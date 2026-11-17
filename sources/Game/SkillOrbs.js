import * as THREE from 'three/webgpu'
import gsap from 'gsap'
import { Game } from './Game.js'

// Glowing orbs around the world, one CV highlight each. A lime arrow on the minimap points to the nearest one.
const SKILLS = [
    { at: 'projects',     title: 'Director General, NashCon \'26', text: 'Led a 30 member team across 6 departments for 125+ delegates.' },
    { at: 'career',       title: 'USG Logistics, NashCon \'25',   text: 'Ran delegate kits, rooms and shuttles for 200+ people.' },
    { at: 'achievements', title: '99.46 percentile',              text: 'Maharashtra BBA/BMS CET 2026, AIR 23 in CUET.' },
    { at: 'lab',          title: 'Highest revenue team',          text: 'EDII Entrepreneurship Simulation, led 10 of ~80 participants.' },
    { at: 'social',       title: 'Mock Shark Tank',               text: '2nd of 11 teams and Best Presenter in front of 95+ people.' },
    { at: 'bowling',      title: '9 admission offers',            text: 'Converted offers from 9 programmes, chose IIM Sirmaur.' },
    { at: 'circuit',      title: 'Sponsorship',                   text: 'Closed 1 of 7 sponsors for NashCon \'26 and supported 2 more.' },
    { at: 'cookie',       title: 'Off the clock',                 text: 'Speed skating for 9+ years, guitar, and specialty coffee.' },
]
const PICKUP_RADIUS = 3.5
const STORAGE_KEY = 'manas-folio-skills'

export class SkillOrbs
{
    constructor()
    {
        this.game = Game.getInstance()

        this.mapElement = document.querySelector('.js-minimap-map')
        this.arrow = document.querySelector('.js-minimap-arrow')
        this.hud = document.querySelector('.js-skill-hud')

        let found = []
        try { found = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch(error) {}

        const size = this.game.terrain.size
        const orbGeometry = new THREE.IcosahedronGeometry(0.45, 1)
        const beamGeometry = new THREE.CylinderGeometry(0.12, 0.12, 14, 8, 1, true)
        const orbMaterial = new THREE.MeshBasicNodeMaterial({ color: 0xc8f05a })
        const beamMaterial = new THREE.MeshBasicNodeMaterial({ color: 0xc8f05a, transparent: true, opacity: 0.25, depthWrite: false })

        this.items = []
        for(const skill of SKILLS)
        {
            const respawn = this.game.respawns.getByName(skill.at)
            if(!respawn)
                continue

            const item = { ...skill, collected: found.includes(skill.at), x: respawn.position.x, z: respawn.position.z }

            item.group = new THREE.Group()
            item.group.position.set(item.x, respawn.position.y + 1.3, item.z)
            item.group.add(new THREE.Mesh(orbGeometry, orbMaterial))
            const beam = new THREE.Mesh(beamGeometry, beamMaterial)
            beam.position.y = 7
            item.group.add(beam)
            item.group.visible = !item.collected
            this.game.scene.add(item.group)

            item.dot = document.createElement('div')
            item.dot.className = 'minimap-dot'
            item.dot.style.left = `${(item.x / size + 0.5) * 100}%`
            item.dot.style.top = `${(item.z / size + 0.5) * 100}%`
            item.dot.hidden = item.collected
            this.mapElement.append(item.dot)

            this.items.push(item)
        }

        this.game.ticker.events.on('tick', () => this.update(), 15)
    }

    collect(item)
    {
        item.collected = true
        item.dot.hidden = true
        gsap.to(item.group.scale, { x: 0, y: 0, z: 0, duration: 0.4, ease: 'back.in', onComplete: () => { item.group.visible = false } })

        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items.filter(i => i.collected).map(i => i.at))) } catch(error) {}

        const left = this.items.filter(i => !i.collected).length
        this.game.notifications.show(
            `<strong>${item.title}</strong><br>${item.text}${left === 0 ? '<br><strong>All skills found. Thanks for exploring!</strong>' : ''}`,
            '',
            7
        )
    }

    update()
    {
        const time = this.game.ticker.elapsed
        const px = this.game.player.position.x
        const pz = this.game.player.position.z

        let nearest = null
        let nearestDistance = Infinity

        for(const item of this.items)
        {
            if(item.collected)
                continue

            item.group.position.y += Math.sin(time * 2 + item.x) * 0.004
            item.group.rotation.y = time

            const distance = Math.hypot(item.x - px, item.z - pz)
            if(distance < PICKUP_RADIUS)
            {
                this.collect(item)
                continue
            }
            if(distance < nearestDistance)
            {
                nearestDistance = distance
                nearest = item
            }
        }

        const total = this.items.length
        const done = this.items.filter(i => i.collected).length

        if(nearest)
        {
            // Minimap is north up, so the angle comes straight from world coordinates
            const angle = Math.atan2(nearest.x - px, - (nearest.z - pz))
            this.arrow.style.display = 'block'
            this.arrow.style.transform = `rotate(${angle}rad) translateY(calc(var(--minimap-radius) * -0.78))`
            this.hud.textContent = `Skills ${done}/${total} · ${Math.round(nearestDistance)} m`
        }
        else
        {
            this.arrow.style.display = 'none'
            this.hud.textContent = `Skills ${done}/${total} · all found`
        }
    }
}

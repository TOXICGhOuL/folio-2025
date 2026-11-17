import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from './Game.js'

// Ten glowing orbs, one per CV highlight. Drive into them to read each one.
const STORAGE_KEY = 'manas-folio-skills'

const SKILLS = [
    { area: 'projects',    text: '99.46 percentile in the Maharashtra BBA/BMS CET 2026. State Rank 162, All India Rank 23.' },
    { area: 'career',      text: 'Director General of NashCon \'26: a 30-member team and 125+ delegates.' },
    { area: 'lab',         text: 'Crisis management: found a new venue when the old one cancelled 12 to 15 hours before reporting.' },
    { area: 'social',      text: 'Sponsorship: closed 1 of 7 sponsors and helped win 2 more.' },
    { area: 'achievements', text: 'Highest revenue among all teams at the EDII Entrepreneurship Simulation (~80 participants).' },
    { area: 'circuit',     text: '2nd of 11 teams at Mock Shark Tank, and Best Presenter.' },
    { area: 'bowling',     text: 'Converted offers from 9 management and commerce programmes. Chose IIM Sirmaur.' },
    { area: 'cookie',      text: 'Logistics for 200+ people at NashCon \'25: kits, rooms and shuttles.' },
    { area: 'timeMachine', text: 'Six MUN conferences in five years, from Delegate to Director General.' },
    { area: 'altar',       text: 'Bookkeeping in Tally Prime at CA Rahul Bajaj & Co.' },
]

export class SkillHunt
{
    constructor()
    {
        this.game = Game.getInstance()

        let found = []
        try { found = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch(error) {}
        this.found = new Set(found)

        this.counter = document.createElement('div')
        this.counter.className = 'skills-counter'
        document.body.append(this.counter)
        this.updateCounter()

        const geometry = new THREE.IcosahedronGeometry(0.55, 1)
        const material = new THREE.MeshBasicNodeMaterial()
        material.colorNode = color('#c8f05a').mul(1.8)

        this.orbs = []
        SKILLS.forEach((skill, index) =>
        {
            const respawn = this.game.respawns.getByName(skill.area)
            if(!respawn || this.found.has(index))
                return

            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(respawn.position.x + 3, 1.3, respawn.position.z)
            this.game.scene.add(mesh)
            this.orbs.push({ index, skill, mesh, baseY: 1.3 })
        })

        this.game.ticker.events.on('tick', () => this.update(), 17)
    }

    updateCounter()
    {
        this.counter.textContent = `Skills ${this.found.size}/${SKILLS.length}`
    }

    update()
    {
        const car = this.game.physicalVehicle.position
        const time = this.game.ticker.elapsed

        for(let i = this.orbs.length - 1; i >= 0; i--)
        {
            const orb = this.orbs[i]
            orb.mesh.rotation.y = time
            orb.mesh.position.y = orb.baseY + Math.sin(time * 2 + orb.index) * 0.2

            if(Math.hypot(car.x - orb.mesh.position.x, car.z - orb.mesh.position.z) < 3.2 && Math.abs(car.y - orb.mesh.position.y) < 4)
            {
                this.game.scene.remove(orb.mesh)
                this.orbs.splice(i, 1)
                this.found.add(orb.index)
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify([ ...this.found ])) } catch(error) {}
                this.updateCounter()

                const done = this.found.size === SKILLS.length
                this.game.notifications.show(
                    done ? 'All 10 found. Thanks for the full tour!' : `<strong>Skill ${this.found.size}/${SKILLS.length}</strong><br>${orb.skill.text}`,
                    'achievement',
                    done ? 5 : 6
                )
            }
        }
    }
}

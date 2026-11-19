import * as THREE from 'three/webgpu'
import { float, positionLocal } from 'three/tsl'
import gsap from 'gsap'
import { Game } from './Game.js'

// GTA style checkpoint run. Eight checkpoints in open ground, visited in order.
// The minimap shows the whole route, a bright line to the current checkpoint and an edge arrow.
const FACTS = [
    { title: 'Off the clock', text: 'Speed skating for 9+ years (District runner-up), guitar with Trinity College London, and specialty coffee.' },
    { title: 'Mock Shark Tank, 2024', text: '2nd of 11 teams and Best Presenter in front of 95+ people.' },
    { title: 'Highest revenue team', text: 'EDII Entrepreneurship Simulation: led 10 of ~80 participants and sold the most.' },
    { title: 'USG Logistics, NashCon \'25', text: 'Delegate kits, rooms and shuttles for 200+ people. Found a new supplier when a vendor slipped.' },
    { title: '99.46 percentile', text: 'Maharashtra BBA/BMS CET 2026. State rank 162, and AIR 23 through CUET.' },
    { title: '9 admission offers', text: 'Converted offers from 9 programmes across India, and chose IIM Sirmaur.' },
    { title: 'Director General, NashCon \'26', text: 'Led a 30 member team across 6 departments for 125+ delegates, and found a new venue 12 hours before reporting.' },
    { title: 'Sponsorship', text: 'Personally closed 1 of 7 sponsors for NashCon \'26 and supported 2 more.' },
]
const PICKUP_RADIUS = 4.5
const MAP_PX = 600
const STORAGE_KEY = 'manas-folio-route'

export class SkillOrbs
{
    constructor()
    {
        this.game = Game.getInstance()

        this.mapElement = document.querySelector('.js-minimap-map')
        this.arrow = document.querySelector('.js-minimap-arrow')
        this.hud = document.querySelector('.js-skill-hud')
        this.goButton = document.querySelector('.js-go-button')
        this.panel = document.querySelector('.js-go-panel')
        this.huntButton = document.querySelector('.js-hunt-toggle')
        this.huntBest = document.querySelector('.js-hunt-best')
        this.placesList = document.querySelector('.js-go-places')
        this.hunting = false
        this.waypoint = null
        this.size = this.game.terrain.size

        this.ready = false
        this.wait = 0
        this.lastText = ''

        // The floor collider is created a moment after the game objects, so wait for it before looking for ground
        this.game.ticker.events.on('tick', () =>
        {
            if(!this.ready)
            {
                if(this.game.world.floor && ++this.wait > 4)
                    this.init()
                return
            }
            this.update()
        }, 15)
    }

    init()
    {
        this.ready = true
        this.index = 0
        this.points = this.findPoints()
        this.items = []

        if(this.points.length)
            this.setMeshes()
        else
            this.huntButton.disabled = true

        this.setRoute()

        this.setWaypointMarker()
        this.setPanel()
        this.refreshStates()
    }

    // Open, dry, flat ground that is far from every area and from the other checkpoints
    findPoints()
    {
        const { RAPIER } = this.game
        const world = this.game.physics.world
        const groundAt = (x, z) =>
        {
            const hit = world.castRay(new RAPIER.Ray({ x, y: 40, z }, { x: 0, y: -1, z: 0 }), 80, true)
            return hit ? 40 - hit.timeOfImpact : null
        }

        const areas = [...this.game.respawns.items.values()].map(item => item.position)
        const candidates = []
        for(let x = -66; x <= 66; x += 6)
        {
            for(let z = -66; z <= 66; z += 6)
            {
                const y = groundAt(x, z)
                if(y === null || y < -0.1)
                    continue

                const flat = [[2, 0], [-2, 0], [0, 2], [0, -2]].every(([dx, dz]) =>
                {
                    const other = groundAt(x + dx, z + dz)
                    return other !== null && Math.abs(other - y) < 0.6
                })
                if(!flat)
                    continue

                candidates.push({ x, y, z })
            }
        }

        // Farthest point sampling, seeded with the areas so nothing lands next to an interactable
        const taken = areas.map(a => ({ x: a.x, z: a.z }))
        const picked = []
        for(let i = 0; i < FACTS.length && candidates.length; i++)
        {
            let best = null
            let bestDistance = -1
            for(const candidate of candidates)
            {
                const nearest = Math.min(...taken.map(t => Math.hypot(t.x - candidate.x, t.z - candidate.z)))
                if(nearest > bestDistance)
                {
                    bestDistance = nearest
                    best = candidate
                }
            }
            picked.push(best)
            taken.push(best)
            candidates.splice(candidates.indexOf(best), 1)
        }

        // Order them as a drive: always the nearest remaining one, starting from the spawn
        const route = []
        let from = this.game.player.position
        while(picked.length)
        {
            picked.sort((a, b) => Math.hypot(a.x - from.x, a.z - from.z) - Math.hypot(b.x - from.x, b.z - from.z))
            const next = picked.shift()
            route.push(next)
            from = next
        }
        return route
    }

    setMeshes()
    {
        const lime = 0xc8f05a
        const solid = new THREE.MeshBasicNodeMaterial({ color: lime })
        const ringMaterial = new THREE.MeshBasicNodeMaterial({ color: lime, transparent: true, opacity: 0.9 })
        const groundMaterial = new THREE.MeshBasicNodeMaterial({ color: lime, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide })
        const beamMaterial = new THREE.MeshBasicNodeMaterial({ color: lime, transparent: true, depthWrite: false, side: THREE.DoubleSide })
        beamMaterial.opacityNode = float(1).sub(positionLocal.y.add(30).div(60)).mul(0.45)

        const core = new THREE.OctahedronGeometry(0.7)
        const ring = new THREE.TorusGeometry(1.5, 0.08, 8, 40)
        const ground = new THREE.RingGeometry(2.6, 3.2, 40)
        const beam = new THREE.CylinderGeometry(0.4, 0.4, 60, 12, 1, true)

        this.items = this.points.map((point, i) =>
        {
            const item = { ...point, ...FACTS[i] }

            item.group = new THREE.Group()
            item.group.position.set(point.x, point.y, point.z)

            item.core = new THREE.Mesh(core, solid)
            item.ringA = new THREE.Mesh(ring, ringMaterial)
            item.ringB = new THREE.Mesh(ring, ringMaterial)
            item.ringB.rotation.x = Math.PI / 2
            item.spin = new THREE.Group()
            item.spin.position.y = 2
            item.spin.add(item.core, item.ringA, item.ringB)

            item.ground = new THREE.Mesh(ground, groundMaterial)
            item.ground.rotation.x = - Math.PI / 2
            item.ground.position.y = 0.08

            item.beam = new THREE.Mesh(beam, beamMaterial)
            item.beam.position.y = 30
            item.beam.frustumCulled = false

            item.group.add(item.spin, item.ground, item.beam)
            this.game.scene.add(item.group)
            return item
        })
    }

    setRoute()
    {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('class', 'minimap-route')
        svg.setAttribute('viewBox', `0 0 ${MAP_PX} ${MAP_PX}`)
        this.routeAll = document.createElementNS(svg.namespaceURI, 'polyline')
        this.routeAll.setAttribute('class', 'route-all')
        this.routeNow = document.createElementNS(svg.namespaceURI, 'line')
        this.routeNow.setAttribute('class', 'route-now')
        svg.append(this.routeAll, this.routeNow)
        this.mapElement.append(svg)

        for(const item of this.items)
        {
            item.dot = document.createElement('div')
            item.dot.className = 'minimap-dot'
            item.dot.style.left = `${this.toMap(item.x)}px`
            item.dot.style.top = `${this.toMap(item.z)}px`
            this.mapElement.append(item.dot)
        }
    }

    toMap(value)
    {
        return (value / this.size + 0.5) * MAP_PX
    }

    refreshStates()
    {
        this.items.forEach((item, i) =>
        {
            const isCurrent = this.hunting && i === this.index
            const isNext = this.hunting && i === this.index + 1
            item.group.visible = isCurrent || isNext
            item.beam.visible = isCurrent
            item.group.scale.setScalar(isCurrent ? 1 : 0.55)
            item.dot.hidden = !this.hunting || i < this.index
            item.dot.classList.toggle('is-current', isCurrent)
            item.dot.classList.toggle('is-next', isNext)
        })

        const remaining = this.hunting ? this.items.slice(this.index) : []
        this.routeAll.setAttribute('points', remaining.map(item => `${this.toMap(item.x)},${this.toMap(item.z)}`).join(' '))
    }

    // Hunt: start, stop, finish
    startHunt()
    {
        this.hunting = true
        this.index = 0
        this.huntStart = performance.now()
        this.huntButton.textContent = 'Stop the hunt'
        this.refreshStates()
        this.closePanel()
        this.game.notifications.show('<strong>Skill hunt started</strong><br>Drive through the 8 checkpoints in order. Follow the lime arrow.', '', 6)
    }

    stopHunt()
    {
        this.hunting = false
        this.huntButton.textContent = 'Start the skill hunt'
        this.refreshStates()
    }

    collect(item)
    {
        gsap.fromTo(item.group.scale, { x: 1, y: 1, z: 1 }, { x: 2.2, y: 2.2, z: 2.2, duration: 0.35, ease: 'power2.out', onComplete: () => { item.group.visible = false } })

        this.index++
        const done = this.index >= this.items.length
        let extra = ''

        if(done)
        {
            const seconds = Math.round((performance.now() - this.huntStart) / 1000)
            let best = seconds
            try
            {
                best = Math.min(seconds, parseInt(localStorage.getItem(STORAGE_KEY) || '999999'))
                localStorage.setItem(STORAGE_KEY, String(best))
            } catch(error) {}
            extra = `<br><strong>Hunt complete in ${this.format(seconds)}.</strong> Best: ${this.format(best)}.`
            this.stopHunt()
            this.updateBest()
        }
        else
        {
            this.refreshStates()
        }

        this.game.notifications.show(`<strong>${item.title}</strong><br>${item.text}${extra}`, '', 8)
    }

    format(seconds)
    {
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
    }

    updateBest()
    {
        let best = null
        try { best = parseInt(localStorage.getItem(STORAGE_KEY) || '') } catch(error) {}
        this.huntBest.textContent = best ? `Best time ${this.format(best)}` : '8 checkpoints, one CV fact each. Beat the clock.'
    }

    // Go panel: pick a place, get a lime route to it
    setPanel()
    {
        const PLACES = [
            { key: 'projects',     name: 'Projects',     blurb: 'Six case files: NashCon, Shark Tank, EDII, Kotak' },
            { key: 'career',       name: 'Career',       blurb: 'Walk the timeline from 2021 to 2030' },
            { key: 'achievements', name: 'Achievements', blurb: 'Percentile, ranks and awards' },
            { key: 'lab',          name: 'Lab',          blurb: 'My other sites and links' },
            { key: 'social',       name: 'Contact',      blurb: 'LinkedIn, mail, WhatsApp, GitHub' },
            { key: 'circuit',      name: 'Circuit',      blurb: 'A timed lap, just for fun' },
            { key: 'bowling',      name: 'Bowling',      blurb: 'Knock the pins down' },
            { key: 'timeMachine',  name: 'Time machine', blurb: 'Jump to my other websites' },
        ]

        this.places = PLACES.map(place =>
        {
            const respawn = this.game.respawns.getByName(place.key)
            if(!respawn)
                return null

            const button = document.createElement('button')
            button.type = 'button'
            button.className = 'go-place'
            button.innerHTML = `<span class="go-place-name">${place.name}</span><span class="go-place-blurb">${place.blurb}</span><span class="go-place-distance"></span>`
            button.addEventListener('click', () => this.setWaypoint({ name: place.name, x: respawn.position.x, y: respawn.position.y, z: respawn.position.z }))
            this.placesList.append(button)

            return { ...place, button, distanceElement: button.querySelector('.go-place-distance'), position: respawn.position }
        }).filter(Boolean)

        this.goButton.addEventListener('click', () => this.panel.hidden ? this.openPanel() : this.closePanel())
        this.panel.querySelector('.js-go-close').addEventListener('click', () => this.closePanel())
        this.huntButton.addEventListener('click', () => this.hunting ? this.stopHunt() : this.startHunt())
        this.panel.querySelector('.js-go-clear').addEventListener('click', () => { this.waypoint = null; this.waypointMarker.visible = false; this.closePanel() })
        this.updateBest()
    }

    openPanel()
    {
        const px = this.game.player.position.x
        const pz = this.game.player.position.z
        for(const place of this.places)
            place.distanceElement.textContent = `${Math.round(Math.hypot(place.position.x - px, place.position.z - pz))} m`

        // Closest first, like a nav app
        this.places.sort((a, b) => parseInt(a.distanceElement.textContent) - parseInt(b.distanceElement.textContent)).forEach(place => this.placesList.append(place.button))
        this.panel.hidden = false
    }

    closePanel()
    {
        this.panel.hidden = true
    }

    setWaypointMarker()
    {
        const material = new THREE.MeshBasicNodeMaterial({ color: 0xe9e6dc, transparent: true, depthWrite: false, side: THREE.DoubleSide })
        material.opacityNode = float(1).sub(positionLocal.y.add(30).div(60)).mul(0.4)
        this.waypointMarker = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 60, 10, 1, true), material)
        this.waypointMarker.frustumCulled = false
        this.waypointMarker.visible = false
        this.game.scene.add(this.waypointMarker)
    }

    setWaypoint(waypoint)
    {
        this.waypoint = waypoint
        this.waypointMarker.position.set(waypoint.x, waypoint.y + 30, waypoint.z)
        this.waypointMarker.visible = true
        this.closePanel()
    }

    weatherText()
    {
        const weather = this.game.weather
        const night = this.game.dayCycles.intervalEvents.get('night').inInterval
        const icon = weather.snow.value > 0.2 ? '❄' : weather.rain.value > 0.2 ? '🌧' : weather.clouds.value > 0.3 ? '☁' : night ? '🌙' : '☀'
        return `${icon} ${Math.round(weather.temperature.value)}°C`
    }

    update()
    {
        const time = this.game.ticker.elapsed
        const px = this.game.player.position.x
        const pz = this.game.player.position.z

        // Animate hunt markers
        if(this.hunting)
        {
            for(let i = this.index; i < Math.min(this.index + 2, this.items.length); i++)
            {
                const item = this.items[i]
                item.spin.rotation.y = time * 1.5
                item.ringA.rotation.x = time * 2
                item.ringB.rotation.y = time * 1.2
                item.spin.position.y = 2 + Math.sin(time * 2) * 0.25
                item.ground.scale.setScalar(1 + (Math.sin(time * 3) * 0.5 + 0.5) * 0.18)
            }
        }

        // What are we navigating to? A chosen place wins over the next hunt checkpoint
        const huntItem = this.hunting ? this.items[this.index] : null
        const target = this.waypoint || huntItem
        let text = this.weatherText()

        if(target)
        {
            const distance = Math.hypot(target.x - px, target.z - pz)

            if(this.waypoint && distance < 8)
            {
                this.game.notifications.show(`<strong>You have arrived</strong><br>${this.waypoint.name}`, '', 4)
                this.waypoint = null
                this.waypointMarker.visible = false
            }
            else if(!this.waypoint && distance < PICKUP_RADIUS)
            {
                this.collect(huntItem)
            }

            const angle = Math.atan2(target.x - px, - (target.z - pz)) + this.game.view.spherical.theta
            this.arrow.style.display = 'block'
            this.arrow.style.transform = `rotate(${angle}rad) translateY(calc(var(--minimap-radius) * -0.8))`

            this.routeNow.setAttribute('x1', this.toMap(px))
            this.routeNow.setAttribute('y1', this.toMap(pz))
            this.routeNow.setAttribute('x2', this.toMap(target.x))
            this.routeNow.setAttribute('y2', this.toMap(target.z))
            this.routeNow.style.display = ''

            const meters = Math.round(distance)
            if(this.waypoint)
                text = `→ ${this.waypoint.name} · ${meters} m  ${text}`
            else
                text = `HUNT ${this.index + 1}/${this.items.length} · ${this.format(Math.round((performance.now() - this.huntStart) / 1000))} · ${meters} m  ${text}`
        }
        else
        {
            this.arrow.style.display = 'none'
            if(this.routeNow) this.routeNow.style.display = 'none'
        }

        if(text !== this.lastText)
        {
            this.lastText = text
            this.hud.textContent = text
        }
    }
}

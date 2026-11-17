import { Game } from './Game.js'

// Small always-on map in the corner. Follows the car, north up.
export class Minimap
{
    constructor()
    {
        this.game = Game.getInstance()

        this.element = document.querySelector('.js-minimap')
        this.map = this.element.querySelector('.js-minimap-map')
        this.player = this.element.querySelector('.js-minimap-player')

        this.mapSize = 600
        this.previousUrl = null
        this.lastUpdate = 0

        this.setTexture()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 15)
    }

    setTexture()
    {
        const url = this.game.dayCycles.intervalEvents.get('night').inInterval ? 'ui/map/map-night.webp' : 'ui/map/map-day.webp'

        if(url !== this.previousUrl)
        {
            this.previousUrl = url
            this.map.style.backgroundImage = `url(${url})`
        }
    }

    update()
    {
        // About 12 updates per second is plenty for a corner map
        const now = performance.now()
        if(now - this.lastUpdate < 80)
            return
        this.lastUpdate = now

        // Nothing to do while hidden
        if(this.element.offsetParent === null)
            return

        this.setTexture()

        const size = this.game.terrain.size
        const x = Math.min(1, Math.max(0, this.game.player.position.x / size + 0.5))
        const y = Math.min(1, Math.max(0, this.game.player.position.z / size + 0.5))

        const half = this.element.clientWidth / 2
        const tx = Math.round(half - x * this.mapSize)
        const ty = Math.round(half - y * this.mapSize)

        this.map.style.transform = `translate(${tx}px, ${ty}px)`
        this.player.style.transform = `rotate(${- this.game.physicalVehicle.yRotation}rad)`
    }
}

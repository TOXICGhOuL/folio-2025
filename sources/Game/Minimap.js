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
        this.compass = this.element.querySelector('.js-minimap-compass')

        this.mapSize = 600
        this.previousUrl = null

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
        this.setTexture()

        const size = this.game.terrain.size
        const x = Math.min(1, Math.max(0, this.game.player.position.x / size + 0.5))
        const y = Math.min(1, Math.max(0, this.game.player.position.z / size + 0.5))

        const half = this.element.clientWidth / 2
        const theta = this.game.view.spherical.theta

        // Player stays in the centre, the map turns so the camera's forward direction is always up
        this.map.style.transform = `translate(${half}px, ${half}px) rotate(${theta}rad) translate(${- x * this.mapSize}px, ${- y * this.mapSize}px)`
        this.player.style.transform = `rotate(${theta + Math.PI / 2 - this.game.physicalVehicle.yRotation}rad)`
        this.compass.style.transform = `rotate(${theta}rad)`
    }
}

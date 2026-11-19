import { Game } from './Game.js'
import places from '../data/places.js'

// Shows the name and a short description when the car enters an area
export class AreaBanner
{
    constructor()
    {
        this.game = Game.getInstance()
        this.element = document.querySelector('.js-area-banner')
        this.name = document.querySelector('.js-area-name')
        this.text = document.querySelector('.js-area-text')
        this.current = null
        this.timeout = null

        this.game.ticker.events.on('tick', () => this.update(), 9)
    }

    update()
    {
        const html = document.documentElement
        if(!html.classList.contains('is-gate-done') || html.classList.contains('input-filter-intro'))
            return

        const position = this.game.player.position
        let nearest = null
        let nearestDistance = Infinity

        for(const place of places)
        {
            const respawn = this.game.respawns.getByName(place.key)
            if(!respawn)
                continue

            const distance = Math.hypot(respawn.position.x - position.x, respawn.position.z - position.z)
            const limit = place === this.current ? place.radius + 6 : place.radius

            if(distance < limit && distance < nearestDistance)
            {
                nearest = place
                nearestDistance = distance
            }
        }

        if(nearest === this.current)
            return

        this.current = nearest

        clearTimeout(this.timeout)

        if(nearest)
        {
            this.name.textContent = nearest.name
            this.text.textContent = nearest.text
            this.element.classList.add('is-visible')
            this.timeout = setTimeout(() => this.element.classList.remove('is-visible'), 9000)
        }
        else
        {
            this.element.classList.remove('is-visible')
        }
    }
}

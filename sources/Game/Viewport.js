import { Events } from './Events.js'

export class Viewport
{
    constructor(domElement)
    {
        this.domElement = domElement

        this.events = new Events()
        this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        this.scale = 1 // lowered automatically when frames get slow
        this.slowSeconds = 0
        
        this.measure()
        this.setResize()
    }

    measure()
    {
        const bounding = this.domElement.getBoundingClientRect()

        this.width = bounding.width
        this.height = bounding.height
        this.ratio = this.width / this.height

        this.pixelRatioPure = window.devicePixelRatio
        this.pixelRatioMax = this.isMobile ? 1.5 : 1.25
        this.pixelRatio = Math.min(this.pixelRatioPure, this.pixelRatioMax) * this.scale
    }

    // Called every frame: if average fps stays under ~40 for a second, render fewer pixels
    adapt(deltaAverage, delta)
    {
        // Ignore the first seconds (loading spikes) and hidden tabs, then only react to long slow stretches
        this.age = (this.age || 0) + delta
        this.slowSeconds = this.age > 10 && document.visibilityState === 'visible' && deltaAverage > 1 / 35 ? this.slowSeconds + delta : 0

        if(this.slowSeconds > 0.7 && this.scale > 0.6)
        {
            this.slowSeconds = 0
            this.scale = Math.max(0.6, this.scale - 0.1)
            this.measure()
            this.events.trigger('change')
        }
    }

    setResize()
    {
        const throttleDuration = 400
        let throttleTimeout = null
        addEventListener('resize', () =>
        {
            this.measure()
            this.events.trigger('change')

            if(throttleTimeout)
            {
                clearTimeout(throttleTimeout)
            }

            throttleTimeout = setTimeout(() =>
            {
                throttleTimeout = null
                this.events.trigger('throttleChange')
            }, throttleDuration)
        })
    }
}
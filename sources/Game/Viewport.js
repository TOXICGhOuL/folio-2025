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
        this.pixelRatioMax = this.isMobile ? 0.9 : 1.25
        this.pixelRatio = Math.min(this.pixelRatioPure, this.pixelRatioMax) * this.scale
    }

    // Called every frame: if average fps stays under ~40 for a second, render fewer pixels
    adapt(deltaAverage, delta)
    {
        this.slowSeconds = deltaAverage > 1 / 40 ? this.slowSeconds + delta : 0

        if(this.slowSeconds > 1 && this.scale > 0.5)
        {
            this.slowSeconds = 0
            this.scale = Math.max(0.5, this.scale - 0.15)
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
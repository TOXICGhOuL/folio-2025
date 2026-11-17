// Shows the controls once, right after the intro hands control to the player.
const STORAGE_KEY = 'manas-folio-tutorial-seen'

export class Tutorial
{
    constructor()
    {
        this.element = document.querySelector('.js-tutorial')
        this.button = this.element.querySelector('.js-tutorial-close')

        let seen = false
        try { seen = localStorage.getItem(STORAGE_KEY) === '1' } catch(error) {}

        if(seen)
            return

        const root = document.documentElement

        const observer = new MutationObserver(() =>
        {
            const inIntro = root.classList.contains('input-filter-intro')
            if(root.classList.contains('is-started') && !inIntro && root.classList.contains('is-gate-done'))
            {
                observer.disconnect()
                this.open()
            }
        })
        observer.observe(root, { attributes: true, attributeFilter: [ 'class' ] })
    }

    open()
    {
        this.element.hidden = false
        this.button.focus({ preventScroll: true })

        const close = () =>
        {
            this.element.hidden = true
            try { localStorage.setItem(STORAGE_KEY, '1') } catch(error) {}
            removeEventListener('keydown', onKey, true)
        }

        const onKey = (event) =>
        {
            if(event.key === 'Escape')
                close()
        }

        this.button.addEventListener('click', close)
        addEventListener('keydown', onKey, true)
    }
}

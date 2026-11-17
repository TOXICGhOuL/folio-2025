// Nothing heavy is imported until the visitor chooses the interactive version.
const gate = document.querySelector('.js-gate')
const startButton = document.querySelector('.js-gate-start')

let started = false

const start = async() =>
{
    if(started)
        return
    started = true

    gate.classList.add('is-loading')
    startButton.setAttribute('disabled', 'disabled')

    try
    {
        await import('./threejs-override.js')
        const { Game } = await import('./Game/Game.js')
        const { default: consoleLog } = await import('./data/consoleLog.js')

        if(import.meta.env.VITE_LOG)
            console.log(...consoleLog)

        if(import.meta.env.VITE_GAME_PUBLIC)
            window.game = new Game()
        else
            new Game()

        // Gate fades out once the game has taken over the screen
        document.documentElement.classList.add('is-gate-done')
        setTimeout(() => gate.remove(), 600)
    }
    catch(error)
    {
        console.error(error)
        started = false
        gate.classList.remove('is-loading')
        gate.classList.add('is-error')
        startButton.removeAttribute('disabled')
    }
}

startButton.addEventListener('click', start)

// Shareable shortcut: https://site/#drive skips the question
if(location.hash === '#drive')
    start()

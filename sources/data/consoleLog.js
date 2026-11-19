import * as THREE from 'three/webgpu'

const text = `
╔═ Manas Bajaj ═════════╗
║ Interactive portfolio of Manas Bajaj, BMS (Hons), IIM Sirmaur.
║ Mail     ⇒ manasbajaj07@gmail.com
║ LinkedIn ⇒ https://www.linkedin.com/in/manasrbajaj/
║ GitHub   ⇒ https://github.com/TOXICGhOuL
╚═══════════════════════╝

╔═ Credits ═════════════╗
║ Built with Three.js and Rapier physics.
║ Inspired by the portfolio of Bruno Simon (MIT licensed): https://bruno-simon.com
╚═══════════════════════╝
`
let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #ffffff; font: 400 1em monospace;',
    pipe: 'color: #D66FFF; font: 400 1em monospace;',
}
let currentStyle = null
for(let i = 0; i < text.length; i++)
{
    const char = text[i]

    const style = char.match(/[╔║═╗╚╝╔╝]/) ? 'pipe' : 'letter'
    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += '%c'

        finalStyles.push(stylesSet[currentStyle])
    }
    finalText += char
}

export default [finalText, ...finalStyles]
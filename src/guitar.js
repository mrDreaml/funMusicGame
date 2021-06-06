const $ = s => document.querySelector(s)

const audio = new Audio('./src/new politics.mp3')

const chord1El = $('.chord1')
const chord2El = $('.chord2')
const chord3El = $('.chord3')
const chord4El = $('.chord4')
const chord5El = $('.chord5')
const chord6El = $('.chord6')

const chords = [chord1El, chord2El, chord3El, chord4El, chord5El, chord6El]

const generateValue = () => [Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random())]

const L = 100
const SPEED = 1
let SCORE = 0


const repeatList = (list, q) => Array(q).fill(list)

const TEMPLATE_3 = [
    ...repeatList([1, 0, 0, 0, 0, 0], 3),
    ...repeatList([0, 1, 0, 0, 0, 0], 3),
    ...repeatList([1, 0, 0, 0, 0, 0], 3),
    [0, 0, 0, 0, 1, 0],
]

const TEMPLATE = [
    [0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    ...TEMPLATE_3,
    ...repeatList([0, 0, 1, 0, 0, 0], 3),
    ...repeatList([0, 1, 0, 0, 0, 0], 3),
    ...TEMPLATE_3,
]

const TEMPLATE_2 = [
    ...TEMPLATE_3,
    ...repeatList([0, 1, 0, 0, 0, 0], 2),
    ...repeatList([0, 0, 1, 0, 0, 0], 2),
    ...repeatList([0, 0, 0, 1, 0, 0], 5),
    ...repeatList([0, 1, 0, 0, 0, 0], 2),
    ...repeatList([0, 0, 1, 0, 0, 0], 2),
    ...repeatList([0, 0, 0, 1, 0, 0], 5),
    ...TEMPLATE_3,
]
const FULL_D = [
    ...TEMPLATE_2,
    ...repeatList([0, 1, 0, 0, 0, 0], 2),
    ...repeatList([0, 0, 1, 0, 0, 0], 2),
    ...repeatList([0, 0, 0, 1, 0, 0], 5),
    ...repeatList([1, 0, 0, 0, 0, 0], 10),
    ...repeatList([0, 1, 0, 0, 0, 0], 2),
    ...repeatList([0, 0, 1, 0, 0, 0], 2),
    ...repeatList([0, 0, 0, 1, 0, 0], 5),
    ...repeatList([0, 1, 0, 0, 0, 0], 2),
    ...repeatList([0, 0, 1, 0, 0, 0], 2),
    ...repeatList([0, 0, 0, 1, 0, 0], 5),
    ...TEMPLATE_3,
    ...repeatList([0, 1, 0, 0, 0, 0], 2),
    ...repeatList([0, 0, 1, 0, 0, 0], 2),
    ...repeatList([0, 0, 0, 1, 0, 0], 5),
    ...TEMPLATE,
    ...repeatList([0, 1, 0, 0, 0, 0], 2),
    ...repeatList([0, 0, 1, 0, 0, 0], 2),
    ...repeatList([0, 0, 0, 1, 0, 0], 5),
    ...TEMPLATE_3,
    ...TEMPLATE,
    ...TEMPLATE,
    ...TEMPLATE,
    ...TEMPLATE,
    ...TEMPLATE,
    ...repeatList([1, 0, 0, 0, 0, 0], 10),
    ...TEMPLATE_2,
    ...TEMPLATE,
    ...repeatList([1, 0, 0, 0, 0, 0], 10),
].reverse()

let id = 0
createStackEl = (style) => {
    const stack = document.createElement('div')
    stack.className = 'chord-stack'
    stack.id = id++
    if (style) { 
        Object.entries(style).map(([k, v]) => {
            stack.style[k] = v
        })
     }
     FULL_D.map((rowData) => {
        const row = document.createElement('div')
        row.className = 'chord-row'
        rowData.forEach((v, i) => {
            const chord = document.createElement('div')
            chord.className = `chord ${v ? 'chord' + (i + 1) : '' }`
            row.appendChild(chord)
        })
        stack.appendChild(row)
    })
    $('.chord-container').appendChild(stack)
    return stack
}

let pos = 0
let isGameOver = false
const stack = createStackEl()
const H = stack.getBoundingClientRect().height
stack.style.transform = `translateY(-${H}px)`
const step = () => {
    stack.style.transform = `translateY(${pos - H}px)`
    pos += SPEED
    if (pos <= H + 370) {
        requestAnimationFrame(step)
    } else if (!isGameOver) {
        isGameOver = true
        audio.pause()
        const el = document.createElement('div')
        el.className = 'game-over'
        el.textContent = 'GAME OVER'
        $('#main').appendChild(el)
    }
}


const createHint = (chordIndex, msg = 'GOOD') => {
    const actionEl = document.createElement('div')
    const actionElMsg = document.createElement('div')
    actionEl.className = 'actionChord'
    actionElMsg.className = msg === 'GOOD' ? 'actionMsg-success' : 'actionMsg-fail'
    actionElMsg.textContent = msg
    const shift = 165 + chordIndex * 83.5
    actionEl.style.left = `${shift + 30}px`
    actionElMsg.style.left = `${shift}px`
    $('#actionField').appendChild(actionEl)
    $('#actionField').appendChild(actionElMsg)
    setTimeout(() => {
        $('#actionField').removeChild(actionEl)
        $('#actionField').removeChild(actionElMsg)
    }, 200)
}

const invokeAfter = (f1, f2, t) => {
    let timer
    return (...props) => {
        clearTimeout(timer)
        f1(...props)
        timer = setTimeout(() => f2(...props), t)
    }
}

const _updateScore = (scoreValue, status) => {
    const scoreEl = $('#score')
    scoreEl.textContent = scoreValue
    scoreEl.style.color = status === 'GOOD' ? '#0f0' : '#f00'
    scoreEl.style.transform = 'scale(1.2)'
}

const updateScore = invokeAfter(_updateScore, () => {
    const scoreEl = $('#score')
    scoreEl.style.color = '#fff'
    scoreEl.style.transform = 'scale(1)'
}, 200)

const playMusicTick = invokeAfter(() => audio.volume = 1, () => audio.volume = .3, 500)

let timeStamp = 0

window.addEventListener('keydown', e => {
    if (e.key === ' ' && !isGameOver) {
        audio.play()
        step()
        return
    }

    if (e.timeStamp - timeStamp > 50) {
        timeStamp = e.timeStamp
        const rowInd = (pos - 310) / 60 | 0
        const rowD = FULL_D[rowInd ? FULL_D.length - rowInd : -1]
        if (rowD) {
            const { key } = e
            if (['1', '2', '3', '4', '5', '6'].includes(key)) {
                if (rowD[key - 1]) {
                    createHint(key - 1, 'GOOD')
                    updateScore(SCORE, 'GOOD')
                    SCORE += 10
                    playMusicTick()
                } else {
                    createHint(key - 1, 'FAIL')
                    updateScore(SCORE, 'FAIL')
                    SCORE -= 10
                }
            }   
        }
    }
})
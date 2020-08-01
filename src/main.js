import _ from 'lodash'

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const restart_btn = document.getElementById("restart_btn")

// セル正方形のサイズ
const cellSize = 30
// 画面縦のセル数
const screenH = 20
// 画面横のセル数
const screenW = 10
// 画面配列
let screen = [];

// テトリミノ配列の画面配列内での座標
const defaultTetriminoX = 3
const defaultTetriminoY = 0

let tetriminoX = defaultTetriminoX
let tetriminoY = defaultTetriminoY

// テトリミノ種類
const tetriminoType = [
    [// I - テトリミノ（水色）
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ],
    [// O - テトリミノ（黄色）
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [// S - テトリミノ（緑）

        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [// Z - テトリミノ（赤）

        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [// J - テトリミノ（青）

        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0]
    ],
    [// L - テトリミノ（オレンジ）
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0]
    ],
    [// T - テトリミノ（紫） 
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
    ]
]
// テトリミノ色
const tetriminoColor = [
    "aqua",
    "yellow",
    "green",
    "red",
    "blue",
    "orange",
    "purple"
]

// テトリミノインデックス
let tetriminoIndex
let nextTetriminoIndex

// テトリミノ配列
let tetrimino
let nextTetrimino

let intervalID
let millisecond = 500

let score = 0

// 画面配列
function init() {
    nextTetriminoIndex = _.random(0, tetriminoColor.length - 1)
    nextTetrimino = tetriminoType[nextTetriminoIndex]

    tetriminoIndex = _.random(0, tetriminoColor.length - 1)
    tetrimino = tetriminoType[tetriminoIndex]

    for (let row = 0; row < screenH; row++) {
        screen[row] = Array(screenW)
        for (let col = 0; col < screenW; col++) {
            screen[row][col] = false
        }
    }
}

// 描画
function drawScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 画面描画
    for (let row = 0; row < screenH; row++) {
        for (let col = 0; col < screenW; col++) {
            let y1 = row * cellSize
            let x1 = col * cellSize

            if (screen[row][col]) {
                ctx.fillStyle = "gray"
                ctx.fillRect(x1, y1, cellSize, cellSize)
            }

            ctx.strokeStyle = "black"
            ctx.strokeRect(x1, y1, cellSize, cellSize)
        }
    }

    ctx.fillStyle = "gray"
    ctx.font = "20px serif"
    ctx.textAlign = "center"
    ctx.fillText("Next Tetrimino", 400, 30)
    ctx.strokeStyle = "black"
    ctx.strokeRect(325, 50, 150, 150)

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (nextTetrimino[y][x]) {
                ctx.fillRect(x * cellSize + 335, y * cellSize + 65, cellSize, cellSize)
            }
        }
    }

    ctx.fillText("Score", 400, 250)
    ctx.fillText(score, 400, 303)
    ctx.strokeStyle = "black"
    ctx.strokeRect(325, 270, 150, 50)


    // テトリミノ描画
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (tetrimino[y][x]) {
                let y1 = (tetriminoY + y) * cellSize
                let x1 = (tetriminoX + x) * cellSize

                ctx.fillStyle = tetriminoColor[tetriminoIndex]
                ctx.fillRect(x1, y1, cellSize, cellSize)

                ctx.strokeStyle = "black"
                ctx.strokeRect(x1, y1, cellSize, cellSize)
            }
        }
    }
}

function checkMove(vertical, horizontal, tmp = null) {
    let possible = true

    let tetriminoTmp = tetrimino

    if (tmp !== null) {
        tetriminoTmp = tmp
    }

    out:
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (tetriminoTmp[y][x]) {
                let x1 = x + tetriminoX + horizontal
                let y1 = y + tetriminoY + vertical
                if (x1 < 0 || x1 > screenW - 1 || y1 > screenH - 1 || screen[y1][x1]) {
                    possible = false
                    break out
                }
            }
        }
    }

    return possible
}


function mixScreen() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (tetrimino[y][x]) {
                let y1 = (tetriminoY + y)
                let x1 = (tetriminoX + x)
                screen[y1][x1] = true
                ctx.fillStyle = "gray"
                ctx.fillRect(x1 * cellSize, y1 * cellSize, cellSize, cellSize)
            }
        }
    }
}

function animation() {

    if (checkMove(1, 0)) {
        tetriminoY++
    } else if (tetriminoY === defaultTetriminoY) {
        clearTimeout(intervalID)
        alert("ゲームオーバー！")
        restart_btn.classList.remove("d-none")
    } else {
        mixScreen()

        tetrimino = nextTetrimino
        tetriminoIndex = nextTetriminoIndex

        tetriminoX = defaultTetriminoX
        tetriminoY = defaultTetriminoY

        nextTetriminoIndex = _.random(0, tetriminoColor.length - 1)
        nextTetrimino = tetriminoType[nextTetriminoIndex]

    }

    drawScreen()
    disappear()
}

function disappear() {
    const delRow = []

    for (let row = 0; row < screenH; row++) {
        let f = true
        for (let col = 0; col < screenW; col++) {
            if (!screen[row][col]) {
                f = false
                break
            }
        }
        if (f) {
            delRow.push(row)
        }
    }

    const delRowCount = delRow.length


    if (delRowCount > 0) {

        if (delRowCount === 1) {
            score += 1
        } else if (delRowCount === 2) {
            score += 2
        } else if (delRowCount === 3) {
            score += 3
        } else if (delRowCount === 4) {
            score += 4
        }

        if (score >= 30) {
            millisecond = 100
            clearTimeout(intervalID)
            intervalID = setInterval(animation, millisecond)
        } else if (score >= 25) {
            millisecond = 200
            clearTimeout(intervalID)
            intervalID = setInterval(animation, millisecond)
        } else if (score >= 20) {
            millisecond = 300
            clearTimeout(intervalID)
            intervalID = setInterval(animation, millisecond)
        } else if (score >= 10) {
            millisecond = 400
            clearTimeout(intervalID)
            intervalID = setInterval(animation, millisecond)
        }


        for (const v of delRow) {
            let tmp = []
            for (let row = 0; row < screenH; row++) {
                tmp[row] = []
                for (let col = 0; col < screenW; col++) {
                    tmp[row][col] = false
                }
            }

            let f = false

            for (let row = screenH - 1; row >= 0; row--) {
                if (row === v) {
                    f = true
                }
                if (f) {
                    if (screen[row - 1]) {
                        tmp[row] = screen[row - 1]
                    }
                } else {
                    if (screen[row]) {
                        tmp[row] = screen[row]
                    }
                }
            }
            screen = tmp
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (e.keyCode === 87 || e.keyCode === 38) {
        // w 上 回転
        const tmp = _.zip(...[...tetrimino].reverse())
        if (checkMove(0, 0, tmp)) {
            tetrimino = tmp
        }
    } else if (e.keyCode === 65 || e.keyCode === 37) {
        // a 左
        if (checkMove(0, -1)) {
            tetriminoX--
        }
    } else if (e.keyCode === 83 || e.keyCode === 40) {
        // s 下
        if (checkMove(1, 0)) {
            tetriminoY++
        }
    } else if (e.keyCode === 68 || e.keyCode === 39) {
        // d 右
        if (checkMove(0, 1)) {
            tetriminoX++
        }
    }
    drawScreen()
});


function main() {
    init()
    intervalID = setInterval(animation, millisecond)
}

main()


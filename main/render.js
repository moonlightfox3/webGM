let isFullscreen = false
let drawScreenX = null
let drawScreenY = null
let drawScreenW = null
let drawScreenH = null
let drawScaleX = null
let drawScaleY = null
let canvasEl = null
let drawCtx = null
let mainCtx = null
function initRenderer () {
    resizeRenderer()
    mainCtx = mainCanvasEl.getContext("bitmaprenderer")

    canvasEl = new OffscreenCanvas(mainCanvasEl.width, mainCanvasEl.height)
    drawCtx = canvasEl.getContext("2d", {willReadFrequently: true})
    drawCtx.imageSmoothingEnabled = false
}
function scaleCanvasActual () {
    drawScaleX = 1
    drawScaleY = 1
}
function scaleCanvasDefault () {
    drawScreenW = gameInfo.width, drawScreenH = gameInfo.height
    drawScaleX = drawScreenW / (room_width || 320)
    drawScaleY = drawScreenH / (room_height || 240)
    if (isFullscreen) {
        let scaleW = canvasEl.width / drawScreenW
        let scaleH = canvasEl.height / drawScreenH
        if (scaleW >= scaleH) {
            drawScreenW *= scaleH, drawScreenH *= scaleH
            drawScaleX *= scaleH, drawScaleY *= scaleH
        } else {
            drawScreenW *= scaleW, drawScreenH *= scaleW
            drawScaleX *= scaleW, drawScaleY *= scaleW
        }
    }
    drawScreenX = (canvasEl.width - drawScreenW) / 2
    drawScreenY = (canvasEl.height - drawScreenH) / 2
}
function renderMain () {
    let imgBitmap = canvasEl.transferToImageBitmap()
    mainCtx.transferFromImageBitmap(imgBitmap)
    drawCtx.clearRect(0, 0, canvasEl.width, canvasEl.height)
}

function clearCanvas () {
    scaleCanvasDefault()
    let oldStyle = drawCtx.fillStyle
    
    drawCtx.fillStyle = drawCtx.strokeStyle = roomBackground || "#000000"
    drawCtx.fillRect(drawScreenX, drawScreenY, drawScreenW, drawScreenH)

    drawCtx.fillStyle = drawCtx.strokeStyle = oldStyle
}
function drawAllInstances () {
    let sortedInstances = all.filter(val => val != null).filter(val => val.visible != false)
    sortedInstances.sort((a, b) => b.depth - a.depth)
    sortedInstances.sort((a, b) => a.persistent - b.persistent)
    fireEventsAllInstances("Draw", ["PreDraw", "DrawBegin"], sortedInstances)
    for (let j = 0; j < sortedInstances.length; j++) {
        let i = sortedInstances[j].id
        let useDefaultDraw = isScriptEmpty("Draw", "Draw", i)
        if (useDefaultDraw) {
            if (all[i].sprite_index != undefined) drawSprite(all[i])
        } else fireEventsOneInstance("Draw", "Draw", i)
    }
    fireEventsAllInstances("Draw", ["DrawEnd", "PostDraw"], sortedInstances)
    
    scaleCanvasActual()
    fireEventsAllInstances("Draw", ["DrawGUIBegin", "DrawGUI", "DrawGUIEnd"], sortedInstances)
    scaleCanvasDefault()
}

let uiSelectPos = 0
function drawMainUI (header, list = []) {
    drawCtx.fillStyle = drawCtx.strokeStyle = "#FFFFFF"
    drawCtx.font = "25px monospace"
    drawCtx.fillText(header, 10, 33)
    drawCtx.font = "20px monospace"

    let currentY = 38 + 23
    drawCtx.clearRect(0, 40, canvasEl.width, canvasEl.height - 40)
    for (let i = 0; i < list.length; i++) {
        drawCtx.fillStyle = drawCtx.strokeStyle = (i == uiSelectPos ? "white" : "lightgray")
        drawCtx.fillText(list[i], 10, currentY)
        currentY += 23
    }

    renderMain()
}
function cropToGame () {
    if (drawScreenX != null && drawScreenY != null && drawScreenW != null && drawScreenH != null) {
        let oldStyle = drawCtx.fillStyle
        drawCtx.fillStyle = "#000000"
        let op = isFullscreen ? "fillRect" : "clearRect"
        
        drawCtx[op](0, 0, canvasEl.width, drawScreenY)
        drawCtx[op](0, drawScreenY + drawScreenH, canvasEl.width, drawScreenY)
        drawCtx[op](0, drawScreenY, drawScreenX, canvasEl.height - (drawScreenY * 2))
        drawCtx[op](drawScreenX + drawScreenW, drawScreenY, drawScreenX, canvasEl.height - (drawScreenY * 2))

        drawCtx.fillStyle = drawCtx.strokeStyle = oldStyle
    }
}

function resizeRenderer () {
    let style = getComputedStyle(mainCanvasEl)
    mainCanvasEl.width = parseInt(style.width)
    mainCanvasEl.height = parseInt(style.height)

    if (canvasEl != null) {
        canvasEl.width = mainCanvasEl.width
        canvasEl.height = mainCanvasEl.height
        drawCtx.imageSmoothingEnabled = false
        
        if (gameList == null) drawLoadingGameWindow()
        else if (!hasInited) drawGameList()
        else if (readyToStart) drawStartGameWindow()
    }
}
onresize = resizeRenderer

function drawRawRectangle (x1, y1, x2, y2, isOnlyOutline = false) {
    drawCtx[isOnlyOutline ? "strokeRect" : "fillRect"](drawScreenX + (x1 * drawScaleX), drawScreenY + (y1 * drawScaleY), (x2 - x1) * drawScaleX, (y2 - y1) * drawScaleY)
}
function drawRawCircle (x, y, r, isOnlyOutline = false) {
    drawCtx.beginPath()
    drawCtx.arc(drawScreenX + (x * drawScaleX), drawScreenY + (y * drawScaleY), r * drawScaleX, 0, Math.PI * 2)
    drawCtx[isOnlyOutline ? "stroke" : "fill"]()
}
function drawRawLine (x1, y1, x2, y2) {
    drawCtx.beginPath()
    drawCtx.moveTo(drawScreenX + (x1 * drawScaleX), drawScreenY + (y1 * drawScaleY))
    drawCtx.lineTo(drawScreenX + (x2 * drawScaleX), drawScreenY + (y2 * drawScaleY))
    drawCtx.stroke()
}

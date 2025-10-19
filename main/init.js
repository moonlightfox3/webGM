let currentGame = null
let currentGamePack = null
let isGameWindow = false
let hasInited = false
let readyToStart = false
async function getDataInit () {
    let packResp = await fetch(`./games/${currentGame}.wpck`)
    let packBuf = await packResp.arrayBuffer()
    packBuf = new FileBuf(packBuf)
    currentGamePack = unpackWPCK(packBuf)
    
    loadFileSystemFromLocalStorage()
    getInfo()
    if (isGameWindow) {
        getScripts()
        getFonts()
        getObjects()
        getPaths()
        getRooms()
        getSounds()
        getSprites()
        getTiles()
    }

    if (isGameWindow) {
        hasInited = true
        readyToStart = true
        drawStartGameWindow()
    } else createGameWindow()
}
function createGameWindow () {
    let w = gameInfo.width, h = gameInfo.height
    let x = (screen.width - w) / 2, y = (screen.height - h) / 2

    let url = location.href
    if (!url.endsWith("index.html")) {
        if (!url.endsWith("/")) url = `${url}/`
        url = `${url}index.html`
    }
    let win = open(`${url}?game=${currentGame}`, "_blank", `popup,width=${w},height=${h},left=${x},top=${y}`)
    if (win == null) return
}
function drawLoadingGameWindow () {
    drawMainUI("Game loading...")
}
let gameList = null
function drawGameList () {
    drawMainUI("Select a GM game to play (use up/down/enter):", gameList)
}
function drawStartGameWindow () {
    drawMainUI("Press Enter to start '" + currentGame + "'")
}
function startGame () {
    room_goto(0)
    startMainTickLoop()
}

function checkUrlParam () {
    let params = new URLSearchParams(location.search)
    let game = params.get("game")
    if (game != null) {
        isGameWindow = true
        currentGame = game
        getDataInit()
    }
    return game != null
}
onload = async function () {
    let isGame = checkUrlParam()
    initRenderer()
    if (!isGame) {
        gameList = await getGameList()
        drawGameList()
    } else {
        gameList = []
        drawLoadingGameWindow()
    }
}

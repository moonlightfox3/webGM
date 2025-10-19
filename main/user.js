let keyCodeList = {
    "8": "Backspace",
    "9": "Tab",
    "13": "Return",
    "13": "Enter",
    "16": "Shift",
    "17": "Control",
    "18": "Alt",
    "19": "Pause",
    "27": "Escape",
    "32": " ",
    "33": "PageUp",
    "34": "PageDown",
    "35": "End",
    "36": "Home",
    "37": "ArrowLeft",
    "38": "ArrowUp",
    "39": "ArrowRight",
    "40": "ArrowDown",
    "45": "Insert",
    "46": "Delete",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "65": "A",
    "66": "B",
    "67": "C",
    "68": "D",
    "69": "E",
    "70": "F",
    "71": "G",
    "72": "H",
    "73": "I",
    "74": "J",
    "75": "K",
    "76": "L",
    "77": "M",
    "78": "N",
    "79": "O",
    "80": "P",
    "81": "Q",
    "82": "R",
    "83": "S",
    "84": "T",
    "85": "U",
    "86": "V",
    "87": "W",
    "88": "X",
    "89": "Y",
    "90": "Z",
    "96": "0",
    "97": "1",
    "98": "2",
    "99": "3",
    "100": "4",
    "101": "5",
    "102": "6",
    "103": "7",
    "104": "8",
    "105": "9",
    "112": "F1",
    "113": "F2",
    "114": "F3",
    "115": "F4",
    "116": "F5",
    "117": "F6",
    "118": "F7",
    "119": "F8",
    "120": "F9",
    "121": "F10",
    "122": "F11",
    "123": "F12",
    "160": "Shift",
    "161": "Shift",
    "162": "Control",
    "163": "Control",
    "164": "Alt",
    "165": "Alt",
}

let pressedKeys = []
let heldKeys = []
let releasedKeys = []
onkeydown = function (ev) {
    if (ev.repeat) return
    if (gameList == null) return
    else if (!hasInited) {
        if (gameList.length > 0) {
            if (ev.key == "ArrowUp") {
                if (uiSelectPos > 0) uiSelectPos--
                drawGameList()
            } else if (ev.key == "ArrowDown") {
                if (uiSelectPos < gameList.length - 1) uiSelectPos++
                drawGameList()
            } else if (ev.key == "Enter") {
                currentGame = gameList[uiSelectPos]
                getDataInit()
            }
        }
        return
    } else if (readyToStart) {
        if (ev.key == "Enter") {
            readyToStart = false
            startGame()
        }
        return
    }

    let keyCode = getKeyCode(ev.key)
    let vkKeyIndex = Object.values(vkKeys).indexOf(keyCode)
    if (/[a-z0-9]/i.test(ev.key) || vkKeyIndex > -1) {
        if (pressedKeys.indexOf(keyCode) == -1) pressedKeys.push(keyCode)
        if (heldKeys.indexOf(keyCode) == -1) heldKeys.push(keyCode)
        
        let evKey = ev.key.toUpperCase()
        let vkKey = Object.keys(vkKeys)[vkKeyIndex]
        if (vkKey != undefined) fireEventsAllInstances("KeyPress", vkKey)
        else fireEventsAllInstances("KeyPress", evKey)
    }
}
onkeyup = function (ev) {
    if (!hasInited) return
    if (gameList == null || !hasInited || readyToStart) return
    
    let keyCode = getKeyCode(ev.key)
    let vkKeyIndex = Object.values(vkKeys).indexOf(keyCode)
    if (/[a-z0-9]/i.test(ev.key) || vkKeyIndex > -1) {
        if (releasedKeys.indexOf(keyCode) == -1) releasedKeys.push(keyCode)
        if (heldKeys.indexOf(keyCode) > -1) heldKeys.splice(heldKeys.indexOf(keyCode), 1)
    }
}
function getKeyCode (key) {
    let index = Object.values(keyCodeList).indexOf(key)
    let keyCode = +Object.keys(keyCodeList)[index]
    return keyCode
}

function debugSendKeydown (key) {
    onkeydown({key})
}
function debugSendKeyup (key) {
    onkeyup({key})
}
async function debugSendKeypress (key) {
    debugSendKeydown(key)
    await new Promise(resolve => setTimeout(resolve, 150))
    debugSendKeyup(key)
}

let currentlyOpenIni = null
function closeIni () {
    let file = ""
    if (fileSystem[currentlyOpenIni] == undefined) return ""

    for (let section of Object.keys(fileSystem[currentlyOpenIni])) {
        file += `[${section}]\n`
        for (let key of Object.keys(fileSystem[currentlyOpenIni][section])) {
            let val = fileSystem[currentlyOpenIni][section][key]
            file += `${key} = "${val}"\n`
        }
    }

    fileSystemStr[currentlyOpenIni] = file
    currentlyOpenIni = null
    saveFileSystemToLocalStorage()
    return file
}
function writeIni (section, key, val) {
    if (fileSystem[currentlyOpenIni] == undefined) fileSystem[currentlyOpenIni] = {}
    if (fileSystem[currentlyOpenIni][section] == undefined) fileSystem[currentlyOpenIni][section] = {}
    fileSystem[currentlyOpenIni][section][key] = val
    saveFileSystemToLocalStorage()
}

function saveFileSystemToLocalStorage (gameOverride = null) {
    let storage = {fileSystem, fileSystemStr}
    localStorage.setItem(gameOverride || currentGame || "", JSON.stringify(storage))
}
function loadFileSystemFromLocalStorage (gameOverride = null) {
    let storage = JSON.parse(localStorage.getItem(gameOverride || currentGame || "")) || {}
    fileSystem = storage?.fileSystem || {}
    fileSystemStr = storage?.fileSystemStr || {}
}

function checkKeyPressed (key) {
    let val = pressedKeys.indexOf(key)
    if (val > -1) pressedKeys.splice(val, 1)
    return val > -1
}
function checkKeyReleased (key) {
    let val = releasedKeys.indexOf(key)
    if (val > -1) releasedKeys.splice(val, 1)
    return val > -1
}
function clearKey (key) {
    if (pressedKeys.indexOf(key) > -1) pressedKeys.splice(pressedKeys.indexOf(key), 1)
    if (heldKeys.indexOf(key) > -1) heldKeys.splice(heldKeys.indexOf(key), 1)
    if (releasedKeys.indexOf(key) > -1) releasedKeys.splice(releasedKeys.indexOf(key), 1)
}

function createInstance (x, y, nameId) {
    if (typeof nameId == "object") nameId = nameId.object_index
    
    let j = all.push({}) - 1
    all[j] = {
        id: j,
        visible: objectList[nameId].visible || true,
        persistent: objectList[nameId].persistent || false,
        depth: objectList[nameId].depth || 0,
        alarm: new Array(12).fill(-1),
        x,
        y,
        object_index: nameId,
        sprite_index: objectList[nameId].sprite_index || -1,
        sprite_width: objectList[nameId].sprite_width || 0,
        sprite_height: objectList[nameId].sprite_height || 0,
        image_alpha: objectList[nameId].image_alpha || 1,
        image_index: objectList[nameId].image_index || 0,
        image_number: objectList[nameId].image_number || 0,
        image_speed: objectList[nameId].image_speed || 1,
        image_xscale: 1,
        image_yscale: 1,
        action_kill_object: function () {
            all[j] = null
        },
        action_move_to: function (x, y) {
            this.x = x
            this.y = y
        },
        instance_destroy: function () {
            if (all[j] != null) fireEventsOneInstance("Destroy", "default", j)
            all[j] = null
        },
        event_inherited: function () {
            fireEventsOneInstance(this.currentEventType, this.currentEventSubtype, j, true)
        },

        lastSpriteChangeTime: current_time,
        currentEventType: null,
        currentEventSubtype: null,
    }

    fireEventsOneInstance("Create", "default", j)
    return all[j]
}
function checkInstanceExists (nameId) {
    if (typeof nameId == "object") nameId = nameId.object_index

    if (typeof nameId == "number") return all[nameId] != null
    else if (typeof nameId == "string") return all.filter(val => val?.object_index == nameId).length > 0
}

function endGame () {
    fireEventsAllInstances("Other", "GameEnd")
    endMainTickLoop()
    stopAllSounds()

    readyToEnd = true
    drawMainUI("Game ended. Press Enter to quit.")
}
function debugEndGame () {
    console.warn("Ending game... (debug)")
    endMainTickLoop()
    stopAllSounds()
}
function restartGame() {
    fireEventsAllInstances("Other", "GameEnd")
    gameStartEventFired = false
    gameStart()
}

let roomBackground = null
let fileSystem = {}
let fileSystemStr = {}
let joysticksList = []
let textAlignH = 0
let runContextCopy = window


let global = {}
let all = []
let argument = []
let argument_count = 0
let view_current = 0
let current_time = 0
let delta_time = 0
let room = null
let room_width = null
let room_height = null
let room_speed = null

const pointer_null = null
const pointer_invalid = undefined
const infinity = Infinity
const pi = Math.PI
const noone = []

const os_unknown = -1
const os_windows = 0
const os_macosx = 1
const os_psp = 2
const os_ios = 3
const os_android = 4
const os_symbian = 5
const os_linux = 6
const os_winphone = 7
const os_tizen = 8
const os_win8native = 9
const os_wiiu = 10
const os_3ds = 11
const os_psvita = 12
const os_bb10 = 13
const os_ps4 = 14
const os_xboxone = 15
const os_ps3 = 16
const os_xbox360 = 17
const os_uwp = 18
const os_switch_beta = 20
const os_switch = 21
const os_ps5 = 22
const os_gdk = 23
const os_gxgames = 24
const os_type = os_windows

const application_surface = 0

const c_aqua = "#00FFFF"
const c_black = "#000000"
const c_blue = "#0000FF"
const c_dkgray = "#404040"
const c_fuchsia = "#FF00FF"
const c_gray = "#808080"
const c_green = "#008000"
const c_lime = "#00FF00"
const c_ltgray = "#C0C0C0"
const c_maroon = "#800000"
const c_navy = "#000080"
const c_olive = "#808000"
const c_orange = "#FFA040"
const c_purple = "#800080"
const c_red = "#FF0000"
const c_silver = "#C0C0C0"
const c_teal = "#008080"
const c_white = "#FFFFFF"
const c_yellow = "#FFFF00"

const fa_left = 0
const fa_center = 1
const fa_right = 2

Object.defineProperty(window, "view_wview", {
    get () {
        return [room_width]
    },
})
Object.defineProperty(window, "view_hview", {
    get () {
        return [room_height]
    },
})
Object.defineProperty(window, "view_xview", {
    get () {
        return [0]
    },
})
Object.defineProperty(window, "view_yview", {
    get () {
        return [0]
    },
})

function room_goto (name) {
    if (room != null) fireEventsAllInstances("Other", "RoomEnd")
    if (typeof name == "number") room = name
    else if (typeof name == "string") room = Object.keys(roomList).indexOf(name)
    else throw new Error(`Error going to room "${name}" - Invalid data type "${typeof name}"`)
    
    let copiedInstances = all?.filter(val => val?.persistent) || []
    all = loadRoomInstances()
    if (gameStartEventFired) all.push(...copiedInstances)

    for (let j = 0; j < all.length; j++) {
        let instance = all[j]
        if (instance == null) continue
        let nameId = instance.object_index

        Object.assign(all[j], {
            id: j,
            visible: objectList[nameId].visible || true,
            persistent: objectList[nameId].persistent || false,
            depth: objectList[nameId].depth || 0,
            alarm: new Array(12).fill(-1),
            sprite_index: objectList[nameId].sprite_index || -1,
            sprite_width: objectList[nameId].sprite_width || 0,
            sprite_height: objectList[nameId].sprite_height || 0,
            image_alpha: objectList[nameId].image_alpha || 1,
            image_index: objectList[nameId].image_index || 0,
            image_number: objectList[nameId].image_number || 0,
            image_speed: objectList[nameId].image_speed || 1,
            image_xscale: 1,
            image_yscale: 1,
            action_kill_object: function () {
                all[j] = null
            },
            action_move_to: function (x, y) {
                this.x = x
                this.y = y
            },
            instance_destroy: function () {
                if (all[j] != null) fireEventsOneInstance("Destroy", "default", j)
                all[j] = null
            },
            event_inherited: function () {
                fireEventsOneInstance(this.currentEventType, this.currentEventSubtype, j, true)
            },
    
            lastSpriteChangeTime: current_time,
            currentEventType: null,
            currentEventSubtype: null,
        })
    }

    fireEventsAllInstances("Create")
    if (!gameStartEventFired) {
        fireEventsAllInstances("Other", "GameStart")
        gameStartEventFired = true
    }
    fireEventsAllInstances("Other", "RoomStart")
}
function room_goto_next () {
    room_goto(room + 1)
}
function room_goto_previous () {
    room_goto(room - 1)
}
function randomize () { return 0 }
function audio_channel_num () {  }
function steam_initialised () { return true }
function steam_file_exists (name) { return fileSystem[name] != undefined }
function os_get_language () { return "en" }
function string_upper (str) { return str.toUpperCase() }
function string_lower (str) { return str.toLowerCase() }
function os_get_region () { return "US" }
function variable_global_exists (name) { return global[name] != undefined }
function script_execute (name, ...args) { return execScript(name, ...args) }
function string_length (str) { return str.length }
function string_copy (str, index, count) { return str.substring(index - 1, (index - 1) + count) }
function ds_map_create () { return new Map() }
function ds_map_set (map, key, val) { map.set(key, val) }
function ds_map_add (map, key, val) { map.set(key, val) }
function floor (val) { return Math.floor(val) }
function window_set_caption (caption) { document.title = `${caption} | webGM` }
function ini_open (name) { currentlyOpenIni = name }
function ini_read_string (section, key, fallback) { return fileSystem[currentlyOpenIni]?.[section]?.[key] || fallback }
function ini_read_real (section, key, fallback) { return +(fileSystem[currentlyOpenIni]?.[section]?.[key] || fallback) }
function ini_close () { return closeIni() }
function file_exists (name) { return fileSystem[name] != undefined }
function sprite_prefetch (name) { loadSprite(name); return 0 }
function window_get_width () { return canvasEl.width }
function window_get_height () { return canvasEl.height }
function surface_get_width (id) { return canvasEl.width }
function surface_get_height (id) { return canvasEl.height }
function min (...vals) { return Math.min(...vals) }
function draw_set_font (name) { setFont(name) }
function draw_set_color (color) { drawCtx.fillStyle = drawCtx.strokeStyle = color }
function joystick_exists (id) { return joysticksList.indexOf(id) > -1 }
function round (val) { return Math.round(val) }
function ord (str) { return str.charCodeAt(0) }
function chr (val) { return String.fromCharCode(val) }
function keyboard_check (key) { return heldKeys.indexOf(key) > -1 }
function keyboard_check_pressed (key) { return checkKeyPressed(key) }
function keyboard_check_released (key) { return checkKeyReleased(key) }
function keyboard_check_direct (key) { return heldKeys.indexOf(key) > -1 }
function keyboard_clear (key) { clearKey(key) }
function instance_create (x, y, name) { return createInstance(x, y, name) }
function audio_play_sound (name, priority, loop) { return playSound(name, priority, loop) }
function ds_map_find_value (map, key) { return map.get(key) }
function is_undefined (val) { return val == undefined }
function audio_sound_pitch (sound, pitch) { setSoundPitch(sound, pitch) }
function audio_sound_gain (sound, vol, time) { setSoundGain(sound, vol, time) }
function draw_rectangle (x1, y1, x2, y2, isOnlyOutline) { drawRawRectangle(x1, y1, x2, y2, isOnlyOutline) }
function draw_circle (x, y, r, isOnlyOutline) { drawRawCircle(x, y, r, isOnlyOutline) }
function instance_exists (name) { return checkInstanceExists(name) }
function audio_stop_sound (sound) { stopSound(sound) }
function draw_sprite (sprite, frame, x, y) { drawSpriteStatic(sprite, frame, x, y) }
function game_end () { endGame() }
function game_restart () { restartGame() }
function ini_section_exists (section) { return fileSystem[currentlyOpenIni]?.[section] != undefined }
function string_char_at (str, i) { return i < 1 ? str[0] : i > str.length ? "" : str[i - 1] }
function string_pos (substr, str) { return str.indexOf(substr) + 1 }
function string_height (str) { return drawText(0, 0, str, true).heightMax }
function string_width (str) { return drawText(0, 0, str, true).widthMax }
function draw_text (x, y, str) { drawText(x, y, str) }
function draw_text_transformed (x, y, str, scaleX, scaleY, angle) { drawTextTransformed(x, y, str, scaleX, scaleY, angle) }
function draw_text_transformed_color (x, y, str, scaleX, scaleY, angle, c1, c2, c3, c4, alpha) { drawTextTransformed(x, y, str, scaleX, scaleY, angle, c1, c2, c3, c4, alpha) }
function random (max) { return Math.random() *  max }
function audio_stop_all () { stopAllSounds() }
function window_get_fullscreen () { return isFullscreen }
function window_set_fullscreen (fullscreen) { fullscreen ? mainCanvasEl.requestFullscreen() : (document.fullscreenElement != null ? document.exitFullscreen() : null); isFullscreen = fullscreen }
function draw_set_halign (type) { textAlignH = type }
function ini_write_string (section, key, val) { writeIni(section, key, val) }
function ini_write_real (section, key, val) { writeIni(section, key, val) }
function joystick_buttons (id) { return joysticksList[id]?.length || 0 }
function draw_sprite_ext (sprite, frame, x, y, scaleX, scaleY, angle, blendColor, alpha) { drawSpriteStatic(sprite, frame, x, y, scaleX, scaleY, angle, blendColor, alpha) }
function string_replace_all (str, substr, newstr) { return str.replaceAll(substr, newstr) }
function real (str) { return parseInt(str) }
function draw_sprite_part (sprite, frame, left, top, w, h, x, y) { drawSpriteStaticPart(sprite, frame, left, top, w, h, x, y) }
function draw_background (bg, x, y) { drawBackground(bg, x, y) }
function room_get_name (room) { return getRoomName(room) }
function string (...args) { return formatString(...args) }

let shouldRunMainTickLoop = false
let startGameEventFired = false
let startGameTime = null
let lastTickTime = null
async function mainTick (timestamp) {
    if (startGameTime == null) startGameTime = timestamp
    current_time = timestamp || 0
    let deltaTime = (current_time - (lastTickTime || 0)) * 1000
    if (shouldRunMainTickLoop) requestAnimationFrame(mainTick)
    if (deltaTime < 1000000 / room_speed && lastTickTime != null) return
    lastTickTime = timestamp
    delta_time = deltaTime
    
    clearCanvas()
    
    fireEventsAllInstances("Step", "BeginStep")
    for (let i = 0; i < all.length; i++) {
        let instance = all[i]
        if (instance == null) continue
        for (let j = 0; j < instance.alarm.length; j++) {
            if (instance.alarm[j] > -1) instance.alarm[j]--
            if (instance.alarm[j] == 0) fireEventsOneInstance("Alarm", `${j}`, i)
        }
    }
    fireEventsAllInstances("Step", "Step")
    for (let i = 0; i < all.length; i++) {
        let instance = all[i]
        if (instance == null) continue
        
        if (instance.sprite_index != -1) {
            let useDefaultDraw = isScriptEmpty("Draw", "Draw", i)
            if (!useDefaultDraw) continue

            if ((current_time - instance.lastSpriteChangeTime) * instance.image_speed >= room_speed) {
                if (instance.image_index >= instance.image_number - 1) all[i].image_index = 0
                else all[i].image_index++
                all[i].lastSpriteChangeTime = current_time
            }
        }
    }
    fireEventsAllInstances("Step", "EndStep")
    
    drawAllInstances()
    cropToGame()
    renderMain()
}
function startMainTickLoop () {
    if (shouldRunMainTickLoop) return
    shouldRunMainTickLoop = true
    mainTick()
}
function endMainTickLoop () {
    shouldRunMainTickLoop = false
}

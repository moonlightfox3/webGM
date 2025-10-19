(async function () {
    mainTick = () => {}
    drawGameList = function () {
        drawMainUI("Pack a GM game dump (use up/down/enter):", gameList)
    }
    
    let state = 0
    let dumpName = null
    let dumpPack = null
    getDataInit = async function () {
        if (state == 0)
        {
            drawGameList()

            let handle = await showDirectoryPicker({mode: "read"})
            dumpName = handle.name

            hasInited = true
            gameList = ["Importing..."]
            uiSelectPos = -1
            drawGameList()

            let dumpFolder = {}
            await exploreFolder(handle, dumpFolder)
            
            hasInited = true
            gameList = ["Packing..."]
            uiSelectPos = -1
            drawGameList()
            
            dumpPack = packWPCK(dumpFolder).data
            
            gameList = ["Download pack"]
            uiSelectPos = 0
            drawGameList()
            hasInited = false
            
            state++
        }
        else if (state == 1)
        {
            drawGameList()

            await exportFile(dumpName, "wpck", dumpPack)

            gameList = ["Done! Press Enter to quit."]
            uiSelectPos = 0
            drawGameList()
            hasInited = false
            
            state++
        }
        else if (state == 2)
        {
            drawGameList()
            
            hasInited = true
            gameList = ["Quitting..."]
            uiSelectPos = -1
            drawGameList()

            close()
        }
    }
    
    gameList = ["Select a game dump"]
    uiSelectPos = 0
    drawGameList()
    hasInited = false
})()

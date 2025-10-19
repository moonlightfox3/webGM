async function exploreFolder (pathFilesys, pathStructure) {
    let entries = pathFilesys.entries()
    for await (let [name, data] of entries) {
        if (data.kind == "file") {
            let file = await data.getFile()
            let buf = await file.arrayBuffer()
            let fileBuf = new FileBuf(buf)
            
            pathStructure[name] = fileBuf
        } else if (data.kind == "directory") {
            if (name == ".git") continue

            pathStructure[name] = {}
            await exploreFolder(data, pathStructure[name])
        }
    }
}

async function importFolder () {
    let structure = {}

    let handle = await showDirectoryPicker({mode: "read"})
    let name = handle.name
    await exploreFolder(handle, structure)
    return {name, structure}
}
async function exportFile (name, ext, buf) {
    let handle = await showSaveFilePicker({
        excludeAcceptAllOption: true,
        suggestedName: `${name}.${ext}`,
        types: [{
            accept: {
                "*/*": [`.${ext}`],
            },
            description: ":",
        }],
    })
    let writable = await handle.createWritable()
    await writable.write(buf)
    await writable.close()
}

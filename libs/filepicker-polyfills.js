// polyfills for showOpenFilePicker, showSaveFilePicker, and showDirectoryPicker (some browsers don't support them)
if (window.showOpenFilePicker == undefined) {
    window.showOpenFilePicker = async function (options) {
        let el = document.createElement("input"); el.type = "file"
        el.multiple = options?.multiple ?? false
        let types = options?.types?.[0]?.accept["*/*"] ?? []
        el.accept = types.join(",")
        return new Promise(function (resolve) {
            el.onchange = function () {
                let files = [...el.files].map(val => {return {
                    kind: "file",
                    name: val.name,
                    getFile: async function () {
                        return val
                    },
                }})
                el.remove()

                if (options?.excludeAcceptAllOption && files.find(val => {
                    let dotIndex = val.name.lastIndexOf(".")
                    if (dotIndex > -1) {
                        let ext = val.name.substring(dotIndex)
                        return !types.includes(ext)
                    }
                }) != undefined) throw new Error("Failed to execute 'showOpenFilePicker' on 'Window': The user selected a file with the wrong extension.", "AbortError")
                resolve(files)
            }
            el.oncancel = function () {
                el.remove()
                throw new DOMException("Failed to execute 'showOpenFilePicker' on 'Window': The user aborted a request.", "AbortError")
            }
            el.click()
        })
    }
}
if (window.showSaveFilePicker == undefined) {
    window.showSaveFilePicker = async function (options) {
        let el = document.createElement("a")
        el.download = options?.suggestedName ?? "download"
        return {
            createWritable: async function () {
                return {
                    write: async function (data) {
                        let url = URL.createObjectURL(new Blob([data]))
                        el.href = url
                    },
                    close: async function () {
                        el.click()
                        URL.revokeObjectURL(el.href)
                        el.remove()
                    },
                }
            },
        }
    }
}
if (window.showDirectoryPicker == undefined) {
    class _showDirectoryPickerPolyfillObj {
        kind = "directory"
        name = ""
        #structure = {}

        constructor (structure, name = "") {
            this.#structure = structure
            this.name = name
        }

        entries () {
            let structure = this.#structure
            return (async function* () {
                let keys = Object.keys(structure)
                for (let key of keys) {
                    let val = structure[key]
                    if (val instanceof File) yield [key, {
                            kind: "file",
                            name: key,
                            getFile: async function () {
                                return structure[key]
                            },
                        }]
                    else yield [key,
                            new _showDirectoryPickerPolyfillObj(val, key)
                        ]
                }
            })()
        }
    }
    window.showDirectoryPicker = async function (options) {
        let el = document.createElement("input"); el.type = "file"; el.webkitdirectory = el.multiple = true
        return new Promise(function (resolve) {
            el.onchange = function () {
                let name = ""
                let structure = {}

                if (el.files.length > 0) name = el.files[0].webkitRelativePath.split("/")[0]
                else console.warn("'showDirectoryPicker' cannot determine the name of a folder that does not contain files.")

                for (let file of el.files) {
                    let path = file.webkitRelativePath.split("/").slice(1, -1)

                    let currentPath = structure
                    for (let pathPart of path) {
                        if (currentPath[pathPart] == undefined) currentPath[pathPart] = {}
                        currentPath = currentPath[pathPart]
                    }

                    currentPath[file.name] = file
                }

                resolve(new _showDirectoryPickerPolyfillObj(structure, name))
            }
            el.oncancel = function () {
                el.remove()
                throw new DOMException("Failed to execute 'showDirectoryPicker' on 'Window': The user aborted a request.", "AbortError")
            }
            el.click()
        })
    }
}

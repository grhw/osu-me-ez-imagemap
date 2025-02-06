const scale = 10
const input = document.querySelector("input")
const output = document.querySelector(".out")
const canvasElement = document.querySelector("canvas")
const canvas = canvasElement.getContext("2d")
const image = document.querySelector("img")

canvasElement.width *= scale
canvasElement.height *= scale

input.onchange = () => {
    const [file] = input.files
    if (file) {
        image.src = URL.createObjectURL(file)
    }
}

var boxes = []
var current = null

function displayRect(x,y,w,h) {
    canvas.fillStyle = "#ffffff80"
    canvas.fillRect(x*scale,y*scale,w*scale,h*scale)
}

function update() {
    canvas.clearRect(0,0,100*scale,100*scale)
    output.value = "[imagemap]\n<put your image's url here>"
    boxes.forEach((v, index)=>{
        displayRect(v[0],v[1],v[2],v[3])
        canvas.fillStyle = "#000000"
        canvas.font = "35px Tiny5"
        canvas.fillText(` ${index}`,v[0]*scale,(v[1]+v[3]-1)*scale)

        output.value += `\n${v[0]} ${v[1]} ${v[2]} ${v[3]} <link> box${index}`
    })
    output.value += "\n[/imagemap]"
    output.style.height = (output.value.split("\n").length*20) + "px"

    if (current !== null) {
        displayRect(current[0],current[1],current[2],current[3])
    }
    canvasElement.style.height = image.clientHeight + "px"
}

function getPercentage(x,y) {
    const bbox = image.getBoundingClientRect()
    return [Math.ceil(((x-bbox.x)/bbox.width)*100),Math.ceil(((y-bbox.y)/bbox.height)*100)]
}

document.addEventListener("mousedown",(mouse)=>{
    const [x,y] = getPercentage(mouse.clientX,mouse.clientY)
    if (x >= 0 && x <= 100) {
        if (y >= 0 && y <= 100) {
            current = [x,y,1,1]
            console.log(current)
        }
    }
})

document.addEventListener("mousemove",(mouse)=>{
    if (current !== null) {
        const [x,y] = getPercentage(mouse.clientX,mouse.clientY)
        if (x >= 0 && x <= 100) {
            if (y >= 0 && y <= 100) {
                current[2] = x-current[0]
                current[3] = y-current[1]
            }
        }
    }
    update()

})

document.addEventListener("mouseup",()=>{
    if (Math.min(Math.abs(current[2]),Math.abs(current[3])) <= 1) {
        var del = false
        boxes.forEach((v)=>{
            if (!del) {
                const [x,y,w,h] = v
                if (current[0] > x && current[0] < x+w) {
                    if (current[1] > y && current[1] < y+h) {
                        boxes.splice(boxes.indexOf(v),1)
                        del = true
                    }
                }
            }
        })
    } else {
        const [x,y] = [current[0],current[1]]
        if (current[2] < 0) {
            current[2] = Math.abs(current[2])
            current[0] = x-current[2]
        }
        if (current[3] < 0) {
            current[3] = Math.abs(current[3])
            current[1] = y-current[3]
        }
        boxes.push(current)
    }
    current = null
    update()
})
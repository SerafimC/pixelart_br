var mesh_size = 10
var show_mesh = true
var color_selected = "black"
var changes_history = []
var mousedownID = -1; //Global ID of mouse down interval
var mouseisdown = false

function startGame() {
    drawArea.start();
    colorPalet.draw();
}

var colorPalet = {
    interval: 1,
    draw: function() {
        colorPalet_html = '<table>'
        for (red1 = 0; red1 < 6; red1 += this.interval) {
            colorPalet_html += '<tr>'
            for (green1 = 0; green1 < 6; green1 += this.interval) {
                for (blue1 = 0; blue1 < 6; blue1 += this.interval) {
                    color_ac = hexTransl(red1) + '' + hexTransl(red1) + '' + hexTransl(green1) + '' + hexTransl(green1) + '' + hexTransl(blue1) + '' + hexTransl(blue1)
                    colorPalet_html += '<td id="' + color_ac + '"><button style="background-color: #' + color_ac + ';"' +
                        'onclick=changeColor(' + "'#" + color_ac + "')" + '> </button></td>'
                }
            }
            colorPalet_html += '</tr>'
        }

        colorPalet_html += '</table>'
        $('#colorpalet').html(colorPalet_html).show()
    }
}

var drawArea = {
    width: 700,
    height: 300,
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");
        document.getElementById("mdiv").insertBefore(this.canvas,
            document.getElementById("mdiv").firstChild);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
var dm = drawMesh()
var mesh = dm.mesh
var drawMesh = dm.draw_mesh
changes_history.push(clone_array(drawMesh))

function component(width, height, color, x, y, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color
    this.update = function() {
        ctx = drawArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.setColor = function(color) {
        this.color = color
    }
}

function updateGameArea() {
    // Mesh fill
    for (dm in drawMesh) {
        for (dmi in drawMesh[dm]) {
            drawMesh[dm][dmi].update()
        }
    }
    // Mesh drawning
    if (show_mesh) {
        for (ms in mesh) {
            mesh[ms].update()
        }
    }
}

function drawMesh() {
    var mesh = []
    var mesh_s = mesh_size

    mesh_w = drawArea.width / mesh_s
    mesh_h = drawArea.height / mesh_s
    for (i = 0; i < mesh_w - 1; i++) {
        mesh.push(new component(0.5, drawArea.height, "black", (i + 1) * mesh_s, 0))
    }
    for (i = 0; i < mesh_h - 1; i++) {
        mesh.push(new component(drawArea.width, 0.5, "black", 0, (i + 1) * mesh_s))
    }

    var draw_mesh = []
    for (dm = 0; dm < mesh_w; dm++) {
        draw_mesh.push([])
        for (dmi = 0; dmi < mesh_h; dmi++) {
            draw_mesh[dm].push(new component(mesh_s, mesh_s, 'white', dm * mesh_s, dmi * mesh_s))
        }
    }

    return { mesh: mesh, draw_mesh: draw_mesh }
}

function paint(x, y, color) {
    changes_history.push(clone_array(drawMesh))
    console.log(changes_history.length)
    for (dm in drawMesh) {
        for (dmi in drawMesh[dm]) {
            if (dm == x && dmi == y) {
                drawMesh[dm][dmi].setColor(color)
            }
        }
    }
}

function showHideMesh() {
    if (show_mesh) {
        show_mesh = false
    } else {
        show_mesh = true
    }
}

function clearDraw() {
    changes_history.push(clone_array(drawMesh))
    for (dm in drawMesh) {
        for (dmi in drawMesh[dm]) {
            drawMesh[dm][dmi].setColor("white")
        }
    }
}

function backStep() {
    drawMesh = clone_array(changes_history[changes_history.length - 1])
    if (changes_history.length > 0)
        changes_history.pop()
}

function changeColor(color) {
    try { document.getElementById(color_selected.replace('#', '')).style.border = "1px solid #dddddd" } finally {
        color_selected = (typeof color !== 'undefined') ? color : document.getElementById("color").value;
        document.getElementById("color").value = color_selected;
        document.getElementById(color_selected.replace('#', '')).style.border = "2px solid black"
    }

}

function clone_array(array) {
    cln_arr = new Array()
    for (i in array) {
        cln_arr.push([])
        for (j in array[i])
            cln_arr[i].push(Object.assign({}, array[i][j]))
    }
    return cln_arr
}
var pixel_x_prev = -1
var pixel_y_prev = -1

function mousedown(event) {
    if (mousedownID == -1) { //Prevent multimple loops!
        mousedownID = 1
        mouseisdown = true
    }
}

function mouseup(event) {
    if (mousedownID != -1) { //Only stop if exists
        clearInterval(mousedownID);
        mousedownID = -1;
        mouseisdown = false
    }
}
document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop || body && body.scrollTop || 0) -
            (doc && doc.clientTop || body && body.clientTop || 0);
    }

    if (mouseisdown) {
        var rect = drawArea.canvas.getBoundingClientRect()
        if ((event.pageX - rect.left) < drawArea.width && (event.pageY - rect.top) < drawArea.height) {
            pixel_x = Math.trunc((event.pageX - rect.left) / mesh_size)
            pixel_y = Math.trunc((event.pageY - rect.top) / mesh_size)
            paint(pixel_x, pixel_y, color_selected)
        }
    }

}

function printOnClick(event) {
    var rect = drawArea.canvas.getBoundingClientRect()

    pixel_x = Math.trunc((event.clientX - rect.left) / mesh_size)
    pixel_y = Math.trunc((event.clientY - rect.top) / mesh_size)

    if ((event.clientX - rect.left) < drawArea.width && (event.clientY - rect.top) < drawArea.height &&
        (pixel_x != pixel_x_prev || pixel_y != pixel_y_prev)) {
        pixel_x_prev = pixel_x
        pixel_y_prev = pixel_y
        paint(pixel_x, pixel_y, color_selected)
    }

}

document.addEventListener("click", printOnClick);
//Assign events
document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
//Also clear the interval when user leaves the window with mouse
// document.addEventListener("mouseout", mouseup);
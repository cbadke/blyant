function startCanvas (canvasId, onchangecallback) {

  var canvas = $(canvasId);
  var drawing = false;

  if (!canvas || !canvas[0] || !canvas[0].getContext){
    return;
  }

  context = canvas[0].getContext('2d');
  if (!context) {
    return;
  }

  canvas.bind('mousemove', function(ev) {
    var x, y;

    // Get the mouse position relative to the canvas element.
    if (ev.layerX || ev.layerX == 0) { // Firefox
      x = ev.layerX;
      y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      x = ev.offsetX;
      y = ev.offsetY;
    }

    if (drawing) {
      context.lineTo(x, y);
      context.stroke();
      onchangecallback();
    }
  });

  canvas.bind('mousedown', function (ev) {
    if (!drawing) {
      var x, y;

      // Get the mouse position relative to the canvas element.
      if (ev.layerX || ev.layerX == 0) { // Firefox
        x = ev.layerX;
        y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
      }

      context.beginPath();
      context.moveTo(x, y);
      drawing = true;
    }
  });

  canvas.bind('mouseup', function (ev) {
    drawing = false;
  });
}

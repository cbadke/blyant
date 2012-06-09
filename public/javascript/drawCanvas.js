function DrawCanvas( selector ) {

  if (!(this instanceof DrawCanvas)) {
    return new DrawCanvas( selector );
  }

  var canvas = $(selector);
  var drawing = false;
  var isActive = true;
  var onchangecallback = function(data){};
  var lastPosition = { x : 0, y : 0 };

  if (!canvas || !canvas[0] || !canvas[0].getContext){
    return null;
  }

  context = canvas[0].getContext('2d');
  if (!context) {
    return null;
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
      onchangecallback( {from : lastPosition, to : { x : x, y : y } } );
      lastPosition = { x : x, y : y };
    }
  });

  canvas.bind('mousedown', function (ev) {
    if (!drawing && isActive) {
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
      lastPosition = { x : x, y : y };
      drawing = true;
    }
  });

  canvas.bind('mouseup', function (ev) {
    drawing = false;
  });

  return {
    update : function (data) {
      context.moveTo( data.from.x, data.from.y );
      context.lineTo( data.to.x, data.to.y );
      context.stroke();
      return this;
    },
    onChange : function (callback) {
      onchangecallback = callback;
      return this;
    },
    setActive : function (act) {
      isActive = !!act;
      return this;
    }
  };

}



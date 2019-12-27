var canvasDiv = document.getElementById("canvasDiv");
var canvas = document.createElement("canvas");
var downImgBtn = document.querySelector(".downImg-btn");
var nameBase64 = "";

var screenwidth = window.innerWidth > 0 ? window.innerWidth : screen.width;

var canvasWidth = screenwidth - 34;
var canvasHeight = 320;
document.addEventListener("touchmove", onDocumentTouchMove, false);
var point = {};
point.notFirst = false;
canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("id", "canvas");
canvasDiv.appendChild(canvas);
if (typeof G_vmlCanvasManager != "undefined") {
  canvas = G_vmlCanvasManager.initElement(canvas);
}
var context = canvas.getContext("2d");
var img = new Image();
img.src = "Transparent.png";

img.onload = function() {
  var ptrn = context.createPattern(img, "repeat");
  context.fillStyle = ptrn;
  context.fillRect(0, 0, canvas.width, canvas.height);
};
canvas.addEventListener("touchstart", function(e) {
  //console.log(e);
  var mouseX = e.touches[0].pageX - this.offsetLeft;
  var mouseY = e.touches[0].pageY - this.offsetTop;
  paint = true;
  addClick(
    e.touches[0].pageX - this.offsetLeft,
    e.touches[0].pageY - this.offsetTop
  );
  //console.log(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);
  handwriting();
});

canvas.addEventListener("touchend", function(e) {
  //console.log("touch end");
  paint = false;
});

canvas.addEventListener("touchmove", function(e) {
  if (paint) {
    //console.log("touchmove");
    addClick(
      e.touches[0].pageX - this.offsetLeft,
      e.touches[0].pageY - this.offsetTop,
      true
    );
    //console.log(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);
    handwriting();
  }
});

canvas.addEventListener("mousedown", function(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  handwriting();
});
canvas.addEventListener("mousemove", function(e) {
  if (paint) {
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    handwriting();
  }
});
canvas.addEventListener("mouseup", function(e) {
  paint = false;
});
canvas.addEventListener("mouseleave", function(e) {
  paint = false;
});
document.getElementById("btn_clear").addEventListener("click", function() {
  canvas.width = canvas.width;
  $(".fileName-group").addClass("hide");
  $("#btn_submit").attr("disabled", false);
});
document.getElementById("btn_submit").addEventListener("click", saveName);

function saveName() {
  $("#signatureImg").attr("src", canvas.toDataURL("image/png"));
  nameBase64 = canvas.toDataURL("image/png");
  $(".fileName-group").removeClass("hide");
  $(this).attr("disabled", "true");
}

downImgBtn.addEventListener("click", downImg);

function downImg(id) {
  let fileName = document.querySelector("#fileNameInput").value;
  let link = document.createElement("a");
  link.id = "downurl";
  link.href = nameBase64;
  if (fileName == "") {
    fileName = "未命名";
  }
  link.download = `${fileName}.png`;
  document.body.appendChild(link);
  document.getElementById("downurl").click();
  canvas.width = canvas.width;
  removeName();
  $("#btn_submit").attr("disabled", false);
  $(".fileName-group").addClass("hide");
  document.getElementById("downurl").remove();
}

function removeName() {
  let removeName = document.querySelector("#fileNameInput");
  removeName.value = "";
}

function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    // Faking double click for touch devices
    var now = new Date().getTime();
    if (now - timeOfLastTouch < 250) {
      reset();
      return;
    }
    timeOfLastTouch = now;
    mouseX = event.touches[0].pageX;
    mouseY = event.touches[0].pageY;
    isMouseDown = true;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouseX = event.touches[0].pageX;
    mouseY = event.touches[0].pageY;
  }
}

function onDocumentTouchEnd(event) {
  if (event.touches.length == 0) {
    event.preventDefault();
    isMouseDown = false;
  }
}

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function handwriting() {
  //canvas.width = canvas.width; // Clears the canvas
  context.strokeStyle = "blue";
  context.lineJoin = "round";
  context.lineWidth = 2;
  while (clickX.length > 0) {
    point.bx = point.x;
    point.by = point.y;
    point.x = clickX.pop();
    point.y = clickY.pop();
    point.drag = clickDrag.pop();
    context.beginPath();
    if (point.drag && point.notFirst) {
      context.moveTo(point.bx, point.by);
    } else {
      point.notFirst = true;
      context.moveTo(point.x - 1, point.y);
    }
    context.lineTo(point.x, point.y);
    context.closePath();
    context.stroke();
  }
}

$("#useSignatureBtn").on("click", function() {
  $(".container-fluid").removeClass("hide");
  $(".useSignatureBtn-wrap").addClass("hide");
  fullView();
});

function fullView() {
  document.fullscreenEnabled =
    document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.documentElement.webkitRequestFullScreen;

  function requestFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }

  if (document.fullscreenEnabled) {
    requestFullscreen(document.documentElement);
  }
}


window.addEventListener('load', function() {

  var isWindowTop = false;
  var lastTouchY = 0;

  var touchStartHandler = function(e) {
      if (e.touches.length !== 1) return;
      lastTouchY = e.touches[0].clientY;
      isWindowTop = (window.pageYOffset === 0);
  };

  var touchMoveHandler = function(e) {
      var touchY = e.touches[0].clientY;
      var touchYmove = touchY - lastTouchY;
      lastTouchY = touchY;

      if (isWindowTop) {
          isWindowTop = false;
          // 阻擋移動事件
          if (touchYmove > 0) {
              e.preventDefault();
              return;
          }
      }

  };

  document.addEventListener('touchstart', touchStartHandler, false);
  document.addEventListener('touchmove', touchMoveHandler, false);

});



document.body.addEventListener('touchmove', function (e) {
  e.preventDefault(); //以阻止默認的方式，禁止回彈
}, {passive: false});

Quagga.init(
  {
    config: { locate: true },
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#camera") // Or '#yourElement' (optional)
    },
    decoder: {
      readers: ["code_128_reader"],
      debug: {
        drawBoundingBox: false,
        showFrequency: false,
        drawScanline: false,
        showPattern: false
      }
    }
  },
  function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  }
);
let oldCode = "";
Quagga.onDetected(data => {
  //   alert(data.codeResult.code);
  // console.log(data.codeResult.code);

  let barCode = data.codeResult.code;
  let regex = /^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$/;
  let match = regex.test(barCode);
  if (match) {
    var snd = new Audio();
    snd.src = "../media/beep.mp3";
    if (barCode != oldCode) {
      snd.play();
      oldCode = barCode;
    }

    $(".result").html(data.codeResult.code);
    // $("#camera").html(""data.codeResult.code"");
    // Quagga.stop();
  }
});

Quagga.onProcessed(function(result) {
  var drawingCtx = Quagga.canvas.ctx.overlay,
    drawingCanvas = Quagga.canvas.dom.overlay;

  if (result) {
    if (result.boxes) {
      drawingCtx.clearRect(
        0,
        0,
        parseInt(drawingCanvas.getAttribute("width")),
        parseInt(drawingCanvas.getAttribute("height"))
      );
      result.boxes
        .filter(function(box) {
          return box !== result.box;
        })
        .forEach(function(box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
            color: "green",
            lineWidth: 2
          });
        });
    }

    if (result.box) {
      Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
        color: "#00F",
        lineWidth: 2
      });
    }

    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, {
        color: "red",
        lineWidth: 3
      });
    }
  }
});

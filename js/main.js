Quagga.init(
  {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#camera") // Or '#yourElement' (optional)
    },
    decoder: {
      readers: ["code_128_reader"],
      debug: {
        drawBoundingBox: true,
        showFrequency: true,
        drawScanline: true,
        showPattern: true
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

Quagga.onDetected(data => {
  //   alert(data.codeResult.code);
  // console.log(data.codeResult.code);

  let barCode = data.codeResult.code;
  let regex = /^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$/;
  let match = regex.test(barCode);
  if (match) {
    $(".result").html(data.codeResult.code);
    $("#camera").html(data.codeResult.code);
    Quagga.stop();
  }
});

const qrcodebar = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const outputData = document.getElementById("outputData");
const videoSelect = document.querySelector("select#videoSource");
const container = document.getElementById("container");
const button = document.getElementById("close-camera-button");

let scanning = false;
getDevices().then(gotDevices);

function getDevices() {
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos;
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement("option");
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === "videoinput") {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  }
}

qrcodebar.callback = (res) => {
  if (res) {
    outputData.val(res);
    scanning = false;

    video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    canvasElement.hidden = true;
    container.style.display = "block";
    button.style.display = "none";
  }
};

$('#btn-scan-qr').click(function() {
  navigator.mediaDevices
    .getUserMedia({
        video: {
        deviceId: videoSelect.value ? { exact: videoSelect.value } : undefined
        }
    })
    .then(function(stream) {
      console.log("here");
      scanning = true;
      button.style.display = "block";
      container.style.display = "none";
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true);
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
});

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcodebar.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

$('#close-camera-button').click( function () {
  scanning = false;
  video.srcObject.getTracks().forEach(track => {
    track.stop();
  });
  canvasElement.hidden = true;
  container.style.display = "block";
  this.style.display = "none";
})

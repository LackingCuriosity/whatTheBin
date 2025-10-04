document.addEventListener("DOMContentLoaded", e => {
    csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream) => {
        const cameraDiv = document.getElementById("cameraBox");
        cameraDiv.srcObject = stream;

        captureButton = document.getElementById("captureButton")
        pictureBox = document.getElementById("pictureBox")
        context = pictureBox.getContext('2d')
        captureButton.addEventListener('click', e => {
            pictureBox.width = cameraDiv.videoWidth;
            pictureBox.height = cameraDiv.videoHeight;

            context.drawImage(cameraDiv, 0, 0, pictureBox.width, pictureBox.height)
            dataURL = pictureBox.toDataURL('image/png', 0.01)
            console.log(dataURL)
            
            fetch("/api", {
                method: 'POST',
                headers : {
                    'X-CSRFToken': csrf
                },
                body: JSON.stringify({'image': dataURL})
            })
        })
    })
})
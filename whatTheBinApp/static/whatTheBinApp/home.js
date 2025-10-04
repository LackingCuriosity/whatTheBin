document.addEventListener("DOMContentLoaded", e => {
    pictureBox = document.getElementById("pictureBox") 
    pictureBox.style.display = "none"
    csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream) => {
        const cameraDiv = document.getElementById("cameraBox");
        cameraDiv.srcObject = stream;

        captureButton = document.getElementById("captureButton")
        context = pictureBox.getContext('2d')
        isRecyclableDiv = document.getElementById("isRecyclable")
        isCompostableDiv = document.getElementById("isCompostable")
        isLandfillDiv = document.getElementById("isLandfill")
        descriptionDiv = document.getElementById("description")
        captureButton.addEventListener('click', e => {
            for (loadingDiv of document.getElementsByClassName("loadingDiv")) {
                loadingDiv.style.opacity = '100'
            }
            pictureBox.style.display = "block"
            pictureBox.width = cameraDiv.videoWidth;
            pictureBox.height = cameraDiv.videoHeight;

            context.drawImage(cameraDiv, 0, 0, pictureBox.width, pictureBox.height)
            dataURL = pictureBox.toDataURL('image/png', 0.01)
            
            fetch("/api", {
                method: 'POST',
                headers : {
                    'X-CSRFToken': csrf
                },
                body: JSON.stringify({'image': dataURL})
            })
            .then (data => data.json())
            .then (data => {
                if (data["isRecyclable"]) {
                    isRecyclableDiv.style.color = "green"
                    isRecyclableDiv.innerHTML = "Recycling Bin: ✅"
                }
                else {
                    isRecyclableDiv.style.color = "red"
                    isRecyclableDiv.innerHTML = "Recycling Bin: ❌" 
                }

                if (data["isCompostable"]) {
                    isCompostableDiv.style.color = "green"
                    isCompostableDiv.innerHTML = "Compost Bin: ✅"
                }
                else {
                    isCompostableDiv.style.color = "red"
                    isCompostableDiv.innerHTML = "Compost Bin: ❌" 
                }

                if (data["isLandfill"]) {
                    isLandfillDiv.style.color = "green"
                    isLandfillDiv.innerHTML = "Landfill Bin: ✅"
                }
                else {
                    isLandfillDiv.style.color = "red"
                    isLandfillDiv.innerHTML = "Landfill Bin: ❌" 
                }

                descriptionDiv.innerHTML = data["description"]

                for (element of document.getElementsByClassName("loadingDiv")) {
                    element.style.opacity = '0'
            }
            })
        })
    })
})
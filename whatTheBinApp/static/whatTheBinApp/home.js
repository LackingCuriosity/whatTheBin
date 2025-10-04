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
            document.getElementById("helpDiv").style.display = "none"
            pictureBox.style.display = "block"
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
            .then (data => data.json())
            .then (data => {
                console.log(data["isRecyclable"])
                console.log(data["isCompostable"])
                console.log(data["isLandfill"])
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

            })
        })
    })
})
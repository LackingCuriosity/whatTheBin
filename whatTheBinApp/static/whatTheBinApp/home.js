document.addEventListener("DOMContentLoaded", e => {
    // csrf for async POST request
    csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value

    // hide inital picture box
    pictureBox = document.getElementById("pictureBox") 
    pictureBox.style.display = "none"

    // get user webcam
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream) => {
        // cameraDiv
        cameraDiv = document.getElementById("cameraBox");
        cameraDiv.srcObject = stream;
        
        //picture div context
        context = pictureBox.getContext('2d')

        // get subDiv elements
        isRecyclableDiv = document.getElementById("isRecyclable")
        isCompostableDiv = document.getElementById("isCompostable")
        isLandfillDiv = document.getElementById("isLandfill")
        descriptionDiv = document.getElementById("description")

        // capture button on click
        captureButton = document.getElementById("captureButton")
        captureButton.addEventListener('click', e => {
            //start loading animation
            for (loadingDiv of document.getElementsByClassName("loadingDiv")) {
                loadingDiv.style.opacity = '100'
            }

            //show image
            pictureBox.style.display = "block"
            pictureBox.width = cameraDiv.videoWidth;
            pictureBox.height = cameraDiv.videoHeight;
            context.drawImage(cameraDiv, 0, 0, pictureBox.width, pictureBox.height)

            //send picture to back-end servers
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

                //update User information divs
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

                // hide loading animation
                for (element of document.getElementsByClassName("loadingDiv")) {
                    element.style.opacity = '0'
            }
            })
        })
    })
})
const video = document.getElementById('video')

// This will be an asyncronous code with a promise
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),

    // tHIS RECOGNIZES THE FACIAL EXPRESSION
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),

    // THIS ONE RECOGNIZES ALL THE FROM OF THE FACE
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),

    // This will recognize all the expression
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)
// Esto se cargara ya que se carguen esas cosas



function startVideo() {

    // This takes the object to get the video and in the 2nd parameter is wat we are going to set as the src of the videp
    navigator.getUserMedia(
        {video:{}},
        stream =>video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play',()=>{

    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)

    const displaySize = {
        width:video.width,
        height:video.height
    }

    faceapi.matchDimensions(canvas,displaySize)

    setInterval(async ()=>{
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

            // console.log(detections)

            const resizedDetections = faceapi.resizeResults(detections, displaySize)

            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)

            faceapi.draw.drawDetections(canvas,resizedDetections)

            faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)

            faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
    },100)
})
// src/utils/compressVideo.js
export function extractAudioFromVideo(videoFile) {
    return new Promise((resolve, reject) => {
        try {
            const videoElement = document.createElement("video");
            videoElement.src = URL.createObjectURL(videoFile);
            videoElement.crossOrigin = "anonymous";
            videoElement.muted = true;

            videoElement.onloadedmetadata = () => {
                videoElement.play().then(() => {
                    const stream = videoElement.captureStream();
                    const audioTracks = stream.getAudioTracks();

                    if (audioTracks.length === 0) {
                        reject(new Error("No se encontró pista de audio en el video."));
                        return;
                    }

                    const audioOnlyStream = new MediaStream(audioTracks);
                    const recorder = new MediaRecorder(audioOnlyStream, {
                        mimeType: "audio/webm",
                    });

                    const chunks = [];
                    recorder.ondataavailable = (e) => chunks.push(e.data);

                    recorder.onstop = () => {
                        const audioBlob = new Blob(chunks, { type: "audio/webm" });
                        const audioFile = new File([audioBlob], "audio.webm", {
                            type: "audio/webm",
                        });
                        resolve(audioFile);
                    };

                    recorder.start();
                    setTimeout(() => recorder.stop(), videoElement.duration * 1000);
                });
            };
        } catch (err) {
            reject(err);
        }
    });
}


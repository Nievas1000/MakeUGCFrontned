import { useEffect, useState } from "react";

export default function useVideoScreenshots(videoFile, setOptimizedDataFromImages, originalTranscript, setStep, setFrameAnalysis) {
    const [screenshots, setScreenshots] = useState([]);
    const [concatenatedText, setContatenadedText] = useState("")

    const sendConcatenatedDescriptions = async (descriptionsArray, setFinalScript) => {
        try {
            const concatenatedText = descriptionsArray
                .map((item) => item.description)
                .join(" - ");
            setContatenadedText(concatenatedText)
            const response = await fetch(
                "https://pdog.app.n8n.cloud/webhook/6a9d6caa-e378-4f5b-a806-3e022f3adc3a",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: concatenatedText, originalTranscript }),
                }
            );

            const result = await response.json();
            console.log("Full Inspiration Ad Analysis: ", result);
            setOptimizedDataFromImages(result);
            setStep(3)
        } catch (err) {
            console.error("Error sending concatenated descriptions", err);
            setFinalScript("");
        }
    };


    useEffect(() => {
        if (!videoFile) {
            setScreenshots([]);
            return;
        }
        setFrameAnalysis(true)
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        video.preload = "auto";
        video.src = URL.createObjectURL(videoFile);
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.playsInline = true;

        video.addEventListener("loadedmetadata", async () => {
            const duration = Math.floor(video.duration);
            const interval = 5; // cada 5 segundos
            const times = [];

            for (let t = 0; t < duration; t += interval) {
                times.push(t);
            }

            const captures = [];

            for (const time of times) {
                await new Promise((resolve) => {
                    video.currentTime = time;
                    video.onseeked = async () => {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const dataURL = canvas.toDataURL("image/jpeg", 0.85);

                        // Convertir dataURL a Blob
                        const blob = dataURLToBlob(dataURL);
                        const formData = new FormData();
                        formData.append("image", blob, `screenshot-${time}.jpg`);

                        // Enviar a webhook
                        let description = "No description";
                        try {
                            const res = await fetch(
                                "https://pdog.app.n8n.cloud/webhook/19bbb7d3-3739-4421-bc18-c318e4b2e389",
                                {
                                    method: "POST",
                                    body: formData,
                                }
                            );
                            const result = await res.json();
                            console.log(result);
                            description = result.content || "No description";
                        } catch (err) {
                            console.error("Error sending image to n8n:", err);
                        }

                        captures.push({ image: dataURL, description });
                        resolve();
                    };
                });
            }

            await sendConcatenatedDescriptions(captures, setOptimizedDataFromImages);
            setScreenshots(captures);
            setFrameAnalysis(false)
            URL.revokeObjectURL(video.src);
        });

        return () => {
            video.remove();
            canvas.remove();
        };
    }, [videoFile]);

    return { screenshots, concatenatedText };
}

// 🔁 Utilidad para convertir base64 a Blob
function dataURLToBlob(dataURL) {
    const arr = dataURL.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

export async function fetchTikTokFile(adUrl) {
    const res = await fetch("https://n8n-stabmediabackend.jdirlx.easypanel.host/api/get-tiktok-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adUrl }),
    });

    const data = await res.json();
    if (!res.ok || !data.base64 || !data.videoUrl) {
        throw new Error(data.error || "Failed to get TikTok video");
    }

    const byteCharacters = atob(data.base64);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i += 1024) {
        const slice = byteCharacters.slice(i, i + 1024);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }
    const videoBlob = new Blob(byteArrays, { type: "video/mp4" });
    const videoFile = new File([videoBlob], "tiktok-video.mp4", {
        type: "video/mp4",
    });

    return { file: videoFile, originalUrl: data.videoUrl };
}
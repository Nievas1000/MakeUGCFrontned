export async function fetchMetaVideo(adUrl) {
    const res = await fetch("https://n8n-stabmediabackend.jdirlx.easypanel.host/api/get-meta-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adUrl }),
    });

    const data = await res.json();
    if (!res.ok || !data.videoUrl) {
        throw new Error(data.error || "Failed to get Meta video");
    }

    return data.videoUrl;
}
import { useState } from "react";

export default function EmailIteratedAds() {
  const [brandUrl, setBrandUrl] = useState("");
  const [email, setEmail] = useState("");
  const [adsUrl, setAdsUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/email-iterated-ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandUrl, email, adsUrl }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-8 pt-5">
      <input
        type="url"
        placeholder="Enter brand URL"
        value={brandUrl}
        onChange={(e) => setBrandUrl(e.target.value)}
        className="w-full mx-auto border-b-2 border-gray-300 py-2 focus:border-blue-500 focus:outline-none"
        required
      />
      <input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mx-auto border-b-2 border-gray-300 py-2 focus:border-blue-500 focus:outline-none"
        required
      />
      <input
        type="url"
        placeholder="Ads library URL"
        value={adsUrl}
        onChange={(e) => setAdsUrl(e.target.value)}
        className="w-full mx-auto border-b-2 border-gray-300 py-2 focus:border-blue-500 focus:outline-none"
        required
      />
      <button
        type="submit"
        className="block mx-auto mt-6 px-14 py-5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Generate
      </button>
    </form>
  );
}

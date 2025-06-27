import { useEffect, useState } from "react";
import UploadMediaModal from "./UploadMediaModal"; // Asegurate de tener bien la ruta

export default function MetaAdManager() {
  const [token, setToken] = useState(localStorage.getItem("meta_token"));
  const [userInfo, setUserInfo] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [adAccounts, setAdAccounts] = useState([]); // eslint-disable-line
  const [selectedAdAccount, setSelectedAdAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [adSets, setAdSets] = useState([]); // NUEVO
  const [ads, setAds] = useState([]);
  const [adsWithMedia, setAdsWithMedia] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const handleLogin = () => {
    const appId = "3047134048782822";
    const redirectUri =
      "https://n8n-stabmediabackend.jdirlx.easypanel.host/auth/callback";
    const scopes =
      "ads_management,ads_read,business_management,pages_show_list";
    const authUrl = `https://www.facebook.com/v23.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopes}&response_type=code`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("meta_token");
    setToken(null);
    setUserInfo(null);
    setSelectedPage("");
    setSelectedAdAccount("");
    setCampaigns([]);
    setSelectedCampaign("");
    setAds([]);
    setAdSets([]);
    setAdsWithMedia([]);
  };

  const fetchInitialData = async () => {
    try {
      const [userRes, pagesRes, accountsRes] = await Promise.all([
        fetch(
          "https://n8n-stabmediabackend.jdirlx.easypanel.host/api/meta/user",
          { headers }
        ),
        fetch(
          "https://n8n-stabmediabackend.jdirlx.easypanel.host/api/meta/pages",
          { headers }
        ),
        fetch(
          "https://n8n-stabmediabackend.jdirlx.easypanel.host/api/meta/adaccounts",
          { headers }
        ),
      ]);

      const [user, pagesData, accounts] = await Promise.all([
        userRes.json(),
        pagesRes.json(),
        accountsRes.json(),
      ]);
      console.log(pagesData);
      setUserInfo(user);
      setPages(pagesData || []);
      setAdAccounts(accounts || []);
      if (accounts.length > 0) {
        handleAdAccountChange(accounts[accounts.length - 1].id);
      }
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    }
  };

  const handleAdAccountChange = async (id) => {
    setSelectedAdAccount(id);
    setCampaigns([]);
    setSelectedCampaign("");
    setAds([]);
    setAdSets([]);

    if (!id) return;

    try {
      const res = await fetch(
        `https://n8n-stabmediabackend.jdirlx.easypanel.host/api/meta/campaigns/${id}`,
        { headers }
      );
      /* const data = await res.json();
      setCampaigns(data || []); */
    } catch (err) {
      console.error("Error fetching campaigns", err);
    }
  };

  const handleCampaignChange = async (id) => {
    setSelectedCampaign(id);
    setAds([]);
    setAdSets([]);

    if (!id) return;

    try {
      const [adsRes, adsetsRes] = await Promise.all([
        fetch(
          `https://n8n-stabmediabackend.jdirlx.easypanel.host/api/meta/ads/${id}`,
          { headers }
        ),
        fetch(
          `https://n8n-stabmediabackend.jdirlx.easypanel.host/api/meta/adsets/${id}`,
          { headers }
        ),
      ]);

      const [adsData, adsetsData] = await Promise.all([
        adsRes.json(),
        adsetsRes.json(),
      ]);

      setAds(adsData || []);
      setAdSets(adsetsData || []);
    } catch (err) {
      console.error("Error fetching ads or adsets", err);
    }
  };

  const fetchImagesForAds = async () => {
    const updatedAds = await Promise.all(
      ads.map(async (ad) => {
        const creativeId = ad.creative?.id;
        if (!creativeId) return ad;

        try {
          const res = await fetch(
            `https://n8n-stabmediabackend.jdirlx.easypanel.host/api/meta/creative/${creativeId}`,
            {
              headers,
            }
          );
          const data = await res.json();
          return {
            ...ad,
            image_url: data.image_url || data.thumbnail_url || null,
          };
        } catch {
          return ad;
        }
      })
    );
    setAdsWithMedia(updatedAds);
  };

  useEffect(() => {
    if (token) {
      fetchInitialData();
    }
  }, [token]);

  useEffect(() => {
    if (ads.length && token) {
      fetchImagesForAds();
    }
  }, [ads, token]);

  const handleMediaSave = (files) => {
    setMediaFiles(files);
    setShowUploadModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {token && userInfo && (
        <div className="text-lg flexitems-center text-gray-600">
          👤 Logged in as <strong>{userInfo.name}</strong>
          <button
            onClick={handleLogout}
            className="text-sm ml-30 text-red-500 border border-red-400 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}

      {!token ? (
        <div className="text-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded"
            onClick={handleLogin}
          >
            Sign in with Meta
          </button>
        </div>
      ) : (
        <>
          <div>
            <p className="font-semibold">Select Page</p>
            <select
              className="w-full border p-2 rounded"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
            >
              <option value="">-- Choose a page --</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {selectedPage && campaigns.length > 0 && (
            <div>
              <p className="font-semibold">Select Campaign</p>
              <select
                className="w-full border p-2 rounded"
                value={selectedCampaign}
                onChange={(e) => handleCampaignChange(e.target.value)}
              >
                <option value="">-- Choose a campaign --</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCampaign && (
            <div className="flex justify-between items-center mt-4">
              <p className="font-semibold">Ads in Campaign</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Upload Media
              </button>
            </div>
          )}

          {adsWithMedia.length > 0 && (
            <div className="space-y-4 mt-4">
              {adsWithMedia.map((ad) => {
                const creative = ad.creative?.object_story_spec?.link_data;
                return (
                  <div
                    key={ad.id}
                    className="border p-4 rounded shadow bg-white space-y-2"
                  >
                    <p className="font-semibold">{ad.name}</p>
                    <p className="text-sm text-gray-600">Status: {ad.status}</p>

                    {creative?.message && (
                      <p className="text-sm">📝 {creative.message}</p>
                    )}
                    {ad.image_url && (
                      <img
                        src={ad.image_url}
                        alt="Ad"
                        className="w-full max-w-xs rounded"
                      />
                    )}
                    {creative?.video_id && (
                      <video controls className="w-full max-w-xs rounded">
                        <source
                          src={`https://www.facebook.com/video.php?v=${creative.video_id}`}
                          type="video/mp4"
                        />
                      </video>
                    )}
                    {creative?.link && (
                      <a
                        href={creative.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        🔗 {creative.link}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {mediaFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold">Files ready to upload:</h3>
              <ul className="list-disc ml-4 text-sm">
                {mediaFiles.map((file, i) => (
                  <li key={i}>
                    {file.file.name} ({file.type}){" "}
                    {file.optimizeText && `→ Optimized: "${file.primaryText}"`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showUploadModal && (
            <UploadMediaModal
              adAccountId={selectedAdAccount}
              campaignId={selectedCampaign}
              token={token}
              onClose={() => setShowUploadModal(false)}
              onSave={handleMediaSave}
              defaultAdsetId={adSets?.[0]?.id || null}
              selectedPage={selectedPage}
            />
          )}
        </>
      )}
    </div>
  );
}

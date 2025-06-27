import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MetaAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const expiresIn = params.get("expires_in");

    if (!token || !expiresIn) {
      console.error("Missing token or expiration from URL");
      navigate("/error");
      return;
    }
    console.log(token);
    localStorage.setItem("meta_auth", "true");
    localStorage.setItem("meta_token", token);
    localStorage.setItem(
      "meta_token_expiry",
      (Date.now() + parseInt(expiresIn) * 1000).toString()
    );

    navigate("/metaAdUploader"); // o la ruta de tu uploader
  }, []);

  return <p className="text-center p-10">Verifying meta auth...</p>;
}

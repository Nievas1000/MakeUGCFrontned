import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import ToolButton from "./components/ToolButton";
import MetaAuthSuccess from "./components/MetaAuthSuccess";
import Home from "./components/Home";
import Header from "./components/Header";

const FacebookAdsRecreator = lazy(() =>
  import("./components/FacebookAdsRecreator")
);
const TikTokAdsRecreator = lazy(() =>
  import("./components/TikTokAdsRecreator")
);
const HookRecreator = lazy(() => import("./components/HookRecreator"));
const MetaAdUploader = lazy(() => import("./components/MetaAdUploader"));
const BriefCreator = lazy(() => import("./components/BriefCreator"));
const EmailIteratedAds = lazy(() => import("./components/EmailIteratedAds"));
const LanguajeTranslation = lazy(() =>
  import("./components/LanguajeTranslation")
);
const CrossPlatformGeneration = lazy(() =>
  import("./components/CrossPlatformGeneration")
);

const tools = [
  {
    key: "facebook",
    name: "Facebook Ads Recreator",
    component: FacebookAdsRecreator,
    description:
      "Transform any Facebook ad into a new AI-generated video by analyzing its structure, combining it with your brand’s identity, and regenerating the script via MakeUGC.",
  },
  {
    key: "tiktok",
    name: "TikTok Ads Recreator",
    component: TikTokAdsRecreator,
    description:
      "Upload a TikTok ad, analyze it frame-by-frame, and generate a fresh version tailored to your product — optimized for native performance on TikTok.",
  },
  {
    key: "hook",
    name: "Hook Generator",
    component: HookRecreator,
    description:
      "Upload an existing ad and instantly generate three new hook variants, each designed around different emotional triggers. Delivered as separate MakeUGC clips for testing.",
  },
  {
    key: "briefCreator",
    name: "Brief Creator",
    component: BriefCreator,
    description:
      "Transform any Facebook ad into a new AI-generated video by analyzing its structure, combining it with your brand’s identity, and regenerating the script via MakeUGC.",
  },
  {
    key: "localised",
    name: "Languaje Translation",
    component: LanguajeTranslation,
    description:
      "Upload an ad and get back translations in your chosen languages. The system adapts phrasing and delivery for cultural relevance and visual alignment.",
  },
  {
    key: "crossPlatform",
    name: "Cross Platform Script Generator",
    component: CrossPlatformGeneration,
    description:
      "Automatically convert a Meta ad for TikTok or vice versa. Prompts are tailored for each platform’s native feel while preserving core messaging, followed by script generation and MakeUGC video output.",
  },
  {
    key: "metaAdUploader",
    name: "Meta Ad Uploader",
    component: MetaAdUploader,
    description:
      "Upload folders or individual files, assign campaigns, optimize primary text with AI, and push ads to Meta via API — all from a single interface.",
  },
];

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-100">
        {/* Header con logo centrado */}
        <Header />

        {/* Contenido principal */}
        <main className="flex-grow p-8 pt-20">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home tools={tools} />} />
              {tools.map((tool) => (
                <Route
                  key={tool.key}
                  path={`/${tool.key}`}
                  element={
                    <div className="rounded-2xl p-8 max-w-5xl mx-auto mt-6">
                      <tool.component />
                    </div>
                  }
                />
              ))}
              <Route path="/meta-auth-success" element={<MetaAuthSuccess />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="bg-[#191E2A] text-sm text-gray-400 py-4 px-28 flex justify-between items-center">
          <p>© 2025 MakeUGC. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

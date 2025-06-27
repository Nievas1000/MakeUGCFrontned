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
  },
  {
    key: "tiktok",
    name: "TikTok Ads Recreator",
    component: TikTokAdsRecreator,
  },
  { key: "hook", name: "Hook Recreator", component: HookRecreator },
  {
    key: "briefCreator",
    name: "Brief Creator",
    component: BriefCreator,
  },
  {
    key: "localised",
    name: "Languaje Translation",
    component: LanguajeTranslation,
  },
  {
    key: "crossPlatform",
    name: "Cross Platform Generation",
    component: CrossPlatformGeneration,
  },
  {
    key: "metaAdUploader",
    name: "Meta Ad Uploader",
    component: MetaAdUploader,
  },
];

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          AI Agents Tools
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {tools.map((tool) => (
            <NavLink
              key={tool.key}
              to={`/${tool.key}`}
              className={({ isActive }) =>
                isActive ? "transform scale-105" : ""
              }
            >
              {({ isActive }) => (
                <ToolButton active={isActive}>{tool.name}</ToolButton>
              )}
            </NavLink>
          ))}
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto">
          <Suspense fallback={<div>Cargando...</div>}>
            <Routes>
              <Route
                path="/"
                element={<Navigate to={`/${tools[0].key}`} replace />}
              />
              {tools.map((tool) => (
                <Route
                  key={tool.key}
                  path={`/${tool.key}`}
                  element={<tool.component />}
                />
              ))}
              <Route path="/meta-auth-success" element={<MetaAuthSuccess />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

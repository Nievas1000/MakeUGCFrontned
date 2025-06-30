import { Link, useLocation } from "react-router-dom";
import logo from "../assets/makeugc.png";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="w-full py-6 px-4 flex items-center justify-between">
      <div className="w-1/3">
        {!isHome && (
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-blue-600 transition flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>
        )}
      </div>
      <div className="w-1/3 text-center">
        <img src={logo} alt="MakeUGC" className="h-10 mx-auto" />
      </div>
      <div className="w-1/3" />
    </header>
  );
}

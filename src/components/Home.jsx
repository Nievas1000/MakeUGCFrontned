import { NavLink } from "react-router-dom";
import ToolButton from "./ToolButton";

export default function Home({ tools }) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 max-w-screen-xl w-full">
        {tools.map((tool, index) => (
          <NavLink
            key={tool.key}
            to={`/${tool.key}`}
            className={({ isActive }) =>
              isActive ? "transform scale-105" : ""
            }
          >
            {({ isActive }) => (
              <ToolButton active={isActive} tool={tool} index={index + 1} />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

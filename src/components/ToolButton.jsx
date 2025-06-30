import React from "react";
import { motion } from "framer-motion"; //eslint-disable-line

export default function ToolButton({ tool, active, index }) {
  return (
    <motion.button
      type="button"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`w-full text-left rounded-xl border border-gray-200 shadow-md bg-white p-5 hover:shadow-xl transition-all duration-300`}
    >
      <div className="text-sm text-blue-600 font-medium mb-2">
        Agent {index}
      </div>
      <div className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
        {tool.name}
      </div>
      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
      <div className="mt-auto">
        <span className="inline-block bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition">
          Get Started
        </span>
      </div>
    </motion.button>
  );
}

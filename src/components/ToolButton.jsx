import React from "react";
import { motion } from "framer-motion"; //eslint-disable-line

export default function ToolButton({ children, icon: Icon, onClick, active }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`flex flex-col w-full items-center justify-center p-4 rounded-2xl border select-none pointer-fine: ${
        active
          ? "bg-blue-600 text-white shadow-2xl"
          : "bg-white text-gray-700 hover:shadow-lg"
      }`}
    >
      {Icon && <Icon className="mb-2 w-6 h-6" />}
      <span className="font-medium">{children}</span>
    </motion.button>
  );
}

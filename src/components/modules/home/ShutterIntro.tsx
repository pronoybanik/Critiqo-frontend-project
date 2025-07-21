"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ShutterIntro = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const openTimer = setTimeout(() => setIsOpen(true), 1000); // shutters move
    const hideTimer = setTimeout(() => setIsVisible(false), 2500); // hide after animation
    return () => {
      clearTimeout(openTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex pointer-events-none" // allow clicks through
      initial={{ opacity: 1 }}
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="w-1/2 h-full bg-black"
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.div
        className="w-1/2 h-full bg-black"
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default ShutterIntro;

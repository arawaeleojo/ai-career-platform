'use client';

import type { Metadata } from "next";
import "./globals.css";
import { motion } from "framer-motion";

// --- ANIMATION VARIANTS FOR SHARP FLOATING OBJECTS ---
const floatObject = (duration = 20, delay = 0, xStart = "0vw", yStart = "0vh") => ({
  initial: { x: xStart, y: yStart, opacity: 0, rotate: 0, scale: 0.8 },
  animate: {
    opacity: [0, 0.8, 0.8, 0.8, 0], // Keeps them highly visible most of the time
    scale: [0.8, 1, 0.9, 1.1, 0.8],
    rotate: [0, 90, 180, 270, 360],
    x: [xStart, "30vw", "60vw", "80vw", "40vw", xStart],
    y: [yStart, "60vh", "20vh", "80vh", "30vh", yStart],
    transition: {
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "linear",
    }
  }
});

const orbitObject = (duration = 40) => ({
  animate: {
    rotate: 360,
    transition: {
      duration: duration,
      repeat: Infinity,
      ease: "linear",
    }
  }
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased relative bg-background">

        {/* ---------------- BACKGROUND GRID ---------------- */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* ---------------- VISIBLE FLOATING SHAPES ---------------- */}
        {/*
<div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">

  <motion.div
    initial="initial"
    animate="animate"
    variants={floatObject(35, 0, "5vw", "15vh")}
    className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-primary via-[#D8B4FE] to-accent-blue shadow-[0_0_80px_rgba(157,78,221,0.6)] opacity-90 blur-[2px]"
  />

  <motion.div
    initial="initial"
    animate="animate"
    variants={floatObject(40, 5, "75vw", "65vh")}
    className="absolute w-56 h-56 rounded-full border-[8px] border-secondary shadow-[0_0_40px_rgba(0,240,181,0.5)] opacity-80 blur-[1px]"
  />

  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
    <motion.div
      animate="animate"
      variants={orbitObject(60)}
      style={{ originX: "30vw", originY: "30vh" }}
      className="w-40 h-40 bg-[#EC4899]/20 border border-[#EC4899]/50 backdrop-blur-xl shadow-[0_0_50px_rgba(236,72,153,0.3)] rotate-45"
    />
  </div>

  <motion.div
    initial="initial"
    animate="animate"
    variants={floatObject(30, 10, "85vw", "10vh")}
    className="absolute w-32 h-32 border-2 border-accent-blue/80 bg-accent-blue/10 backdrop-blur-sm shadow-[0_0_30px_rgba(37,99,235,0.4)]"
  />

</div>
*/}

        {/* The Actual Page Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
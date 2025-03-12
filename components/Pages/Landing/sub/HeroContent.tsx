"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/utils/motion";
import Image from "next/image";

const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-row items-center justify-between px-20 mt-5 w-full z-[20]"
    >
      {/* Left Side: Text Content */}
      <div className="flex flex-col gap-5 justify-center text-start">
        <motion.div variants={slideInFromTop}>
          <Image
            src="/stacked-color.svg"
            alt="description of image"
            width={250}
            height={30}
          />
        </motion.div>
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-5xl font-bold text-white max-w-[600px]"
        >
          <span>
            Low-Code
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">
              {" "}
              SOLANA{" "}
            </span>
            High-Speed Innovation
          </span>
        </motion.div>
        <motion.a
          variants={slideInFromLeft(1)}
          className="py-2 button-primary text-2xl text-center text-white cursor-pointer rounded-lg max-w-[200px]"
          href="https://alpha-gui-host.vercel.app/editor.html"
        >
          Create now!
        </motion.a>
      </div>

      {/* Right Side: Floating Images Container */}
      {/* The container has an explicit width and height to allow vertical spacing */}
      <motion.div className="relative w-[600px] h-[100vh]">
        {/* Floating image 1 */}
        <motion.div
          className="absolute"
          style={{ top: "15%", left: "-10%" }}
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Image src="/3.png" alt="floating image 1" width={350} height={500} />
        </motion.div>

        {/* Floating image 2 */}
        <motion.div
          className="absolute"
          style={{ top: "30%", left: "10%" }}
          animate={{ y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <Image src="/1.png" alt="floating image 2" width={500} height={500} />
        </motion.div>

        {/* Floating image 3 */}
        <motion.div
          className="absolute"
          style={{ top: "45%", left: "-5%" }}
          animate={{ y: [0, -25, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          <Image src="/2.png" alt="floating image 3" width={500} height={500} />
        </motion.div>

        {/* Floating image 4 */}
        <motion.div
          className="absolute"
          style={{ top: "65%", left: "20%" }}
          animate={{ y: [0, -35, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <Image src="/4.png" alt="floating image 4" width={500} height={500} />
        </motion.div>

        {/* Floating image 5 */}
        <motion.div
          className="absolute"
          style={{ top: "80%", left: "-15%" }}
          animate={{ y: [0, -28, 0] }}
          transition={{ repeat: Infinity, duration: 5.5 }}
        >
          <Image src="/5.png" alt="floating image 5" width={500} height={500} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;

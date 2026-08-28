"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

function Hero() {
  return (
    <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-20 mt-[-200px] pb-20">
      {/* Text Content */}
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Take Control of your Finances with <span className="text-[#9333ea]">PennyTrail</span>
        </h1>
        <p className="text-gray-600 text-base mb-6">
          Follow where every penny goes, Navigate your expenses with precision!
        </p>
        <Link href="/sign-in">
          <button className="bg-[#9333ea] text-white px-6 py-2 font-medium rounded-md hover:bg-[#7e22ce]">
            Get Started
          </button>
        </Link>
      </div>
      <div className="relative min-h-screen">
         <Image
          src="/illustration.jpg"
          alt="Illustration"
          width={500}
          height={500}
          className="absolute bottom-0 right-0"
        />
      </div>
    </section>
  );
}

export default Hero;
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/images/IMG_6323.JPG",
    "/images/IMG_6328.JPG",
    "/images/IMG_6337.JPG",
    "/images/IMG_6360.JPG",
    "/images/IMG_6372.JPG",
    "/images/IMG_6376.JPG",
    "/images/IMG_6498.JPG",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Animated Background Slideshow */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-2000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={image}
              alt={`Yaba ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
          </div>
        ))}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Top Left - YABA Logo */}
      <div className="fixed top-4 md:top-8 left-6 md:left-12 lg:left-16 z-50">
        <Image
          src="/images/logo/yaba_logo.png"
          alt="Yaba Logo"
          width={64}
          height={64}
          className="rounded-full w-24 h-24 md:w-24 md:h-24 lg:w-24 lg:h-24"
        />
      </div>

      {/* Top Right - YABA */}
      <div className="fixed top-6 md:top-8 right-4 sm:right-6 md:right-12 lg:right-16 z-50">
        <h2 className="text-[#F0FFF0] font-playfair text-2xl md:text-3xl font-bold tracking-[0.2em]" style={{ writingMode: "vertical-rl" }}>
          YABA
        </h2>
      </div>

      {/* Left Side - EVENTS (Rotated) */}
      <div className="fixed bottom-20 left-6 md:left-12 lg:left-16 md:-translate-y-1/2 z-50">
        <Link
          href="/events"
          className="text-[#F0FFF0] font-playfair text-base md:text-xl tracking-[0.3em] hover:text-[#708238] transition-colors uppercase"

          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          EVENTS
        </Link>
      </div>

      {/* Right Side - SHOP (Rotated) */}
      <div className="fixed bottom-35 right-4 sm:right-6 md:right-12 lg:right-16 -translate-y-1/2 z-50">
        <Link
          href="/shop"
          className="text-[#F0FFF0] font-playfair text-base md:text-xl tracking-[0.3em] hover:text-[#708238] transition-colors uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          SHOP
        </Link>
      </div>

      {/* Bottom Right - GIFT */}
      <div className="fixed bottom-20 right-4 sm:right-6 md:right-12 lg:right-16 z-50">
        <Link
          href="/coffee"
          className="text-[#F0FFF0] font-playfair text-base md:text-xl tracking-[0.3em] hover:text-[#708238] transition-colors uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          GIFT
        </Link>
      </div>

      {/* Center Content - WAPE WAPE EP */}
      <div className="relative z-40 flex flex-col items-center justify-center h-full text-center px-6 mb-20 mt-30 2xl:mt-48">
        {/* Main Title */}
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#F0FFF0] mb-3 tracking-tight leading-none">
          WAPE WAPE
        </h1>

        {/* Subtitle */}
        <p className="font-playfair text-xs sm:text-sm md:text-base text-[#F0FFF0]/80 mb-4 tracking-[0.2em] uppercase">
          OUT NOW
        </p>

        {/* CTA Button */}
        <Link
          href="/shop"
          className="inline-block border-2 border-[#F0FFF0] px-6 md:px-8 py-2 md:py-2.5 text-[#F0FFF0] font-playfair text-xs tracking-[0.2em] uppercase hover:bg-[#F0FFF0] hover:text-black transition-all duration-300"
        >
          LISTEN HERE
        </Link>
      </div>

      {/* Bottom Bar - Social Icons */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <a
            href="https://tiktok.com/@yabamusic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F0FFF0] hover:text-[#708238] transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/yabamusic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F0FFF0] hover:text-[#708238] transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://twitter.com/yabamusic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F0FFF0] hover:text-[#708238] transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://youtube.com/@yabamusic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F0FFF0] hover:text-[#708238] transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href="https://facebook.com/yabamusic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F0FFF0] hover:text-[#708238] transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Copyright Notice - Bottom Left */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 md:left-12 lg:left-16 -translate-x-1/2 md:translate-x-0 z-50 text-[#F0FFF0]/50 text-[10px] md:text-xs text-center md:text-left">
        Powered by{" "}
        <a
          href="https://soldoutafrica.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#708238] transition-colors underline"
        >
          SoldOutAfrica
        </a>
      </div>
    </div>
  );
}

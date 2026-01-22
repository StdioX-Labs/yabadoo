'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Track {
    number: number;
    title: string;
    file: string;
    duration: string;
}

const tracks: Track[] = [
    { number: 1, title: "Adhiambo", file: "/music/v1 Yaba - Adhiambo.wav", duration: "3:42" },
    { number: 2, title: "Mazoea", file: "/music/v1 Yaba - Mazoea 2.wav", duration: "4:15" },
    { number: 3, title: "Sema", file: "/music/v1 Yaba - Sema 2.wav", duration: "3:28" },
    { number: 4, title: "Something Sweet", file: "/music/v1 Yaba - Something Sweet 2.wav", duration: "4:01" },
    { number: 5, title: "Today", file: "/music/v1 Yaba - Today.wav", duration: "3:55" },
    { number: 6, title: "Wape Wape", file: "/music/v1 Yaba - Wape Wape.wav", duration: "3:38" },
];

const PREVIEW_DURATION = 30; // 30 seconds

export default function EPSampler() {
    const [currentTrack, setCurrentTrack] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            const handleTimeUpdate = () => {
                if (audioRef.current) {
                    const time = audioRef.current.currentTime;
                    setCurrentTime(time);

                    if (time >= PREVIEW_DURATION) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                        setShowPurchaseModal(true);
                    }
                }
            };

            const handleEnded = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };

            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('ended', handleEnded);

            return () => {
                audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current?.removeEventListener('ended', handleEnded);
            };
        }
    }, [currentTrack]);

    const playTrack = (trackNumber: number) => {
        const track = tracks.find(t => t.number === trackNumber);
        if (!track) return;

        if (currentTrack === trackNumber && isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            if (currentTrack !== trackNumber) {
                setCurrentTrack(trackNumber);
                setCurrentTime(0);
                if (audioRef.current) {
                    audioRef.current.src = track.file;
                    audioRef.current.load();
                }
            }
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <audio ref={audioRef} />

            <div className="space-y-3">
                {tracks.map((track) => {
                    const isCurrentTrack = currentTrack === track.number;
                    const isCurrentlyPlaying = isCurrentTrack && isPlaying;

                    return (
                        <div
                            key={track.number}
                            className={`border border-[#708238]/30 transition-all ${isCurrentTrack ? 'border-[#708238]' : 'hover:border-[#708238]/50'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Play Button */}
                                    <button
                                        onClick={() => playTrack(track.number)}
                                        className={`w-12 h-12 flex items-center justify-center transition-all ${isCurrentlyPlaying
                                                ? 'bg-[#708238] text-[#F0FFF0]'
                                                : 'bg-transparent border border-[#708238] text-[#708238] hover:bg-[#708238] hover:text-[#F0FFF0]'
                                            }`}
                                    >
                                        {isCurrentlyPlaying ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Track Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[#708238] font-playfair font-bold text-sm">
                                                    {String(track.number).padStart(2, '0')}
                                                </span>
                                                <h3 className={`font-playfair transition-colors ${isCurrentTrack ? 'text-[#708238]' : 'text-[#F0FFF0]'
                                                    }`}>
                                                    {track.title}
                                                </h3>
                                            </div>
                                            <span className="text-[#F0FFF0]/50 font-playfair text-xs">
                                                {track.duration}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        {isCurrentTrack && (
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between text-xs text-[#F0FFF0]/60 mb-1">
                                                    <span className="font-playfair">{formatTime(currentTime)}</span>
                                                    <span className="font-playfair text-[#708238]">30s Preview</span>
                                                </div>
                                                <div className="relative w-full h-1 bg-[#1A2421]">
                                                    <div
                                                        className="absolute inset-0 bg-[#708238] transition-all"
                                                        style={{ width: `${(currentTime / PREVIEW_DURATION) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Purchase Modal */}
            {showPurchaseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                    <div className="relative max-w-md w-full border border-[#708238]/30 p-8 bg-[#1A2421]">
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setShowPurchaseModal(false);
                                setCurrentTime(0);
                                setCurrentTrack(null);
                            }}
                            className="absolute top-4 right-4 w-8 h-8 border border-[#708238]/30 hover:border-[#708238] flex items-center justify-center transition-all"
                        >
                            <svg className="w-5 h-5 text-[#F0FFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Content */}
                        <div className="text-center mb-6">
                            <h3 className="font-playfair text-2xl font-bold text-[#F0FFF0] mb-3">
                                Enjoying the Preview?
                            </h3>
                            <p className="text-sm text-[#F0FFF0]/70 font-playfair leading-relaxed">
                                Purchase the full WAPE WAPE EP to enjoy all 6 tracks in high quality with unlimited plays.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-2 mb-6 border border-[#708238]/30 p-4">
                            <div className="flex items-center gap-2 text-sm text-[#F0FFF0]/80">
                                <svg className="w-4 h-4 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                                <span className="font-playfair">Full-length tracks (no time limits)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#F0FFF0]/80">
                                <svg className="w-4 h-4 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                                <span className="font-playfair">High-quality digital downloads</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#F0FFF0]/80">
                                <svg className="w-4 h-4 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                                <span className="font-playfair">Support Yaba directly</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-center mb-6">
                            <div className="flex items-baseline justify-center gap-2 mb-1">
                                <span className="text-4xl font-bold text-[#708238] font-playfair">KES 1,000</span>
                            </div>
                            <p className="text-sm text-[#F0FFF0]/60 font-playfair">Complete EP • All 6 tracks</p>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <Link
                                href="/checkout"
                                className="block w-full py-3 border-2 border-[#F0FFF0] text-[#F0FFF0] font-playfair text-sm tracking-[0.2em] uppercase hover:bg-[#F0FFF0] hover:text-black transition-all duration-300 text-center"
                            >
                                Purchase Full EP
                            </Link>
                            <button
                                onClick={() => {
                                    setShowPurchaseModal(false);
                                    setCurrentTime(0);
                                    setCurrentTrack(null);
                                }}
                                className="w-full py-3 border border-[#708238]/50 hover:border-[#708238] text-[#F0FFF0] font-playfair text-sm tracking-[0.2em] uppercase transition-all"
                            >
                                Continue Browsing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

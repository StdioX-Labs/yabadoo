'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Track {
  number: number;
  title: string;
  file: string;
  featured: boolean;
}

const tracks: Track[] = [
  { number: 1, title: "Adhiambo", file: "/music/v1 Yaba - Adhiambo.wav", featured: false },
  { number: 2, title: "Mazoea", file: "/music/v1 Yaba - Mazoea 2.wav", featured: false },
  { number: 3, title: "Sema", file: "/music/v1 Yaba - Sema 2.wav", featured: false },
  { number: 4, title: "Something Sweet", file: "/music/v1 Yaba - Something Sweet 2.wav", featured: true },
  { number: 5, title: "Today", file: "/music/v1 Yaba - Today.wav", featured: false },
  { number: 6, title: "Wape Wape", file: "/music/v1 Yaba - Wape Wape.wav", featured: true },
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const PREVIEW_DURATION = 30; // 30 seconds

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleTrackEnd);
      
      return () => {
        audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current?.removeEventListener('ended', handleTrackEnd);
      };
    }
  }, [currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      // Stop at 30 seconds and show purchase modal
      if (time >= PREVIEW_DURATION && !previewEnded) {
        audioRef.current.pause();
        setIsPlaying(false);
        setPreviewEnded(true);
        setShowPurchaseModal(true);
      }
    }
  };

  const handleTrackEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const playTrack = (trackNumber: number) => {
    const track = tracks.find(t => t.number === trackNumber);
    if (!track) return;

    if (currentTrack === trackNumber && isPlaying) {
      // Pause current track
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Play new track or resume
      if (currentTrack !== trackNumber) {
        setCurrentTrack(trackNumber);
        setCurrentTime(0);
        setPreviewEnded(false);
        
        if (audioRef.current) {
          audioRef.current.src = track.file;
          audioRef.current.load();
        }
      }
      
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handlePurchase = () => {
    router.push('/checkout');
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setCurrentTime(0);
    setCurrentTrack(null);
    setPreviewEnded(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio ref={audioRef} />

      {/* Track Listing */}
      <div className="space-y-3">
        {tracks.map((track) => {
          const isCurrentTrack = currentTrack === track.number;
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;

          return (
            <div
              key={track.number}
              className="relative group"
            >
              {/* Glow effect on active track */}
              {isCurrentTrack && (
                <div className="absolute -inset-1 bg-gradient-to-r from-[#708238] to-[#3F704D] rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              )}
              
              <div className={`relative glass rounded-2xl border transition-all ${
                isCurrentTrack 
                  ? 'border-[#708238] bg-gradient-to-r from-[#708238]/15 to-[#3F704D]/10 shadow-lg shadow-[#708238]/20' 
                  : 'border-[#708238]/20 hover:border-[#708238]/50 hover:bg-[#708238]/5'
              }`}>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    {/* Play Button */}
                    <button
                      onClick={() => playTrack(track.number)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center text-[#F0FFF0] transition-all flex-shrink-0 shadow-lg ${
                        isCurrentlyPlaying
                          ? 'from-[#708238] to-[#3F704D] scale-105 shadow-[#708238]/50'
                          : 'from-[#708238]/30 to-[#3F704D]/30 hover:from-[#708238] hover:to-[#3F704D] hover:scale-110 hover:shadow-[#708238]/40'
                      }`}
                    >
                      {isCurrentlyPlaying ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start sm:items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isCurrentTrack 
                              ? 'bg-[#708238] text-[#F0FFF0]' 
                              : 'bg-[#708238]/10 text-[#708238]'
                          } transition-all`}>
                            <span className="text-xs sm:text-sm font-bold">{String(track.number).padStart(2, '0')}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className={`text-base sm:text-lg font-semibold truncate transition-colors ${
                              isCurrentTrack ? 'text-[#708238]' : 'text-[#F0FFF0] group-hover:text-[#708238]'
                            }`}>
                              {track.title}
                            </h3>
                            {track.featured && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <svg className="w-3 h-3 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <span className="text-xs text-[#708238] font-semibold uppercase tracking-wider">Featured</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Mobile Preview Badge */}
                        <div className="sm:hidden flex items-center gap-1 px-2 py-1 bg-[#708238]/10 rounded-full border border-[#708238]/30 flex-shrink-0">
                          <svg className="w-3 h-3 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <span className="text-xs text-[#708238] font-medium">30s</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {isCurrentTrack && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-[#F0FFF0]/60 mb-2">
                            <span className="font-medium">{formatTime(currentTime)}</span>
                            <span className="text-[#708238]">Preview • {formatTime(PREVIEW_DURATION)}</span>
                          </div>
                          <div className="relative w-full h-2 bg-[#1A2421] rounded-full overflow-hidden">
                            <div 
                              className="absolute inset-0 bg-gradient-to-r from-[#708238] via-[#708238] to-[#3F704D] transition-all duration-300 ease-out"
                              style={{ width: `${(currentTime / PREVIEW_DURATION) * 100}%` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      )}

                      {/* Desktop Preview Badge */}
                      {!isCurrentTrack && (
                        <div className="hidden sm:flex items-center gap-2 mt-2 text-xs text-[#F0FFF0]/50">
                          <svg className="w-3.5 h-3.5 text-[#708238]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <span>30-second preview available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2421]/95 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-md w-full glass rounded-3xl p-6 sm:p-8 border-2 border-[#708238]/40 shadow-2xl animate-scaleIn">
            {/* Close button */}
            <button
              onClick={closePurchaseModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#708238]/20 hover:bg-[#708238]/40 flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5 text-[#F0FFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-[#708238] to-[#3F704D] flex items-center justify-center shadow-lg shadow-[#708238]/50">
              <svg className="w-7 h-7 sm:w-9 sm:h-9 text-[#F0FFF0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
              </svg>
            </div>

            {/* Content */}
            <div className="text-center mb-5 sm:mb-6">
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F0FFF0] mb-2 sm:mb-3">
                Enjoying the Preview?
              </h3>
              <p className="text-sm sm:text-base text-[#F0FFF0]/70 leading-relaxed px-2">
                Purchase the full WAPE WAPE EP to enjoy all 6 tracks in high quality, with unlimited plays.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6 p-3 sm:p-4 bg-[#708238]/5 rounded-xl border border-[#708238]/20">
              <div className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#F0FFF0]/80">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#708238] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Full-length tracks (no time limits)</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#F0FFF0]/80">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#708238] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>High-quality digital downloads</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#F0FFF0]/80">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#708238] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Support Yaba directly</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-5 sm:mb-6">
              <div className="flex items-baseline justify-center gap-2 mb-1">
                <span className="text-3xl sm:text-4xl font-bold text-[#708238]">KES 1,000</span>
              </div>
              <p className="text-xs sm:text-sm text-[#F0FFF0]/60">Complete EP • All 6 tracks</p>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5 sm:space-y-3">
              <button
                onClick={handlePurchase}
                className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-[#708238] to-[#3F704D] hover:from-[#3F704D] hover:to-[#708238] text-[#F0FFF0] font-bold text-sm sm:text-base rounded-xl transition-all transform active:scale-95 sm:hover:scale-105 shadow-xl shadow-[#708238]/30 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <span>Purchase Full EP</span>
              </button>
              <button
                onClick={closePurchaseModal}
                className="w-full py-3 sm:py-3 px-6 bg-transparent border border-[#708238]/50 hover:border-[#708238] hover:bg-[#708238]/10 text-[#F0FFF0] font-medium text-sm sm:text-base rounded-xl transition-all"
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

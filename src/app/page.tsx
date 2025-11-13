import Image from "next/image";
import Link from "next/link";
import MusicPlayer from "@/components/MusicPlayer";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1A2421] text-[#F0FFF0]">
      {/* Buy Me Coffee Floating Button */}
      <BuyMeCoffeeButton />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#1A2421]/90 border-b border-[#708238]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <a href="#home" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#708238]/20 rounded-full blur-md group-hover:bg-[#708238]/40 transition-all"></div>
                <Image
                  src="/images/logo/yaba_logo.png"
                  alt="Yaba Logo"
                  width={48}
                  height={48}
                  className="relative rounded-full ring-1 ring-[#708238]/30 group-hover:ring-[#708238]/60 transition-all"
                />
              </div>
              <div className="hidden sm:block">
                <div className="font-playfair text-xl font-bold text-[#F0FFF0] group-hover:text-[#708238] transition-colors">
                  YABA
                </div>
                <div className="text-[10px] text-[#708238]/70 uppercase tracking-widest">
                  Rhumba Artist
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <Link
                href="/checkout"
                className="px-5 py-2 bg-[#708238] hover:bg-[#3F704D] text-[#F0FFF0] text-sm font-medium rounded-full transition-all hover:shadow-lg hover:shadow-[#708238]/30"
              >
                WAPE WAPE EP
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-[#708238] hover:bg-[#708238]/10 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with proper aspect ratio */}
        <div className="absolute inset-0 w-full h-full bg-[#1A2421]">
          <div className="relative w-full h-full">
            <Image
              src="/images/IMG_6323.JPG"
              alt="Yaba Performance"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={90}
              style={{
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
            />
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#1A2421]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2421]/60 via-transparent to-[#1A2421]/80"></div>
        </div>

        {/* Subtle Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#708238]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#3F704D]/5 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto py-32 ">
          {/* Logo */}
          <div className="mb-10 animate-fadeIn">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#708238]/20 rounded-full blur-2xl scale-110"></div>
              <Image
                src="/images/logo/yaba_logo.png"
                alt="Yaba Logo"
                width={130}
                height={40}
                className="relative rounded-full ring-1 ring-[#708238]/40 shadow-2xl"
              />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-bold mb-5 text-gradient animate-fadeIn tracking-tight leading-none">
            YABA
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl font-playfair italic mb-8 text-[#F0FFF0]/90 animate-fadeIn font-light tracking-wide">
            Prince of Rhumbacane
          </p>

          {/* Divider */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#708238] to-transparent mx-auto mb-8"></div>

          {/* Description */}
          <p className="text-base md:text-lg mb-10 text-[#F0FFF0]/70 max-w-2xl mx-auto animate-fadeIn leading-relaxed font-light">
            Experience the Soul of Kenyan Rhumba
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn max-w-md mx-auto">
            <a
              href="#wape"
              className="group relative bg-gradient-to-r from-[#708238] to-[#3F704D] hover:from-[#3F704D] hover:to-[#708238] text-[#F0FFF0] font-medium py-3.5 px-8 rounded-full text-base transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl shadow-[#708238]/30"
            >
              Listen Now
            </a>
            <a
              href="#about"
              className="bg-transparent border border-[#708238]/50 hover:border-[#708238] hover:bg-[#708238]/10 text-[#F0FFF0] font-medium py-3.5 px-8 rounded-full text-base transition-all"
            >
              Discover More
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="about" className="py-32 px-4 relative bg-gradient-to-b from-[#1A2421] via-[#0d1310] to-[#1A2421] overflow-hidden">
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#708238] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3F704D] rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#708238]/5 rounded-full blur-3xl"></div>
        </div>

        {/* Decorative Lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#708238] to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Simple Gallery Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#708238]/10 border-t border-b border-[#708238] text-[#708238] text-sm font-semibold tracking-[0.3em] mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
              GALLERY
            </div>
            <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-6 leading-none tracking-tight">
              Yaba
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#708238]"></div>
              <div className="w-3 h-3 bg-[#708238] rotate-45"></div>
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#708238]"></div>
            </div>
          </div>

          {/* Integrated Artistic Gallery */}
          <div className="space-y-8">
            {/* Featured Large Image with Side Images */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Large Featured Image */}
              <div className="lg:col-span-2 relative group">
                <div className="absolute -inset-2 bg-gradient-to-br from-[#708238] to-[#3F704D] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
                <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#708238]/20">
                  <Image
                    src="/images/IMG_6323.JPG"
                    alt="Yaba Live Performance"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2421]/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="backdrop-blur-md bg-[#1A2421]/40 rounded-2xl p-6 border border-[#708238]/30 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-16 h-1 bg-gradient-to-r from-[#708238] to-[#3F704D] mb-3"></div>
                      <h3 className="font-playfair text-2xl font-bold text-[#F0FFF0] mb-2">Live Performance</h3>
                      <p className="text-[#F0FFF0]/80 text-sm">Captivating audiences with authentic Rhumba</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stacked Side Images */}
              <div className="space-y-6">
                <div className="relative h-[238px] rounded-2xl overflow-hidden group shadow-xl border-2 border-[#708238]/20">
                  <Image
                    src="/images/IMG_6328.JPG"
                    alt="Studio Session"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2421]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-12 h-1 bg-[#708238] mb-2"></div>
                    <p className="text-[#F0FFF0] font-playfair font-semibold">Studio Sessions</p>
                  </div>
                </div>
                <div className="relative h-[238px] rounded-2xl overflow-hidden group shadow-xl border-2 border-[#708238]/20">
                  <Image
                    src="/images/IMG_6360.JPG"
                    alt="On Stage"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2421]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-12 h-1 bg-[#708238] mb-2"></div>
                    <p className="text-[#F0FFF0] font-playfair font-semibold">On Stage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Three Column Gallery */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { src: "/images/IMG_6372.JPG", title: "Musical Expression", desc: "Pure artistry in motion" },
                { src: "/images/IMG_6376.JPG", title: "Cultural Pride", desc: "Celebrating Kenyan heritage" },
                { src: "/images/IMG_6498.JPG", title: "Stage Presence", desc: "Commanding the spotlight" },
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#708238] to-[#3F704D] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700"></div>
                  <div className="relative h-72 rounded-2xl overflow-hidden shadow-xl border-2 border-[#708238]/20">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A2421] via-[#1A2421]/50 to-transparent"></div>

                    {/* Always visible bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="w-10 h-1 bg-[#708238] mb-3 group-hover:w-16 transition-all duration-500"></div>
                      <h4 className="font-playfair text-lg font-bold text-[#F0FFF0] mb-1">{item.title}</h4>
                      <p className="text-[#F0FFF0]/70 text-sm">{item.desc}</p>
                    </div>

                    {/* Decorative Corner Elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#708238] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#708238] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="mt-20 flex items-center justify-center gap-4">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#708238]"></div>
            <div className="w-2 h-2 bg-[#708238] rotate-45"></div>
            <div className="w-32 h-px bg-[#708238]"></div>
            <div className="w-2 h-2 bg-[#708238] rotate-45"></div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#708238]"></div>
          </div>
        </div>
      </section>

      {/* WAPE WAPE EP Section */}
      <section id="wape" className="py-32 px-4 relative overflow-hidden bg-gradient-to-br from-[#0d1310] via-[#1A2421] to-[#0d1310]">
        {/* Asymmetric Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3F704D] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#708238] rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#708238]/30 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Decorative Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#708238]/10 rotate-45"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-[#3F704D]/10 rounded-full"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Asymmetric Header - Left Aligned */}
          <div className="mb-20 max-w-4xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-1 h-12 bg-gradient-to-b from-[#708238] to-[#3F704D]"></div>
              <div className="px-5 py-2 bg-[#708238]/10 border-l-4 border-[#708238] text-[#708238] text-sm font-bold tracking-[0.2em]">
                NEW RELEASE 2025
              </div>
            </div>
            <h2 className="font-playfair text-6xl md:text-8xl lg:text-9xl font-bold text-gradient mb-6 leading-none tracking-tighter">
              WAPE<br/>WAPE
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-[#708238] to-transparent"></div>
              <span className="text-xl text-[#708238] font-playfair italic">EP</span>
            </div>
            <p className="text-2xl text-[#F0FFF0]/70 font-light max-w-2xl">
              Six tracks of pure Kenyan Rhumba excellence
            </p>
          </div>

          {/* Asymmetric Grid Layout */}
          <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
            {/* Left Column - Album Cover (Takes 2 columns) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Main Album Cover */}
              <div className="relative group">
                <div className="hidden sm:block absolute -top-6 -left-6 w-40 h-40 border border-[#708238]/20 rounded-3xl"></div>
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-[#708238] to-[#3F704D] rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#708238]/20 transform group-hover:rotate-0 transition-all duration-500">
                  <div className="relative h-[350px] sm:h-[450px] lg:h-[550px]">
                    <Image
                      src="/images/wape.PNG"
                      alt="WAPE WAPE EP Cover"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                  {/* Overlay Badge */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 backdrop-blur-xl bg-[#1A2421]/80 border border-[#708238] rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2">
                    <div className="text-[#708238] font-bold text-xl sm:text-2xl">2025</div>
                  </div>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-[#708238]/20 hover:border-[#708238] transition-all hover:transform hover:-translate-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-[#708238] mb-0.5 sm:mb-1">6</div>
                  <div className="text-[10px] sm:text-xs text-[#F0FFF0]/60 uppercase">Tracks</div>
                </div>
                <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-[#708238]/20 hover:border-[#708238] transition-all hover:transform hover:-translate-y-1">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-0.5 sm:mb-1 text-[#708238]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                  </svg>
                  <div className="text-[10px] sm:text-xs text-[#F0FFF0]/60 uppercase">Digital</div>
                </div>
                <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-[#708238]/20 hover:border-[#708238] transition-all hover:transform hover:-translate-y-1">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-0.5 sm:mb-1 text-[#708238]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-[10px] sm:text-xs text-[#F0FFF0]/60 uppercase">Kenya</div>
                </div>
              </div>
            </div>

            {/* Right Column - Content (Takes 3 columns) */}
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              {/* Description Card */}
              <div className="relative">
                <div className="hidden lg:block absolute -right-4 top-0 w-72 h-72 bg-[#708238]/5 rounded-full blur-3xl"></div>
                <div className="relative glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-[#708238]/30 backdrop-blur-xl">
                  <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#708238] to-[#3F704D] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#F0FFF0]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F0FFF0] mb-2">
                        Available Now
                      </h3>
                      <div className="w-16 sm:w-20 h-1 bg-[#708238]"></div>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-[#F0FFF0]/80 leading-relaxed">
                    Experience the magic of Yaba&apos;s latest EP &quot;WAPE WAPE&quot; - a masterful blend
                    of traditional Kenyan Rhumba with modern production. Each track tells a
                    story, weaving together love, culture, and the rhythm of life.
                  </p>
                </div>
              </div>

              {/* Track Listing with Music Player */}
              <MusicPlayer />

              {/* Purchase Section - Asymmetric */}
              <div className="relative">
                <div className="hidden lg:block absolute -left-4 bottom-0 w-64 h-64 bg-[#3F704D]/5 rounded-full blur-3xl"></div>
                <div className="relative glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-[#708238]/40 backdrop-blur-xl bg-gradient-to-br from-[#708238]/10 to-transparent">
                  <div className="flex flex-col gap-5 sm:gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#708238] to-[#3F704D] flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#F0FFF0]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xl sm:text-2xl font-playfair font-bold text-[#F0FFF0]">Get Your Copy</h4>
                          <p className="text-xs sm:text-sm text-[#F0FFF0]/60">High quality digital download</p>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                        <span className="text-4xl sm:text-5xl font-bold text-[#708238]">KES 1,000</span>
                        <span className="text-sm sm:text-base text-[#F0FFF0]/60">/ All 6 tracks</span>
                      </div>
                    </div>
                    <Link
                      href="/checkout"
                      className="group relative bg-gradient-to-r from-[#708238] to-[#3F704D] hover:from-[#3F704D] hover:to-[#708238] text-[#F0FFF0] font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all transform active:scale-95 sm:hover:scale-105 shadow-2xl shadow-[#708238]/40 flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
                    >
                      <span>Purchase Now</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Footer Section */}
      <footer className="relative py-20 px-4 overflow-hidden bg-[#0d1310]">
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-px bg-[#708238]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-2 gap-16 mb-12">
            {/* Left - Branding */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/images/logo/yaba_logo.png"
                  alt="Yaba Logo"
                  width={70}
                  height={70}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-playfair text-3xl font-bold text-[#F0FFF0]">YABA</h3>
                  <p className="text-sm text-[#708238]">Prince of Rhumbacane</p>
                </div>
              </div>
              <p className="text-[#F0FFF0]/60 text-base mb-6 leading-relaxed">
                Authentic Kenyan Rhumba music that bridges generations.
                Based in Nairobi, bringing traditional sounds to modern audiences.
              </p>
            </div>

            {/* Right - Social Links */}
            <div>
              <h4 className="text-[#708238] font-semibold mb-5 text-sm uppercase tracking-wider">Follow the Journey</h4>
              <div className="space-y-3">
                <a href="#" className="group flex items-center gap-3 py-2 text-[#F0FFF0]/70 hover:text-[#708238] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">Instagram</span>
                    <span className="text-sm opacity-60">@yabamusic</span>
                  </div>
                </a>
                <a href="#" className="group flex items-center gap-3 py-2 text-[#F0FFF0]/70 hover:text-[#708238] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">Facebook</span>
                    <span className="text-sm opacity-60">Yaba Official</span>
                  </div>
                </a>
                <a href="#" className="group flex items-center gap-3 py-2 text-[#F0FFF0]/70 hover:text-[#708238] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">YouTube</span>
                    <span className="text-sm opacity-60">Yaba Music</span>
                  </div>
                </a>
                <a href="#" className="group flex items-center gap-3 py-2 text-[#F0FFF0]/70 hover:text-[#708238] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">Spotify</span>
                    <span className="text-sm opacity-60">Yaba</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#708238]/20 my-8"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-[#F0FFF0]/50">
              © 2025 Yaba. All rights reserved.
            </p>

            {/* Powered by */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-[#F0FFF0]/60 hover:text-[#708238] transition-colors"
            >
              <span className="text-xs">Powered by</span>
              <span className="font-semibold text-[#708238]">SoldoutAfrica</span>
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

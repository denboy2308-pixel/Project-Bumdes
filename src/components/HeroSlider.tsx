import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Recycle, Building, Trophy, ArrowRight } from 'lucide-react';
import { PageType } from '../types';

interface HeroSliderProps {
  onCallToAction: (page: PageType) => void;
}

export default function HeroSlider({ onCallToAction }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-bank-sampah',
      title: 'Unit Usaha "Layanan Pengelolaan Sampah Desa"',
      subtitle: 'Unit Usaha "Layanan Pengelolaan Sampah Desa"',
      description: 'Mari wujudkan Desa Waru yang bersih, sehat, dan bernilai ekonomis. Kami melayani penjemputan sampah rutin sesuai jadwal wilayah dan pengelolaan kas lingkungan warga.',
      badge: 'Peduli Lingkungan',
      theme: 'from-emerald-900/90 via-emerald-800/80 to-slate-900/90',
      bgImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1600',
      icon: <Recycle className="w-16 h-16 text-emerald-300" />,
      actionText: 'Daftar Nasabah Sampah',
      actionPage: 'register-nasabah' as PageType,
      illustration: (
        <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 to-teal-900 border border-emerald-500/30 shadow-inner">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="z-10 text-center px-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-400/40 animate-pulse">
              <Recycle className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="text-emerald-300 font-mono text-xs uppercase tracking-widest mb-1">PROGRAM UNGGULAN</div>
            <div className="text-lg font-bold text-white mb-2">Sampah Jadi Rupiah</div>
            <p className="text-xs text-emerald-200/80 max-w-xs mx-auto">Setor sampah anorganik Anda, catat beratnya, dan cairkan saldo di Papan Kas digital BUMDES.</p>
          </div>
          {/* Decorative rings */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border border-emerald-500/10"></div>
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-emerald-500/10"></div>
        </div>
      )
    },
    {
      id: 'slide-sewa-gedung',
      title: 'Gedung Pertemuan Waskita Wijaya',
      subtitle: 'Sewa Gedung Serbaguna',
      description: 'Menyediakan fasilitas aula luas dan modern untuk segala kebutuhan acara Anda seperti pernikahan, rapat warga, hajatan, pameran, dan pertemuan formal lainnya.',
      badge: 'Fasilitas Desa',
      theme: 'from-slate-900/95 via-slate-800/85 to-emerald-950/90',
      bgImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1600',
      icon: <Building className="w-16 h-16 text-emerald-300" />,
      actionText: 'Cek Fasilitas',
      actionPage: 'layanan' as PageType,
      illustration: (
        <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 border border-slate-700/50 shadow-inner">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="z-10 text-center px-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-slate-700/30 flex items-center justify-center mb-4 border border-slate-500/40">
              <Building className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="text-slate-300 font-mono text-xs uppercase tracking-widest mb-1">KAPASITAS HINGGA 1000 ORANG</div>
            <div className="text-lg font-bold text-white mb-2">Gedung Pertemuan Utama</div>
            <p className="text-xs text-slate-300/80 max-w-xs mx-auto">Dilengkapi dengan panggung utama, ruang rias, sound system berkualitas, serta area parkir yang sangat luas.</p>
          </div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full border border-slate-700/20"></div>
        </div>
      )
    },
    {
      id: 'slide-badminton',
      title: 'Arena Badminton Desa Waru',
      subtitle: 'Sewa Lapangan Olahraga',
      description: 'Lapangan badminton standar dengan pencahayaan prima dan lantai berkualitas tinggi. Tempat ideal bagi komunitas bulutangkis lokal untuk berlatih maupun bertanding.',
      badge: 'Gaya Hidup Sehat',
      theme: 'from-green-950/95 via-emerald-900/85 to-slate-900/90',
      bgImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1600',
      icon: <Trophy className="w-16 h-16 text-yellow-400" />,
      actionText: 'Cek jadwal & booking',
      actionPage: 'cek-jadwal-booking' as PageType,
      illustration: (
        <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 to-emerald-900 border border-emerald-500/20 shadow-inner">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="z-10 text-center px-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 border border-yellow-400/30">
              <Trophy className="w-12 h-12 text-yellow-400" />
            </div>
            <div className="text-yellow-400 font-mono text-xs uppercase tracking-widest mb-1">INTERACTIVE SPORTS</div>
            <div className="text-lg font-bold text-white mb-2">Arena Bulutangkis Waru</div>
            <p className="text-xs text-slate-300/80 max-w-xs mx-auto">Tersedia 3 line lapangan indoor yang nyaman dan terlindung dari cuaca, buka setiap hari s.d jam 23.00 WIB.</p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-40 border border-yellow-400/10 rounded-full rotate-12"></div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // cycle every 6s
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div id="hero-slider" className="relative bg-slate-950 overflow-hidden min-h-[480px]">
      {/* Background Slides with Smooth Fade-in & Scale Transition */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={`bg-${slide.id}`}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-35 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          />
        ))}
        {/* Sleek Gradient Overlay for high-contrast text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      {/* Main Slide Carousel container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 translate-x-0 relative' : 'opacity-0 absolute inset-0 pointer-events-none -translate-x-10'
            }`}
          >
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {slide.badge}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-200 border border-white/15 backdrop-blur-sm">
                  Badan Usaha Milik Desa · Waru, Baki, Sukoharjo
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm md:text-base font-medium text-emerald-400 uppercase tracking-widest">
                  {slide.id === 'slide-bank-sampah' ? 'BUMDES WASKITA WIJAYA' : slide.subtitle}
                </p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {slide.title}
                </h2>
              </div>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id={`hero-btn-action-${slide.id}`}
                  onClick={() => onCallToAction(slide.actionPage)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-xl transition-all duration-200 group"
                >
                  <span>{slide.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  id={`hero-btn-secondary-${slide.id}`}
                  onClick={() => onCallToAction('layanan')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/10 transition-colors"
                >
                  Informasi Detail
                </button>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-5 w-full">
              <div className="transition-all duration-500 transform hover:scale-[1.02]">
                {slide.illustration}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Controllers */}
      <button
        id="hero-slider-prev"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white border border-white/10 transition-all z-20"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        id="hero-slider-next"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white border border-white/10 transition-all z-20"
        aria-label="Slide berikutnya"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bullet Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            id={`hero-dot-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-emerald-400 w-8' : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Ke slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

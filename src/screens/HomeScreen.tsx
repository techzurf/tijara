import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Star,
  Compass,
  Send,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { Business, BusinessOffer, Category } from '../types';
import { CATEGORIES, ALL_OFFERS } from '../data/mockBusinesses';
import { Header } from '../components/common/Header';
import { SearchBar } from '../components/common/SearchBar';
import { CategoryCard } from '../components/common/CategoryCard';
import { BusinessCard } from '../components/common/BusinessCard';
import { OfferCard } from '../components/common/OfferCard';

interface LocalServiceItem {
  id: string;
  title: string;
  image: string;
  categorySlug: string;
}

const COMPACT_SERVICES: LocalServiceItem[] = [
  {
    id: 'ac-repair',
    title: 'AC Repair',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80',
    categorySlug: 'services',
  },
  {
    id: 'pest-control',
    title: 'Pest Control',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=200&q=80',
    categorySlug: 'services',
  },
  {
    id: 'packers-movers',
    title: 'Packers & Movers',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80',
    categorySlug: 'services',
  },
  {
    id: 'deep-cleaning',
    title: 'Deep Cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=200&q=80',
    categorySlug: 'services',
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=200&q=80',
    categorySlug: 'services',
  },
  {
    id: 'electricians',
    title: 'Electricians',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80',
    categorySlug: 'services',
  },
];

const HOME_SERVICES_3D_LAYERS = [
  { z: -1.5, color: '#00D0F5' },
  { z: -3.0, color: '#00B8E6' },
  { z: -4.5, color: '#00A8DE' },
  { z: -6.0, color: '#0099D6' },
  { z: -7.5, color: '#008BCE' },
  { z: -9.0, color: '#007DC5' },
  { z: -10.5, color: '#0077C8' },
  { z: -12.0, color: '#0066BC' },
  { z: -13.5, color: '#005FAF' },
  { z: -15.0, color: '#074896' },
];

interface HomeScreenProps {
  currentLocation: string;
  onOpenLocationModal: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onSearchFocus: () => void;
  onSelectCategory: (cat: Category) => void;
  onSelectBusiness: (business: Business) => void;
  onSelectOffer: (offer: BusinessOffer) => void;
  onViewAllCategories: () => void;
  onViewAllOffers: () => void;
  onViewAllPopular: () => void;
  onFindVideoClick?: () => void;
  onListBusiness?: () => void;
  businesses: Business[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  unreadCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLocation,
  onOpenLocationModal,
  onOpenNotifications,
  onOpenProfile,
  onSearchFocus,
  onSelectCategory,
  onSelectBusiness,
  onSelectOffer,
  onViewAllCategories,
  onViewAllOffers,
  onViewAllPopular,
  onFindVideoClick,
  businesses,
  favorites,
  onToggleFavorite,
  unreadCount = 2,
}) => {
  const EXCLUDED_FEATURED_IDS = ['b5', 'b11', 'b12', 'b20'];
  const EXCLUDED_FEATURED_NAMES = [
    'Urban Threads',
    'Aura Unisex Salon & Spa',
    'Grand Marina Bay Hotel',
    'Elite Fitness & CrossFit Hub',
    'Elite Fitness CrossFit',
  ];
  const featuredBusinesses = businesses.filter(
    (b) =>
      b.isFeatured &&
      !EXCLUDED_FEATURED_IDS.includes(b.id) &&
      !EXCLUDED_FEATURED_NAMES.includes(b.name)
  );
  const popularBusinesses = [...businesses].sort((a, b) => b.rating - a.rating);

  const videoRef = useRef<HTMLVideoElement>(null);
  const homeServicesCardRef = useRef<HTMLDivElement>(null);
  const [isHomeServicesVisible, setIsHomeServicesVisible] = useState(false);

  const handleServiceClick = (service: LocalServiceItem) => {
    const targetCategory =
      CATEGORIES.find((c) => c.id === service.categorySlug) ||
      CATEGORIES.find((c) => c.id === 'services') ||
      CATEGORIES[0];
    onSelectCategory(targetCategory);
  };

  useEffect(() => {
    const el = homeServicesCardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsHomeServicesVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHomeServicesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="w-full min-h-[100dvh] bg-[#F5F8FC] pb-nav">
      {/* Native App Top Header */}
      <Header
        currentLocation={currentLocation}
        onLocationClick={onOpenLocationModal}
        onNotificationClick={onOpenNotifications}
        onProfileClick={onOpenProfile}
        unreadCount={unreadCount}
      />

      {/* Main Container */}
      <main className="flex flex-col gap-6">
        {/* Hero Section & Search Header with Background Banner */}
        <section
          className="relative px-4 pt-5 pb-6 border-b border-[#E2E8F0] shadow-[0_2px_12px_rgba(7,27,82,0.04)] overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dv16a8l1l/image/upload/v1790664810/Vesa_Online_Shopping_Banner_m81vqz.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Subtle translucent overlay to ensure crisp readability while keeping the banner clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/65 to-white/80 backdrop-blur-[1px] pointer-events-none" />

          {/* Foreground content container */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0757D9] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#008CFF]" />
              <span className="drop-shadow-xs">Discover Local Quality</span>
            </div>

            <h1 className="font-brand font-extrabold text-2xl text-[#172033] tracking-tight drop-shadow-xs">
              What are you looking for?
            </h1>

            <div className="mt-3.5">
              <SearchBar
                value=""
                isReadOnly
                onFocus={onSearchFocus}
                onChange={() => {}}
                placeholder="Search businesses, services, products..."
                onFilterClick={onSearchFocus}
              />
            </div>

            {/* Quick Search Chips */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-semibold text-[#475467] shrink-0 bg-white/70 px-2 py-0.5 rounded-md backdrop-blur-xs shadow-2xs">
                Popular:
              </span>
              {['Mobile Shops', 'Restaurants', 'Clinics', 'Salons', 'Car Care'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={onSearchFocus}
                  className="text-[11px] font-semibold text-[#0757D9] bg-white/90 hover:bg-white border border-[#E2E8F0]/70 shadow-xs px-2.5 py-1 rounded-full shrink-0 transition-colors backdrop-blur-xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: Explore Categories */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="font-brand font-bold text-lg text-[#172033]">
                Explore Categories
              </h2>
              <p className="text-xs text-[#667085]">
                Discover verified businesses across Chennai
              </p>
            </div>

            <button
              type="button"
              onClick={onViewAllCategories}
              className="text-xs font-bold text-[#0757D9] hover:text-[#008CFF] flex items-center gap-0.5 min-h-[44px] py-2"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4-column responsive category grid */}
          <div className="grid grid-cols-4 gap-y-4 gap-x-2 bg-white p-4 rounded-3xl border border-[#E2E8F0] shadow-xs items-stretch">
            {/* Video Tile spanning the combined visual area of Restaurants + Travel */}
            <button
              type="button"
              onClick={onFindVideoClick}
              aria-label="Discover"
              className="row-span-2 col-span-1 relative flex items-center justify-center w-full h-full min-h-[148px] rounded-2xl overflow-hidden cursor-pointer focus:outline-none transition-transform active:scale-95 bg-[#071B52] shadow-xs"
            >
              <video
                ref={videoRef}
                src="https://res.cloudinary.com/jevuqbu8/video/upload/v1790410373/Find_2.mp4"
                autoPlay
                muted
                loop
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-full object-cover rounded-2xl block pointer-events-none"
                style={{ objectFit: 'cover' }}
              />
            </button>

            {/* Remaining 6 categories: Shopping, Doctors, Education, Hotels, Salons, Automotive */}
            {CATEGORIES.slice(0, 8)
              .filter((cat) => cat.id !== 'restaurants' && cat.id !== 'travel')
              .map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  videoUrl={
                    cat.id === 'automotive'
                      ? 'https://res.cloudinary.com/jevuqbu8/video/upload/v1790406938/new-car.mp4'
                      : undefined
                  }
                  fontIconClass={
                    cat.id === 'doctors'
                      ? 'fi fi-sr-user-md'
                      : cat.id === 'education'
                      ? 'fi fi-ss-graduation-cap'
                      : undefined
                  }
                  onClick={onSelectCategory}
                />
              ))}
          </div>
        </section>

        {/* SECTION: Featured on Tizara */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-brand font-bold text-lg text-[#172033]">
                Featured on Tizara
              </h2>
              <p className="text-xs text-[#667085]">
                Hand-picked top verified partners
              </p>
            </div>
          </div>

          {/* Horizontal scrollable cards */}
          <div className="flex items-center gap-3.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {featuredBusinesses.map((b) => (
              <BusinessCard
                key={b.id}
                business={b}
                variant="horizontal"
                isFavorite={favorites.includes(b.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={onSelectBusiness}
              />
            ))}
          </div>
        </section>

        {/* SECTION: Single Compact Service Category Card (3x2 Grid) */}
        <section className="px-4" ref={homeServicesCardRef}>
          <div
            className="relative rounded-2xl p-4 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(7,27,82,0.04)] overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://res.cloudinary.com/jevuqbu8/image/upload/v1790750130/Untitled_design_2.jpg")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Subtle translucent white overlay for crisp text readability while keeping the image clearly visible */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] pointer-events-none" />

            <div className="relative z-10">
              {/* Single Card Heading with Layered 3D Text Animation */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 min-h-[44px]">
                <div className="home-services-3d-wrapper gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#008CFF] shrink-0 shadow-sm" />
                  <div
                    className="home-services-3d-text font-brand font-bold text-[22px] md:text-[24px] tracking-tight"
                    aria-label="Home Services"
                  >
                    {/* Background 3D Extrusion Layers (Progressively moved backward on Z axis) */}
                    {HOME_SERVICES_3D_LAYERS.map((layer, idx) => (
                      <span
                        key={idx}
                        aria-hidden="true"
                        className="home-services-3d-layer"
                        style={{
                          transform: `translateZ(${layer.z}px)`,
                          color: layer.color,
                        }}
                      >
                        Home Services
                      </span>
                    ))}
                    {/* Foreground Sharp White Text */}
                    <span
                      className="home-services-3d-front"
                      style={{
                        transform: 'translateZ(0px)',
                        color: '#FFFFFF',
                        textShadow:
                          '0 1px 3px rgba(7, 27, 82, 0.55), 0 0 1px rgba(7, 27, 82, 0.8)',
                      }}
                    >
                      Home Services
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const servicesCat = CATEGORIES.find((c) => c.id === 'services') || CATEGORIES[0];
                    onSelectCategory(servicesCat);
                  }}
                  className="text-xs font-bold text-[#0757D9] hover:text-[#008CFF] flex items-center gap-0.5 active:scale-95 transition-transform min-h-[32px] px-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3-Column x 2-Row Compact Grid */}
              <div className="grid grid-cols-3 gap-y-3.5 gap-x-2">
                {COMPACT_SERVICES.map((service) => (
                  <div
                    key={service.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleServiceClick(service)}
                    onKeyDown={(e) => e.key === 'Enter' && handleServiceClick(service)}
                    className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform group py-0.5"
                  >
                    {/* Small rounded icon/image thumbnail */}
                    <div className="w-13 h-13 rounded-2xl overflow-hidden bg-white/90 p-0.5 border border-white/80 shadow-xs group-hover:border-[#0757D9]/40 group-hover:shadow-sm transition-all flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    {/* Short category name underneath */}
                    <span className="text-[11px] font-bold text-[#172033] text-center leading-tight mt-1.5 px-0.5 line-clamp-2 group-hover:text-[#0757D9] transition-colors drop-shadow-xs">
                      {service.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Offers Near You */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-brand font-bold text-lg text-[#172033]">
                Offers Near You
              </h2>
              <p className="text-xs text-[#667085]">
                Exclusive deals for Tizara members
              </p>
            </div>

            <button
              type="button"
              onClick={onViewAllOffers}
              className="text-xs font-bold text-[#0757D9] hover:text-[#008CFF] flex items-center gap-0.5 min-h-[44px] py-2"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal compact offer cards */}
          <div className="flex items-center gap-3.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {ALL_OFFERS.slice(0, 4).map((offer, index) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                compact
                colorThemeIndex={index}
                onViewOffer={onSelectOffer}
                onSelectBusiness={(id) => {
                  const b = businesses.find((item) => item.id === id);
                  if (b) onSelectBusiness(b);
                }}
              />
            ))}
          </div>
        </section>

        {/* SECTION: Popular Near You */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-brand font-bold text-lg text-[#172033]">
                Popular Near You
              </h2>
              <p className="text-xs text-[#667085]">
                Highly rated by local customers
              </p>
            </div>

            <button
              type="button"
              onClick={onViewAllPopular}
              className="text-xs font-bold text-[#0757D9] hover:text-[#008CFF] flex items-center gap-0.5 min-h-[44px] py-2"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Vertical cards stack */}
          <div className="flex flex-col gap-4">
            {popularBusinesses.slice(0, 4).map((b) => (
              <BusinessCard
                key={b.id}
                business={b}
                variant="vertical"
                isFavorite={favorites.includes(b.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={onSelectBusiness}
              />
            ))}
          </div>
        </section>

        {/* SECTION: Why Tizara? */}
        <section className="px-4 mb-3">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#F8FAFD] to-[#EFF6FE] border border-[#E2E8F0] p-5 shadow-[0_4px_20px_rgba(7,87,217,0.04)]">
            {/* Subtle decorative background glows for depth */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#008CFF]/10 to-[#08D9F5]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-gradient-to-tr from-[#0757D9]/8 to-[#008CFF]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0757D9] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#008CFF]" />
                <span>The Tizara Standard</span>
              </div>
              <h3 className="font-brand font-bold text-lg text-[#172033] tracking-tight">
                Why Tizara?
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Building authentic trust between local customers and high-standard businesses.
              </p>

              {/* 2x2 Clean Lightweight Benefits Grid */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 pt-4 mt-4 border-t border-[#E2E8F0]/70">
                {/* 1. Verified Businesses */}
                <div className="flex flex-col">
                  <div className="w-9 h-9 rounded-xl bg-[#0757D9]/10 border border-[#0757D9]/15 flex items-center justify-center mb-2.5 shadow-2xs">
                    <ShieldCheck className="w-4.5 h-4.5 text-[#0757D9]" />
                  </div>
                  <h4 className="font-bold text-xs text-[#172033] tracking-tight">
                    Verified Businesses
                  </h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                    Checked identity & address
                  </p>
                </div>

                {/* 2. Trusted Reviews */}
                <div className="flex flex-col">
                  <div className="w-9 h-9 rounded-xl bg-[#008CFF]/10 border border-[#008CFF]/20 flex items-center justify-center mb-2.5 shadow-2xs">
                    <Star className="w-4.5 h-4.5 text-[#008CFF]" />
                  </div>
                  <h4 className="font-bold text-xs text-[#172033] tracking-tight">
                    Trusted Reviews
                  </h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                    Real verified customer feedback
                  </p>
                </div>

                {/* 3. Local Discovery */}
                <div className="flex flex-col">
                  <div className="w-9 h-9 rounded-xl bg-[#08D9F5]/15 border border-[#08D9F5]/30 flex items-center justify-center mb-2.5 shadow-2xs">
                    <Compass className="w-4.5 h-4.5 text-[#0284C7]" />
                  </div>
                  <h4 className="font-bold text-xs text-[#172033] tracking-tight">
                    Local Discovery
                  </h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                    Find nearby gems quickly
                  </p>
                </div>

                {/* 4. Easy Enquiries */}
                <div className="flex flex-col">
                  <div className="w-9 h-9 rounded-xl bg-[#0757D9]/10 border border-[#0757D9]/15 flex items-center justify-center mb-2.5 shadow-2xs">
                    <Send className="w-4.5 h-4.5 text-[#0757D9]" />
                  </div>
                  <h4 className="font-bold text-xs text-[#172033] tracking-tight">
                    Easy Enquiries
                  </h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                    Direct quotes & instant responses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

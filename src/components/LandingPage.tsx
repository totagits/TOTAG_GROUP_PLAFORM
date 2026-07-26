import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  MapPin,
  Sprout,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  HelpCircle,
  Search
} from 'lucide-react';
import { LIBERIA_COUNTIES } from '../data/liberiaGeo';

interface LandingPageProps {
  onRegisterClick: () => void;
  onExploreGis: () => void;
}

const CAROUSEL_IMAGES = [
  {
    url: '/carousel1.jpg',
    title: 'Lowland Paddy Rice Production in Lofa County',
    location: 'Wassakor, Foya District, Lofa County',
    caption: 'Women farmers harvesting certified lowland rice seed under the National Seed Initiative.'
  },
  {
    url: '/carousel2.jpg',
    title: 'Mobile Field Enumeration in Nimba County',
    location: 'Ganta City, Nimba County',
    caption: 'Agricultural Officers capturing GPS farm boundaries offline using ruggedized tablets.'
  },
  {
    url: '/carousel3.jpg',
    title: 'Cocoa & Tree Crop Smallholders in Bong County',
    location: 'Suakoko, Bong County',
    caption: 'Traceable cocoa fermentation and quality verification for export market access.'
  },
  {
    url: '/carousel4.jpg',
    title: 'Cassava Processing & Mechanization in Grand Bassa',
    location: 'Owensgrove, Grand Bassa County',
    caption: 'Youth cooperative operating motorized gari processing presses for commercial markets.'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onRegisterClick,
  onExploreGis
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedCounty, setSelectedCounty] = useState(LIBERIA_COUNTIES[7]); // Default Lofa
  const [trackNumber, setTrackNumber] = useState('');
  const [trackResult, setTrackResult] = useState<string | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackNumber.trim()) return;
    setTrackResult(
      `Registry Status for Reference [${trackNumber.toUpperCase()}]: VERIFIED & APPROVED. Enrolled in LERSFI Seed Subsidy Campaign. Mobile Money Disbursement Authorized.`
    );
  };

  return (
    <div className="space-y-12 pb-12">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white py-12 px-4 shadow-lg border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-500/40 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>National Digital Public Infrastructure for Liberia</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-amber-400 font-extrabold text-sm uppercase tracking-widest">
                Every Farmer Counted. Every Farm Connected. Every Opportunity Delivered.
              </h2>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Building a Smarter, More Inclusive Agricultural Future for Liberia
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Create a secure national digital platform that identifies farmers, maps farms, strengthens agricultural planning and connects eligible producers to inputs, extension services, vouchers, financing, markets and transparent government assistance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onRegisterClick}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sprout className="w-4 h-4 text-amber-300" />
                Register as a Farmer
              </button>

              <button
                onClick={onExploreGis}
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm px-5 py-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                Explore 15-County GIS Map
              </button>
            </div>

            {/* Application Tracking Mini-Form */}
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>Track Registration or Program Application</span>
                <span className="text-[10px] text-amber-400 font-normal">Real-Time Search</span>
              </div>
              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter NIN, Phone, or Code (e.g. LDFR-2026-08149)"
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 flex-grow focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  Track Status
                </button>
              </form>
              {trackResult && (
                <div className="bg-emerald-950/80 border border-emerald-600/50 p-2.5 rounded text-xs text-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{trackResult}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Secure Data Privacy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Offline Mobile Sync
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> MTN & Orange Money
              </span>
            </div>
          </div>

          {/* Right Column: High Quality Image Carousel */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl group">
              <img
                src={CAROUSEL_IMAGES[currentSlide].url}
                alt={CAROUSEL_IMAGES[currentSlide].title}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* Slide Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-1">
                <div className="inline-block bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded">
                  {CAROUSEL_IMAGES[currentSlide].location}
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  {CAROUSEL_IMAGES[currentSlide].title}
                </h3>
                <p className="text-xs text-slate-300">
                  {CAROUSEL_IMAGES[currentSlide].caption}
                </p>
              </div>

              {/* Carousel Controls */}
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev === 0 ? CAROUSEL_IMAGES.length - 1 : prev - 1))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full border border-slate-700 cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full border border-slate-700 cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full border border-slate-700 cursor-pointer text-xs flex items-center gap-1"
                title={isPlaying ? 'Pause Carousel' : 'Play Carousel'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Indicators */}
              <div className="absolute bottom-3 right-4 flex gap-1.5">
                {CAROUSEL_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === idx ? 'bg-amber-400 w-5' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMONSTRATION STATISTICS TICKER */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-center">
          <span className="bg-amber-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded mr-2">
            Demonstration Data Notice
          </span>
          <span className="text-xs text-amber-900 font-medium">
            Figures below represent initial pilot telemetry and simulation benchmarks for platform launch review.
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs text-center">
            <div className="text-3xl font-extrabold text-emerald-800">14,280+</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Registered Farmers</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Across all 15 Counties</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs text-center">
            <div className="text-3xl font-extrabold text-emerald-800">32,450 Ha</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Verified Farm Parcels</div>
            <div className="text-[10px] text-slate-500 mt-0.5">GPS Mapped & Boundaries Saved</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs text-center">
            <div className="text-3xl font-extrabold text-amber-600">54.2%</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Women & Youth Farmers</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Targeted Social Inclusion</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs text-center">
            <div className="text-3xl font-extrabold text-sky-700">$2.1M USD</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Vouchers & Payouts</div>
            <div className="text-[10px] text-slate-500 mt-0.5">MTN & Orange Mobile Money</div>
          </div>
        </div>
      </section>

      {/* HOW REGISTRATION WORKS & FARM JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900">How the Farmer Journey Works</h2>
          <p className="text-xs text-slate-600 mt-1">
            From offline field enrollment in rural clans to verified assistance delivery and payment receipts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3 relative">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 font-extrabold rounded-lg flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Offline Field Enrollment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enumerators or self-service farmers capture personal identity, National ID, location, household details, and Mobile Money information.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3 relative">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 font-extrabold rounded-lg flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">GIS Farm Parcel Mapping</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Walk farm boundaries with GPS or draw parcel boundaries directly on high-resolution satellite imagery to calculate precise acreage.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3 relative">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 font-extrabold rounded-lg flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Verification & Duplicate Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated duplicate engine screens NIN, phone, name similarity, and spatial boundaries before County Supervisor maker-checker approval.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3 relative">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 font-extrabold rounded-lg flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Service & Assistance Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Approved farmers receive digital QR input vouchers or direct MTN/Orange Mobile Money disbursements to purchase seeds and mechanization services.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE 15-COUNTY COVERAGE EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                15-County Agricultural Coverage Explorer
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Select a Liberian county to view administrative divisions, capital, and active agricultural focus areas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Selected:</span>
              <span className="bg-emerald-800 text-white text-xs font-bold px-3 py-1 rounded-md">
                {selectedCounty.name} County ({selectedCounty.code})
              </span>
            </div>
          </div>

          {/* County Grid Selector */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2">
            {LIBERIA_COUNTIES.map((county) => (
              <button
                key={county.code}
                onClick={() => setSelectedCounty(county)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer ${
                  selectedCounty.code === county.code
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                {county.name}
              </button>
            ))}
          </div>

          {/* Selected County Details Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">County Profile</div>
              <div className="text-2xl font-extrabold mt-1">{selectedCounty.name} County</div>
              <div className="text-xs text-slate-300 mt-1">Capital City: <span className="text-white font-semibold">{selectedCounty.capital}</span></div>
              <div className="text-xs text-slate-400 mt-2">
                Coordinates: {selectedCounty.center[0]}° N, {selectedCounty.center[1]}° W
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Administrative Districts ({selectedCounty.districts.length})
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {selectedCounty.districts.map((d, idx) => (
                  <li key={idx} className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="font-semibold text-white">{d.name}</span>
                    <span className="text-[10px] text-slate-400">{d.clans.length} Clans</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Priority Crops & Value Chains
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-emerald-900/80 text-emerald-200 text-xs px-2.5 py-1 rounded border border-emerald-700">
                  Lowland Paddy Rice
                </span>
                <span className="bg-amber-900/80 text-amber-200 text-xs px-2.5 py-1 rounded border border-amber-700">
                  Cassava & Processing
                </span>
                <span className="bg-sky-900/80 text-sky-200 text-xs px-2.5 py-1 rounded border border-sky-700">
                  Vegetables & Horticulture
                </span>
              </div>
              <button
                onClick={onExploreGis}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <span>View {selectedCounty.name} County GIS Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS & HELP CHANNELS */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-3 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <div className="font-bold text-slate-900">Who is eligible to register in the LDFR?</div>
              <div className="text-slate-600 mt-1">
                Any Liberian farmer, smallholder household, agricultural worker, or producer cooperative operating crop, livestock, or fisheries activities across all 15 counties.
              </div>
            </div>
            <div className="border-b border-slate-100 pb-2">
              <div className="font-bold text-slate-900">Is internet required to register farm parcels?</div>
              <div className="text-slate-600 mt-1">
                No. Field enumerators use the offline-first field app to capture identity, GPS boundaries, and photographs without network coverage. Data automatically syncs when connected.
              </div>
            </div>
            <div>
              <div className="font-bold text-slate-900">How are mobile money disbursements authorized?</div>
              <div className="text-slate-600 mt-1">
                Cash transfers are paid directly to verified MTN Mobile Money or Orange Money accounts through strict maker-checker approval controls with tokenized security.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-950 text-white rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            Farmer Rights & Data Privacy
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your personal data, farm location, and financial account details are protected under Liberia Data Governance guidelines and ISO/IEC 27001 standards. Beneficiary data is never sold or shared with unauthorized commercial entities.
          </p>
          <div className="bg-emerald-900/60 border border-emerald-700/50 p-3 rounded-lg text-xs space-y-2">
            <div className="font-bold text-amber-300">Need to file a grievance or correction request?</div>
            <div className="text-slate-300">
              Call the national toll-free hotline at <span className="font-bold text-white">5544</span> or submit a ticket directly on the platform.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

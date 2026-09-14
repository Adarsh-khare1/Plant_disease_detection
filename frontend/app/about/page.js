import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-10">
        {/* Title */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">
            About PlantDx
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            Agricultural decision support through computer vision
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            PlantDx is an experimental agricultural decision support project designed for farmers, agronomists, and agricultural students seeking accessible foliage classification tools.
          </p>
        </div>

        {/* Purpose & Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-stone-900">Project Purpose</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              PlantDx combines classical Digital Signal Processing (DSP) with deep learning classification to explore how structured, multi-stage image verification can assist early foliage assessment in smallholder farming environments.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-stone-900">Supported Crops</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              The project explicitly restricts its current operational scope to two crops: <strong>Tomato</strong> and <strong>Potato</strong>. PlantDx does not support or analyze other crops. Supported disease categories encompass Healthy, Early Blight, and Late Blight.
            </p>
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-stone-900">Engineering Approach</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-1">
              <span className="font-bold text-stone-900">1. Quality Validation</span>
              <p className="text-stone-600">Filters out uninformative, blurry, or misfocused field photos before ML processing.</p>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-1">
              <span className="font-bold text-stone-900">2. Deterministic DSP</span>
              <p className="text-stone-600">Uses OpenCV color space segmentation to isolate clean leaf tissue from complex field backgrounds.</p>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-1">
              <span className="font-bold text-stone-900">3. Hierarchical Classification</span>
              <p className="text-stone-600">Routes leaf images through specialized model adapters for species and condition identification.</p>
            </div>
          </div>
        </div>

        {/* Disclaimers & Limitations */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-6 space-y-2 text-xs text-amber-900 leading-relaxed">
          <h3 className="font-bold text-amber-950 text-sm">Important Limitations & Educational Use</h3>
          <p>
            PlantDx is an educational classification prototype, not a certified biological diagnostic instrument. Model outputs are classification probabilities based on visual surface features and do not replace physical laboratory testing, soil analysis, or direct consultation with qualified agricultural extension officers.
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

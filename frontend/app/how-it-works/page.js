import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Image Upload',
      desc: 'Upload a clear, focused foliage photograph of a single leaf specimen.',
    },
    {
      num: '02',
      title: 'Image Quality Check',
      desc: 'The product quality gate assesses resolution, sharpness, blur, and exposure to ensure the photo is clear enough for evaluation.',
    },
    {
      num: '03',
      title: 'Leaf Identification',
      desc: 'The system verifies whether a valid plant leaf is present in the image before proceeding to classification.',
    },
    {
      num: '04',
      title: 'Crop Identification',
      desc: 'The system determines whether the leaf belongs to a supported crop species (Tomato or Potato).',
    },
    {
      num: '05',
      title: 'Disease Analysis',
      desc: 'If routed successfully, the foliage is evaluated for Healthy, Early Blight, or Late Blight condition patterns.',
    },
    {
      num: '06',
      title: 'Diagnostic Result',
      desc: 'Receive structured diagnostic findings with model confidence scores and observational guidance.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-12">
        {/* Hero */}
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">
            Product Workflow
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            How PlantDx evaluates foliage health
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            PlantDx uses a structured multi-stage analysis pipeline to ensure image clarity, confirm plant species, and deliver transparent foliage disease classifications for Tomato and Potato crops.
          </p>
        </div>

        {/* Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="bg-white border border-stone-200 rounded-lg p-6 space-y-3 shadow-xs">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                STEP {s.num}
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900">{s.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Supported Scope Callout */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900">Supported Crops & Classes</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            PlantDx currently evaluates foliage for two specific agricultural crops:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-1">
              <span className="font-bold text-stone-900">Tomato (Solanum lycopersicum)</span>
              <p className="text-stone-600">Supported: Healthy, Early Blight, Late Blight</p>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-1">
              <span className="font-bold text-stone-900">Potato (Solanum tuberosum)</span>
              <p className="text-stone-600">Supported: Healthy, Early Blight, Late Blight</p>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="bg-stone-900 text-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold">Ready to analyze a specimen?</h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Upload a clear leaf photo to experience the PlantDx quality and classification pipeline.
            </p>
          </div>
          <Link
            href="/app/analyze"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs rounded transition-colors shrink-0"
          >
            Start analysis
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

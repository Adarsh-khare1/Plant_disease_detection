import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { mockDiseaseLibrary } from '@/lib/mock/diseases';

export default async function DiseaseDetailPage({ params }) {
  const { slug } = await params;
  const disease = mockDiseaseLibrary.find((d) => d.slug === slug);

  if (!disease) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-stone-500 flex items-center gap-2">
          <Link href="/diseases" className="hover:text-emerald-800 underline">
            Disease library
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">{disease.condition}</span>
        </nav>

        {/* Title Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-medium text-xs rounded">
              Crop: {disease.crop}
            </span>
            <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-xs rounded font-mono">
              classId: {disease.classId}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            {disease.condition}
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            {disease.shortDescription}
          </p>
        </div>

        {/* Visual Characteristics */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
            Common Visual Characteristics
          </h2>
          <ul className="space-y-2">
            {disease.visualCharacteristics.map((trait, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                <span>{trait}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Model Recognition & Limitations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-2">
            <h3 className="font-serif text-base font-bold text-stone-900">What PlantDx Recognizes</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{disease.modelRecognition}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-2">
            <h3 className="font-serif text-base font-bold text-stone-900">Diagnostic Limitations</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{disease.limitations}</p>
          </div>
        </div>

        {/* Educational Note */}
        <div className="bg-stone-100 border border-stone-200 rounded-lg p-4 text-xs text-stone-600 leading-relaxed">
          <p className="font-medium text-stone-800 mb-1">Educational Notice</p>
          PlantDx is an experimental computer vision classification tool for agricultural study. Disease reference entries are separate from automated ML outputs and are provided solely for contextual reference. Consult local agricultural extension specialists for field diagnostics.
        </div>

        {/* Action Callout */}
        <div className="bg-stone-900 text-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold">Have a foliage sample?</h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Analyze your Tomato or Potato leaf image through our multi-stage quality and disease gate.
            </p>
          </div>
          <Link
            href="/app/analyze"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs rounded transition-colors shrink-0"
          >
            Analyze a leaf
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { mockDiseaseLibrary } from '@/lib/mock/diseases';

export default function DiseasesPage() {
  const tomatoDiseases = mockDiseaseLibrary.filter((d) => d.cropId === 'tomato');
  const potatoDiseases = mockDiseaseLibrary.filter((d) => d.cropId === 'potato');

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">
            Educational Reference
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            Disease reference library
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl">
            Supported condition catalog for Tomato and Potato crops. Information provided here is for educational comparison and separate from automated ML diagnostic predictions.
          </p>
        </div>

        {/* Educational Disclaimer Banner */}
        <div className="bg-emerald-900 text-white rounded-lg p-4 text-xs leading-relaxed flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-semibold text-emerald-200">Scope Restriction: </span>
            PlantDx currently evaluates only <strong>Healthy</strong>, <strong>Early Blight</strong>, and <strong>Late Blight</strong> for Tomato and Potato crops. Other disease classes or crops are not currently within the model scope.
          </div>
        </div>

        {/* Tomato Section */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-200 pb-2">
            Tomato Diseases & Supported Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tomatoDiseases.map((item) => (
              <div
                key={item.slug}
                className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-emerald-700 transition-colors shadow-xs"
              >
                <div className="space-y-2">
                  <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px] font-medium">
                    {item.crop}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{item.condition}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.shortDescription}</p>
                </div>
                <div className="pt-4">
                  <Link
                    href={`/diseases/${item.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                  >
                    View condition details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Potato Section */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-200 pb-2">
            Potato Diseases & Supported Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {potatoDiseases.map((item) => (
              <div
                key={item.slug}
                className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-emerald-700 transition-colors shadow-xs"
              >
                <div className="space-y-2">
                  <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px] font-medium">
                    {item.crop}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{item.condition}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.shortDescription}</p>
                </div>
                <div className="pt-4">
                  <Link
                    href={`/diseases/${item.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                  >
                    View condition details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

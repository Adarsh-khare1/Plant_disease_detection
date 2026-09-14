import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function TechnologySection() {
  const features = [
    { icon: 'photo_filter', text: 'Image quality assessment' },
    { icon: 'tune', text: 'Image preprocessing' },
    { icon: 'graphic_eq', text: 'Digital signal processing' },
    { icon: 'spa', text: 'Leaf analysis' },
    { icon: 'model_training', text: 'Machine learning' },
    { icon: 'verified', text: 'Model evaluation' },
  ];

  return (
    <section 
      className="w-full flex flex-col mb-10 bg-surface p-4 rounded-lg border border-surface-high shadow-xs" 
      id="technology"
    >
      <div className="flex flex-col mb-2">
        <h2 className="font-display text-[22px] sm:text-[26px] font-medium leading-[1.3] sm:leading-[1.25] text-text tracking-tight">
          Where agriculture meets image science.
        </h2>
        <p className="font-body text-[13px] leading-[1.5] text-text-muted mt-1 leading-relaxed">
          The project&apos;s technical foundation rests on standard image science and pathology benchmarks:
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        {features.map((feat, idx) => (
          <div key={idx} className="bg-surface-low p-2.5 rounded flex items-center gap-2">
            <Icon name={feat.icon} className="w-[18px] h-[18px] text-primary" />
            <span className="font-body text-[12px] leading-[1.3] font-medium text-text">
              {feat.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-2 border-t border-surface-container flex items-center justify-end">
        <Link 
          href="#technology" 
          className="font-body text-[12px] leading-[1.3] font-semibold text-primary flex items-center gap-1 hover:underline focus-visible:outline-2 focus-visible:outline-primary rounded px-1"
        >
          <span>Explore the technology</span>
          <Icon name="arrow_forward" className="w-[15px] h-[15px]" />
        </Link>
      </div>
    </section>
  );
}

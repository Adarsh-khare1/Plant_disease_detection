import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function FinalCTA() {
  return (
    <section className="w-full bg-surface-container p-6 rounded-lg text-center flex flex-col items-center gap-2 mb-6 border border-surface-high/60">
      <h2 className="font-display text-[26px] sm:text-[28px] text-primary tracking-tight font-medium">
        Start with a leaf.
      </h2>
      <p className="font-body text-[15px] leading-[1.55] text-text-muted max-w-xs leading-relaxed">
        Upload a clear leaf image and begin an analysis.
      </p>
      <Link 
        href="#analyze" 
        className="w-full max-w-xs min-h-[48px] mt-2 py-3 bg-primary text-white rounded font-body text-[14px] leading-[1.2] font-medium active:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="add_a_photo" className="w-[18px] h-[18px]" />
        <span>Analyze a leaf</span>
      </Link>
    </section>
  );
}

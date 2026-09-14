import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';

export default function HeroSection() {
  return (
    <section className="flex flex-col w-full mb-10 pt-2">
      <h1 className="font-display text-[28px] sm:text-[32px] text-primary tracking-tight font-medium leading-[1.2] mb-2">
        Know what your leaf is telling you.
      </h1>
      <p className="font-body text-[15px] leading-[1.55] text-text-muted mb-6">
        PlantDx helps identify plant diseases from leaf images, giving farmers and agriculture students a clearer starting point for understanding crop health.
      </p>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-10">
        <Link 
          href="#analyze" 
          className="min-h-[44px] px-6 py-3 bg-primary text-white rounded flex items-center justify-center gap-1.5 font-body text-[14px] leading-[1.2] font-medium active:bg-primary/90 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="document_scanner" className="w-[18px] h-[18px]" />
          <span>Analyze a leaf</span>
        </Link>
        <Link 
          href="#how-it-works" 
          className="min-h-[44px] px-4 py-3 text-primary rounded flex items-center justify-center gap-1.5 font-body text-[14px] leading-[1.2] font-medium hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span>How it works</span>
          <Icon name="arrow_forward" className="w-[16px] h-[16px]" />
        </Link>
      </div>
      
      <figure className="flex flex-col w-full">
        <div className="relative w-full rounded-lg overflow-hidden bg-surface-high shadow-sm">
          <Image 
            src="/images/landing/hero-leaf.jpg" 
            alt="Tomato leaf photographed in natural field conditions" 
            width={900}
            height={450}
            className="w-full h-64 sm:h-80 object-cover block"
            priority
          />
        </div>
        <figcaption className="mt-1 font-body text-[11px] leading-[1.4] tracking-[0.05em] font-semibold text-text-muted">
          Tomato leaf photographed in natural field conditions.
        </figcaption>
      </figure>
    </section>
  );
}

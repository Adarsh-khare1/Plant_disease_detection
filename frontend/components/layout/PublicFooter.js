import Link from 'next/link';
import Image from 'next/image';

export default function PublicFooter() {
  return (
    <footer className="w-full mt-10 py-4 flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl mx-auto w-full px-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-high pt-4 pb-10 text-center sm:text-left">
        <div className="flex flex-col">
          <div className="flex items-center justify-center sm:justify-start gap-1">
            <Image 
              src="/images/logo.svg" 
              alt="PlantDx" 
              width={96} 
              height={24} 
              className="h-6 w-auto object-contain" 
            />
          </div>
          <p className="font-body text-[13px] leading-[1.5] text-text-muted mt-1">
            PlantDx is an experimental agricultural diagnostic platform.
          </p>
        </div>
        <nav 
          aria-label="Footer Navigation" 
          className="flex flex-wrap items-center justify-center gap-4 font-body text-[12px] font-medium leading-[1.3] text-text-muted"
        >
          <Link href="#principles" className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-0.5">
            About
          </Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-0.5">
            How It Works
          </Link>
          <Link href="#disease-library" className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-0.5">
            Disease Library
          </Link>
          <Link href="#technology" className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-0.5">
            Technology
          </Link>
          <Link href="#help" className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-0.5">
            Help
          </Link>
        </nav>
      </div>
    </footer>
  );
}

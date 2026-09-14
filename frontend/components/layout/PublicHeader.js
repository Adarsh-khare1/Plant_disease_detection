import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';

export default function PublicHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-border/40">
      <div className="max-w-5xl mx-auto h-16 px-4 flex items-center justify-between gap-2">
        <Link 
          href="/" 
          className="flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
          aria-label="PlantDx Home"
        >
          <Image 
            src="/images/logo.svg" 
            alt="PlantDx" 
            width={128} 
            height={32} 
            className="h-8 w-auto object-contain" 
            priority
          />
        </Link>
        <nav 
          aria-label="Main Navigation" 
          className="hidden sm:flex items-center gap-4 text-text-muted font-body text-[12px] font-medium leading-[1.3]"
        >
          <Link href="#how-it-works" className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-1">
            How It Works
          </Link>
          <Link href="#disease-library" className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-1">
            Disease Library
          </Link>
          <Link href="#technology" className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-1">
            Technology
          </Link>
          <Link href="#principles" className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-1">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link 
            href="#login" 
            className="hidden sm:inline-block font-body text-[12px] font-medium leading-[1.3] text-text-muted hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded px-1"
          >
            Log in
          </Link>
          <Link 
            href="#analyze" 
            className="h-9 px-4 bg-primary text-white rounded flex items-center gap-1.5 active:bg-primary/90 transition-colors text-[12px] font-medium leading-[1.3] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="photo_camera" className="w-[17px] h-[17px]" />
            <span>Analyze a leaf</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

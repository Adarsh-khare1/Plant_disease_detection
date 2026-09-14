import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import HeroSection from '@/components/landing/HeroSection';
import CropCoverage from '@/components/landing/CropCoverage';
import WorkflowSection from '@/components/landing/WorkflowSection';
import ProductPreview from '@/components/landing/ProductPreview';
import PrinciplesSection from '@/components/landing/PrinciplesSection';
import TechnologySection from '@/components/landing/TechnologySection';
import FinalCTA from '@/components/landing/FinalCTA';

export default function Home() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1 flex flex-col relative w-full px-4 pt-16 bg-background">
        <div className="w-full flex-1 flex flex-col">
          <div className="flex flex-col w-full text-text">
            <div className="max-w-3xl mx-auto w-full flex flex-col py-4">
              <HeroSection />
              <CropCoverage />
              <WorkflowSection />
              <ProductPreview />
              <PrinciplesSection />
              <TechnologySection />
              <FinalCTA />
            </div>
          </div>
        </div>
        <PublicFooter />
      </main>
    </>
  );
}

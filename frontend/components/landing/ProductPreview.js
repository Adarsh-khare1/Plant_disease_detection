import Image from 'next/image';

export default function ProductPreview() {
  return (
    <section className="w-full flex flex-col mb-10" id="disease-library">
      <div className="flex flex-col mb-4">
        <h2 className="font-display text-[22px] sm:text-[26px] font-medium leading-[1.3] sm:leading-[1.25] text-text tracking-tight">
          A diagnosis should be understandable.
        </h2>
      </div>
      <div className="w-full bg-surface rounded-lg p-4 border border-surface-high flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-surface-high">
          <span className="font-body text-[14px] leading-[1.2] font-semibold text-text">
            Sample diagnostic report
          </span>
          <span className="font-body text-[11px] leading-[1.4] tracking-[0.05em] font-semibold text-text-muted uppercase bg-surface-container px-2 py-0.5 rounded">
            Crop: Tomato
          </span>
        </div>
        
        <div className="flex items-center gap-4 bg-surface-low p-2 rounded">
          <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-surface-high relative">
            <Image 
              src="/images/landing/hero-leaf.jpg" 
              alt="Leaf preview specimen showing symptomatic discoloration" 
              width={64} 
              height={64} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-body text-[14px] leading-[1.2] font-semibold text-text truncate">
              Example diagnosis
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 bg-surface-high h-1.5 rounded-full overflow-hidden" role="progressbar" aria-valuenow={88} aria-valuemin={0} aria-valuemax={100} aria-label="Diagnostic confidence">
                <div className="bg-primary h-full rounded-full w-[88%]"></div>
              </div>
              <span className="font-body text-[13px] leading-[1.5] text-text-muted font-medium">
                88% confidence
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-body text-[12px] leading-[1.3] font-semibold text-primary">
            Why this result?
          </span>
          <p className="font-body text-[13px] leading-[1.5] text-text-muted leading-relaxed">
            Plain, clear explanation of observed foliar discoloration along leaf margins.
          </p>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <span className="font-body text-[12px] leading-[1.3] font-semibold text-text">
            Symptoms
          </span>
          <ul className="flex flex-col gap-1 text-text-muted font-body text-[13px] leading-[1.5]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true"></span>
              <span>Visible marginal yellowing</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true"></span>
              <span>Localized spotting</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true"></span>
              <span>Intact midrib structure</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-surface-low p-2 rounded flex flex-col gap-1 border border-surface-container">
          <span className="font-body text-[12px] leading-[1.3] font-semibold text-text">
            Management
          </span>
          <p className="font-body text-[13px] leading-[1.5] text-text-muted leading-relaxed">
            Monitor surrounding plants, inspect lower foliage, avoid overhead watering, and consult a local agricultural extension service.
          </p>
        </div>
      </div>
    </section>
  );
}

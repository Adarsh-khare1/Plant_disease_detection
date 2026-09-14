export default function PrinciplesSection() {
  const principles = [
    {
      title: "Clear",
      subtitle: "Results should be understandable rather than technically overwhelming.",
      desc: "Designed for immediate comprehension in the field without confusing jargon."
    },
    {
      title: "Evidence-oriented",
      subtitle: "The system is designed around image analysis, measurable confidence, and documented information.",
      desc: "Grounded in observable symptoms and agricultural extension references."
    },
    {
      title: "Built to evolve",
      subtitle: "The diagnostic pipeline can improve as better preprocessing and machine-learning models are introduced.",
      desc: "Continuously refined as agricultural datasets grow."
    }
  ];

  return (
    <section className="w-full flex flex-col mb-10" id="principles">
      <div className="flex flex-col mb-4">
        <h2 className="font-display text-[22px] sm:text-[26px] font-medium leading-[1.3] sm:leading-[1.25] text-text tracking-tight">
          Principles of agricultural diagnostic rigor.
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {principles.map((p, idx) => (
          <div key={idx} className="bg-surface-low p-4 rounded-lg border border-surface-container flex flex-col gap-1">
            <h3 className="font-display text-[16px] leading-[1.4] text-primary font-semibold">
              {p.title}
            </h3>
            <p className="font-body text-[15px] leading-[1.55] text-text font-medium mt-0.5">
              {p.subtitle}
            </p>
            <p className="font-body text-[13px] leading-[1.5] text-text-muted leading-relaxed mt-0.5">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

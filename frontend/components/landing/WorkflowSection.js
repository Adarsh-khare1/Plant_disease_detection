export default function WorkflowSection() {
  const steps = [
    {
      num: "01",
      title: "Capture: Take a clear image of the leaf.",
      desc: "Focus on symptomatic areas under natural field daylight."
    },
    {
      num: "02",
      title: "Check: PlantDx checks whether the image is suitable for analysis.",
      desc: "Evaluates image clarity, lighting, and leaf coverage."
    },
    {
      num: "03",
      title: "Analyze: The system analyzes visual characteristics of the leaf.",
      desc: "Examines foliar patterns, lesion margins, and discoloration."
    },
    {
      num: "04",
      title: "Understand: Review the result, confidence, symptoms, and guidance.",
      desc: "Clear diagnostic findings with practical next steps."
    }
  ];

  return (
    <section className="w-full flex flex-col mb-10" id="how-it-works">
      <div className="flex flex-col mb-6">
        <h2 className="font-display text-[22px] sm:text-[26px] font-medium leading-[1.3] sm:leading-[1.25] text-text tracking-tight">
          From leaf image to useful insight.
        </h2>
      </div>
      <div className="flex flex-col divide-y divide-surface-high border-y border-surface-high">
        {steps.map((step) => (
          <div key={step.num} className="py-4 flex items-start gap-4">
            <span className="font-body text-[14px] leading-[1.2] font-semibold text-outline shrink-0 mt-0.5">
              {step.num}
            </span>
            <div className="flex flex-col">
              <h3 className="font-display text-[16px] leading-[1.4] text-text font-semibold">
                {step.title}
              </h3>
              <p className="font-body text-[13px] leading-[1.5] text-text-muted mt-1">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

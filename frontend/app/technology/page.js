import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function TechnologyPage() {
  const dspSteps = [
    { name: '1. RGB Input', desc: 'Acquire high-resolution 3-channel color leaf image.' },
    { name: '2. HSV Conversion', desc: 'Transform RGB color space into Hue, Saturation, and Value representation.' },
    { name: '3. Saturation Channel Extraction', desc: 'Extract S-channel to maximize contrast between organic foliage and neutral backgrounds.' },
    { name: '4. Gaussian Blur', desc: 'Apply Gaussian spatial smoothing filter to suppress high-frequency image noise.' },
    { name: '5. Otsu Thresholding', desc: 'Compute optimal global threshold to segment leaf foreground from background.' },
    { name: '6. Morphological Operations', desc: 'Apply morphological closing/opening to fill intra-leaf holes and clean mask margins.' },
    { name: '7. Connected Components', desc: 'Identify primary leaf contour bounding box and remove extraneous background artifacts.' },
    { name: '8. Foreground Masking', desc: 'Apply binary mask back onto original RGB channels to isolate clean leaf tissue.' },
    { name: '9. Crop & Resize Transform', desc: 'Crop tightly around leaf bounding box and resize to fixed input dimensions.' },
    { name: '10. Pre-normalization Output', desc: 'Pass preprocessed RGB leaf tensor to hierarchical neural network adapters.' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-12">
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">
            Technical Architecture
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            System technology & computer vision architecture
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            Detailed breakdown of PlantDx&apos;s product quality gate, deterministic digital signal processing (DSP), and hierarchical deep learning pipeline architecture.
          </p>
        </div>

        {/* System Architecture Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Gate 1</span>
            <h3 className="font-serif text-lg font-bold text-stone-900">Product Quality Gate</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Evaluates incoming photographs for resolution, sharpness, blur, and exposure prior to ML pipeline execution. Prevents uninformative, blurry, or overexposed uploads from generating unreliable predictions.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Gate 2</span>
            <h3 className="font-serif text-lg font-bold text-stone-900">Deterministic DSP Preprocessing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Classical computer vision pipeline converting raw RGB input into clean, background-subtracted foreground leaf crops prior to model input tensor normalization.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Gate 3</span>
            <h3 className="font-serif text-lg font-bold text-stone-900">Hierarchical ML Inference</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Structured multi-stage inference: Model 1 verifies leaf presence, Model 2 classifies crop species (Tomato vs. Potato), and Model 3/4 predicts condition status.
            </p>
          </div>
        </div>

        {/* Deterministic DSP Breakdown */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Deterministic DSP Preprocessing Sequence
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Exact mathematical sequence applied to convert raw photographs into normalized model inputs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {dspSteps.map((step) => (
              <div key={step.name} className="p-3 bg-stone-50 border border-stone-200 rounded space-y-1">
                <p className="font-bold text-stone-900 font-mono text-[11px]">{step.name}</p>
                <p className="text-stone-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Future Work & Technical Disclaimer */}
        <div className="bg-stone-100 border border-stone-200 rounded-lg p-6 space-y-3 text-xs text-stone-700 leading-relaxed">
          <h3 className="font-serif text-base font-bold text-stone-900">Future Work & Technical Transparency</h3>
          <p>
            • <strong>Model Readiness Notice:</strong> Model checkpoints and PyTorch inference pipelines are currently under active engineering and validation.
          </p>
          <p>
            • <strong>Explainability & Visual Heatmaps:</strong> Visual attention maps (such as Grad-CAM or SHAP regions) are planned for future backend integration and are not currently active in production inference.
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

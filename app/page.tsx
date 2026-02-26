import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

const features = [
  { icon: '🤖', title: 'AI-Guided Interview', desc: 'Answer simple questions — the AI writes the proposal content for you' },
  { icon: '👁️', title: 'Live Preview', desc: 'See your proposal take shape in real-time as you confirm each section' },
  { icon: '📄', title: 'Branded PDF', desc: 'Download a polished PDF with ArgosMob header, footer, and watermark' },
  { icon: '💾', title: 'Auto-Save', desc: 'Your progress saves automatically. Resume any time' },
];

const sections = [
  'Cover Page', 'Introduction', 'Key Modules', 'Tech Stack',
  'Delivery Components', 'Cost & Estimation', 'Proposed Team',
  'AMC', 'SLA', 'Change Request', 'Acceptance Criteria', 'Warranty', 'Legal & Sign Off',
];

export default function LandingPage() {
  return (
    <div className="min-h-full bg-[#0B1220]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#E85D2B] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AM</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">ArgosMob</div>
            <div className="text-gray-400 text-xs">Proposal Builder</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
          >
            History
          </Link>
          <Link
            href="/builder"
            className="bg-[#E85D2B] hover:bg-[#d4521f] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Create Proposal →
          </Link>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-[#E85D2B] text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-[#E85D2B] rounded-full animate-pulse" />
          Powered by Groq AI
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
          From blank page to
          <span className="text-[#E85D2B]"> polished proposal</span>
          <br />in minutes.
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Our AI interviews your sales team section by section, generates professional content,
          and exports a branded PDF — no writing skills needed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/builder"
            className="bg-[#E85D2B] hover:bg-[#d4521f] text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-[#E85D2B]/20 hover:shadow-[#E85D2B]/30"
          >
            Start Building →
          </Link>
          <a
            href="#how-it-works"
            className="border border-white/20 hover:border-white/40 text-white font-medium px-8 py-4 rounded-xl text-base transition-all"
          >
            See How It Works
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="text-white font-semibold text-sm mb-1.5">{f.title}</div>
              <div className="text-gray-400 text-xs leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div id="how-it-works" className="max-w-5xl mx-auto px-8 pb-20">
        <h2 className="text-white text-xl font-bold text-center mb-8">
          13 Professional Sections, Fully AI-Written
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {sections.map((s, i) => (
            <div
              key={s}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-300"
            >
              <span className="text-[#E85D2B] font-bold">{i + 1}.</span>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="border-t border-white/10 py-12 text-center">
        <h2 className="text-white text-2xl font-bold mb-4">Ready to impress your clients?</h2>
        <Link
          href="/builder"
          className="inline-block bg-[#E85D2B] hover:bg-[#d4521f] text-white font-bold px-10 py-4 rounded-xl text-base transition-all"
        >
          Create My Proposal →
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-8 py-5 flex items-center justify-between text-xs text-gray-500">
        <span>© 2025 ArgosMob Tech & AI Pvt. Ltd.</span>
        <a href="https://www.argosmob.in/" className="hover:text-gray-300 transition-colors">
          www.argosmob.in
        </a>
      </div>
    </div>
  );
}

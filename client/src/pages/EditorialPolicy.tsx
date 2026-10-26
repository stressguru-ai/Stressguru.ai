import SEO from "@/components/SEO";
import ScrollReveal from "@/components/oura/ScrollReveal";
import PromiseSection from "@/components/PromiseSection";
import { Link } from "wouter";

export default function EditorialPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      <SEO
        title="StressGuru Editorial Policy"
        description="See how StressGuru researches, writes, reviews, corrects, and updates wellness content, including how we use AI."
        canonicalUrl="https://stressguru.ai/editorial-policy"
        keywords={["StressGuru editorial policy", "content review process", "wellness content standards", "AI content disclosure"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Editorial Policy", url: "/editorial-policy" }
        ]}
      />

      <section className="relative pt-44 pb-16 md:pt-48 md:pb-20 overflow-hidden bg-slate-900">
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Editorial Policy</h1>
            <p className="text-xl text-white/70 leading-relaxed">
              A wellness claim can shape how you spend your time, money, and attention. This is how we research, write, review, and correct the content on StressGuru.ai.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-3xl prose prose-slate prose-lg">
          <ScrollReveal width="100%">
            <h2>Our Standards</h2>
            <p>
              When a full calendar and a short night leave little time to sort through wellness advice, clear information matters. We publish content to help you understand everyday stress and make an informed choice about StressGuru. We aim for accuracy, plain language, and honest limits.
            </p>
            <p>
              We do not publish unverified health claims, fabricated testimonials, or descriptions that overstate what StressGuru can do. StressGuru is a wellness app, not therapy, healthcare, diagnosis, treatment, crisis care, or a medical device.
            </p>

            <h2>How We Create Content</h2>
            <ol>
              <li><strong>Research:</strong> We begin with published research, professional guidance, and recognized wellness frameworks. We cite primary sources when we make factual claims.</li>
              <li><strong>Drafting:</strong> Our team may use AI tools for research, drafting, and structure. A human editor reviews and edits AI-assisted material before it is published.</li>
              <li><strong>Review:</strong> We check content for accuracy, tone, safety, and alignment with our claims register. Health-sensitive content receives an additional review for clear limits, safe wording, and source support.</li>
              <li><strong>Publication:</strong> We publish content with a visible date. When information changes, we update the content and note substantive changes.</li>
            </ol>

            <h2>How We Use AI</h2>
            <p>
              AI can help our team organize information and draft a starting point. It does not make final editorial decisions. A human editor reviews, edits, and approves AI-assisted content before publication. We do not publish raw AI output.
            </p>

            <h2>Corrections</h2>
            <p>
              An outdated or inaccurate claim can send someone in the wrong direction when she needs clear information. If you find an error, an outdated claim, or misleading wording, please <Link href="/contact" className="text-sky-700 hover:underline">contact us</Link>. We review correction requests promptly and add a visible correction note when appropriate.
            </p>

            <h2>Claims Register</h2>
            <p>
              We maintain an internal register for health, performance, security, and comparative claims on our website. Each entry includes its source, approval status, and review date. We remove or revise claims we cannot support.
            </p>

            <p className="text-sm text-slate-400 mt-12">Last updated: August 2026</p>
          </ScrollReveal>
        </div>
      </section>

      <PromiseSection />
    </div>
  );
}

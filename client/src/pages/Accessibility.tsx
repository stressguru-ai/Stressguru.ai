import SEO from "@/components/SEO";
import ScrollReveal from "@/components/oura/ScrollReveal";
import PromiseSection from "@/components/PromiseSection";
import { Link } from "wouter";

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      <SEO
        title="StressGuru Accessibility"
        description="Learn about StressGuru's accessibility work, current support, known limitations, and how to report an access barrier."
        canonicalUrl="https://stressguru.ai/accessibility"
        keywords={["StressGuru accessibility", "accessible wellness app", "screen reader support", "WCAG accessibility"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Accessibility", url: "/accessibility" }
        ]}
      />

      <section className="relative pt-44 pb-16 md:pt-48 md:pb-20 overflow-hidden bg-slate-900">
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Accessibility</h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Access needs should not cost you time or control. See the accessibility support we provide, the gaps we are working on, and how to tell us what needs attention.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-3xl prose prose-slate prose-lg">
          <ScrollReveal width="100%">
            <h2>Our Commitment</h2>
            <p>
              A five-minute wellness check-in should not become a frustrating task because you use a keyboard, screen reader, voice control, or reduced motion. We are working to make the StressGuru website and app usable for more people and to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
            </p>

            <h2>What We Build For</h2>
            <ul>
              <li>Semantic HTML and a clear heading order that help people navigate with assistive technology</li>
              <li>Keyboard navigation across the website</li>
              <li>Visible focus indicators for interactive elements</li>
              <li>Color contrast that supports readable text and controls</li>
              <li>Descriptive alt text for informational images</li>
              <li>Form labels and error messages designed to work with screen readers</li>
              <li>Reduced-motion support for people who prefer less animation</li>
              <li>Responsive layouts that work across devices and screen sizes</li>
            </ul>

            <h2>Known Limitations</h2>
            <p>
              An access barrier can turn a simple task into extra work when you already have a meeting to join, a family need to answer, or a train to catch. We are improving the website and app. Current areas of work include:
            </p>
            <ul>
              <li>Some older content may not yet have complete alt text descriptions.</li>
              <li>Complex interactive elements may have limited screen reader support.</li>
              <li>Third-party embedded content may not meet our accessibility standards.</li>
            </ul>

            <h2>Report an Accessibility Barrier</h2>
            <p>
              If you encounter a barrier on our website or in our app, please <Link href="/contact" className="text-sky-700 hover:underline">contact us</Link>. Tell us what you were trying to do, the device or assistive technology you used, and what got in the way. We review accessibility feedback and work to address issues as quickly as possible.
            </p>

            <p className="text-sm text-slate-400 mt-12">Last updated: August 2026</p>
          </ScrollReveal>
        </div>
      </section>

      <PromiseSection />
    </div>
  );
}

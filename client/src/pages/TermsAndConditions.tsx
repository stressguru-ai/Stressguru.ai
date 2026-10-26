import React from 'react';
import SEO from "@/components/SEO";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white pt-40 md:pt-40 pb-16">
      <SEO 
        title="Terms and Conditions | StressGuru"
        canonicalUrl="https://stressguru.ai/terms-and-conditions"
        description="Read the Terms and Conditions for using StressGuru's website, iPhone app, Apple Watch features, and AI wellness services."
        keywords={["terms and conditions", "StressGuru terms", "user agreement", "service terms", "legal terms"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Terms and Conditions", url: "/terms-and-conditions" }
        ]}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">Terms and Conditions</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-6">
            PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY. BY USING THE STRESSGURU WEBSITE, IPHONE APPLICATION ("STRESSGURU"), APPLE WATCH FEATURES, OR SERVICES, YOU ACCEPT THIS LEGALLY BINDING AGREEMENT.
          </p>

          <p>
            These Terms and Conditions incorporate our <a href="/privacy-policy" className="text-brand-primary hover:underline">Privacy Policy</a>. Please review it carefully. If you do not agree to these Terms and Conditions, you may not use or purchase the StressGuru App or Services.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-red-700 mb-3">IMPORTANT WARNINGS: FOR EMERGENCIES &amp; MEDICAL ADVICE</h3>
            <p className="text-red-700 font-semibold mb-3">
              IF YOU ARE EXPERIENCING A MEDICAL OR MENTAL HEALTH EMERGENCY, OR ARE CONSIDERING HARMING YOURSELF OR OTHERS, IMMEDIATELY CALL 988 OR 911 IN THE USA OR YOUR LOCAL EMERGENCY SERVICES NUMBER IN THE COUNTRY WHERE YOU ARE.
            </p>
            <p className="text-gray-700 mb-3">
              StressGuru is an AI wellness tool. It is not a crisis response service.
            </p>
            <p className="text-gray-700 mb-3">
              STRESSGURU DOES NOT PROVIDE MEDICAL ADVICE OR CLINICAL DIAGNOSES. The StressGuru App and its AI wellness personas ("Gurus") are for mental wellness and self-help purposes only. All Gurus are AI wellness personas. StressGuru is not therapy, a healthcare provider, a medical device, a diagnostic tool, or crisis care. It does not create a doctor-patient relationship and is not a substitute for professional medical advice, diagnosis, or treatment from a qualified human provider, such as a psychiatrist, psychologist, therapist, or physician. StressGuru does not prescribe pharmaceutical or other medications.
            </p>
            <p className="text-gray-700">
              Do not use StressGuru for clinical diagnoses, prescribed treatment plans, or official medical documentation, including court-ordered therapy verification, medical letters, or certifications. Disregard any StressGuru information that could be interpreted as medical, pharmaceutical, or clinical advice. Do not disregard or delay seeking professional medical advice because of information received through StressGuru, including if your symptoms worsen or you see no progress in your conditions.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. THE NATURE OF AN AI GURU &amp; YOUR ROLE IN USING IT SAFELY</h3>
          <p>You understand and acknowledge that StressGuru features use artificial intelligence through the "AI Gurus." All Gurus are AI wellness personas. This technology has limits you must understand to use the Service safely and effectively.</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Not Human:</strong> An AI Guru is software, not a person. It cannot fully understand emotions or verbal and non-verbal cues with the nuance of a human professional. It has no consciousness, feelings, or relatable experiences.</li>
            <li><strong>Potential for Inaccuracies:</strong> An AI Guru generates responses from patterns and probabilities in available data. Its responses may be inaccurate, irrelevant, nonsensical, inappropriate, or reflect limitations and biases. Treat outputs as suggestions for reflection, not factual truth.</li>
            <li><strong>No Therapeutic Relationship:</strong> Your interaction with an AI Guru does not create a therapist-patient, doctor-patient, confidential, privileged, or other professional relationship. The legal and ethical duties of licensed mental health providers do not apply to the Service.</li>
            <li><strong>Your Responsibility:</strong> You agree to use StressGuru as a wellness tool, like an interactive self-help resource. You are solely responsible for using your own judgment and seeking help from qualified human professionals for serious issues.</li>
            <li><strong>Not a Crisis Service:</strong> StressGuru is not designed for emergency support or suicide crisis intervention.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. USER ELIGIBILITY AND RESPONSIBILITIES</h3>
          <p><strong>Adults Only (18+):</strong> The Service is only for users who are at least 18 years old. By using the Service, you represent and warrant that you are 18+.</p>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Provide accurate information when requested.</li>
            <li>Use the Service only for lawful purposes.</li>
            <li>Not use the Service in a way that harms others or violates these Terms.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. YOUR ACCOUNT INFORMATION</h3>
          <p>StressGuru offers personalized content and experiences. When you create an account ("Account"), we may request certain information described in our <a href="/privacy-policy" className="text-brand-primary hover:underline">Privacy Policy</a> ("Account Information").</p>
          <p>You are responsible for:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Keeping your login credentials confidential.</li>
            <li>All activities under your Account.</li>
            <li>Making sure the information you provide is accurate. AI output quality may depend on your input.</li>
          </ul>
          <p>You must notify us immediately of any unauthorized use of your Account.</p>
          <p><strong>Account Deletion:</strong> You may delete your account using tools within the Service, subject to legal limitations, such as legal requests or investigations.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. INTELLECTUAL PROPERTY AND LIMITED LICENSE</h3>
          <p>This Site, App, and Services, including their content, branding, AI experiences, text, graphics, interfaces, code, designs, look-and-feel, and related materials (collectively, "Materials"), are protected by intellectual property laws.</p>
          <p>All StressGuru trademarks, logos, slogans, and brand features are owned by or licensed to us ("Trademarks"). We reserve all rights not expressly granted.</p>
          <p><strong>Limited License:</strong> Subject to these Terms, we grant you a limited, revocable, non-transferable, non-sublicensable, non-exclusive license to access and use the Service for personal, non-commercial use.</p>
          <p>You may not:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Copy, reproduce, distribute, modify, or create derivative works from the Materials;</li>
            <li>Reverse engineer, decompile, or attempt to discover source code or underlying systems;</li>
            <li>Use the Materials for public or commercial purposes without written permission.</li>
          </ul>
          <p><strong>Third-Party Content:</strong> The Service may display or link to third-party materials ("Third-Party Content"). We do not control or accept responsibility for Third-Party Content. You access it at your own risk.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. FEEDBACK</h3>
          <p>We welcome feedback, comments, questions, and suggestions ("Feedback"). By submitting Feedback, you represent that:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>You have the right to provide it;</li>
            <li>It does not infringe others' rights;</li>
            <li>It does not contain confidential or proprietary third-party information.</li>
          </ul>
          <p>By providing Feedback, you agree that:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>We are not required to keep it confidential;</li>
            <li>We may use it without compensation;</li>
            <li>You grant us a perpetual, worldwide, royalty-free license to use, modify, publish, distribute, and create derivative works from the Feedback.</li>
          </ul>
          <p>This Feedback section survives termination of your Account.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. RESTRICTIONS AND PROHIBITED USES</h3>
          <p>In addition to other prohibitions in these Terms, you may not use the Service:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>For an unlawful purpose;</li>
            <li>To violate regulations, laws, or ordinances;</li>
            <li>To infringe intellectual property rights;</li>
            <li>To harass, abuse, defame, intimidate, or discriminate;</li>
            <li>To collect or store Personal Information about other users;</li>
            <li>To submit false or misleading information;</li>
            <li>To reverse engineer, decompile, disassemble, "jailbreak," or try to discover source code or underlying algorithms;</li>
            <li>To scrape or extract data with automated systems;</li>
            <li>To evade filters, safety systems, or rate limits;</li>
            <li>To transmit malware, viruses, or destructive code;</li>
            <li>To impersonate others or misrepresent your identity;</li>
            <li>To interfere with security features or Service operations.</li>
          </ul>
          <p>We may deny access or terminate your use at our sole discretion, and we may report suspected illegal activity to the appropriate authorities.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. DATA PRIVACY IN AI TRAINING AND RESEARCH</h3>
          <p>Our collection and use of your information are described in our <a href="/privacy-policy" className="text-brand-primary hover:underline">Privacy Policy</a>.</p>
          <p><strong>Data training and sharing:</strong></p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>We do not use user data to train AI models.</li>
            <li>We do not sell user data. We may share it in the limited situations described in our Privacy Policy.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. WEARABLE &amp; VITALS DATA (APPLE HEALTH / APPLE WATCH)</h3>
          <p>If you grant permission, StressGuru may sync wellness signals and values from Apple Health and Apple Watch, including heart rate, HRV, respiratory rate, sleep, steps, motion, and related metrics.</p>
          <p>You acknowledge:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Apple Health or your device provides these values.</li>
            <li>We do not provide medical interpretations or clinical conclusions.</li>
            <li>You can withdraw permissions at any time in your device settings.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. SUBSCRIPTIONS AND PAYMENTS</h3>
          <p>We offer free and paid subscription plans. Paid plans are available within the StressGuru App and may change. You are responsible for tracking changes to plans and their prices.</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Automatic Renewal:</strong> Unless you cancel before the end of the current billing period, your subscription automatically renews and we charge your payment method.</li>
            <li><strong>Cancellation:</strong> You may cancel your subscription at any time through the platform you used to subscribe, such as the Apple App Store. Cancellation takes effect at the end of the current billing period.</li>
            <li><strong>No Partial Refunds:</strong> Unless applicable law requires otherwise or we state otherwise at purchase, we do not provide refunds for partial subscription periods.</li>
            <li><strong>Price Changes:</strong> We may change prices with reasonable advance notice as required by applicable law and platform rules.</li>
          </ul>

          <div className="border-t border-gray-200 mt-12 pt-8">
            <p className="text-sm text-gray-500">
              For questions or comments about these Terms and Conditions, email us at <a href="mailto:support@stressguru.ai" className="text-brand-primary hover:underline">support@stressguru.ai</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

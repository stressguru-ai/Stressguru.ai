import React from 'react';
import SEO from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-40 md:pt-40 pb-16">
      <SEO 
        title="Privacy Policy | StressGuru"
        canonicalUrl="https://stressguru.ai/privacy-policy"
        description="Read how StressGuru collects, uses, and handles personal information and HealthKit Data."
        keywords={["privacy policy", "data protection", "StressGuru privacy", "health data security"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy-policy" }
        ]}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="font-bold">Effective Date: October 02, 2025</p>

          <p>
            This Privacy Policy ("Policy") explains how and why StressGuru ("Company," "we," "us," or "our") may process your Personal Information when you use our services ("Services"), including when you:
          </p>

          <ul className="list-disc pl-6 mb-6">
            <li>Visit <a href="https://www.stressguru.ai" className="text-brand-primary hover:underline">www.stressguru.ai</a> or another website of ours that links to this Policy.</li>
            <li>Download or use the StressGuru mobile application or another application of ours that links to this Policy.</li>
            <li>Use StressGuru, an iPhone and Apple Watch wellness app. StressGuru uses artificial intelligence and Apple Watch data to provide wellness insights and AI wellness support on your mobile device. It is not therapy, a healthcare provider, a medical device, a diagnostic tool, or crisis care.</li>
            <li>Interact with us in other related ways, including sales, marketing, or events.</li>
          </ul>

          <p>
            This Policy explains our practices for collecting, using, and disclosing information that can identify you ("Personal Information"). You may use the Services only if you accept this Policy. If you do not agree to its terms, do not use the Services.
          </p>

          <p>
            For questions or concerns about this Policy, contact our Data Protection Officer at <a href="mailto:support@stressguru.ai" className="text-brand-primary hover:underline">support@stressguru.ai</a>.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">SUMMARY OF KEY POINTS</h3>
          <p>This summary highlights key points in this Privacy Policy. Please read the full Policy for complete details.</p>
          
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>What Personal Information do we process?</strong> When you visit, use, or navigate the Services, we may process Personal Information based on how you interact with us, the choices you make, and the features you use.</li>
            <li><strong>Do we process Sensitive Personal Information?</strong> We may process sensitive personal information when necessary, with your consent or as applicable law otherwise allows.</li>
            <li><strong>How do we process your information?</strong> We process your information to provide, improve, and administer the Services; communicate with you; prevent fraud and support security; and comply with legal obligations.</li>
            <li><strong>With which parties do we share Personal Information?</strong> We do not sell your personal information. We may share information in limited situations, including a business transfer or with affiliates, as described below.</li>
            <li><strong>How is your information secured?</strong> We use organizational and technical processes and procedures designed to protect your Personal Information.</li>
            <li><strong>What are your rights?</strong> Depending on where you live, privacy law may give you rights regarding your Personal Information.</li>
            <li><strong>How can you exercise your rights?</strong> You can submit a request through our official channels or contact us directly.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">TABLE OF CONTENTS</h3>
          <ol className="list-decimal pl-6 mb-6 space-y-1">
            <li>Information We Collect</li>
            <li>How We Process Your Information</li>
            <li>Legal Bases for Processing Your Information</li>
            <li>When and With Whom We Share Your Personal Information</li>
            <li>Use of Cookies and Other Tracking Technologies</li>
            <li>Artificial Intelligence-Based Products</li>
            <li>Social Logins</li>
            <li>Data Retention</li>
            <li>Information Security</li>
            <li>Collection of Information from Minors</li>
            <li>Your Privacy Rights</li>
            <li>Controls for Do-Not-Track Features</li>
            <li>United States Residents' Specific Privacy Rights</li>
            <li>Amendments to This Policy</li>
            <li>Contact Information</li>
            <li>Reviewing, Updating, or Deleting Your Data</li>
          </ol>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. INFORMATION WE COLLECT</h3>
          <p className="italic mb-4">In Short: We collect Personal Information you choose to provide.</p>
          <p>We collect Personal Information you provide when you register for the Services, express interest in our products, take part in activities on the Services, or otherwise contact us. The Personal Information we collect may include:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Telephone Number</li>
            <li>Username and Password</li>
            <li>Date of Birth and Gender</li>
          </ul>

          <p><strong>Sensitive Information.</strong> With your explicit consent and as applicable law allows, we process the following category of sensitive information:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Health Data:</strong> With your express permission, we access specific health-related data points from the Apple Health application ("HealthKit") on your device. This data is limited to metrics such as heart rate, sleep patterns, and physical activity levels ("HealthKit Data").</li>
          </ul>

          <p><strong>Application Data.</strong> If you use our Application, we may collect the following information if you grant access or permission:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Apple HealthKit Access:</strong> We will ask for your permission to read specific HealthKit Data. The Application is designed only to interact with Apple's HealthKit framework. This version does not support other third-party health platforms or wearable devices.</li>
            <li><strong>Push Notifications:</strong> We may ask for your permission to send push notifications about your account or Application features. You may withdraw this permission at any time in your device settings.</li>
          </ul>
          <p>You must provide Personal Information that is true, complete, and accurate, and you must tell us about any changes to it.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. HOW WE PROCESS YOUR INFORMATION</h3>
          <p className="italic mb-4">In Short: We process your information to provide, improve, and administer the Services; communicate with you; prevent fraud and support security; and comply with law.</p>
          <p>We process your Personal Information for legitimate business purposes, including:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>To create, authenticate, and manage accounts.</li>
            <li>To provide the Services. This includes processing your HealthKit Data to provide wellness insights and support your interactions with our AI wellness persona features.</li>
            <li>To evaluate and improve our Services, products, and your experience. We may process your information when we believe it is necessary to identify usage trends, assess campaign effectiveness, and evaluate and improve our Services, products, and your experience.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. LEGAL BASES FOR PROCESSING YOUR INFORMATION</h3>
          <p className="italic mb-4">In Short: We process your Personal Information only when we believe it is necessary and have a valid legal reason (a legal basis) under applicable law. Legal bases include your consent, compliance with law, providing services to enter into or fulfill contractual obligations, protecting your rights, and our legitimate business interests.</p>
          
          <p>This section applies if you are in Canada.</p>
          <p>We may process your information when you give us specific permission (express consent) to use it for a specific purpose, or when your permission can be inferred (implied consent). You can withdraw your consent at any time.</p>
          <p>In exceptional cases, applicable law may permit us to process your information without your consent, including:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>When collection is clearly in an individual's interests and consent cannot be obtained in a timely way.</li>
            <li>For investigations and fraud detection and prevention.</li>
            <li>For business transactions when certain conditions are met.</li>
            <li>When information is in a witness statement and collection is necessary to assess, process, or settle an insurance claim.</li>
            <li>To identify injured, ill, or deceased persons and communicate with next of kin.</li>
            <li>When we have reasonable grounds to believe an individual has been, is, or may be a victim of financial abuse.</li>
            <li>When it is reasonable to expect that collection and use with consent would compromise the availability or accuracy of the information, and collection is reasonable for investigating a breach of an agreement or a violation of Canadian federal or provincial law.</li>
            <li>When disclosure is required to comply with a subpoena, warrant, court order, or rules of court related to producing records.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. WHEN AND WITH WHOM WE SHARE YOUR PERSONAL INFORMATION</h3>
          <p className="italic mb-4">In Short: We may share information in the situations described in this section and/or with the following third parties.</p>
          <p>We may need to share your Personal Information in the following situations:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or while negotiating, a merger, sale of company assets, financing, or acquisition of all or part of our business by another company.</li>
            <li><strong>Affiliates.</strong> We may share your information with our affiliates. We will require them to honor this Privacy Policy. Affiliates include our parent company, subsidiaries, joint venture partners, and other companies we control or that are under common control with us.</li>
            <li><strong>Business Partners.</strong> We may share your information with business partners to offer certain products, services, or promotions.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. USE OF COOKIES AND OTHER TRACKING TECHNOLOGIES</h3>
          <p className="italic mb-4">In Short: We may use cookies and other tracking technologies to collect and store your information.</p>
          <p>We may use cookies and similar tracking technologies, such as web beacons and pixels, to access or store information. Our Cookie Notice explains how we use these technologies and how you can refuse certain cookies.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. ARTIFICIAL INTELLIGENCE-BASED PRODUCTS</h3>
          <p>Our Services use artificial intelligence ("AI"), including large language models, for personalized wellness features. All Gurus are AI wellness personas. When you interact with AI features:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Data Processing:</strong> Our AI models process your inputs, including text and voice, and relevant HealthKit Data to generate responses and insights.</li>
            <li><strong>No Human Review:</strong> We monitor system performance, but our personnel do not routinely review your specific AI conversations unless needed for safety, legal compliance, or system improvement, with anonymization where possible.</li>
            <li><strong>Accuracy:</strong> AI-generated content may not always be accurate. Do not rely on our AI as a substitute for professional medical advice, diagnosis, or treatment.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. SOCIAL LOGINS</h3>
          <p className="italic mb-4">In Short: If you choose to register or log in using a social media account, we may access certain information about you.</p>
          <p>Our Services let you register and log in with a third-party social media account, such as Facebook or Google. If you do, we receive certain profile information from that provider. The information we receive varies by provider, but often includes your name, email address, friends list, profile picture, and other information you choose to make public on that social media platform.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. DATA RETENTION</h3>
          <p className="italic mb-4">In Short: We keep your information as long as needed for the purposes in this Privacy Policy, unless law requires otherwise.</p>
          <p>We keep your Personal Information only as long as needed for the purposes in this Privacy Policy, unless a longer period is required or permitted by law, such as for tax, accounting, or other legal requirements. No purpose in this Policy requires us to keep your Personal Information longer than the time you have an account with us.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. INFORMATION SECURITY</h3>
          <p className="italic mb-4">In Short: We aim to protect your Personal Information through organizational and technical security measures.</p>
          <p>We have implemented appropriate and reasonable technical and organizational security measures designed to protect the Personal Information we process. However, no internet transmission or information storage technology is guaranteed to be 100% secure. We cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not defeat our security and improperly collect, access, steal, or modify your information.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. COLLECTION OF INFORMATION FROM MINORS</h3>
          <p className="italic mb-4">In Short: We do not knowingly collect data from or market to children under 18 years of age.</p>
          <p>We do not knowingly solicit data from or market to children under 18. By using the Services, you represent that you are at least 18 or that you are a parent or guardian who consents to a minor dependent's use of the Services. If we learn that we collected Personal Information from a user under 18, we will deactivate the account and take reasonable steps to promptly delete that data from our records.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. YOUR PRIVACY RIGHTS</h3>
          <p className="italic mb-4">In Short: In some regions, including Canada, you have rights that give you greater access to and control over your Personal Information. You may review, change, or terminate your account at any time.</p>
          <p>In some regions, including Canada, applicable data protection laws give you certain rights. These may include the right to (i) request access to and a copy of your Personal Information, (ii) request correction or deletion, (iii) restrict processing of your Personal Information, and (iv) where applicable, data portability. In some circumstances, you may also object to processing of your Personal Information. You can make a request using the contact details in the "CONTACT INFORMATION" section below.</p>
          <p>We will consider and act on each request under applicable data protection laws.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. CONTROLS FOR DO-NOT-TRACK FEATURES</h3>
          <p>Most web browsers, some mobile operating systems, and some mobile applications include a Do-Not-Track ("DNT") feature or setting. You can use it to signal that you do not want your online browsing activity monitored or collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. Therefore, we do not currently respond to DNT browser signals or other mechanisms that automatically communicate your choice not to be tracked online.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. UNITED STATES RESIDENTS' SPECIFIC PRIVACY RIGHTS</h3>
          <p className="italic mb-4">In Short: California, Colorado, Connecticut, Utah, and Virginia residents have specific rights to access their Personal Information.</p>
          <p><strong>California Residents:</strong> California Civil Code Section 1798.83, also known as the "Shine The Light" law, lets California residents request and receive, once each year and free of charge, information about categories of personal information, if any, that we disclosed to third parties for direct marketing purposes. They may also request the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and want to make this request, submit it in writing using the contact information below.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. AMENDMENTS TO THIS POLICY</h3>
          <p className="italic mb-4">In Short: We will update this Policy as needed to comply with relevant laws.</p>
          <p>We may update this Privacy Policy from time to time. The updated version will show a revised date and will take effect as soon as it is accessible. If we make material changes, we may notify you by prominently posting a notice or sending you a notification directly. Review this Privacy Policy often to stay informed about how we protect your information.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. CONTACT INFORMATION</h3>
          <p>If you have questions or comments about this Policy, contact our Data Protection Officer (DPO) by email at <a href="mailto:support@stressguru.ai" className="text-brand-primary hover:underline">support@stressguru.ai</a>.</p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">16. REVIEWING, UPDATING, OR DELETING YOUR DATA</h3>
          <p>Depending on the laws in your country, you may have the right to request access to the Personal Information we collect, change that information, or delete it. To request a review, update, or deletion of your Personal Information, email <a href="mailto:support@stressguru.ai" className="text-brand-primary hover:underline">support@stressguru.ai</a>.</p>
        </div>
      </div>
    </div>
  );
}

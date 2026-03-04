import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-fluid py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Terms and Conditions
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-10">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  By accessing and using StocksOcean ("the Platform", "we", "us", "our"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use the Platform.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Website Usage Terms</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.1 Eligibility</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You must be at least 18 years old to use this Platform. By using the Platform, you represent and warrant that you are of legal age to form a binding contract.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.2 Account Registration</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You agree to provide accurate, current, and complete information during registration</li>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.3 Prohibited Activities</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon intellectual property rights</li>
                  <li>Upload malicious code, viruses, or harmful software</li>
                  <li>Attempt to gain unauthorized access to the Platform</li>
                  <li>Interfere with or disrupt the Platform's operation</li>
                  <li>Use automated systems to access the Platform without authorization</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect user information without consent</li>
                </ul>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Subscription Billing</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.1 Subscription Plans</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The Platform offers subscription plans with monthly and yearly billing cycles. Subscription fees are charged in advance for the selected billing period.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.2 First-Month Discounts</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Special promotional pricing may be offered for the first month of subscription. After the promotional period, standard subscription rates apply automatically.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.3 Billing Cycle</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Monthly subscriptions: Charged on the same date each month</li>
                  <li>Yearly subscriptions: Charged annually on the anniversary of your subscription start date</li>
                  <li>All fees are non-refundable except as required by law or as specified in our <a href="/refund" className="text-blue-600 dark:text-blue-400 hover:underline">Refund Policy</a></li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.4 Price Changes</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We reserve the right to modify subscription pricing at any time. Price changes will be communicated to subscribers at least 30 days in advance. Continued use of the Platform after price changes constitutes acceptance of the new pricing.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.5 Payment Processing</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Payments are processed through 2Checkout (Verifone), a third-party payment processor. By subscribing, you agree to their terms of service and privacy policy.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Download Limits and Fair Use</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.1 Download Limits</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Subscription plans include specific download limits per billing period. These limits are based on your subscription tier, reset at the beginning of each billing cycle, and are non-transferable and non-refundable.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.2 Fair Use Policy</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Downloads are intended for personal and commercial use within the scope of your subscription</li>
                  <li>Excessive downloading that exceeds normal usage patterns may result in account review</li>
                  <li>We reserve the right to limit or suspend accounts that violate fair use policies</li>
                  <li>Download limits are enforced to ensure equitable access for all subscribers</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.3 Unused Downloads</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Unused downloads do not roll over to the next billing period. Download limits reset at the start of each new billing cycle.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Digital Delivery</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.1 Delivery Method</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  All digital assets are delivered electronically through the Platform. No physical products are shipped.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.2 Access</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Upon successful payment, you gain immediate access to download assets according to your subscription plan's terms and download limits.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">6. License Terms</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.1 Royalty-Free Commercial License</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Subject to your subscription and these Terms, you are granted a non-exclusive, worldwide, royalty-free license to use downloaded assets for commercial and personal purposes.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.2 Permitted Uses</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">You may:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Use assets in commercial projects, including advertising, marketing, and promotional materials</li>
                  <li>Modify, adapt, and create derivative works from assets</li>
                  <li>Use assets in digital and print media</li>
                  <li>Use assets in products for resale (subject to restrictions in Section 6.3)</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.3 Prohibited Uses</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">You may NOT:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Resell, redistribute, or sublicense assets as standalone files</li>
                  <li>Use assets in ways that violate applicable laws</li>
                  <li>Use assets to create competing stock asset services</li>
                  <li>Use assets containing identifiable persons in ways that suggest endorsement without consent</li>
                  <li>Use assets in defamatory, obscene, or illegal content</li>
                  <li>Remove copyright notices or metadata from assets</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.4 AI-Generated Content</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Assets may include AI-generated content. You acknowledge that AI-generated content may not be eligible for copyright protection in some jurisdictions, and you are responsible for ensuring your use complies with applicable laws.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Intellectual Property Ownership</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  All Platform content, design, functionality, and intellectual property are owned by StocksOcean or its licensors. Contributors retain ownership of their uploaded assets. By downloading assets, you receive a license to use them, not ownership.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Contributor Uploads and Responsibilities</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Contributors must ensure uploaded content is original or properly licensed, does not infringe upon third-party rights, complies with Platform content guidelines, and meets technical quality standards. Contributors are solely responsible for their uploaded content and any claims arising from its use.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Royalty System</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Contributors earn royalties based on the number of downloads of their assets and their contributor level (Bronze: 40%, Silver: 45%, Gold: 50%, Platinum: 55% of asset price per download). We reserve the right to modify royalty rates with 30 days' notice.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Account Suspension and Termination</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or fail to pay subscription fees. You may cancel your subscription at any time, with cancellation taking effect at the end of your current billing period.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, STOCKSOCEAN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Indemnification</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You agree to indemnify, defend, and hold harmless StocksOcean, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from your use of the Platform, violation of these Terms, or violation of any third-party rights.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">13. Governing Law</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  These Terms are governed by and construed in accordance with applicable laws. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">14. Changes to Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time. Material changes will be communicated to users via email or Platform notification. Continued use of the Platform after changes constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">15. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  For questions about these Terms, please contact us:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>StocksOcean</strong><br />
                  Email: legal@stocksocean.com<br />
                  Website: https://stocksocean.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


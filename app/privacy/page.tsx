import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-fluid py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-10">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  StocksOcean ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our digital asset marketplace platform.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.1 Account Information</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">When you create an account, we collect:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Name and username</li>
                  <li>Email address</li>
                  <li>Password (encrypted)</li>
                  <li>Profile information (avatar, bio, portfolio links)</li>
                  <li>Account preferences and settings</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.2 Usage Information</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">We automatically collect information about how you use the Platform:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Pages visited and time spent on pages</li>
                  <li>Search queries and filters used</li>
                  <li>Assets viewed, downloaded, or favorited</li>
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and location data</li>
                  <li>Referral sources</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.3 Payment Information</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">For subscription and payment processing:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Billing address</li>
                  <li>Payment method details (processed securely through 2Checkout)</li>
                  <li>Transaction history</li>
                  <li>Subscription status and billing cycle information</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
                  <strong>Note:</strong> We do not store full credit card numbers. Payment processing is handled by 2Checkout (Verifone), a PCI DSS compliant payment processor.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Provide and maintain the Platform</li>
                  <li>Process subscriptions and payments</li>
                  <li>Deliver digital assets</li>
                  <li>Manage your account and preferences</li>
                  <li>Calculate and process contributor royalties</li>
                  <li>Send service-related communications</li>
                  <li>Improve Platform functionality and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Cookies and Analytics</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to remember your preferences, authenticate your account, analyze Platform usage, and provide personalized content. You can control cookies through your browser settings, though disabling certain cookies may limit Platform functionality.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Third-Party Services</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We use <strong>2Checkout (Verifone)</strong> for payment processing. When you make a payment, your payment information is transmitted securely to 2Checkout, and we receive transaction confirmations. We also use third-party services for cloud storage, email services, analytics, and customer support.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Data Protection Measures</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We implement industry-standard security measures including encryption of data in transit (SSL/TLS), encryption of sensitive data at rest, regular security assessments, access controls, and secure payment processing through PCI DSS compliant providers.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Your Rights</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Receive your data in a portable format</li>
                  <li>Object to certain types of data processing</li>
                  <li>Opt out of marketing communications</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  To exercise these rights, contact us at privacy@stocksocean.com. We will respond within 30 days.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">8. International Users</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Your information may be transferred to and processed in countries other than your country of residence. If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR). If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA).
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Our Platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. Material changes will be communicated to you via email or Platform notification. Continued use of the Platform after changes constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  For questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>StocksOcean Privacy Team</strong><br />
                  Email: privacy@stocksocean.com<br />
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


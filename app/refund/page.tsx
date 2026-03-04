import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-fluid py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Refund Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-10">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">1. General Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  StocksOcean operates as a digital asset marketplace providing subscription-based access to downloadable digital content. Due to the immediate digital delivery nature of our services, we maintain a strict no-refund policy except in limited circumstances as outlined below.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">2. No Refunds for Digital Downloads</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.1 Digital Product Nature</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  All assets available on the Platform are digital products delivered immediately upon download. Once a digital asset is downloaded, it cannot be "returned" in the traditional sense.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.2 No Refunds for Downloads</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">We do not provide refunds for:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Individual asset downloads</li>
                  <li>Assets accessed through subscription plans</li>
                  <li>Assets that have been downloaded, even if unused</li>
                  <li>Assets that do not meet your expectations</li>
                  <li>Assets that are incompatible with your intended use</li>
                </ul>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Subscription Refunds</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.1 No Refunds for Used Subscription Periods</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">Subscription fees are non-refundable once the subscription period has begun, regardless of:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Number of downloads used</li>
                  <li>Level of Platform usage</li>
                  <li>Satisfaction with available content</li>
                  <li>Technical issues resolved after subscription start</li>
                  <li>Change of mind or circumstances</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.2 Subscription Cancellation</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>You may cancel your subscription at any time</li>
                  <li>Cancellation takes effect at the end of your current billing period</li>
                  <li>No refunds are provided for the remaining subscription period</li>
                  <li>You retain access to the Platform until the end of your paid period</li>
                  <li>You may continue downloading assets within your plan limits until cancellation takes effect</li>
                </ul>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Exceptions and Refund Eligibility</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.1 Billing Errors</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">We will provide refunds for:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Duplicate charges for the same subscription</li>
                  <li>Charges for subscriptions you did not authorize</li>
                  <li>Incorrect billing amounts due to technical errors</li>
                  <li>Charges processed after account cancellation</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  To request a refund for billing errors, contact us within 30 days of the charge. Allow 5-10 business days for investigation and processing.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.2 Duplicate Charges</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  If you are charged multiple times for the same subscription, contact us immediately with transaction details. We will investigate and refund duplicate charges within 5-10 business days.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Refund Request Process</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  To request a refund for an eligible exception, contact our support team at support@stocksocean.com with your account email and transaction details. All refund requests are reviewed on a case-by-case basis, and we will respond within 5 business days. If approved, refunds are processed to the original payment method within 5-10 business days.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">6. 2Checkout (Verifone) Compliance</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  This Refund Policy complies with 2Checkout (Verifone) requirements for clear disclosure of refund terms, digital product refund policies, subscription cancellation procedures, and billing error resolution.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  For refund requests or questions about this policy:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>StocksOcean Support Team</strong><br />
                  Email: support@stocksocean.com<br />
                  Website: https://stocksocean.com/support
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


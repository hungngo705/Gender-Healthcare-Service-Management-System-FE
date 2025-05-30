import React from "react";

function Faq() {
  return (
    <div id="faq" className="mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {/* FAQ Item 1 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How long does STI testing take?
              </h3>
              <p className="text-gray-600">
                The actual testing process usually takes about 15-20 minutes.
                Most of this time is spent on paperwork and consultation. The
                sample collection itself is quick and minimally invasive.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How soon will I receive my results?
              </h3>
              <p className="text-gray-600">
                Results are typically available within 2-3 days for standard
                tests and 1-2 days for expedited services. You'll receive a
                secure notification when your results are ready to view in our
                customer portal.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Is STI testing confidential?
              </h3>
              <p className="text-gray-600">
                Absolutely. We take your privacy very seriously. All testing is
                completely confidential, and your results are only accessible to
                you and your healthcare provider. Our online portal uses
                encryption to keep your information secure.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What should I do if my test is positive?
              </h3>
              <p className="text-gray-600">
                If your test comes back positive, don't panic. Many STIs are
                easily treatable. Our healthcare providers will guide you
                through treatment options and can prescribe medication if
                necessary. We also offer counseling services and partner
                notification assistance if desired.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How often should I get tested?
              </h3>
              <p className="text-gray-600">
                The frequency of testing depends on your individual risk
                factors. Generally, we recommend annual testing for sexually
                active individuals. However, more frequent testing (every 3-6
                months) may be appropriate for those with multiple partners or
                other risk factors. Our healthcare providers can help determine
                the best testing schedule for you.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Do I need to prepare for STI testing?
              </h3>
              <p className="text-gray-600">
                For most STI tests, no special preparation is required. However,
                for certain tests, you may be advised to avoid urinating for 1-2
                hours before your appointment. If you're scheduled for a blood
                test, you can eat and drink normally beforehand. Our staff will
                provide specific instructions if needed when you book your
                appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;

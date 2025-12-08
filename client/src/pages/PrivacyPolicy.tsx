import usePageTitle from "../hooks/usePageTitle"

export const PrivacyPolicy: React.FC = () => {

    usePageTitle("Privacy policy");

    return (
        <div className="flex flex-col text-color mt-10">
            <h1 className="text-5xl font-bold">Privacy Policy</h1>
            <p className="text-lg mt-8">
                Welcome to <span className="underline">superguitartab.com</span>. This Privacy Policy explains what information we collect, how we use it, and how we protect your data. 
                By using our website, you agree to the practices described here.
            </p>

            {/* Section 1 */}
            <div className="flex flex-col mt-12">
                <h3 className="text-3xl font-semibold mb-5">1. Information We Collect</h3>
                
                <p className="text-lg font-semibold mb-3">A. Information you provide to us</p>
                <p className="text-lg">
                    If you create an account, we collect the following information:
                </p>

                <ul className="list-disc list-inside space-y-2 mt-3 mb-5 text-lg">
                    <li>First name</li>
                    <li>Last name</li>
                    <li>Email address</li>
                    <li>Password (securely hashed — we never store plain passwords)</li>
                </ul>

                <p className="text-lg">
                    If you sign up using Google, we may receive:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3 mb-5 text-lg">
                    <li>Your Google account email</li>
                    <li>Your Google account name</li>
                    <li>Your Google ID (used only for login)</li>
                </ul>

                <p className="text-lg">
                    We do <span className="font-semibold">not</span> receive access to your Google password or any unrelated Google data.
                </p>

                <p className="text-lg font-semibold mt-8 mb-3">B. Analytics Data (Automatically Collected)</p>
                <p className="text-lg">
                    We use Google Analytics to understand how visitors use the site. Google Analytics may collect:
                </p>

                <ul className="list-disc list-inside space-y-2 mt-3 mb-5 text-lg">
                    <li>Pages visited</li>
                    <li>Time spent on pages</li>
                    <li>Device type (phone, tablet, computer)</li>
                    <li>Browser type</li>
                    <li>Approximate location (city-level)</li>
                    <li>IP address (processed by Google and may be anonymized)</li>
                </ul>

                <p className="text-lg">
                    We do <span className="font-semibold">not</span> store analytics data ourselves.
                </p>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col mt-12">
                <h3 className="text-3xl font-semibold mb-5">2. How We Use This Information</h3>

                <p className="text-lg font-semibold mb-3">A. Account-Related Usage</p>
                <p className="text-lg">
                    The information you provide when creating an account is used to:
                </p>

                <ul className="list-disc list-inside space-y-2 mt-3 mb-5 text-lg">
                    <li>Create and manage your account</li>
                    <li>Authenticate your login</li>
                    <li>Allow access to your downloaded guitar tabs</li>
                    <li>Enable secure sign-in via Google if chosen</li>
                </ul>

                <p className="text-lg font-semibold mt-8 mb-3">B. Analytics Usage</p>
                <p className="text-lg">Analytics data is used only to:</p>

                <ul className="list-disc list-inside space-y-2 mt-3 mb-5 text-lg">
                    <li>Understand which pages are visited</li>
                    <li>Improve website content and usability</li>
                    <li>Fix user experience issues</li>
                    <li>Measure overall performance</li>
                </ul>

                <p className="text-lg">
                    We do <span className="font-semibold">not</span> sell, trade, or share this data with anyone else.
                </p>
            </div>

            {/* Section 3 */}
            <div className="flex flex-col mt-12">
                <h3 className="text-3xl font-semibold mb-5">3. Cookies and Tracking Technologies</h3>
                <p className="text-lg">Google Analytics uses cookies or similar technologies to collect usage information.</p>
                <p className="text-lg">
                    You can opt out of Google Analytics using Google's official browser add-on:{" "}
                    <a className="link" href="https://tools.google.com/dlpage/gaoptout/">https://tools.google.com/dlpage/gaoptout/</a>
                </p>
            </div>

            {/* Section 4 */}
            <div className="flex flex-col mt-12">
                <h3 className="text-3xl font-semibold mb-5">4. Third-Party Services</h3>
                <p className="text-lg">
                    We use the following third-party service:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3 mb-5 text-lg">
                    <li><span className="font-semibold">Google Analytics (Google LLC)</span></li>
                    <li><span className="font-semibold">Google Sign-In (Google LLC)</span> — if you choose to sign in with Google</li>
                </ul>

                <p className="text-lg">
                    Google may process data as described in their Privacy Policy:{" "}
                    <a className="link" href="https://policies.google.com/privacy">https://policies.google.com/privacy</a>
                </p>
                <p className="text-lg">
                    We do not combine analytics data with personally identifiable information.
                </p>
            </div>

            {/* Section 5 */}
            <div className="flex flex-col mt-12">
                <h3 className="text-3xl font-semibold mb-5">5. Data Storage and Security</h3>
                <p className="text-lg">
                    We store only the information necessary to create and manage your account.
                </p>
                <p className="text-lg mt-5">
                    Passwords are securely hashed and never stored in plain text.
                </p>
                <p className="text-lg mt-5">
                    Analytics data is processed and stored by Google according to their security practices.
                </p>
            </div>

            {/* Section 6 */}
            <div className="flex flex-col mt-12">
                <h3 className="text-3xl font-semibold mb-5">6. Children's Privacy</h3>
                <p className="text-lg">
                    Our website is not intended for children under 13, and we do not knowingly collect personal information from children.
                </p>
            </div>

            {/* Section 7 */}
            <div className="flex flex-col mt-12 mb-20">
                <h3 className="text-3xl font-semibold mb-5">7. Changes to This Privacy Policy</h3>
                <p className="text-lg">
                    We may update this Privacy Policy from time to time. When changes occur, we will update the “Last Updated” date at the top of this page.
                </p>
            </div>
        </div>
    )
}
import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/constants/legal";

export const metadata: Metadata = {
  title: `Support | ${LEGAL_CONFIG.appName}`,
  description: `Get help with ${LEGAL_CONFIG.appName}. Find support for onboarding, KYC, campaigns, payments, or report safety issues.`,
};

export default function SupportPage() {
  return (
    <LegalPageLayout title="Support Center">
      <LegalSection title="1. How We Can Help">
        <p>
          The {LEGAL_CONFIG.appName} support team is here to assist you with any issues you encounter on the platform. Whether you are a creator building your portfolio or a brand launching a campaign, we are committed to providing timely assistance.
        </p>
      </LegalSection>

      <LegalSection title="2. Supported Topics">
        <p>Our support team can assist you with:</p>
        <ul>
          <li><strong>Authentication:</strong> Login, OTP, and password reset issues.</li>
          <li><strong>Onboarding:</strong> Creator and brand onboarding, profile setup.</li>
          <li><strong>Verification (KYC):</strong> Document upload issues, verification status.</li>
          <li><strong>Platform Features:</strong> Portfolio uploads, video formatting.</li>
          <li><strong>Campaigns:</strong> Campaign creation, application issues, deadlines.</li>
          <li><strong>Payments:</strong> Brand payment processing, creator payouts, refunds, and cancellations.</li>
          <li><strong>Safety & Trust:</strong> Message reporting, abusive behavior, safety reports.</li>
          <li><strong>Account Management:</strong> Account deletion requests, privacy requests.</li>
          <li><strong>Technical Issues:</strong> Bug reports, crash support, and general troubleshooting.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Contacting Support">
        <p>
          To reach our support team, please email us directly at:
        </p>
        <p className="text-xl font-semibold text-[#E11D48] mt-4 mb-4">
          <a href={`mailto:${LEGAL_CONFIG.supportEmail}`}>{LEGAL_CONFIG.supportEmail}</a>
        </p>
        <p>
          When contacting support, please include:
        </p>
        <ul>
          <li>Your registered email address.</li>
          <li>A clear description of the issue.</li>
          <li>Any relevant screenshots, campaign IDs, or error messages.</li>
          <li>Device and browser information (if reporting a technical bug).</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Expected Response Time">
        <p>
          We aim to respond to all standard support inquiries within 24 to 48 hours during regular business days. Urgent issues, such as safety reports or critical payment failures, are prioritized by our team.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

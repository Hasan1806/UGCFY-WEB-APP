import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/constants/legal";

export const metadata: Metadata = {
  title: `Community Guidelines | ${LEGAL_CONFIG.appName}`,
  description: `Read the Community Guidelines for ${LEGAL_CONFIG.appName}. We enforce a zero-tolerance policy for abuse, fraud, and unprofessional conduct.`,
};

export default function CommunityGuidelinesPage() {
  return (
    <LegalPageLayout title="Community Guidelines">
      <LegalSection title="1. Overview">
        <p>
          At {LEGAL_CONFIG.appName}, we are building an ultra-premium ecosystem for brands and creators. To maintain trust, safety, and high standards, all users must adhere to these Community Guidelines.
        </p>
      </LegalSection>

      <LegalSection title="2. Professional Conduct">
        <p>
          We expect all interactions between brands and creators to be professional, respectful, and strictly related to campaign collaboration. Any attempt to solicit personal favors, send inappropriate messages, or engage in unprofessional behavior is strictly prohibited.
        </p>
      </LegalSection>

      <LegalSection title="3. Prohibited Content and Behavior">
        <ul>
          <li><strong>Child Safety Zero Tolerance:</strong> We have a zero-tolerance policy for any content or behavior that exploits or endangers children. Any such violation will result in immediate termination and reporting to law enforcement.</li>
          <li><strong>No Harassment or Hate:</strong> We do not tolerate harassment, bullying, hate speech, threats, or abuse of any kind directed at any user.</li>
          <li><strong>No Fraud or Scams:</strong> Creating fake campaigns, fake creator profiles, engaging in phishing, spreading malware, or any other fraudulent activity is strictly prohibited.</li>
          <li><strong>No Off-Platform Payments:</strong> To protect both parties, attempting to bypass the platform&apos;s payment systems where prohibited by our Terms is a violation of these guidelines.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Campaign Integrity">
        <p>
          Brands must provide clear, honest, and achievable campaign briefs. Creators must submit authentic work that complies with the brief and applicable advertising laws. Manipulating campaign metrics, using bots, or submitting stolen content will result in immediate account suspension.
        </p>
      </LegalSection>

      <LegalSection title="5. Message Monitoring and Moderation">
        <p>
          To enforce these guidelines, {LEGAL_CONFIG.appName} reserves the right to monitor, review, and moderate messages and content shared on the platform. Violations may be flagged automatically or by user reports.
        </p>
      </LegalSection>

      <LegalSection title="6. Reporting, Blocking, and Enforcement">
        <p>
          Users are encouraged to use our in-app reporting and blocking tools to flag inappropriate behavior. When a violation is reported, our moderation team will review the evidence and take appropriate enforcement actions, which may include warnings, temporary suspensions, or permanent account termination.
        </p>
        <p>
          Please note that as per our Privacy Policy, account deletion requests do not immediately erase records of policy violations. We retain relevant data for up to 45 days (or longer if required by law) for security, fraud prevention, and audit purposes.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

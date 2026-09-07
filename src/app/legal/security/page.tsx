import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/constants/legal";

export const metadata: Metadata = {
  title: `Security Policy | ${LEGAL_CONFIG.appName}`,
  description: `Learn about the security measures, data protection, and vulnerability reporting at ${LEGAL_CONFIG.appName}.`,
};

export default function SecurityPage() {
  return (
    <LegalPageLayout title="Security Policy">
      <LegalSection title="1. Commitment to Security">
        <p>
          At {LEGAL_CONFIG.appName}, protecting the data of our brands and creators is our highest priority. We implement robust, industry-standard security measures to safeguard your information against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </LegalSection>

      <LegalSection title="2. Platform Security Measures">
        <ul>
          <li><strong>Authentication Security:</strong> We utilize modern, secure authentication mechanisms, including secure token storage, to ensure that only authorized users can access accounts.</li>
          <li><strong>Secure Sessions:</strong> All web traffic is encrypted in transit using TLS/SSL. User sessions are strictly managed to prevent hijacking.</li>
          <li><strong>Database and Access Controls:</strong> We employ Database-Level Policies (such as Row Level Security) and Role-Based Access Controls (RBAC) to ensure that users can only access data they are explicitly permitted to view.</li>
          <li><strong>Media Storage Controls:</strong> All uploaded media and assets are securely stored, with access limited by signed URLs or strict storage bucket permissions.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Monitoring, Moderation, and Auditing">
        <p>
          To maintain platform integrity and prevent abuse, we conduct active fraud monitoring and maintain detailed audit logs of system activity. Furthermore, message and content moderation systems are utilized to identify and prevent malicious behavior, spam, or phishing attempts.
        </p>
      </LegalSection>

      <LegalSection title="4. Data Retention and Audits">
        <p>
          Following an account deletion request, {LEGAL_CONFIG.appName} retains audit logs, security records, and necessary compliance data for a period of up to 45 days. In cases involving legal investigations, security incidents, or financial fraud, data may be retained for an extended period to assist in resolution.
        </p>
      </LegalSection>

      <LegalSection title="5. User Responsibilities">
        <p>
          Security is a shared responsibility. We expect our users to:
        </p>
        <ul>
          <li>Use strong, unique passwords or secure OTP authentication.</li>
          <li>Never share login credentials or authentication tokens with third parties.</li>
          <li>Verify the identity of collaborators before transferring sensitive intellectual property.</li>
          <li>Report suspicious behavior immediately using our platform tools.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Vulnerability Reporting">
        <p>
          If you are a security researcher and have discovered a potential vulnerability in the {LEGAL_CONFIG.appName} platform, we encourage you to report it to us responsibly.
        </p>
        <p>
          Please email your findings to <strong>{LEGAL_CONFIG.securityEmail}</strong>. We request that you do not publicly disclose the vulnerability until we have had an opportunity to address it.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

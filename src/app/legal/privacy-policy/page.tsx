import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/constants/legal";

export const metadata: Metadata = {
  title: `Privacy Policy | ${LEGAL_CONFIG.appName}`,
  description: `Learn how ${LEGAL_CONFIG.appName} collects, uses, and protects your personal data, including our data retention, support, and message monitoring policies.`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <LegalSection title="1. Introduction">
        <p>
          Welcome to {LEGAL_CONFIG.appName}. We are committed to protecting your personal information and your right to privacy.
          If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at {LEGAL_CONFIG.supportEmail}.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We collect personal information that you voluntarily provide to us when registering on the platform, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.</p>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, password, phone number, and preferences.</li>
          <li><strong>Creator Profile Information:</strong> Social media links, analytics, audience demographics, and portfolio data.</li>
          <li><strong>Brand Profile Information:</strong> Company name, registration details, tax ID, and billing information.</li>
          <li><strong>KYC & Verification Data:</strong> Government-issued ID, business registration documents, and verification selfies.</li>
          <li><strong>Platform Activity:</strong> Uploaded media, portfolio data, campaign data, and payment/campaign amount information.</li>
          <li><strong>Communications:</strong> Messages between brands and creators, support inquiries, and grievance data.</li>
          <li><strong>Technical Data:</strong> Device information, usage logs, IP addresses, and browsing technical data.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use personal information collected via our website for a variety of business purposes described below:</p>
        <ul>
          <li>To facilitate account creation and logon process.</li>
          <li>To fulfill and manage your campaigns and creator collaborations.</li>
          <li>To send administrative information to you.</li>
          <li>To enforce our terms, conditions, and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Moderation and Monitoring">
        <p>
          <strong>UGC FY may access, scan, review, monitor, moderate, preserve, restrict, or disclose messages between brands and creators where reasonably necessary for safety, fraud prevention, campaign dispute resolution, payment verification, KYC review, support, policy enforcement, legal compliance, or protection of users and the platform.</strong>
        </p>
      </LegalSection>

      <LegalSection title="5. Data Sharing and Service Providers">
        <p>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.
        </p>
      </LegalSection>

      <LegalSection title="6. Account Deletion and Data Retention">
        <p>
          You may request to delete your account at any time. However, to ensure platform safety and compliance:
        </p>
        <p>
          <strong>After a verified account deletion request, UGC FY may retain user details, account records, database records, messages, campaign records, payment records, support records, KYC records, logs, backups, and related information for up to 45 days for operational, backup, fraud-prevention, security, dispute-resolution, payment, audit, and compliance purposes.</strong>
        </p>
        <p>
          We may retain information for longer periods if required for legal, payment, fraud, tax, dispute, KYC, or other compliance reasons under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="7. Security Measures">
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
        </p>
      </LegalSection>

      <LegalSection title="8. User Rights">
        <p>
          Depending on your location, you may have certain rights regarding your personal information, such as the right to request access, correction, or deletion of your data. To exercise these rights, please contact our support team.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact Details">
        <p>
          For any privacy-related inquiries, please contact our Data Protection Officer at:
        </p>
        <ul>
          <li>Email: {LEGAL_CONFIG.supportEmail}</li>
          <li>Address: {LEGAL_CONFIG.registeredAddress}</li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}

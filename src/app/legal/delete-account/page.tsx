import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/constants/legal";

export const metadata: Metadata = {
  title: `Delete Account | ${LEGAL_CONFIG.appName}`,
  description: `Instructions on how to delete your ${LEGAL_CONFIG.appName} account and information on our 45-day data retention policy.`,
};

export default function DeleteAccountPage() {
  return (
    <LegalPageLayout title="Delete Account">
      <LegalSection title="1. Overview">
        <p>
          At {LEGAL_CONFIG.appName}, we respect your right to control your personal data. If you no longer wish to use our platform, you can request to delete your account. Please read this document carefully to understand the deletion process and our data retention policies.
        </p>
      </LegalSection>

      <LegalSection title="2. How to Delete Your Account">
        <p>You can delete your account using any of the following methods:</p>
        
        <h3>Through the Mobile App</h3>
        <p>
          Navigate to <strong>Settings → Account → Delete Account</strong>. Follow the on-screen prompts to confirm your deletion request.
        </p>

        <h3>Through the Website</h3>
        <p>
          Log in to your Dashboard, navigate to your <strong>Settings</strong>, locate the <strong>Account</strong> section, and click on <strong>Delete Account</strong>.
        </p>

        <h3>Via Email Support</h3>
        <p>
          You may also send an email to <strong>{LEGAL_CONFIG.supportEmail}</strong> from the email address associated with your account, requesting account deletion. Our support team will guide you through the verification process.
        </p>
      </LegalSection>

      <LegalSection title="3. Verification Requirement">
        <p>
          For security purposes, we must verify your identity before processing an account deletion request. If you request deletion via email, you may be asked to provide proof of identity or confirm a secure verification link sent to your registered email or phone number.
        </p>
      </LegalSection>

      <LegalSection title="4. Data Deletion and Retention Policy">
        <p>
          Once your account deletion request is verified, your profile will be immediately deactivated and no longer visible to other users. 
        </p>
        <p>
          <strong>UGC FY may retain user details and account-related records in its database, backup systems, logs, support systems, moderation systems, campaign systems, payment systems, and compliance systems for up to 45 days after the deletion request.</strong>
        </p>
        <p>
          This 45-day retention period is strictly enforced to ensure we can process pending payments, resolve disputes, prevent fraud, and maintain operational backups. 
        </p>
        <p>
          Furthermore, data may be retained beyond 45 days if required for legal, fraud prevention, payment reconciliation, tax, chargeback, KYC, dispute resolution, or security reasons. Any data retained beyond the operational retention period will be anonymized or securely archived where possible.
        </p>
      </LegalSection>

      <LegalSection title="5. Warning: Permanent Deletion">
        <p>
          <strong>Account deletion is permanent.</strong> Once the 45-day retention period has elapsed, your data (including portfolios, campaign history, and messages) will be permanently deleted or irreversibly anonymized. You will not be able to recover your account or access your history.
        </p>
      </LegalSection>

      <LegalSection title="6. Need Help?">
        <p>
          If you are experiencing issues with the platform or need assistance before deciding to delete your account, please reach out to our support team at <strong>{LEGAL_CONFIG.supportEmail}</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

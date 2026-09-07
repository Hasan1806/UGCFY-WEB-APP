import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/constants/legal";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${LEGAL_CONFIG.appName}`,
  description: `Read the Terms & Conditions for ${LEGAL_CONFIG.appName}. This document covers user eligibility, campaign funding, payment compliance, and moderation rules.`,
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions">
      <LegalSection title="1. Introduction and Platform Description">
        <p>
          Welcome to {LEGAL_CONFIG.appName}. These Terms & Conditions govern your access to and use of the {LEGAL_CONFIG.appName} platform, website, and services. By accessing or using the platform, you agree to be bound by these Terms.
        </p>
      </LegalSection>

      <LegalSection title="2. User Eligibility">
        <p>
          To use {LEGAL_CONFIG.appName}, you must be of legal age to form a binding contract in your jurisdiction. By registering, you represent that all information provided is accurate and that you will maintain the accuracy of such information.
        </p>
      </LegalSection>

      <LegalSection title="3. KYC and Verification Requirements">
        <p>
          To ensure platform safety, all users (both brands and creators) are subject to KYC (Know Your Customer) and verification requirements. We reserve the right to suspend or terminate accounts that fail to provide satisfactory verification documents.
        </p>
      </LegalSection>

      <LegalSection title="4. Account Responsibilities">
        <p>
          <strong>Creator Responsibilities:</strong> Creators must provide authentic work, communicate professionally, and adhere to all campaign requirements and deadlines.
        </p>
        <p>
          <strong>Brand Responsibilities:</strong> Brands must provide clear campaign briefs, respond to creator communications promptly, and ensure all submitted content requests comply with applicable laws and advertising standards.
        </p>
      </LegalSection>

      <LegalSection title="5. Prohibited Conduct">
        <p>Users may not:</p>
        <ul>
          <li>Engage in fraudulent activities or create fake profiles.</li>
          <li>Submit unlawful, harassing, or defamatory content.</li>
          <li>Attempt to bypass the platform&apos;s payment systems where prohibited.</li>
          <li>Violate any intellectual property rights.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Message Monitoring and Moderation">
        <p>
          To enforce these Terms, prevent fraud, and resolve disputes, UGC FY actively moderates communications. You acknowledge that all messages on the platform are subject to review as detailed in our Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="7. Campaign Creation, Funding, and Payments">
        <p>
          <strong>When a brand creates, activates, publishes, reserves, confirms, or proceeds with a campaign, UGC FY may require the brand to pay the full Campaign Amount upfront.</strong>
        </p>
        <p>
          <strong>The full Campaign Amount may include creator compensation, UGC FY platform fees, campaign management fees, payment gateway charges, taxes, campaign add-ons, administrative charges, service charges, and any other amount displayed before payment confirmation.</strong>
        </p>
        <p>
          <strong>A campaign may not be activated, published, reserved, assigned, released to creators, or made available for creator participation unless the required Campaign Amount is successfully paid, authorized, or otherwise approved by UGC FY.</strong>
        </p>
        <p>
          Creator payouts will be processed subject to the successful completion and approval of campaign deliverables, minus any applicable taxes and fees. Refunds, cancellations, and chargebacks are governed by our platform policies and will be assessed on a case-by-case basis during dispute resolution.
        </p>
        <p>
          <strong>The use of the words “hold”, “reserve”, “collect”, or “process” does not mean UGC FY provides regulated banking, wallet, trustee, escrow, deposit-taking, or financial intermediary services unless expressly stated in a separate written agreement and permitted under applicable law.</strong>
        </p>
      </LegalSection>

      <LegalSection title="8. User-Generated Content License & Intellectual Property">
        <p>
          By submitting content on {LEGAL_CONFIG.appName}, creators grant brands a license to use the content as specified in the campaign brief. UGC FY retains all intellectual property rights to the platform itself. Confidentiality agreements made between brands and creators must be respected.
        </p>
      </LegalSection>

      <LegalSection title="9. App Store and Play Store Compliance">
        <p>
          If you are accessing the platform via a mobile application, you agree to comply with all applicable App Store or Google Play Store rules and policies. This agreement is between you and {LEGAL_CONFIG.appName}, not Apple or Google.
        </p>
      </LegalSection>

      <LegalSection title="10. Reporting, Blocking, and Moderation">
        <p>
          Users have access to reporting and blocking tools within the platform. UGC FY reserves the right to moderate, suspend, or terminate accounts for violations of these Terms or the Community Guidelines.
        </p>
      </LegalSection>

      <LegalSection title="11. Account Deletion and Retention">
        <p>
          You may request account deletion at any time. However, UGC FY retains certain records for up to 45 days after the deletion request, or longer if required by law or for fraud prevention, as detailed in our Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="12. Disclaimers and Limitation of Liability">
        <p>
          {LEGAL_CONFIG.appName} is provided &quot;as is&quot; without warranties of any kind. To the maximum extent permitted by law, {LEGAL_CONFIG.appName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages. You agree to indemnify {LEGAL_CONFIG.appName} against any claims arising from your use of the platform.
        </p>
      </LegalSection>

      <LegalSection title="13. Governing Law and Contact Information">
        <p>
          These Terms are governed by the laws of {LEGAL_CONFIG.jurisdiction}. For any questions, please contact us at {LEGAL_CONFIG.supportEmail} or {LEGAL_CONFIG.registeredAddress}.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

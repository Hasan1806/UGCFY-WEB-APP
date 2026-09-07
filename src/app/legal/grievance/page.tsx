import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/constants/legal";

export const metadata: Metadata = {
  title: `Grievance Redressal | ${LEGAL_CONFIG.appName}`,
  description: `Report issues, disputes, or violations to the Grievance Officer at ${LEGAL_CONFIG.appName}.`,
};

export default function GrievancePage() {
  return (
    <LegalPageLayout title="Grievance Redressal">
      <LegalSection title="1. Overview">
        <p>
          {LEGAL_CONFIG.appName} is committed to providing a safe, fair, and transparent platform for all users. If you have a grievance or complaint regarding our services, you may report it to our Grievance Officer.
        </p>
      </LegalSection>

      <LegalSection title="2. What You Can Report">
        <p>You can contact the Grievance Officer regarding:</p>
        <ul>
          <li>Content or reporting issues (e.g., abusive content, harassment).</li>
          <li>Message or communication issues between brands and creators.</li>
          <li>Campaign, payment, and payout disputes.</li>
          <li>KYC and account verification issues.</li>
          <li>Privacy and data deletion requests.</li>
          <li>Intellectual Property (IP) infringement claims.</li>
          <li>Security vulnerabilities or breaches.</li>
          <li>Urgent safety reporting.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How to File a Grievance">
        <p>
          Please submit your grievance in writing to our appointed Grievance Officer:
        </p>
        <p>
          <strong>Name:</strong> {LEGAL_CONFIG.grievanceOfficerName}<br />
          <strong>Email:</strong> {LEGAL_CONFIG.grievanceEmail}<br />
          <strong>Registered Address:</strong> {LEGAL_CONFIG.registeredAddress}
        </p>
        <p>
          When filing a grievance, please include all relevant details, such as campaign IDs, user profiles, screenshots, and a clear description of the issue.
        </p>
      </LegalSection>

      <LegalSection title="4. Review and Response Timeline">
        <p>
          Upon receiving a grievance, we will acknowledge its receipt within 24-48 hours. We aim to resolve all grievances within 15 to 30 days, depending on the complexity of the issue.
        </p>
        <p>
          Please note that to investigate and resolve grievances, our team may review campaign details, payment records, and messages exchanged on the platform, in accordance with our Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Retention for Disputes">
        <p>
          Even if an account deletion request has been submitted, we retain records related to unresolved grievances, disputes, or legal issues for a period of 45 days, or longer if mandated by law.
        </p>
      </LegalSection>

      <LegalSection title="6. Appeals">
        <p>
          If you are unsatisfied with the resolution provided by the Grievance Officer, you may request an appeal or escalate the matter as permitted under applicable laws in {LEGAL_CONFIG.jurisdiction}.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

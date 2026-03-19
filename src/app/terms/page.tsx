import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Terms & Conditions - AIM",
  description: "AIM Terms and Conditions - Rules and guidelines for using the AIM app.",
};

/**
 * Terms and Conditions page with full legal content.
 */
export default function TermsConditionsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions">
      <h2>Overview</h2>
      <p>
        These terms govern your use of the AIM mobile application software, its accompanying data, updates, and online documentation (collectively, the &quot;App&quot; and &quot;Documentation&quot;).
      </p>
      <p>
        AIM and aim.io are trading names of AIMREL Technology Limited, registered company number: HE 471163. Registered office: Agiou Alexiou, 1, 1st Floor, Strovolos, 2054, Nicosia, Cyprus
      </p>

      <h2>Consent to Process Personal Information</h2>
      <p>
        To use AIM services, your personal information will be processed as described in the AIM Privacy Notice. Please read this notice carefully before accepting these terms.
      </p>
      <ul>
        <li>
          <strong>For Players:</strong> By accepting these terms, you confirm that you have read the AIM Privacy Notice and consent to the processing of your personal information.
        </li>
        <li>
          <strong>For Parents/Guardians:</strong> If you are providing consent for a player under the legal age in your country, you confirm you have read the AIM Privacy Notice and consent to the processing of the player&apos;s personal information.
        </li>
      </ul>

      <h2>General Disclaimer</h2>
      <ul>
        <li>
          The App allows you to upload personal and technical data about your skills and abilities. However, we make no guarantees that participation in trials via the App will lead to further evaluations or opportunities.
        </li>
        <li>
          Internet transmissions may not always be secure. Any information you send may be read or intercepted, even when encrypted.
        </li>
      </ul>

      <h2>App Support & Communication</h2>
      <ul>
        <li>
          <strong>Support:</strong> For any issues or queries, contact our customer service team at <a href="mailto:info@aim.io" className="text-[var(--color-brand)] hover:underline">info@aim.io</a>.
        </li>
        <li>
          <strong>Notifications:</strong> We will communicate via email, SMS, or post using the contact information you provide.
        </li>
      </ul>

      <h2>App Usage</h2>
      <p>By complying with these terms, you may:</p>
      <ol className="list-decimal pl-6 text-white/70">
        <li>Download and use the App on multiple mobile devices for personal use.</li>
        <li>Use related Documentation as needed.</li>
        <li>Make up to two backup copies of the App and Documentation.</li>
        <li>Receive updates or patches for improved functionality and security.</li>
      </ol>

      <h3>Age Restrictions</h3>
      <ul>
        <li>If under 18, parental/guardian permission is required.</li>
        <li>If under 13, a parent/guardian must manage the account.</li>
      </ul>

      <h3>Prohibitions</h3>
      <p>
        You may not transfer the App to others, for free or payment. If you sell a device with the App, you must uninstall it.
      </p>

      <h2>Changes & Updates</h2>
      <ul>
        <li>
          <strong>Terms:</strong> We reserve the right to update these terms. Notification of changes will be given 14 days in advance.
        </li>
        <li>
          <strong>App Updates:</strong> Updates may occur automatically for performance, security, or compatibility improvements. Failure to update may restrict App functionality.
        </li>
      </ul>

      <h2>Uploading Content</h2>
      <p>
        If you upload images or videos of others, you confirm their consent for AIM to process their data as per the AIM Privacy Notice.
      </p>

      <h2>License Restrictions</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Rent, lease, sublicense, or share the App or Documentation without our consent.</li>
        <li>Copy, modify, reverse-engineer, or merge the App or Documentation with other software unless necessary for personal backup or security.</li>
      </ul>

      <h2>Acceptable Use</h2>
      <p>You must not:</p>
      <ul>
        <li>Use the App for unlawful or malicious purposes, such as inserting harmful code.</li>
        <li>Infringe intellectual property rights.</li>
        <li>Overload or compromise the App&apos;s systems or interfere with other users.</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        All intellectual property rights in the App and Documentation are owned by AIM. Your rights are limited to personal use as outlined in these terms.
      </p>

      <h2>Liability</h2>
      <ul>
        <li>
          <strong>Foreseeable Loss:</strong> We are liable for losses caused by our breach of terms, but not for unforeseen damages or business-related losses.
        </li>
        <li>
          <strong>Liability Limit:</strong> Our liability, where permitted, is capped at £1,000 per incident or related series of events.
        </li>
        <li>
          <strong>Exclusions:</strong> We are not liable for losses caused by external events or failure to back up data.
        </li>
      </ul>

      <h2>Ending Your Rights</h2>
      <p>We may terminate your access if these terms are breached. If terminated, you must:</p>
      <ol className="list-decimal pl-6 text-white/70">
        <li>Stop using the App and Documentation.</li>
        <li>Delete all copies and confirm their removal to us.</li>
      </ol>

      <h2>Transferring Rights</h2>
      <ul>
        <li>
          <strong>Our Rights:</strong> We may transfer this agreement to another party without affecting your rights.
        </li>
        <li>
          <strong>Your Rights:</strong> You may transfer this agreement only with our written consent.
        </li>
      </ul>

      <h2>General</h2>
      <ul>
        <li>
          <strong>Severability:</strong> If any part of this agreement is deemed unlawful, the rest remains enforceable.
        </li>
        <li>
          <strong>Delays in Enforcement:</strong> Delays in enforcement do not waive our rights to act later.
        </li>
        <li>
          <strong>Governing Law:</strong> These terms are governed by English law, and disputes are subject to English courts.
        </li>
      </ul>

      <p>
        This document ensures a clear understanding of your rights and responsibilities while using the AIM App. Please contact us if you have questions or need further clarification.
      </p>

      <hr className="my-12 border-white/10" />

      <p className="text-sm text-white/50">
        AIM and aim.io are trading names of AIMREL Technology Limited, Registered company number: HE 471163. Registered office: Agiou Alexiou, 1, 1st Floor, Strovolos, 2054, Nicosia, Cyprus
      </p>
    </LegalPageLayout>
  );
}

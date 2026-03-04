import { Suspense } from "react";
import { Metadata } from "next";
import AcademyCheckoutClient from "./AcademyCheckoutClient";

export const metadata: Metadata = {
  title: "Academy Setup — AIM",
  description: "Complete your AIM Academies subscription",
};

/** Academy checkout page - reads plan params from searchParams */
export default function AcademyCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AcademyCheckoutClient />
    </Suspense>
  );
}

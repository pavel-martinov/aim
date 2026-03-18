import { Suspense } from "react";
import { Metadata } from "next";
import AcademyCheckoutClient from "./AcademyCheckoutClient";

export const metadata: Metadata = {
  title: "Register Interest — AIM Academies",
  description: "Register your interest in AIM Academies for your team or organization",
};

/** Academy interest registration page */
export default function AcademyCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AcademyCheckoutClient />
    </Suspense>
  );
}

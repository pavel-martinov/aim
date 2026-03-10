"use client";

import { useState, useEffect, useCallback } from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileOverview from "@/components/profile/ProfileOverview";
import AccountSettings from "@/components/profile/AccountSettings";
import SecuritySettings from "@/components/profile/SecuritySettings";
import BillingSettings from "@/components/profile/billing/BillingSettings";
import {
  getMockUser,
  updateMockUser,
  updateMockAvatar,
  updateMockPassword,
  getMockInvoices,
  getMockPaymentMethod,
  updateMockSubscription,
  cancelMockSubscription,
  reactivateMockSubscription,
  getMockLoginActivity,
  getMockActiveSessions,
  endMockSession,
  endAllMockSessions,
} from "@/lib/mockUser";
import type {
  User,
  Invoice,
  PaymentMethod,
  ProfileSection,
  UpdateUserPayload,
  UpdatePasswordPayload,
  SubscriptionTier,
  LoginActivity,
  ActiveSession,
} from "@/types/user";

/**
 * B2C Profile settings page with Netflix-style navigation.
 */
export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<ProfileSection>("overview");
  const [user, setUser] = useState<User | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [
          userResult,
          invoicesResult,
          paymentResult,
          activityResult,
          sessionsResult,
        ] = await Promise.all([
          getMockUser(),
          getMockInvoices(),
          getMockPaymentMethod(),
          getMockLoginActivity(),
          getMockActiveSessions(),
        ]);

        if (userResult.success) setUser(userResult.data);
        if (invoicesResult.success) setInvoices(invoicesResult.data);
        if (paymentResult.success) setPaymentMethod(paymentResult.data);
        if (activityResult.success) setLoginActivity(activityResult.data);
        if (sessionsResult.success) setActiveSessions(sessionsResult.data);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleAvatarChange = useCallback(async (avatarUrl: string) => {
    const result = await updateMockAvatar(avatarUrl);
    if (result.success) {
      setUser(result.data);
    }
  }, []);

  const handleUserUpdate = useCallback(async (updates: UpdateUserPayload) => {
    const result = await updateMockUser(updates);
    if (result.success) {
      setUser(result.data);
    }
  }, []);

  const handlePasswordChange = useCallback(
    async (payload: UpdatePasswordPayload): Promise<{ success: boolean; error?: string }> => {
      const result = await updateMockPassword(payload);
      return { success: result.success, error: result.success ? undefined : result.error };
    },
    []
  );

  const handleEndSession = useCallback(async (sessionId: string) => {
    const result = await endMockSession(sessionId);
    if (result.success) {
      setActiveSessions(result.data);
    }
  }, []);

  const handleEndAllSessions = useCallback(async () => {
    const result = await endAllMockSessions();
    if (result.success) {
      setActiveSessions(result.data);
    }
  }, []);

  const handleChangePlan = useCallback(async (tier: SubscriptionTier) => {
    const result = await updateMockSubscription(tier);
    if (result.success) {
      setUser(result.data);
    }
  }, []);

  const handleCancelPlan = useCallback(async () => {
    const result = await cancelMockSubscription();
    if (result.success) {
      setUser(result.data);
    }
  }, []);

  const handleReactivate = useCallback(async () => {
    const result = await reactivateMockSubscription();
    if (result.success) {
      setUser(result.data);
    }
  }, []);

  const handleUpdatePaymentMethod = useCallback(() => {
    console.log("Update payment method clicked");
  }, []);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--color-brand)]" />
          <p
            className="text-sm text-white/50"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <ProfileOverview
            user={user}
            onAvatarChange={handleAvatarChange}
            onEditProfile={() => setActiveSection("account")}
            onSectionChange={setActiveSection}
          />
        );
      case "account":
        return <AccountSettings user={user} onSave={handleUserUpdate} />;
      case "security":
        return (
          <SecuritySettings
            loginActivity={loginActivity}
            activeSessions={activeSessions}
            onPasswordChange={handlePasswordChange}
            onEndSession={handleEndSession}
            onEndAllSessions={handleEndAllSessions}
          />
        );
      case "billing":
        return (
          <BillingSettings
            user={user}
            invoices={invoices}
            paymentMethod={paymentMethod}
            onChangePlan={handleChangePlan}
            onCancelPlan={handleCancelPlan}
            onReactivate={handleReactivate}
            onUpdatePaymentMethod={handleUpdatePaymentMethod}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ProfileLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </ProfileLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileOverview from "@/components/profile/ProfileOverview";
import AccountSettings from "@/components/profile/AccountSettings";
import SecuritySettings from "@/components/profile/SecuritySettings";
import BillingSettings from "@/components/profile/billing/BillingSettings";
import {
  ParentOverviewSection,
  ParentAccountSection,
  ParentSecuritySection,
  ParentBillingSection,
} from "@/components/profile/parent";
import { getUserRole, type UserRole } from "@/lib/mockAuth";
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
  getMockParentUser,
  getMockParentBillingUser,
  updateParentalControls,
  updateMockChildProfile,
  updateMockChildPassword,
  updateMockParentSubscription,
  cancelMockParentSubscription,
  reactivateMockParentSubscription,
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
  ParentUser,
  ParentalControls,
  UpdateChildProfilePayload,
  SetChildPasswordPayload,
} from "@/types/user";

/**
 * B2C Profile settings page with Netflix-style navigation.
 * Renders different views based on user role (player vs parent).
 */
export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<ProfileSection>("overview");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [parentUser, setParentUser] = useState<ParentUser | null>(null);
  const [parentBillingUser, setParentBillingUser] = useState<User | null>(null);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const role = getUserRole();
        setUserRole(role);

        if (role === "parent") {
          const [parentResult, billingUserResult, invoicesResult, paymentResult] = await Promise.all([
            getMockParentUser(),
            getMockParentBillingUser(),
            getMockInvoices(),
            getMockPaymentMethod(),
          ]);

          if (parentResult.success) setParentUser(parentResult.data);
          if (billingUserResult.success) setParentBillingUser(billingUserResult.data);
          if (invoicesResult.success) setInvoices(invoicesResult.data);
          if (paymentResult.success) setPaymentMethod(paymentResult.data);
        } else {
          const [userResult, invoicesResult, paymentResult, activityResult, sessionsResult] =
            await Promise.all([
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
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!parentUser?.children.length) return;
    const hasSelectedChild = parentUser.children.some((child) => child.id === selectedChildId);
    if (!hasSelectedChild) {
      setSelectedChildId(parentUser.children[0].id);
    }
  }, [parentUser, selectedChildId]);

  const handleAvatarChange = async (avatarUrl: string) => {
    const result = await updateMockAvatar(avatarUrl);
    if (result.success) setUser(result.data);
  };

  const handleUserUpdate = async (updates: UpdateUserPayload) => {
    const result = await updateMockUser(updates);
    if (result.success) setUser(result.data);
  };

  const handlePasswordChange = async (
    payload: UpdatePasswordPayload
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await updateMockPassword(payload);
    return { success: result.success, error: result.success ? undefined : result.error };
  };

  const handleEndSession = async (sessionId: string) => {
    const result = await endMockSession(sessionId);
    if (result.success) setActiveSessions(result.data);
  };

  const handleEndAllSessions = async () => {
    const result = await endAllMockSessions();
    if (result.success) setActiveSessions(result.data);
  };

  const handleChangePlan = async (tier: SubscriptionTier) => {
    const result = await updateMockSubscription(tier);
    if (result.success) setUser(result.data);
  };

  const handleCancelPlan = async () => {
    const result = await cancelMockSubscription();
    if (result.success) setUser(result.data);
  };

  const handleReactivate = async () => {
    const result = await reactivateMockSubscription();
    if (result.success) setUser(result.data);
  };

  const handleParentalControlsUpdate = async (
    childId: string,
    controls: Partial<ParentalControls>
  ) => {
    const result = await updateParentalControls(childId, controls);
    if (result.success) {
      setParentUser((current) =>
        current
          ? {
              ...current,
              children: current.children.map((child) =>
                child.id === childId ? result.data : child
              ),
            }
          : current
      );
    }
  };

  const handleChildProfileUpdate = async (
    childId: string,
    updates: UpdateChildProfilePayload
  ) => {
    const result = await updateMockChildProfile(childId, updates);
    if (result.success) {
      setParentUser((current) =>
        current
          ? {
              ...current,
              children: current.children.map((child) =>
                child.id === childId ? result.data : child
              ),
            }
          : current
      );
    }
  };

  const handleChildPasswordUpdate = async (
    childId: string,
    payload: SetChildPasswordPayload
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await updateMockChildPassword(childId, payload);

    if (result.success) {
      setParentUser((current) =>
        current
          ? {
              ...current,
              children: current.children.map((child) =>
                child.id === childId ? result.data : child
              ),
            }
          : current
      );
    }

    return {
      success: result.success,
      error: result.success ? undefined : result.error,
    };
  };

  const handleParentPlanChange = async (tier: SubscriptionTier) => {
    const result = await updateMockParentSubscription(tier);
    if (result.success) setParentBillingUser(result.data);
  };

  const handleParentPlanCancel = async () => {
    const result = await cancelMockParentSubscription();
    if (result.success) setParentBillingUser(result.data);
  };

  const handleParentReactivate = async () => {
    const result = await reactivateMockParentSubscription();
    if (result.success) setParentBillingUser(result.data);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (userRole === "parent" && parentUser) {
    const activeChildId = selectedChildId || parentUser.children[0]?.id || "";

    const renderParentSection = () => {
      switch (activeSection) {
        case "overview":
          return (
            <ParentOverviewSection
              parent={parentUser}
              selectedChildId={activeChildId}
              onSelectChild={setSelectedChildId}
            />
          );
        case "account":
          return (
            <ParentAccountSection
              parent={parentUser}
              selectedChildId={activeChildId}
              onSelectChild={setSelectedChildId}
              onSaveChild={handleChildProfileUpdate}
            />
          );
        case "security":
          return (
            <ParentSecuritySection
              parent={parentUser}
              selectedChildId={activeChildId}
              onSelectChild={setSelectedChildId}
              onUpdateControls={handleParentalControlsUpdate}
              onUpdateChild={handleChildProfileUpdate}
              onSetPassword={handleChildPasswordUpdate}
            />
          );
        case "billing":
          return parentBillingUser ? (
            <ParentBillingSection
              user={parentBillingUser}
              invoices={invoices}
              paymentMethod={paymentMethod}
              onChangePlan={handleParentPlanChange}
              onCancelPlan={handleParentPlanCancel}
              onReactivate={handleParentReactivate}
              onUpdatePaymentMethod={() => {}}
            />
          ) : (
            <ErrorState message="Unable to load billing data." />
          );
        default:
          return null;
      }
    };

    return (
      <ProfileLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderParentSection()}
      </ProfileLayout>
    );
  }

  if (!user) {
    return <ErrorState message="Unable to load profile data." />;
  }

  const renderPlayerSection = () => {
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
            onUpdatePaymentMethod={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ProfileLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderPlayerSection()}
    </ProfileLayout>
  );
}

/** Shared loading state for profile pages. */
function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--color-brand)]" />
        <p className="text-sm text-white/50 font-sans">Loading profile...</p>
      </div>
    </div>
  );
}

/** Shared error state for profile pages. */
function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-white/50 font-sans">{message}</p>
      </div>
    </div>
  );
}

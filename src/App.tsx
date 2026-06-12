import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import PetInteract from "@/pages/PetInteract";
import Nest from "@/pages/Nest";
import Gallery from "@/pages/Gallery";
import Diary from "@/pages/Diary";
import PetProfile from "@/pages/PetProfile";
import DressUp from "@/pages/DressUp";
import InteractionHistory from "@/pages/InteractionHistory";
import Personality from "@/pages/Personality";
import Growth from "@/pages/Growth";
import Settings from "@/pages/Settings";
import PetBasicSettings from "@/pages/PetBasicSettings";
import ProfileSubPage from "@/pages/ProfileSubPage";
import DiaryRules from "@/pages/DiaryRules";
import PaintingDiary from "@/pages/PaintingDiary";
import LottiePreview from "@/pages/LottiePreview";
import LuckyDrawMachine from "@/pages/LuckyDrawMachine";
import HomeLost from "@/pages/HomeLost";
import AssistantContentPage from "@/pages/AssistantContentPage";
import DrinkWaterReminderPage from "@/pages/DrinkWaterReminderPage";
import EyeChange from "@/pages/EyeChange";
import SubscriptionPrototype from "@/pages/SubscriptionPrototype";
import DialogueMode from "@/pages/DialogueMode";
import SubscriptionFlow from "@/pages/SubscriptionFlow";
import TrialExperience from "@/pages/TrialExperience";
import VoiceConsent from "@/pages/VoiceConsent";
import PolicyDocument from "@/pages/PolicyDocument";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pet-interact" element={<PetInteract />} />
        <Route path="/nest" element={<Nest />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/diary-rules" element={<DiaryRules />} />
        <Route path="/painting-diary" element={<PaintingDiary />} />
        <Route path="/pet-profile" element={<PetProfile />} />
        <Route path="/dress-up" element={<DressUp />} />
        <Route path="/interaction-history" element={<InteractionHistory />} />
        <Route path="/lucky-draw-2" element={<LuckyDrawMachine />} />
        <Route path="/personality" element={<Personality />} />
        <Route path="/growth" element={<Growth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pet-basic-settings" element={<PetBasicSettings />} />
        <Route path="/help-center" element={<ProfileSubPage title="帮助中心" />} />
        <Route path="/after-sales" element={<ProfileSubPage title="售后服务" />} />
        <Route path="/about-us" element={<ProfileSubPage title="关于我们" />} />
        <Route path="/version-update" element={<ProfileSubPage title="版本更新" />} />
        <Route path="/lottie-preview" element={<LottiePreview />} />
        <Route path="/home-lost" element={<HomeLost />} />
        <Route path="/assistant-content" element={<AssistantContentPage />} />
        <Route path="/drink-water-reminder" element={<DrinkWaterReminderPage />} />
        <Route path="/eye-change" element={<EyeChange />} />
        <Route path="/dialogue-mode" element={<DialogueMode />} />
        <Route path="/subscription" element={<SubscriptionFlow screen="plans" />} />
        <Route path="/subscription/payment-method" element={<SubscriptionFlow screen="payment-method" />} />
        <Route path="/subscription/alipay" element={<SubscriptionFlow screen="alipay" />} />
        <Route path="/subscription/wechat" element={<SubscriptionFlow screen="wechat" />} />
        <Route path="/subscription/alipay/result" element={<SubscriptionFlow screen="alipay-result" />} />
        <Route path="/subscription/wechat/result" element={<SubscriptionFlow screen="wechat-result" />} />
        <Route path="/subscription/opening" element={<SubscriptionFlow screen="opening" />} />
        <Route path="/subscription/success" element={<SubscriptionFlow screen="success" />} />
        <Route path="/subscription/failure" element={<SubscriptionFlow screen="failure" />} />
        <Route path="/subscription/status" element={<SubscriptionFlow screen="status" />} />
        <Route path="/subscription/manage" element={<SubscriptionFlow screen="account" />} />
        <Route path="/subscription/orders" element={<SubscriptionFlow screen="orders" />} />
        <Route path="/subscription/invoices" element={<SubscriptionFlow screen="invoices" />} />
        <Route path="/subscription/trial" element={<TrialExperience />} />
        <Route path="/subscription/voice-consent" element={<VoiceConsent />} />
        <Route path="/policies/privacy" element={<PolicyDocument kind="privacy" />} />
        <Route path="/policies/subscription" element={<PolicyDocument kind="subscription" />} />
        <Route path="/subscription/invoice" element={<SubscriptionFlow screen="invoices" />} />
        <Route path="/subscription/repair" element={<SubscriptionPrototype screen="repair" />} />
        <Route path="/other" element={<div className="text-center text-xl mt-10">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

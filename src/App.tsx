import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <Router>
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
        <Route path="/other" element={<div className="text-center text-xl mt-10">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

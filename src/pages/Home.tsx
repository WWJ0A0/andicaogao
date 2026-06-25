import React, { useState, useRef } from 'react';
import { usePetStore } from '../store/usePetStore';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import pingjingAnimation from '@/assets/animations/pingjing.json';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import DialogueEntryButton from '@/components/DialogueEntryButton';
import { Check, X } from 'lucide-react';

const HomePage: React.FC = () => {
  const { pet, todaysInteractions, incrementInteraction } = usePetStore();
  const {
    dialogueEnabled,
    voiceConsentGranted,
    grantVoiceConsent,
    setDialogueEnabled,
    resetPrototype,
    minorModeEnabled,
  } = useSubscriptionStore();
  const navigate = useNavigate();
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [isDiaryChecked, setIsDiaryChecked] = useState(false);
  const [showDialogueConsent, setShowDialogueConsent] = useState(false);
  const [showDialogueTutorial, setShowDialogueTutorial] = useState(false);
  const [dialogueConsentChecked, setDialogueConsentChecked] = useState(false);

  // 亮度和音量状态 (0 - 100)
  const [brightness, setBrightness] = useState(50);
  const [volume, setVolume] = useState(50);
  
  // 用于拖拽计算的 refs
  const brightnessRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const isDraggingBrightness = useRef(false);
  const isDraggingVolume = useRef(false);

  // 处理拖拽事件
  const handleDrag = (e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent, type: 'brightness' | 'volume') => {
    if (!isDraggingBrightness.current && type === 'brightness') return;
    if (!isDraggingVolume.current && type === 'volume') return;

    const ref = type === 'brightness' ? brightnessRef : volumeRef;
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    
    // 获取 Y 坐标 (兼容鼠标和触摸)
    let clientY = 0;
    if ('touches' in e) {
      clientY = e.touches[0].clientY;
    } else {
      clientY = (e as MouseEvent).clientY;
    }

    // 计算百分比 (顶部是100%，底部是0%)
    let newPercentage = 100 - ((clientY - rect.top) / rect.height) * 100;
    
    // 限制在 0-100 之间
    newPercentage = Math.max(0, Math.min(100, newPercentage));

    if (type === 'brightness') {
      setBrightness(newPercentage);
    } else {
      setVolume(newPercentage);
    }
  };

  // 添加全局事件监听以处理拖拽结束和移动
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingBrightness.current) handleDrag(e, 'brightness');
      if (isDraggingVolume.current) handleDrag(e, 'volume');
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingBrightness.current) handleDrag(e, 'brightness');
      if (isDraggingVolume.current) handleDrag(e, 'volume');
    };

    const handleEnd = () => {
      isDraggingBrightness.current = false;
      isDraggingVolume.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  const handlePetClick = () => {
    incrementInteraction();
    navigate('/pet-interact');
  };

  const openDialogueMode = () => {
    if (minorModeEnabled) return;

    if (voiceConsentGranted) {
      navigate('/dialogue-mode');
      return;
    }

    setDialogueConsentChecked(false);
    setShowDialogueConsent(true);
  };

  const startFirstEntryDemo = () => {
    resetPrototype();
    setDialogueConsentChecked(false);
    setShowDialogueTutorial(false);
    setShowDialogueConsent(true);
  };

  if (!pet) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#d8deea] overflow-hidden flex justify-center py-4">
      {/* 主容器 - 模拟移动设备尺寸 */}
      <div className="relative w-[393px] h-[852px] mx-auto my-0 overflow-hidden bg-gradient-to-b from-[#e2e7f1] to-[#ffffff] to-[56.55%] rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        
        {/* 顶部背景图像区域 */}
        <div 
          className="absolute top-0 left-0 w-[393px] h-[488px] flex flex-col items-start pb-[319px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/mo0uw8au-tiw0645.png)' }}
        >
          {/* 状态栏 */}
          <div className="flex flex-col items-start self-stretch">
            <div className="flex items-start self-stretch px-[14px] py-[14px] pr-[14px] pl-[21px] shrink-0">
              <p className="w-[54px] text-center tracking-[-0.3px] text-[#222222] text-[15px] font-semibold">9:41</p>
              <img 
                src="/images/mo0uw8aq-4czeqtc.svg" 
                alt="蜂窝网络" 
                className="mt-[4px] ml-[233px] w-[18px] h-[11px]"
              />
              <img 
                src="/images/mo0uw8aq-o4ivfo4.svg" 
                alt="WiFi" 
                className="mt-[3px] ml-[5px] w-[16px] h-[11px]"
              />
              <img 
                src="/images/mo0uw8aq-m2z14op.svg" 
                alt="电池" 
                className="mt-[3px] ml-[7px] w-[24px] h-[11px]"
              />
            </div>

            {/* 导航栏 */}
            <div className="relative flex items-center self-stretch gap-[101px] px-5 py-2 shrink-0">
              <p className="max-w-[118px] shrink-0 truncate text-[24px] font-medium leading-[32px] tracking-normal text-[#222222]">
                {pet.name}
              </p>
              
              {/* 设置图标 */}
              <img 
                src="/images/mo0uw8aq-a8dllvc.png" 
                alt="设置" 
                className="absolute top-3 left-[140px] shrink-0 rounded-[12px] w-6 h-6 -rotate-90 cursor-pointer"
                onClick={() => navigate('/settings')}
              />

              {!minorModeEnabled && (
                <DialogueEntryButton
                  enabled={dialogueEnabled}
                  className="absolute left-[203px] top-[4px] z-10"
                  onClick={openDialogueMode}
                />
              )}
              
              {/* 换眼睛按钮 */}
              <div 
                className="absolute top-[6px] left-[297px] shrink-0 flex items-center justify-between z-10 border border-[#ffffffcc] rounded-[12px] bg-[#ffffff99] px-[9px] py-[1px] w-[76px] h-9 cursor-pointer"
                onClick={() => navigate('/eye-change')}
              >
                <div className="flex items-center p-[3px]">
                  <img 
                    src="/images/mo0uw8aq-kotrwfu.svg" 
                    alt="换装图标" 
                    className="w-[18px] h-[18px]"
                  />
                </div>
                <p className="leading-[32px] tracking-normal text-[#222222] text-[14px] font-medium">换装</p>
              </div>
            </div>
          </div>

          <div className="absolute top-[103px] left-[21px] z-[220] cursor-pointer" onClick={() => navigate('/home-lost')}>
            <img src="/images/mo8l3k70-hwl1w86.svg" className="w-[52px] h-[52px] animate-[spin_8s_linear_infinite]" alt="Polkadot (DOT)" />
          </div>

          {/* 宠物点击提示区域 */}
          <div
            className="inline-flex absolute top-[171px] right-[37px] items-center gap-1 z-[120] animate-bounce [animation-duration:1s]"
            onClick={handlePetClick}
          >
            <div className="flex items-center shrink-0 pb-[1px] h-5 overflow-hidden">
              <img 
                src="/images/mo0uw8aq-gowv3y9.png" 
                alt="点击图标" 
                className="w-5 h-5 overflow-hidden -rotate-180"
              />
            </div>
            <p className="shrink-0 leading-5 tracking-normal text-[#22222266] text-[14px]">点我试试</p>
          </div>
        </div>

        {/* 宠物形象 */}
        <div
          className="absolute top-[109px] left-[29px] w-[334px] h-[294px] z-20 cursor-pointer hover:scale-105 transition-transform"
          onClick={handlePetClick}
          aria-label={`${pet.name}设备`}
          role="button"
        >
          <Lottie animationData={pingjingAnimation} loop autoplay className="w-full h-full" />
        </div>

        {/* 当前设备权益状态 */}
        {/* 宠物状态气泡 */}
        <div className="absolute top-[410px] left-0 flex flex-col items-start rounded-[24px] bg-[#f8f8f8e5] pt-[69px] px-[21px] pl-5 w-[393px] h-[442px] gap-3">
          {/* 已陪伴和今日互动统计 */}
          <div 
            className="flex items-start self-stretch border border-[#2222220d] rounded-[20px] bg-[#eeeeee] px-[30px] py-[13px] pr-[30px] pl-[41px] shrink-0 transition-colors"
          >
            {/* 已陪伴天数 */}
            <div className="flex flex-col items-center w-[90px] gap-1">
              <p className="shrink-0 opacity-80 leading-[22px] tracking-normal text-[#3f3f6099] text-[16px]">已陪伴</p>
              <div className="flex items-start shrink-0 w-[77px]">
                <p className="leading-[39px] tracking-[-0.84px] text-[#222222] text-[28px] font-semibold">{pet.companionship_days}</p>
                <p className="mt-[17px] ml-[3px] leading-[17px] tracking-[-0.36px] text-[#222222] text-[12px] font-medium">Days</p>
              </div>
            </div>

            {/* 分隔线 */}
            <img 
              src="/images/mo0uw8aq-bhhhue0.svg" 
              alt="分隔线" 
              className="mt-[11px] ml-[44px] w-[2px] h-10"
            />

            {/* 今日互动 */}
            <button
              type="button"
              className="ml-[31px] flex flex-col items-center justify-center gap-1 rounded-[16px] px-2 transition-colors hover:bg-white/50"
              onClick={() => navigate('/interaction-score')}
            >
              <p className="shrink-0 opacity-80 leading-[22px] tracking-normal text-[#3f3f6099] text-[16px]">今日互动</p>
              <p className="shrink-0 self-stretch text-center tracking-[-0.84px] text-[#222222] text-[28px] font-semibold">{todaysInteractions}</p>
            </button>
          </div>

          {/* 宠物状态和功能区域 */}
          <div className="flex items-start self-stretch justify-between shrink-0">
            {/* 左侧：宠物状态卡片 */}
            <div className="flex flex-col shrink-0 items-start justify-center gap-3">
              {/* 当前性格卡片 */}
              <div 
                className="flex items-center self-stretch justify-between border border-[#2222220d] rounded-[20px] bg-[#eeeeee] px-[15px] py-[13px] min-w-[196px] h-[72px] shrink-0 cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                onClick={() => navigate('/personality')}
              >
                <div className="flex items-center p-[4px] pr-[3px] pl-[6px] overflow-hidden">
                  <div 
                    className="w-8 h-8 bg-cover bg-no-repeat"
                    style={{ 
                      backgroundImage: 'url(/images/mo0uw8au-eiepoer.png)',
                      backgroundPosition: '1px 0px',
                      backgroundSize: '91.12% 96.43%',
                      filter: 'drop-shadow(0px 2px 3px #808ace)'
                    }}
                  />
                </div>
                <div className="flex flex-col items-start self-stretch">
                  <p className="w-[114px] leading-[24px] tracking-normal text-[#222222] text-[16px]">当前性格</p>
                  <p className="mt-[2px] leading-[17px] tracking-normal text-[#22222266] text-[12px]">{pet.personality}</p>
                </div>
              </div>

              {/* 成长阶段卡片 */}
              <div 
                className="flex items-start self-stretch justify-between border border-[#2222220d] rounded-[20px] bg-[#eeeeee] px-[25px] py-[12px] pr-[25px] pl-[15px] shrink-0 cursor-pointer hover:bg-[#e0e0e0] transition-colors"
                onClick={() => navigate('/growth')}
              >
                <div className="flex items-center mt-[3px] p-[2px] pr-[1px] pl-[3px]">
                  <img 
                    src="/images/mo0uw8aq-wy2zeje.png" 
                    alt="成长阶段图标" 
                    className="w-9 h-9 -rotate-10"
                  />
                </div>
                <div className="flex flex-col items-start self-stretch">
                  <p className="leading-[24px] tracking-normal text-[#222222] text-[16px]">ropet成长阶段</p>
                  <p className="mt-[2px] leading-[17px] tracking-normal text-[#22222266] text-[12px]">{pet.growth_stage}</p>
                </div>
              </div>
            </div>

            {/* 右侧：功能图标区域 (亮度和音量控制) */}
            <div className="flex items-center justify-between shrink-0 w-[144px] min-w-[144px] h-[156px]">
              
              {/* 亮度调节条 */}
              <div 
                ref={brightnessRef}
                className="relative flex items-start rounded-[20px] w-[66px] h-[156px] overflow-hidden bg-[#eeeeee] border border-[#2222220d] cursor-pointer touch-none"
                onMouseDown={(e) => {
                  isDraggingBrightness.current = true;
                  handleDrag(e, 'brightness');
                }}
                onTouchStart={(e) => {
                  isDraggingBrightness.current = true;
                  handleDrag(e, 'brightness');
                }}
              >
                {/* 动态亮度背景填充 - 单一紫色 */}
                <div 
                  className="absolute bottom-0 left-0 w-full bg-[#7A57E8] transition-all duration-100"
                  style={{ height: `${brightness}%` }}
                />
                
                {/* 亮度图标 (居底显示，白色) */}
                <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center z-10 pointer-events-none">
                  <img 
                    src="/images/mo14ursi-pb5oyde.svg" 
                    alt="亮度" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 音量调节条 */}
              <div 
                ref={volumeRef}
                className="relative flex items-start rounded-[20px] w-[66px] h-[156px] overflow-hidden bg-[#eeeeee] border border-[#2222220d] cursor-pointer touch-none"
                onMouseDown={(e) => {
                  isDraggingVolume.current = true;
                  handleDrag(e, 'volume');
                }}
                onTouchStart={(e) => {
                  isDraggingVolume.current = true;
                  handleDrag(e, 'volume');
                }}
              >
                {/* 动态音量背景填充 - 单一紫色 */}
                <div 
                  className="absolute bottom-0 left-0 w-full bg-[#7A57E8] transition-all duration-100"
                  style={{ height: `${volume}%` }}
                />
                
                {/* 音量图标 (居底显示，白色) */}
                <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center z-10 pointer-events-none">
                  <img 
                    src="/images/mo14ursi-uygzypb.svg" 
                    alt="音量" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 功能入口卡片 */}
        <div className="inline-flex absolute top-[391px] left-6 items-center w-[346px] h-[72px] z-30">
          {/* 拍拍画廊卡片 */}
          <div 
            className="flex shrink-0 items-center pt-[1px] w-[173px] cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/gallery')}
          >
            <div 
              className="flex flex-grow items-center justify-between mr-[-4px] px-[17px] py-[9px] pr-[17px] pl-[23px] w-[177px] min-w-[177px] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/images/mo0uw8aq-fw9wjm3.svg)' }}
              onClick={() => navigate('/gallery')}
            >
              <p className="leading-[22px] tracking-normal text-white text-[18px] font-semibold">拍拍画廊</p>
              <img 
                src="/images/mo0uw8au-ky3ntp2.png" 
                alt="拍拍画廊图标" 
                className="w-[52px] h-[52px]"
              />
            </div>
          </div>

          {/* 画画日记卡片 */}
          <div 
            className="flex shrink-0 items-center w-[173px] cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/diary')}
          >
            <div 
              className="flex flex-grow items-center justify-between mr-[-1px] ml-[-3px] px-[12px] py-[9px] pr-[12px] pl-[30px] w-[177px] min-w-[177px] bg-cover bg-center bg-no-repeat cursor-pointer"
              style={{ backgroundImage: 'url(/images/mo0uw8aq-olaklxt.svg)' }}
              onClick={() => navigate('/diary')}
            >
              <p className="leading-[24px] tracking-normal text-[#222222] text-[18px] font-semibold">画画日记</p>
              <img 
                src="/images/mo0uw8au-j4envkv.png" 
                alt="画画日记图标" 
                className="w-[52px] h-[52px]"
              />
            </div>
          </div>
        </div>

        {/* 底部导航栏 */}
        <BottomNav />

        {!minorModeEnabled && (
          <button
            type="button"
            aria-label="体验首次进入"
            onClick={startFirstEntryDemo}
            className="absolute bottom-[92px] left-1/2 z-[60] -translate-x-1/2 text-[10px] font-medium text-[#aaa6af]"
          >
            体验首次进入
          </button>
        )}

        {showDialogueConsent && (
          <div
            className="absolute inset-0 z-[500] flex items-center justify-center bg-black/62 px-[24px]"
            onClick={() => setShowDialogueConsent(false)}
          >
            <div
              className="relative mt-[14px] w-[326px] pt-[82px] text-left"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src="/images/dialogue-consent-hero.png"
                alt=""
                aria-hidden="true"
                className="absolute left-1/2 top-0 z-10 h-[184px] w-[230px] -translate-x-1/2 object-contain"
              />
              <div className="relative rounded-[24px] bg-white px-[22px] pb-[24px] pt-[104px] shadow-[0_18px_42px_rgba(70,57,87,0.18)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[104px] overflow-hidden rounded-t-[24px]">
                  <div className="absolute left-[-34px] top-[-38px] h-[96px] w-[96px] rounded-full bg-[#f4efff]" />
                  <div className="absolute right-[-34px] top-[-38px] h-[96px] w-[96px] rounded-full bg-[#f4efff]" />
                  <div className="absolute left-[96px] top-[30px] h-[96px] w-[96px] rounded-full bg-[#f4efff]" />
                </div>
                <h2 className="relative text-center text-[20px] font-bold leading-[28px] text-[#26232a]">
                  让{pet.name}陪你聊一聊
                </h2>
                <p className="relative mt-[16px] text-[14px] font-medium leading-[26px] text-[#67636d]">
                  开启后，{pet.name}会在互动过程中获取必要的语音和画面信息，并上传至云端进行 AI 分析与处理，帮助它更好地听懂你、回应你。悄悄话仅面向年满 16 周岁的用户开放。请确认你已满 16 周岁，再和{pet.name}说说话吧。
                </p>
                <div className="relative mt-[18px] flex items-start gap-3 text-[13px] font-medium leading-[22px] text-[#aaa6af]">
                  <button
                    type="button"
                    aria-label={dialogueConsentChecked ? '取消勾选协议' : '勾选同意协议'}
                    aria-pressed={dialogueConsentChecked}
                    onClick={() => setDialogueConsentChecked(!dialogueConsentChecked)}
                    className={`mt-0.5 flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[7px] border-2 ${
                      dialogueConsentChecked
                        ? 'border-[#8b66ef] bg-[#8b66ef] text-white'
                        : 'border-[#d8d5dc] bg-white text-transparent'
                    }`}
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
                  <span>
                    我已阅读
                    <button
                      type="button"
                      onClick={() => navigate('/policies/privacy?returnTo=/')}
                      className="mx-1 font-semibold text-[#7c5ae0]"
                    >
                      《隐私政策》
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/policies/subscription?returnTo=/')}
                      className="mr-1 font-semibold text-[#7c5ae0]"
                    >
                      《使用协议》
                    </button>
                    并同意协议内容。
                  </span>
                </div>
                <div className="mt-[22px] grid grid-cols-2 gap-[18px]">
                  <button
                    type="button"
                    onClick={() => setShowDialogueConsent(false)}
                    className="h-[48px] rounded-full bg-[#d6d6d8] text-[16px] font-bold text-white"
                  >
                    下次再说
                  </button>
                  <button
                    type="button"
                    disabled={!dialogueConsentChecked}
                    onClick={() => {
                      if (!dialogueConsentChecked) return;
                      grantVoiceConsent();
                      setShowDialogueConsent(false);
                      setShowDialogueTutorial(true);
                    }}
                    className={`h-[48px] rounded-full text-[16px] font-bold text-white ${
                      dialogueConsentChecked
                        ? 'bg-[#8b66ef] shadow-[0_10px_22px_rgba(139,102,239,0.22)]'
                        : 'bg-[#c9b6f6]'
                    }`}
                  >
                    确认并同意
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDialogueTutorial && (
          <div className="absolute inset-0 z-[510] flex flex-col bg-white text-left">
            <div className="flex h-11 items-center justify-between px-7 pt-2 text-[#19181f]">
              <span className="text-[15px] font-semibold">9:41</span>
              <div className="flex items-center gap-[6px]">
                <div className="flex items-end gap-[2px]">
                  {[6, 9, 12, 15].map((height) => (
                    <span key={height} className="w-[3px] rounded-full bg-current" style={{ height }} />
                  ))}
                </div>
                <div className="relative h-[13px] w-[19px] overflow-hidden">
                  <span className="absolute left-0 top-[2px] h-[14px] w-[19px] rounded-t-full border-[3px] border-current" />
                  <span className="absolute left-[7px] top-[8px] h-[5px] w-[5px] rounded-full bg-current" />
                </div>
                <div className="relative h-[13px] w-[25px] rounded-[4px] border-2 border-current">
                  <span className="absolute right-[-4px] top-[2px] h-[5px] w-[2px] rounded-r bg-current" />
                  <span className="absolute inset-[2px] rounded-[1px] bg-current" />
                </div>
              </div>
            </div>
            <div className="relative flex h-[56px] items-center justify-center">
              <button
                type="button"
                aria-label="关闭新手教程"
                onClick={() => setShowDialogueTutorial(false)}
                className="absolute left-[19px] top-[6px] flex h-10 w-10 items-center justify-center text-[#222127]"
              >
                <X size={26} strokeWidth={2.2} />
              </button>
              <h2 className="text-[17px] font-bold text-[#222127]">怎么和{pet.name}说悄悄话？</h2>
            </div>

            <img
              src="/images/dialogue-tutorial-panels.png"
              alt=""
              aria-hidden="true"
              className="mx-auto mt-[6px] h-[202px] w-[379px] object-cover"
            />

            <div className="px-[21px] pt-[26px]">
              {[
                {
                  title: '01. 在App打开「悄悄话模式」开关',
                  body: `打开开关，为${pet.name}带上悄悄话项圈，${pet.name}才能和你用人类的语言沟通哦。`,
                },
                {
                  title: `02. 面对${pet.name}，随便和它聊聊`,
                  body: `和${pet.name}随便聊聊，好好的感受彼此的心意吧❤️`,
                },
                {
                  title: '03.「悄悄话项圈」每天都会刷新免费的「心声能量」',
                  body: '每天8：00刷新免费的心声能量。能量耗尽后，可以去小窝使用积分兑换额外的心声能量哦👌',
                },
                {
                  title: '04.如何退出「悄悄话模式」？',
                  body: `和${pet.name}说“不聊啦”或从App关闭「悄悄话模式」开关，可暂停消耗「心声能量」。积分兑换的「心声能量」可保留，不会每日刷新。`,
                },
              ].map((item, index) => (
                <section key={item.title} className={index === 0 ? '' : 'mt-[25px]'}>
                  <h3 className="inline bg-[#e9fb37] box-decoration-clone px-0.5 text-[17px] font-black leading-[28px] text-[#222127]">
                    {item.title}
                  </h3>
                  <p className="mt-[13px] text-[13px] font-medium leading-[26px] text-[#6d6973]">{item.body}</p>
                </section>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowDialogueTutorial(false);
                setDialogueEnabled(true);
                navigate('/dialogue-mode');
              }}
              className="mx-auto mt-auto mb-[73px] flex h-[47px] w-[236px] items-center justify-center rounded-[14px] bg-[#8b66ef] text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(128,87,223,0.18)]"
            >
              知道啦
            </button>
            <div className="absolute bottom-[11px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
          </div>
        )}
      </div>
      {/* Diary Modal Overlay */}
      {showDiaryModal && (
        <div 
          className="fixed inset-0 bg-[#19181f99] z-[100] flex items-center justify-center"
          onClick={() => setShowDiaryModal(false)}
        >
          {/* Modal Container */}
          <div 
            className="relative w-[331px] h-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* White Card Background */}
            <div className="absolute top-[104px] left-0 w-[331px] h-[376px] bg-white rounded-[20px] overflow-hidden shadow-xl">
              
              {/* Decorative SVG background at the top of the white card */}
              <img 
                src="/images/mo1dozs2-8w5v0kq.svg" 
                alt="Background Decoration" 
                className="absolute top-[-56px] left-0 w-[331px] h-[175px]" 
              />

              {/* Content Box */}
              <div className="absolute top-[76px] left-[24px] w-[283px] flex flex-col items-center gap-[20px]">
                
                {/* Titles & Description */}
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <p className="w-full text-center text-[#222222] font-medium text-[16px] leading-[24px]">
                    开启派派日记功能，<br />
                    让「ropet」记下此刻。
                  </p>
                  <p className="w-full text-center text-[#555555] text-[14px] leading-[24px]">
                    需要先开启“派派日记”功能，（该功能可在详情右上角进行关闭），日记功能开启即代表你同意 ropet 将内容上传并进行AI处理和训练。
                  </p>
                </div>

                {/* Consent Checkbox Row */}
                <div className="flex items-start gap-[8px] w-full px-[12px] cursor-pointer" onClick={() => setIsDiaryChecked(!isDiaryChecked)}>
                  <div className={`w-[16px] h-[16px] border-2 rounded-[4px] shrink-0 mt-[1px] flex items-center justify-center transition-colors ${isDiaryChecked ? 'border-[#7c5ae0] bg-[#7c5ae0]' : 'border-[#22222233]'}`}>
                    {isDiaryChecked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <p className="w-[235px] text-[12px] leading-[17px] text-[#000000]">
                    <span className="text-[#22222266]">我已阅读</span>
                    <span
                      role="link"
                      tabIndex={0}
                      className="cursor-pointer font-medium text-[#7c5ae0]"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate('/policies/privacy?returnTo=/');
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ' ') return;
                        event.preventDefault();
                        event.stopPropagation();
                        navigate('/policies/privacy?returnTo=/');
                      }}
                    >
                      《Ropet 隐私政策》
                    </span>
                    <span className="text-[#22222266]">并同意协议内容。</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-[20px] w-full px-[12px] mt-[4px]">
                  <button 
                    className="flex-1 h-[46px] rounded-[23px] bg-[#19181f33] text-white text-[14px] font-medium leading-[20px] flex items-center justify-center cursor-pointer hover:bg-[#19181f4d] transition-colors"
                    onClick={() => setShowDiaryModal(false)}
                  >
                    下次再说
                  </button>
                  <button 
                    disabled={!isDiaryChecked}
                    className={`flex-1 h-[46px] rounded-[23px] text-white text-[14px] font-medium leading-[20px] flex items-center justify-center transition-colors ${isDiaryChecked ? 'bg-[#7c5ae0] cursor-pointer hover:bg-[#6c4cd0]' : 'bg-[#7c5ae066] cursor-not-allowed'}`}
                    onClick={() => {
                      if (isDiaryChecked) {
                        setShowDiaryModal(false);
                        navigate('/diary-rules');
                      }
                    }}
                  >
                    同意开启
                  </button>
                </div>

              </div>
            </div>

            {/* Top Illustration (Character) */}
            <div className="absolute top-[10px] left-[61px] w-[207px] h-[166px] pointer-events-none">
              {/* Blur Shadow */}
              <div className="absolute top-[136px] left-[65px] w-[130px] h-[30px] bg-[#e9e4f7] rounded-full blur-[3px]"></div>
              {/* Main Image */}
              <img 
                src="/images/mo1dozs6-k2z6adl.png" 
                alt="Character Illustration" 
                className="absolute top-0 left-0 w-[207px] h-[158px]" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

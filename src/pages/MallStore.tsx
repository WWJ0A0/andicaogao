import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AudioWaveform,
  BatteryCharging,
  BookHeart,
  Coins,
  Gift,
  LoaderCircle,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Volume2,
  X,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import PointsBalancePill from '@/components/PointsBalancePill';
import { useDialogueStore } from '@/store/useDialogueStore';

type MallCategory = 'eyes' | 'eyelids' | 'voice' | 'frames' | 'themes' | 'diaries';
type MallKind = 'eye' | 'voice' | 'frame' | 'theme' | 'diary' | 'item';
type MallView = 'picks' | 'shelves';

type MallProduct = {
  id: string;
  category: MallCategory;
  kind: MallKind;
  name: string;
  price: number;
  recommended?: boolean;
  discount?: number;
  discountLabel?: string;
  material: 'aiPaper' | 'renameCard';
  materialName: 'AI 画纸' | '改名卡';
  materialCost: number;
  tone: string;
  accent: string;
  eyeSpritePosition?: string;
  voiceImagePosition?: string;
  voiceShelfPosition?: string;
  itemImage?: string;
  cardImage?: string;
  repeatable?: boolean;
  inventoryEffect?: 'battery' | 'renameCard' | 'aiPaper';
};

const mallTabs = [
  { id: 'picks', label: '折扣专区', helper: '优惠进行中', icon: Sparkles },
  { id: 'shelves', label: '宝贝橱窗', helper: '慢慢挑装扮', icon: ShoppingBag },
] as const;

const categoryMeta: Record<MallCategory, { label: string; shortLabel: string; color: string }> = {
  eyes: { label: '美瞳小柜', shortLabel: '美瞳', color: '#6f5ee8' },
  eyelids: { label: '眼影抽屉', shortLabel: '眼影', color: '#e773a0' },
  voice: { label: '声音糖罐', shortLabel: '声音', color: '#3f9ec6' },
  frames: { label: '限定封面', shortLabel: '封面', color: '#d89138' },
  themes: { label: '主题衣橱', shortLabel: '主题', color: '#795ed8' },
  diaries: { label: '日记贴纸', shortLabel: '日记', color: '#52aacd' },
};

const categoryTabs = (['eyes', 'eyelids', 'voice'] as MallCategory[]).map((id) => ({
  id,
  label: categoryMeta[id].shortLabel,
}));

const products: MallProduct[] = [
  { id: 'galaxy-eyes', category: 'eyes', kind: 'eye', name: '紫曜星河', price: 5000, recommended: true, discount: 0.8, discountLabel: '8折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#d9c8ff] via-[#f5efff] to-white', accent: '#6d41d8', eyeSpritePosition: '0% 0%', cardImage: '/images/mall-product-galaxy-eyes.jpg' },
  { id: 'caramel-eyes', category: 'eyes', kind: 'eye', name: '熔岩落日', price: 4000, recommended: true, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#ffd0ad] via-[#fff0d8] to-white', accent: '#d4512f', eyeSpritePosition: '50% 0%' },
  { id: 'obsidian-eyes', category: 'eyes', kind: 'eye', name: '黑曜夜幕', price: 3000, recommended: true, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#c6c1c9] via-[#eeebf0] to-white', accent: '#383238', eyeSpritePosition: '100% 0%', cardImage: '/images/mall-product-obsidian-eyes.jpg' },
  { id: 'forest-eyes', category: 'eyes', kind: 'eye', name: '圣诞森语', price: 5000, recommended: true, discount: 0.8, discountLabel: '8折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#bcd7a8] via-[#edf5d8] to-white', accent: '#3f8248', eyeSpritePosition: '0% 50%', cardImage: '/images/mall-product-forest-eyes.jpg' },
  { id: 'rainbow-pixel-eyes', category: 'eyes', kind: 'eye', name: '像素彩虹', price: 5000, recommended: true, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#ffe1b9] via-[#f1e2ff] to-white', accent: '#8c62e8', eyeSpritePosition: '50% 50%', cardImage: '/images/mall-product-rainbow-pixel-eyes.jpg' },
  { id: 'reindeer-eyes', category: 'eyes', kind: 'eye', name: '金夜驯鹿', price: 4000, recommended: true, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#d6b98c] via-[#fff0d6] to-white', accent: '#80633b', eyeSpritePosition: '100% 50%' },
  { id: 'moon-pixel-eyes', category: 'eyes', kind: 'eye', name: '月光像素', price: 4000, recommended: true, discount: 0.75, discountLabel: '7.5折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#cdd7ff] via-[#efeaff] to-white', accent: '#827be6', eyeSpritePosition: '0% 100%', cardImage: '/images/mall-product-moon-pixel-eyes.jpg' },
  { id: 'sunset-pixel-eyes', category: 'eyes', kind: 'eye', name: '霓虹像素', price: 2400, recommended: true, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#e2b8ff] via-[#ffe2da] to-white', accent: '#ad3eca', eyeSpritePosition: '50% 100%' },
  { id: 'mint-eyes', category: 'eyes', kind: 'eye', name: '碧海像素', price: 3000, recommended: true, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#b8e9dd] via-[#eafff8] to-white', accent: '#28a7b8', eyeSpritePosition: '100% 100%', cardImage: '/images/mall-product-mint-eyes.jpg' },
  { id: 'vitality-eyelids', category: 'eyelids', kind: 'eye', name: '元气眼影', price: 48000, material: 'renameCard', materialName: '改名卡', materialCost: 10, tone: 'from-[#ffd1df] via-[#fff0f4] to-white', accent: '#ff7ca6', cardImage: '/images/mall-product-vitality-eyelids.png' },
  { id: 'sunset-eyelids', category: 'eyelids', kind: 'eye', name: '晚霞眼影', price: 48000, material: 'renameCard', materialName: '改名卡', materialCost: 10, tone: 'from-[#a94458] via-[#eab0a7] to-white', accent: '#a83d55', cardImage: '/images/mall-product-sunset-eyelids.png' },
  { id: 'little-lamb', category: 'voice', kind: 'voice', name: '咩咩语', price: 3200, recommended: true, discount: 0.625, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#fff0c9] via-[#fff9e9] to-white', accent: '#8b66ef', voiceImagePosition: '-249px -474px', voiceShelfPosition: '-24px -196px' },
  { id: 'pony-talk', category: 'voice', kind: 'voice', name: '小马语', price: 3200, recommended: true, discount: 0.625, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#dff4ff] via-[#f6fbff] to-white', accent: '#8b66ef', voiceImagePosition: '-245px -314px', voiceShelfPosition: '-205px -196px' },
];

const featuredProductIds = [
  'galaxy-eyes',
  'forest-eyes',
  'moon-pixel-eyes',
  'little-lamb',
  'pony-talk',
];

const bannerSlides = [
  {
    id: 'lucky-carnival',
    title: '幸运嘉年华',
    subtitle: '去抽奖机碰碰今日好运气',
    badge: 'LUCKY CARNIVAL',
    image: '/images/mall-banner-lucky-carnival.gif',
    imagePosition: 'center center',
    hideCopy: true,
    durationMs: 3700,
  },
  {
    id: 'fur-dream',
    title: '柔光星河上新',
    subtitle: '紫曜星河 / 月光像素 本期限定',
    badge: 'NEW DROP',
    image: '/images/mall-banner-fur-dream.png',
    imagePosition: 'center 58%',
    hideCopy: false,
    durationMs: 3600,
  },
  {
    id: 'ropet-arrival',
    title: '肉派派来了',
    subtitle: '去抽奖机碰碰今日好运气',
    badge: 'LUCKY DAY',
    image: '/images/mall-banner-ropet-arrival.png',
    imagePosition: 'center 44%',
    hideCopy: true,
    durationMs: 3600,
  },
] as const;

const isConsumableProduct = (item: MallProduct) => item.repeatable === true;

const ProductArt: React.FC<{ item: MallProduct }> = ({ item }) => {
  if (item.cardImage) {
    return <img src={item.cardImage} alt={item.name} className="absolute inset-0 z-10 h-full w-full object-cover transition-transform duration-200 group-active:scale-[1.03]" />;
  }

  if (item.kind === 'eye') {
    const ropetSize = 'h-[112px] w-[142px]';
    const eyeSize = 'h-[25px] w-[25px]';
    const eyeTop = 'top-[45px]';
    const eyeLeft = 'left-[44px]';
    const eyeRight = 'right-[44px]';

    return (
      <span className={`relative z-10 mb-1 shrink-0 bg-contain bg-center bg-no-repeat transition-transform group-active:-translate-y-1 ${ropetSize}`} style={{ backgroundImage: "url('/images/moiedap1-khtkfqv.png')" }}>
        {item.eyeSpritePosition ? (
          <>
            <span className={`absolute ${eyeLeft} ${eyeTop} ${eyeSize} rounded-full bg-no-repeat mix-blend-multiply`} style={{ backgroundImage: "url('/images/mall-eye-collection.png')", backgroundPosition: item.eyeSpritePosition, backgroundSize: '300% auto' }} />
            <span className={`absolute ${eyeRight} ${eyeTop} ${eyeSize} rounded-full bg-no-repeat mix-blend-multiply`} style={{ backgroundImage: "url('/images/mall-eye-collection.png')", backgroundPosition: item.eyeSpritePosition, backgroundSize: '300% auto' }} />
          </>
        ) : (
          <>
            <span className={`absolute ${eyeLeft} ${eyeTop} flex h-[25px] w-[27px] items-center justify-center rounded-full bg-[#f7f2ef] shadow-[0_1px_3px_rgba(96,67,79,0.12)]`}>
              <span className="mt-1 h-[11px] w-[20px] rounded-[50%] border-t-[4px] border-[#ff83b0]" />
            </span>
            <span className={`absolute ${eyeRight} ${eyeTop} flex h-[25px] w-[27px] items-center justify-center rounded-full bg-[#f7f2ef] shadow-[0_1px_3px_rgba(96,67,79,0.12)]`}>
              <span className="mt-1 h-[11px] w-[20px] rounded-[50%] border-t-[4px] border-[#ff83b0]" />
            </span>
          </>
        )}
      </span>
    );
  }

  if (item.kind === 'voice') {
    return (
      <span
        role="img"
        aria-label={item.name}
        className="absolute inset-0 z-10 bg-no-repeat transition-transform duration-150 group-active:scale-[1.03]"
        style={{
          backgroundImage: "url('/images/mall-voice-shelf-reference.png')",
          backgroundPosition: item.id === 'little-lamb' ? '-25px -203px' : '-212px -203px',
          backgroundSize: '407px 882px',
        }}
      />
    );
  }

  if (item.kind === 'frame') {
    return (
      <span className="relative z-10 h-[150px] w-[250px] overflow-hidden rounded-[14px] border-[4px] border-[#ffd66b] bg-[#8e244f] shadow-[0_14px_28px_rgba(137,54,83,0.32),inset_0_0_0_2px_rgba(255,255,255,0.55)]">
        <span className="absolute inset-[3px] rounded-[6px] bg-[linear-gradient(145deg,#9d174d,#e45f88_48%,#7c1d4b)]" />
        <span className="absolute -right-4 -top-5 h-16 w-16 rounded-full border-[10px] border-[#ffd66b]/45" />
        <span className="absolute -bottom-7 -left-5 h-20 w-20 rounded-full border-[12px] border-white/20" />
        <span className="absolute left-1/2 top-[14px] h-[100px] w-[122px] -translate-x-1/2 bg-contain bg-center bg-no-repeat drop-shadow-[0_7px_9px_rgba(60,15,35,0.38)]" style={{ backgroundImage: "url('/images/moiedap1-khtkfqv.png')" }} />
        <span className="absolute left-4 top-2 text-[20px] text-[#ffe589]">✦</span>
        <span className="absolute right-4 top-5 text-[14px] text-white">✦</span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-black text-white [text-shadow:0_1px_3px_rgba(75,13,39,0.6)]">ROPET NEW YEAR</span>
      </span>
    );
  }

  if (item.kind === 'theme') {
    return (
      <span className="relative z-10 h-[82px] w-[48px] rounded-[8px] border-[4px] border-white shadow-[0_9px_15px_rgba(70,55,94,0.16)]" style={{ backgroundColor: item.accent }}>
        <span className="absolute left-1.5 right-1.5 top-3 h-3 rounded-full bg-white/80" />
        <span className="absolute bottom-2 left-1.5 h-6 w-6 rounded-[7px] bg-white/65" />
      </span>
    );
  }

  if (item.kind === 'diary') {
    return (
      <span className="relative z-10 flex h-[78px] w-[64px] items-center justify-center rounded-r-[8px] border-l-[7px] border-white bg-white/85 shadow-[0_9px_15px_rgba(70,55,94,0.12)]">
        <BookHeart size={30} style={{ color: item.accent }} />
      </span>
    );
  }

  if (item.itemImage) {
    return <img src={item.itemImage} alt={item.name} className="relative z-10 mb-3 h-[78px] w-[78px] object-contain drop-shadow-[0_8px_10px_rgba(70,55,94,0.14)] transition-transform group-active:-translate-y-1" />;
  }

  return (
    <span className="relative z-10 mb-3 flex h-[78px] w-[78px] items-center justify-center rounded-[8px] bg-white/90 shadow-[0_8px_16px_rgba(70,55,94,0.12)] transition-transform group-active:-translate-y-1">
      <BatteryCharging size={42} style={{ color: item.accent }} strokeWidth={1.8} />
    </span>
  );
};

const MallStore: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    points,
    redeemedMallItems,
    mallRedemptionOrders,
    startMallRedemption,
    markMallRedemptionRetry,
    completeMallRedemption,
    refundMallRedemption,
    equippedMallEyeId,
    equippedMallVoiceId,
    equipMallItem,
    resetMallRedemptions,
  } = useDialogueStore();
  const initialShop = searchParams.get('shop');
  const initialView: MallView = initialShop && initialShop !== 'featured' ? 'shelves' : 'picks';
  const initialCategory: MallCategory = categoryTabs.some((category) => category.id === initialShop) ? initialShop as MallCategory : 'eyes';
  const [activeView, setActiveView] = useState<MallView>(initialView);
  const [activeCategory, setActiveCategory] = useState<MallCategory>(initialCategory);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [previousBannerIndex, setPreviousBannerIndex] = useState<number | null>(null);
  const [bannerDirection, setBannerDirection] = useState<-1 | 1>(1);
  const [toast, setToast] = useState('');
  const [buyingProduct, setBuyingProduct] = useState<MallProduct | null>(null);
  const [purchasedProduct, setPurchasedProduct] = useState<MallProduct | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [processingModalOpen, setProcessingModalOpen] = useState(false);
  const [demoFulfillmentOutcome, setDemoFulfillmentOutcome] = useState<'success' | 'failure'>('success');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [equippingProductId, setEquippingProductId] = useState<string | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const pullStartY = useRef<number | null>(null);
  const pullDistanceRef = useRef(0);
  const refreshTimerRef = useRef<number | null>(null);
  const bannerPointerStart = useRef<number | null>(null);
  const bannerTransitionTimerRef = useRef<number | null>(null);
  const suppressBannerClick = useRef(false);
  const equipTimerRef = useRef<number | null>(null);
  const notifiedOrderIds = useRef(new Set<string>());
  const scheduledOrderIds = useRef(new Set<string>());
  const remainingSrRewards = 5;
  const redemptionOrders = useMemo(() => mallRedemptionOrders ?? [], [mallRedemptionOrders]);
  const activeOrder = activeOrderId ? redemptionOrders.find((order) => order.id === activeOrderId) : undefined;
  const activeOrderProduct = activeOrder ? products.find((item) => item.id === activeOrder.itemId) : undefined;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBannerDirection(1);
      setPreviousBannerIndex(activeBannerIndex);
      setActiveBannerIndex((index) => (index + 1) % bannerSlides.length);
      if (bannerTransitionTimerRef.current !== null) window.clearTimeout(bannerTransitionTimerRef.current);
      bannerTransitionTimerRef.current = window.setTimeout(() => setPreviousBannerIndex(null), 720);
    }, bannerSlides[activeBannerIndex].durationMs);
    return () => window.clearTimeout(timer);
  }, [activeBannerIndex]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 1600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => () => {
    if (equipTimerRef.current !== null) window.clearTimeout(equipTimerRef.current);
    if (refreshTimerRef.current !== null) window.clearTimeout(refreshTimerRef.current);
    if (bannerTransitionTimerRef.current !== null) window.clearTimeout(bannerTransitionTimerRef.current);
  }, []);

  useEffect(() => {
    const productId = searchParams.get('buy');
    if (!productId) return;
    const product = products.find((item) => item.id === productId);
    if (!product) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('buy');
      setSearchParams(nextParams, { replace: true });
      setToast('商品不存在或已下架');
      return;
    }
    if (product.kind === 'eye') {
      const returnTo = `/interaction-history?shop=${product.category}`;
      navigate(`/eye-change?source=mall&product=${product.id}&returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
      return;
    }
    if (!product.repeatable && (redeemedMallItems?.[product.id] ?? 0) > 0) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('buy');
      setSearchParams(nextParams, { replace: true });
      setToast('该商品已拥有，无需重复兑换');
      return;
    }
    setBuyingProduct(product);
  }, [navigate, redeemedMallItems, searchParams, setSearchParams]);

  useEffect(() => {
    const productId = searchParams.get('purchased');
    if (!productId) return;
    const product = products.find((item) => item.id === productId);
    if (product) setPurchasedProduct(product);
  }, [searchParams]);

  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'processing') return;
    if (activeOrder.status === 'success' && processingModalOpen && activeOrderProduct) {
      setProcessingModalOpen(false);
      setPurchasedProduct(activeOrderProduct);
      return;
    }
    if (activeOrder.status === 'refunded' && processingModalOpen) {
      setProcessingModalOpen(false);
      setToast(`「${activeOrder.title}」兑换失败，${activeOrder.cost.toLocaleString()} 积分已退回`);
      return;
    }
    if (!processingModalOpen && !notifiedOrderIds.current.has(activeOrder.id)) {
      notifiedOrderIds.current.add(activeOrder.id);
      setToast(activeOrder.status === 'success'
        ? `「${activeOrder.title}」已发放成功，可在兑换记录中查看`
        : `「${activeOrder.title}」兑换失败，积分已退回`);
    }
  }, [activeOrder, activeOrderProduct, processingModalOpen]);

  useEffect(() => {
    redemptionOrders.filter((order) => order.status === 'processing').forEach((order) => {
      if (scheduledOrderIds.current.has(order.id)) return;
      scheduledOrderIds.current.add(order.id);
      const elapsed = Math.max(0, Date.now() - order.createdAtMs);
      const scheduleAt = (delay: number, action: () => void) => window.setTimeout(action, Math.max(0, delay - elapsed));

      scheduleAt(5000, () => markMallRedemptionRetry(order.id, 1));
      if (order.demoOutcome !== 'failure') {
        scheduleAt(8000, () => completeMallRedemption(order.id));
        return;
      }
      scheduleAt(15000, () => markMallRedemptionRetry(order.id, 2));
      scheduleAt(30000, () => markMallRedemptionRetry(order.id, 3));
      scheduleAt(31000, () => refundMallRedemption(order.id));
    });
  }, [completeMallRedemption, markMallRedemptionRetry, redemptionOrders, refundMallRedemption]);

  const activeBanner = bannerSlides[activeBannerIndex];
  const visibleProducts = useMemo(() => {
    const baseProducts = activeView === 'picks'
      ? featuredProductIds.map((id) => products.find((item) => item.id === id)).filter((item): item is MallProduct => Boolean(item))
      : products.filter((item) => item.category === activeCategory);

    return baseProducts
      .map((item, index) => ({ item, index }))
      .sort((left, right) => {
        const leftOwned = !isConsumableProduct(left.item) && (redeemedMallItems?.[left.item.id] ?? 0) > 0;
        const rightOwned = !isConsumableProduct(right.item) && (redeemedMallItems?.[right.item.id] ?? 0) > 0;
        if (leftOwned === rightOwned) return left.index - right.index;
        return leftOwned ? 1 : -1;
      })
      .map(({ item }) => item);
  }, [activeCategory, activeView, redeemedMallItems]);

  const getPointPrice = (item: MallProduct) => (
    item.discount ? Math.round(item.price * item.discount) : item.price
  );

  const updateView = (view: MallView) => {
    setActiveView(view);
    setSearchParams({ shop: view === 'picks' ? 'featured' : activeCategory });
  };

  const updateCategory = (category: MallCategory) => {
    setActiveCategory(category);
    setSearchParams({ shop: category });
  };

  const updatePullDistance = (distance: number) => {
    pullDistanceRef.current = distance;
    setPullDistance(distance);
  };

  const finishRefresh = () => {
    setIsRefreshing(false);
    updatePullDistance(0);
    setToast('刷新完成');
    refreshTimerRef.current = null;
  };

  const startRefresh = () => {
    setIsRefreshing(true);
    updatePullDistance(54);
    if (refreshTimerRef.current !== null) window.clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = window.setTimeout(finishRefresh, 900);
  };

  const handlePullStart = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || isRefreshing || !mainRef.current || mainRef.current.scrollTop > 0) return;
    pullStartY.current = event.clientY;
    setIsPulling(true);
  };

  const handlePullMove = (event: React.PointerEvent<HTMLElement>) => {
    if (pullStartY.current === null || isRefreshing || !mainRef.current) return;
    if (mainRef.current.scrollTop > 0) {
      pullStartY.current = null;
      setIsPulling(false);
      updatePullDistance(0);
      return;
    }
    const distance = Math.max(0, event.clientY - pullStartY.current);
    updatePullDistance(Math.min(76, distance * 0.46));
  };

  const handlePullEnd = () => {
    if (pullStartY.current === null) return;
    pullStartY.current = null;
    setIsPulling(false);
    if (pullDistanceRef.current >= 52) {
      startRefresh();
      return;
    }
    updatePullDistance(0);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    if (isRefreshing || !mainRef.current || mainRef.current.scrollTop > 0) return;
    pullStartY.current = event.touches[0]?.clientY ?? null;
    setIsPulling(pullStartY.current !== null);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    if (pullStartY.current === null || isRefreshing || !mainRef.current) return;
    const distance = Math.max(0, (event.touches[0]?.clientY ?? pullStartY.current) - pullStartY.current);
    if (distance > 0 && event.cancelable) event.preventDefault();
    updatePullDistance(Math.min(76, distance * 0.46));
  };

  const rotateBanner = (direction: -1 | 1) => {
    setBannerDirection(direction);
    setPreviousBannerIndex(activeBannerIndex);
    setActiveBannerIndex((index) => (index + direction + bannerSlides.length) % bannerSlides.length);
    if (bannerTransitionTimerRef.current !== null) window.clearTimeout(bannerTransitionTimerRef.current);
    bannerTransitionTimerRef.current = window.setTimeout(() => setPreviousBannerIndex(null), 720);
  };

  const finishBannerSwipe = (clientX: number) => {
    if (bannerPointerStart.current === null) return;
    const distance = clientX - bannerPointerStart.current;
    bannerPointerStart.current = null;
    if (Math.abs(distance) < 36) return;
    suppressBannerClick.current = true;
    window.setTimeout(() => { suppressBannerClick.current = false; }, 350);
    rotateBanner(distance < 0 ? 1 : -1);
  };

  const openProduct = (item: MallProduct) => {
    const processingOrder = redemptionOrders.find((order) => order.itemId === item.id && order.status === 'processing');
    if (processingOrder) {
      setActiveOrderId(processingOrder.id);
      setProcessingModalOpen(true);
      return;
    }
    if (item.kind === 'eye') {
      const returnTo = `/interaction-history?shop=${item.category}`;
      navigate(`/eye-change?source=mall&product=${item.id}&returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    if (!item.repeatable && (redeemedMallItems?.[item.id] ?? 0) > 0) {
      setToast('该商品已拥有，无需重复兑换');
      return;
    }
    setDemoFulfillmentOutcome('success');
    setBuyingProduct(item);
  };

  const closePurchaseModal = () => {
    setBuyingProduct(null);
    setIsPurchasing(false);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('buy');
    setSearchParams(nextParams, { replace: true });
  };

  const confirmPointPurchase = () => {
    if (!buyingProduct || isPurchasing) return;
    setIsPurchasing(true);
    const pointPrice = getPointPrice(buyingProduct);
    const { result, orderId } = startMallRedemption(buyingProduct.id, buyingProduct.name, pointPrice, {
      repeatable: buyingProduct.repeatable,
      inventoryEffect: buyingProduct.inventoryEffect ?? 'none',
      demoOutcome: demoFulfillmentOutcome,
    });
    if (result === 'insufficient-points') {
      setIsPurchasing(false);
      setToast('积分不足，请先购买积分');
      return;
    }
    if (result === 'already-owned') {
      setBuyingProduct(null);
      setIsPurchasing(false);
      setToast('该商品已拥有，无需重复兑换');
      return;
    }
    if (result === 'already-processing' && orderId) {
      setBuyingProduct(null);
      setActiveOrderId(orderId);
      setProcessingModalOpen(true);
      setIsPurchasing(false);
      return;
    }
    if (result !== 'processing' || !orderId) {
      setBuyingProduct(null);
      setIsPurchasing(false);
      setToast('兑换失败，请稍后重试');
      return;
    }
    setBuyingProduct(null);
    setSearchParams({ shop: activeView === 'picks' ? 'featured' : activeCategory });
    setActiveOrderId(orderId);
    setProcessingModalOpen(true);
    setIsPurchasing(false);

  };

  const closePurchasedProduct = () => {
    if (purchasedProduct?.kind === 'eye') {
      const productId = purchasedProduct.id;
      const returnTo = `/interaction-history?shop=${purchasedProduct.category}`;
      setPurchasedProduct(null);
      navigate(`/eye-change?source=mall&product=${productId}&returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
      return;
    }
    setPurchasedProduct(null);
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-[#d8deea] py-4">
      <div className={`relative h-[852px] w-[393px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] ${activeView === 'shelves' && activeCategory === 'voice' ? 'bg-[#fafafa]' : 'bg-[#f8f2ec]'}`}>
        <div className={`pointer-events-none absolute -left-[58px] -top-[28px] h-[865px] w-[504px] bg-cover bg-center transition-opacity ${activeView === 'shelves' && activeCategory === 'voice' ? 'opacity-0' : 'opacity-50'}`} style={{ backgroundImage: 'url(/images/mo1d92xj-hha9qft.svg)' }} />
        <button
          type="button"
          onClick={() => {
            resetMallRedemptions();
            setBuyingProduct(null);
            setPurchasedProduct(null);
            setProcessingModalOpen(false);
            setActiveOrderId(null);
            setToast('商城演示数据已恢复');
          }}
          className={`absolute right-7 top-[27px] z-[105] flex h-8 items-center rounded-full border border-white/80 bg-white/88 px-3 text-[9px] font-black text-[#5f5664] shadow-[0_5px_14px_rgba(42,31,48,0.14)] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeView === 'shelves' ? 'pointer-events-none -translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}
        >
          <RotateCcw size={12} className="mr-1" />恢复演示
        </button>

        <main
          ref={mainRef}
          onPointerDown={handlePullStart}
          onPointerMove={handlePullMove}
          onPointerUp={handlePullEnd}
          onPointerCancel={handlePullEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handlePullEnd}
          onTouchCancel={handlePullEnd}
          className="absolute bottom-[86px] left-0 right-0 top-0 overflow-y-auto overscroll-y-contain px-5 pb-7 pt-4 scrollbar-hide"
        >
          <div
            aria-live="polite"
            className={`flex items-center justify-center overflow-hidden text-[11px] font-bold text-[#81778a] ${isPulling ? '' : 'transition-[height] duration-300 ease-out'}`}
            style={{ height: pullDistance }}
          >
            <RotateCcw
              size={17}
              className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{ transform: isRefreshing ? undefined : `rotate(${Math.min(180, pullDistance * 3)}deg)` }}
            />
            {isRefreshing ? '正在刷新' : pullDistance >= 52 ? '松开刷新' : '下拉刷新'}
          </div>

          <div aria-hidden={activeView === 'shelves'} className={`-mx-5 -mt-4 overflow-hidden transition-[height,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeView === 'shelves' ? 'h-0 -translate-y-8 scale-y-75 opacity-0' : 'h-[232px] translate-y-0 scale-y-100 opacity-100'}`}>
          <div
            role="button"
            tabIndex={activeView === 'shelves' ? -1 : 0}
            aria-label="进入本期幸运抽奖机"
            onClick={() => {
              if (suppressBannerClick.current) {
                suppressBannerClick.current = false;
                return;
              }
              navigate('/lucky-draw-2');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') navigate('/lucky-draw-2');
            }}
            onPointerDown={(event) => { bannerPointerStart.current = event.clientX; }}
            onPointerUp={(event) => finishBannerSwipe(event.clientX)}
            onPointerCancel={() => { bannerPointerStart.current = null; }}
            className="group relative h-[232px] w-full touch-pan-y overflow-hidden bg-[#28212b] text-left"
          >
            {previousBannerIndex !== null && (
              <img
                key={`previous-${bannerSlides[previousBannerIndex].id}`}
                src={bannerSlides[previousBannerIndex].image}
                alt=""
                className={`mall-banner-exit absolute inset-0 h-full w-full object-cover ${bannerDirection > 0 ? 'mall-banner-exit-left' : 'mall-banner-exit-right'}`}
                style={{ objectPosition: bannerSlides[previousBannerIndex].imagePosition }}
              />
            )}
            <img
              key={activeBanner.id}
              src={activeBanner.image}
              alt=""
              className={`mall-banner-enter absolute inset-0 h-full w-full object-cover ${bannerDirection > 0 ? 'mall-banner-enter-right' : 'mall-banner-enter-left'}`}
              style={{ objectPosition: activeBanner.imagePosition }}
            />
            <span className={`absolute inset-0 z-[2] ${activeBanner.hideCopy ? 'bg-[linear-gradient(0deg,rgba(30,22,38,0.20),transparent_42%)]' : 'bg-[linear-gradient(90deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54)_40%,transparent_68%)]'}`} />
            {!activeBanner.hideCopy && (
              <span key={`copy-${activeBanner.id}`} className="mall-banner-copy-enter contents">
                <span className="absolute left-4 top-4 z-[3] rounded-full border border-white/80 bg-white/76 px-3 py-1 text-[9px] font-black text-[#8a4f21] backdrop-blur-sm">{activeBanner.badge}</span>
                <span className="absolute left-5 top-[50px] z-[3] max-w-[190px] text-[23px] font-black leading-[1.08] text-[#26212b] [text-shadow:0_1px_0_white]">{activeBanner.title}</span>
                <span className="absolute left-5 top-[108px] z-[3] max-w-[190px] text-[11px] font-bold leading-5 text-[#74616d]">{activeBanner.subtitle}</span>
              </span>
            )}
            <span className="absolute bottom-5 left-5 z-[3] inline-flex h-9 items-center gap-1.5 rounded-full bg-[#17121a] px-4 text-[11px] font-black text-white shadow-[0_8px_14px_rgba(0,0,0,0.22)]">
              <Gift size={15} />去抽奖机
            </span>
            <span className="absolute bottom-5 left-[132px] z-[3] rounded-full bg-white/78 px-3 py-2 text-[10px] font-black text-[#6b5966] backdrop-blur-sm">
              SR 待收集 {remainingSrRewards}
            </span>
            <span className="absolute bottom-5 right-4 z-[3] rounded-full bg-[#17121a]/72 px-3 py-2 text-[9px] font-black text-white backdrop-blur-sm">
              {String(activeBannerIndex + 1).padStart(2, '0')} / {String(bannerSlides.length).padStart(2, '0')}
            </span>
          </div>
          </div>

          <nav aria-label="商城浏览方式" className={`relative grid h-[64px] grid-cols-2 gap-1.5 rounded-[19px] border border-white/90 bg-white/88 p-1.5 shadow-[0_8px_20px_rgba(77,61,83,0.08)] backdrop-blur-sm transition-[margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeView === 'shelves' ? 'mt-0' : 'mt-4'}`}>
            {mallTabs.map(({ id, label, helper, icon: Icon }) => {
              const active = activeView === id;
              return (
                <button key={id} type="button" onClick={() => updateView(id)} aria-current={active ? 'page' : undefined} className={`relative flex min-w-0 items-center justify-center gap-2 overflow-hidden rounded-[15px] px-2 text-left transition-all duration-200 active:scale-[0.98] ${active ? 'bg-gradient-to-b from-[#9d6bf2] to-[#7950df] text-white shadow-[0_7px_14px_rgba(105,70,190,0.24)]' : 'bg-white text-[#766d79]'}`}>
                  <Icon size={18} className={active ? 'text-[#ffe38a]' : 'text-[#958998]'} />
                  <span className="min-w-0">
                    <strong className="block truncate text-[14px] font-black">{label}</strong>
                    <span className={`block truncate text-[9px] font-bold ${active ? 'text-white/70' : 'text-[#a29aa5]'}`}>{helper}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {activeView === 'shelves' && (
            <nav aria-label="商品分类" className="mt-3 flex h-10 gap-5 overflow-x-auto scrollbar-hide">
              {categoryTabs.map((category) => {
                const active = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => updateCategory(category.id)}
                    className={`relative h-9 shrink-0 px-1 text-[14px] font-medium transition-colors ${active ? 'text-[#27232b]' : 'text-[#8d8790]'}`}
                  >
                    {category.label}
                    {active && <span className="absolute bottom-0 left-1/2 h-[6px] w-[42px] -translate-x-1/2 -rotate-[7deg] rounded-full bg-[#ffc72c]" />}
                  </button>
                );
              })}
            </nav>
          )}

          <section className={`relative grid grid-cols-2 gap-y-4 ${activeView === 'shelves' && activeCategory === 'voice' ? 'mt-2 gap-x-[17px] px-1' : activeView === 'shelves' ? 'mt-3 gap-x-3' : 'mt-5 gap-x-3'}`} aria-label="商城商品列表">
            {visibleProducts.map((item) => {
              const processingOrder = redemptionOrders.find((order) => order.itemId === item.id && order.status === 'processing');
              const owned = !isConsumableProduct(item) && (redeemedMallItems?.[item.id] ?? 0) > 0;
              const playing = playingVoiceId === item.id;
              const status = processingOrder ? '处理中' : owned ? '已拥有' : item.discountLabel ?? null;

              if (activeView === 'shelves' && activeCategory === 'voice') {
                return (
                  <button key={item.id} type="button" onClick={() => openProduct(item)} className="relative w-[164px] text-left transition-transform active:scale-[0.98]">
                    <span
                      role="img"
                      aria-label={item.name}
                      className="block h-[204px] w-[164px] rounded-[10px] bg-no-repeat"
                      style={{
                        backgroundImage: "url('/images/mall-voice-shelf-reference.png')",
                        backgroundPosition: item.voiceShelfPosition,
                        backgroundSize: '393px 852px',
                      }}
                    />
                    <span
                      role="button"
                      aria-label={playing ? `暂停${item.name}` : `试听${item.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setPlayingVoiceId(playing ? null : item.id);
                      }}
                      className="absolute right-3 top-[164px] h-8 w-[52px] rounded-full"
                    />
                    <strong className="mt-3 block text-[16px] font-semibold leading-5 text-[#28242c]">{item.name}</strong>
                    <span className="mt-1 flex h-5 items-center text-[13px]">
                      <Coins size={15} className="mr-1 text-[#f4bd28]" strokeWidth={2.1} />
                      <span className="font-semibold text-[#7654e7]">{getPointPrice(item).toLocaleString()}</span>
                    </span>
                  </button>
                );
              }

              return (
                <button key={item.id} type="button" onClick={() => openProduct(item)} className={`group relative min-w-0 text-left transition-transform duration-150 active:scale-[0.98] ${item.kind === 'frame' ? 'col-span-2' : ''}`}>
                  {status && (
                    <span className={`absolute left-3 top-3 z-20 inline-flex h-7 max-w-[92px] items-center gap-1.5 rounded-[9px] px-2.5 text-[11px] font-bold shadow-sm ${processingOrder ? 'bg-[#8a73d6] text-white' : owned ? 'bg-[#72ae88] text-white' : 'bg-[#ffc83d] text-white'}`}>
                      {processingOrder ? <LoaderCircle size={12} className="animate-spin" /> : owned ? <Star size={11} fill="currentColor" strokeWidth={0} /> : <Tag size={12} className="text-[#ff4e58]" fill="#ff4e58" />}
                      <span className="truncate">{!processingOrder && !owned && item.discountLabel ? `${item.discountLabel}优惠` : status}</span>
                    </span>
                  )}
                  <span className={`relative flex items-end justify-center overflow-hidden rounded-[14px] bg-[#f3f2f4] ${item.kind === 'frame' ? 'h-[220px]' : 'h-[204px]'}`}>
                    <span className="absolute left-1/2 top-3 h-[84px] w-[116px] -translate-x-1/2 rounded-[50%] bg-white/68 blur-[1px]" />
                    <span className="absolute bottom-2 h-[20px] w-[108px] rounded-[50%] bg-[#d9d0d0] shadow-[inset_0_5px_7px_rgba(255,255,255,0.8),0_7px_8px_rgba(66,51,77,0.15)]" />
                    <ProductArt item={item} />
                    {item.kind === 'voice' && (
                      <span
                        role="button"
                        aria-label={playing ? `暂停${item.name}` : `试听${item.name}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setPlayingVoiceId(playing ? null : item.id);
                        }}
                        className={`absolute bottom-1 right-1 z-20 h-9 w-14 rounded-full ${playing ? 'animate-pulse' : ''}`}
                      />
                    )}
                  </span>
                  <span className="mt-3 block px-0.5">
                    <strong className="block truncate text-[16px] font-bold leading-5 text-[#302b32]">{item.name}</strong>
                  </span>
                  <span className={`mt-1.5 flex h-6 items-center px-0.5 text-[14px] font-bold ${processingOrder ? 'text-[#7056c8]' : owned ? 'text-[#4f8b65]' : 'text-[#8159ea]'}`}>
                    {processingOrder ? <><LoaderCircle size={14} className="mr-1.5 animate-spin" />处理中</> : owned ? '已经在小窝里' : (
                      item.discount ? (
                        <span className="flex min-w-0 items-center gap-x-1">
                          <span className="flex items-center">
                            <Coins size={16} className="mr-1 text-[#ffc52e]" strokeWidth={2.1} />
                            {getPointPrice(item).toLocaleString()}
                          </span>
                          <span className="text-[11px] font-medium text-[#918b94] line-through">{item.price.toLocaleString()}</span>
                        </span>
                      ) : (
                        <><Coins size={16} className="mr-1 text-[#ffc52e]" strokeWidth={2.1} />{item.price.toLocaleString()}</>
                      )
                    )}
                  </span>
                  {!processingOrder && !owned && item.discount && (
                    <span className="mt-1.5 inline-flex h-7 items-center rounded-full bg-[#f0eaff] px-3 text-[12px] font-medium text-[#825bea]">还剩 24 天</span>
                  )}
                </button>
              );
            })}
          </section>
        </main>

        {toast && (
          <div role="status" aria-live="polite" className="pointer-events-none absolute bottom-[190px] left-1/2 z-[90] w-max max-w-[320px] -translate-x-1/2 rounded-full border border-white/25 bg-[#29232f]/95 px-6 py-3.5 text-center text-[13px] font-bold text-white shadow-[0_12px_34px_rgba(24,18,31,0.38)] backdrop-blur-md">
            {toast}
          </div>
        )}

        <BottomNav />

        {buyingProduct && buyingProduct.kind === 'voice' ? (
          <div className="absolute inset-0 z-[115] flex items-end bg-black/50" onClick={closePurchaseModal}>
            <section aria-label={`${buyingProduct.name}声音详情`} className="relative h-[676px] w-full overflow-hidden rounded-t-[28px] bg-white shadow-[0_-18px_42px_rgba(31,25,38,0.18)]" onClick={(event) => event.stopPropagation()}>
              <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
                <PointsBalancePill
                  points={points}
                  onAdd={() => {
                    const returnTo = `/interaction-history?shop=${activeView === 'picks' ? 'featured' : buyingProduct.category}&buy=${buyingProduct.id}`;
                    navigate(`/points-store?returnTo=${encodeURIComponent(returnTo)}`);
                  }}
                  className="max-w-[176px]"
                />
              </div>
              <div
                role="img"
                aria-label={`${buyingProduct.name}场景预览`}
                className="relative h-[384px] w-full bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/mall-voice-shelf-reference.png')",
                  backgroundPosition: buyingProduct.id === 'little-lamb' ? '-58px -470px' : '-492px -470px',
                  backgroundSize: '943px 2045px',
                }}
              >
                <button type="button" aria-label={playingVoiceId === buyingProduct.id ? `暂停${buyingProduct.name}` : `试听${buyingProduct.name}`} onClick={() => setPlayingVoiceId((current) => current === buyingProduct.id ? null : buyingProduct.id)} className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#8259e5] text-white shadow-lg">
                  <AudioWaveform
                    size={23}
                    strokeWidth={2.4}
                    className={playingVoiceId === buyingProduct.id ? 'animate-pulse' : ''}
                  />
                </button>
              </div>
              <div className="flex h-[292px] flex-col px-5 pb-5 pt-4">
                <div className="flex items-center gap-3">
                  <h2 className="min-w-0 flex-1 truncate text-[19px] font-bold text-[#28242c]">{buyingProduct.name}</h2>
                </div>
                <p className="mt-3 text-[12px] leading-5 text-[#8d8791]">
                  {buyingProduct.id === 'little-lamb' ? '咩～咩～，软绵绵的声音，像在草地上轻轻撒娇。' : '轻快又充满活力的小马声线，每次回应都像在快乐奔跑。'}
                </p>
                <p className="mt-2 text-[11px] text-[#aaa3ad]">兑换后将直接放入我的声音</p>
                <div className="mt-auto w-full">
                  <button
                    type="button"
                    disabled={isPurchasing}
                    onClick={() => {
                      if (points >= getPointPrice(buyingProduct)) {
                        confirmPointPurchase();
                        return;
                      }
                      const returnTo = `/interaction-history?shop=${activeView === 'picks' ? 'featured' : buyingProduct.category}&buy=${buyingProduct.id}`;
                      navigate(`/points-store?returnTo=${encodeURIComponent(returnTo)}`);
                    }}
                    className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#8259e5] text-[15px] font-semibold text-white disabled:opacity-60"
                  >
                    {isPurchasing ? '兑换中…' : (
                      <>
                        <Coins size={18} className="mr-2 text-[#ffe074]" strokeWidth={2.2} />
                        {getPointPrice(buyingProduct).toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : buyingProduct ? (
          <div className="absolute inset-0 z-[115] flex items-center justify-center bg-black/55 px-8" onClick={closePurchaseModal}>
            <section className="w-full rounded-[20px] bg-white px-6 py-6 text-center shadow-[0_18px_42px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
              <h2 className="text-[18px] font-semibold text-[#222127]">兑换{buyingProduct.name}</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#222127]">
                本次兑换需要 {getPointPrice(buyingProduct).toLocaleString()} 积分，
                <br />
                当前剩余积分 {points.toLocaleString()}。
              </p>
              <div className="mt-4 flex items-center justify-center gap-3 text-[#222127]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffe49a] text-[13px]">★</span>
                <span className="text-[16px] font-semibold">{getPointPrice(buyingProduct).toLocaleString()}</span>
                <span className="text-[16px] font-semibold">=</span>
                <span className="flex items-center gap-2 rounded-[8px] border border-[#e9e5ef] bg-[#f7f7f8] p-1.5 pr-3 text-[14px] font-semibold">
                  {buyingProduct.kind === 'voice' ? (
                    <span role="img" aria-label={buyingProduct.name} className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#eee8ff] text-[#7656d8]">
                      <Volume2 size={23} strokeWidth={2.3} />
                    </span>
                  ) : buyingProduct.kind === 'item' ? (
                    buyingProduct.itemImage ? (
                      <img src={buyingProduct.itemImage} alt={buyingProduct.name} className="h-10 w-10 rounded-[8px] bg-white object-contain" />
                    ) : (
                      <span role="img" aria-label={buyingProduct.name} className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#e9f7ff] text-[#52bce9]">
                        <BatteryCharging size={23} strokeWidth={2.3} />
                      </span>
                    )
                  ) : buyingProduct.category === 'eyelids' ? (
                    <img src={buyingProduct.cardImage} alt={buyingProduct.name} className="h-10 w-10 rounded-[8px] bg-white object-cover" />
                  ) : (
                    <span role="img" aria-label={buyingProduct.name} className="h-10 w-10 rounded-[7px] bg-white bg-no-repeat" style={{ backgroundImage: "url('/images/mall-eye-collection.png')", backgroundPosition: buyingProduct.eyeSpritePosition, backgroundSize: '300% 300%' }} />
                  )}
                  × 1
                </span>
              </div>
              <p className="mt-3 text-[12px] text-[#8b8792]">
                兑换成功后将直接放入{buyingProduct.kind === 'voice' ? '我的声音' : buyingProduct.category === 'eyelids' ? '我的眼影' : buyingProduct.kind === 'eye' ? '我的美瞳' : buyingProduct.kind === 'item' ? '小窝' : '我的装扮'}
              </p>
              <p className="mt-1 text-[11px] text-[#a09aa8]">
                {isConsumableProduct(buyingProduct) ? '消耗型道具，可重复兑换，数量会累加。' : '一次性商品，兑换后不可重复购买。'}
              </p>
              <div className="mt-4 flex items-center justify-between rounded-[12px] bg-[#f5f3f7] px-3 py-2">
                <span className="text-[10px] font-bold text-[#98919d]">原型结果</span>
                <div className="flex rounded-full bg-[#e9e5ed] p-0.5">
                  <button type="button" onClick={() => setDemoFulfillmentOutcome('success')} className={`h-7 rounded-full px-3 text-[10px] font-bold ${demoFulfillmentOutcome === 'success' ? 'bg-white text-[#6650b5] shadow-sm' : 'text-[#9a939f]'}`}>成功</button>
                  <button type="button" onClick={() => setDemoFulfillmentOutcome('failure')} className={`h-7 rounded-full px-3 text-[10px] font-bold ${demoFulfillmentOutcome === 'failure' ? 'bg-white text-[#d85c72] shadow-sm' : 'text-[#9a939f]'}`}>失败退款</button>
                </div>
              </div>
              <button
                type="button"
                disabled={isPurchasing}
                onClick={() => {
                  if (points >= getPointPrice(buyingProduct)) {
                    confirmPointPurchase();
                    return;
                  }
                  const returnTo = `/interaction-history?shop=${activeView === 'picks' ? 'featured' : buyingProduct.category}&buy=${buyingProduct.id}`;
                  navigate(`/points-store?returnTo=${encodeURIComponent(returnTo)}`);
                }}
                className="mt-5 h-12 w-full rounded-[14px] bg-[#7c5ae0] text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isPurchasing ? '兑换中...' : points >= getPointPrice(buyingProduct) ? '确定兑换' : '去购买积分'}
              </button>
              <button type="button" disabled={isPurchasing} onClick={closePurchaseModal} className="mt-3 h-11 w-full rounded-[14px] border border-[#e6e1ed] bg-white text-[14px] font-semibold text-[#4f4a55] disabled:opacity-50">取消</button>
            </section>
          </div>
        ) : null}

        {processingModalOpen && activeOrder?.status === 'processing' && (
          <div className="absolute inset-0 z-[130] flex items-center justify-center bg-black/25">
            <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-white/95 shadow-[0_12px_30px_rgba(35,28,44,0.18)]">
              <LoaderCircle size={31} className="animate-spin text-[#7c5ae0]" strokeWidth={2.4} />
            </div>
          </div>
        )}

        {purchasedProduct && (
          <div className="absolute inset-0 z-[140] overflow-hidden bg-gradient-to-b from-[#ffb719] via-[#ffd95a] to-[#ffb517] text-[#17121a]">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 30 }).map((_, index) => (
                <Star
                  key={index}
                  className="absolute text-white"
                  fill="white"
                  strokeWidth={0}
                  style={{
                    width: 54 + (index % 3) * 16,
                    height: 54 + (index % 3) * 16,
                    left: `${(index * 37) % 112 - 8}%`,
                    top: `${(index * 23) % 108 - 5}%`,
                    transform: `rotate(${(index % 5) * 13}deg)`,
                  }}
                />
              ))}
            </div>
            <div className="absolute left-1/2 top-[355px] h-[330px] w-[330px] -translate-x-1/2 rounded-full bg-white/65 blur-[38px]" />

            <header className="relative z-10 flex h-[72px] items-center justify-between px-6 pt-2">
              <strong className="text-[16px]">9:41</strong>
              <button type="button" aria-label="关闭兑换成功页面" onClick={closePurchasedProduct} className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/90 text-white">
                <X size={27} strokeWidth={1.8} />
              </button>
            </header>

            <main className="relative z-10 flex flex-col items-center px-6 pt-16">
              <h1 className="text-center text-[49px] font-black text-white [text-shadow:0_7px_0_#17121a]">兑换成功</h1>
              <p className="mt-4 text-[12px] font-black tracking-[3px] text-[#855c16]">SUPER RARE ITEM</p>

              <section className="relative mt-12 h-[330px] w-[245px] rotate-3 rounded-[30px] bg-gradient-to-br from-[#ffc43f] via-[#ffac79] to-[#ff98d2] p-[10px] shadow-[0_24px_42px_rgba(135,82,11,0.30)]">
                <div className="relative h-[262px] overflow-hidden rounded-[23px] bg-white">
                  <span className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ffc947] to-[#ff8c75] px-3 py-1 text-[11px] font-black text-white shadow-sm">◆ SR</span>
                  {purchasedProduct.kind === 'eye' ? (
                    purchasedProduct.category === 'eyelids' ? (
                      <img src={purchasedProduct.cardImage} alt={purchasedProduct.name} className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] object-cover" />
                    ) : (
                      <span role="img" aria-label={purchasedProduct.name} className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 bg-white bg-no-repeat" style={{ backgroundImage: "url('/images/mall-eye-collection.png')", backgroundPosition: purchasedProduct.eyeSpritePosition, backgroundSize: '300% 300%' }} />
                    )
                  ) : purchasedProduct.kind === 'voice' ? (
                    <span className="absolute left-1/2 top-1/2 flex h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#eee8ff] text-[#7656d8]">
                      <Volume2 size={78} strokeWidth={1.8} />
                    </span>
                  ) : purchasedProduct.itemImage ? (
                    <img src={purchasedProduct.itemImage} alt={purchasedProduct.name} className="absolute left-1/2 top-1/2 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 object-contain" />
                  ) : (
                    <span className="absolute left-1/2 top-1/2 flex h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[32px] bg-[#e9f7ff] text-[#52bce9]">
                      {purchasedProduct.kind === 'frame' ? <BookHeart size={82} strokeWidth={1.7} /> : <BatteryCharging size={82} strokeWidth={1.7} />}
                    </span>
                  )}
                </div>
                <strong className="flex h-[58px] items-center justify-center truncate px-3 text-[22px] font-black text-white">{purchasedProduct.name}</strong>
              </section>

              <button
                type="button"
                onClick={() => {
                  if (purchasedProduct.category === 'eyelids') {
                    navigate(`/eye-change?source=mall&product=${purchasedProduct.id}&returnTo=${encodeURIComponent('/interaction-history?shop=eyelids')}`);
                    return;
                  }
                  if (purchasedProduct.kind === 'eye' || purchasedProduct.kind === 'voice') {
                    const equippedId = purchasedProduct.kind === 'eye' ? equippedMallEyeId : equippedMallVoiceId;
                    if (equippedId === purchasedProduct.id || equippingProductId === purchasedProduct.id) return;
                    setEquippingProductId(purchasedProduct.id);
                    equipTimerRef.current = window.setTimeout(() => {
                      equipMallItem(purchasedProduct.id, purchasedProduct.kind as 'eye' | 'voice');
                      setEquippingProductId(null);
                      equipTimerRef.current = null;
                    }, 1900);
                    return;
                  }
                  navigate('/nest');
                }}
                disabled={(purchasedProduct.kind === 'eye' || purchasedProduct.kind === 'voice') && ((purchasedProduct.kind === 'eye' ? equippedMallEyeId : equippedMallVoiceId) === purchasedProduct.id || equippingProductId === purchasedProduct.id)}
                className="mt-16 flex h-14 w-full max-w-[300px] items-center justify-center rounded-full bg-black text-[18px] font-bold text-white shadow-[0_10px_20px_rgba(100,60,0,0.22)] disabled:cursor-default disabled:bg-black/85"
              >
                {purchasedProduct.category === 'eyelids'
                  ? '立即试用'
                  : purchasedProduct.kind === 'eye' || purchasedProduct.kind === 'voice'
                    ? equippingProductId === purchasedProduct.id
                      ? <><LoaderCircle size={20} className="mr-2 animate-spin" />{purchasedProduct.kind === 'voice' ? '学习中…' : '穿戴中…'}</>
                      : (purchasedProduct.kind === 'eye' ? equippedMallEyeId : equippedMallVoiceId) === purchasedProduct.id
                        ? purchasedProduct.kind === 'voice' ? '已学会' : '已穿戴'
                        : purchasedProduct.kind === 'voice' ? '一键学会' : '一键穿戴'
                    : '去小窝'}
              </button>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default MallStore;

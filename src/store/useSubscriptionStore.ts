import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionPlan = 'one-month' | 'auto-renew';
export type EntitlementType = 'none' | 'trial' | 'subscription';
export type PaymentMethod = 'alipay' | 'wechat';
export type PaymentState = 'idle' | 'signing' | 'paying' | 'confirming' | 'opening' | 'success' | 'failed';
export type TrialCardStatus = 'available' | 'active' | 'used';

export interface TrialCard {
  id: string;
  days: number;
  source: string;
  description: string;
  status: TrialCardStatus;
  usedAt?: string;
}

interface SubscriptionStore {
  selectedPlan: SubscriptionPlan;
  subscribedPlan: SubscriptionPlan | null;
  paymentMethod: PaymentMethod;
  entitlement: EntitlementType;
  dialogueEnabled: boolean;
  trialCards: TrialCard[];
  selectedTrialCardId: string;
  activeTrialCardId: string;
  autoRenewEnabled: boolean;
  voiceConsentGranted: boolean;
  paymentState: PaymentState;
  expiryDate: string;
  nextChargeDate: string;
  setSelectedPlan: (plan: SubscriptionPlan) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setDialogueEnabled: (enabled: boolean) => void;
  selectTrialCard: (cardId: string) => void;
  setPaymentState: (state: PaymentState) => void;
  grantVoiceConsent: () => void;
  activateTrial: () => void;
  activateSubscription: () => void;
  resetPrototype: () => void;
}

const initialTrialCards: TrialCard[] = [
  {
    id: 'device-update-7',
    days: 7,
    source: '设备更新福利',
    description: '设备更新后免费获取',
    status: 'available',
  },
  {
    id: 'repair-compensation-10',
    days: 10,
    source: '维修补偿',
    description: '维修服务补偿体验时长',
    status: 'available',
  },
  {
    id: 'activity-gift-3',
    days: 3,
    source: '活动赠送',
    description: '参加活动获得',
    status: 'available',
  },
  {
    id: 'activity-gift-1-a',
    days: 1,
    source: '活动赠送',
    description: '参加活动获得',
    status: 'used',
    usedAt: '2026.05.18',
  },
  {
    id: 'activity-gift-1-b',
    days: 1,
    source: '活动赠送',
    description: '参加活动获得',
    status: 'used',
    usedAt: '2026.05.26',
  },
];

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export const isDateExpired = (dateText: string, now = new Date()) => {
  if (!dateText) return false;
  const [year, month, day] = dateText.split('.').map(Number);
  if (!year || !month || !day) return false;

  const expiry = new Date(year, month - 1, day);
  expiry.setHours(23, 59, 59, 999);
  return expiry.getTime() < now.getTime();
};

const initialState = {
  selectedPlan: 'one-month' as SubscriptionPlan,
  subscribedPlan: null as SubscriptionPlan | null,
  paymentMethod: 'alipay' as PaymentMethod,
  entitlement: 'none' as EntitlementType,
  dialogueEnabled: false,
  trialCards: initialTrialCards,
  selectedTrialCardId: '',
  activeTrialCardId: '',
  autoRenewEnabled: false,
  voiceConsentGranted: false,
  paymentState: 'idle' as PaymentState,
  expiryDate: '',
  nextChargeDate: '',
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      selectTrialCard: (selectedTrialCardId) => set({ selectedTrialCardId }),
      setDialogueEnabled: (dialogueEnabled) => {
        const state = get();
        const expired = !state.autoRenewEnabled && isDateExpired(state.expiryDate);
        if (state.entitlement === 'none' || expired) return;
        set({ dialogueEnabled });
      },
      setPaymentState: (paymentState) => set({ paymentState }),
      grantVoiceConsent: () => set({ voiceConsentGranted: true }),
      activateTrial: () => {
        const cards = get().trialCards;
        const availableCards = cards.filter((card) => card.status === 'available');
        if (availableCards.length === 0) return;
        
        // 如果已有试用或订阅，基于现有到期日期计算；否则从今天开始
        let baseDate = new Date();
        if (
          (get().entitlement === 'trial' || get().entitlement === 'subscription')
          && get().expiryDate
          && !isDateExpired(get().expiryDate)
        ) {
          const [year, month, day] = get().expiryDate.split('.').map(Number);
          baseDate = new Date(year, month - 1, day);
        } else {
          baseDate.setHours(0, 0, 0, 0);
        }
        
        // 找到被选中的体验卡
        const selectedCard = cards.find((card) => card.id === get().selectedTrialCardId && card.status === 'available')
          ?? availableCards[0];
        
        // 计算新的到期日期：在基础日期上增加选中体验卡的天数
        const expiry = new Date(baseDate);
        expiry.setDate(expiry.getDate() + selectedCard.days);
        
        // 获取当前激活的体验卡 ID
        const currentActiveCardIds = cards.filter((card) => card.status === 'active').map((card) => card.id);
        
        // 如果开启了自动续费，扣款日也顺延
        let newNextChargeDate = get().nextChargeDate;
        if (get().autoRenewEnabled && get().nextChargeDate) {
          const [ny, nm, nd] = get().nextChargeDate.split('.').map(Number);
          const nextCharge = new Date(ny, nm - 1, nd);
          nextCharge.setDate(nextCharge.getDate() + selectedCard.days);
          newNextChargeDate = formatDate(nextCharge);
        }
        
        // 保持 entitlement 状态：如果已经是 subscription 就保持 subscription，否则设为 trial
        const newEntitlement = get().entitlement === 'subscription' ? 'subscription' : 'trial';
        
        set({
          entitlement: newEntitlement,
          dialogueEnabled: true,
          trialCards: cards.map((card) => (
            card.id === selectedCard.id ? { ...card, status: 'active' as TrialCardStatus } : card
          )),
          selectedTrialCardId: '',
          activeTrialCardId: [...currentActiveCardIds, selectedCard.id].join(','),
          paymentState: 'success',
          expiryDate: formatDate(expiry),
          nextChargeDate: newNextChargeDate,
        });
      },
      activateSubscription: () => {
        const subscribedPlan = get().selectedPlan;
        const autoRenewEnabled = subscribedPlan === 'auto-renew';
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 1);
        set({
          entitlement: 'subscription',
          dialogueEnabled: true,
          subscribedPlan,
          autoRenewEnabled,
          paymentState: 'success',
          expiryDate: formatDate(expiry),
          nextChargeDate: autoRenewEnabled ? formatDate(expiry) : '',
        });
      },
      resetPrototype: () => set(initialState),
    }),
    {
      name: 'ropet-subscription-prototype',
    },
  ),
);

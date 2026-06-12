import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionPlan = 'one-month' | 'auto-renew';
export type EntitlementType = 'none' | 'trial' | 'subscription';
export type PaymentMethod = 'alipay' | 'wechat' | 'apple' | 'google' | 'stripe' | 'paypal';
export type PaymentState = 'idle' | 'signing' | 'paying' | 'confirming' | 'opening' | 'success' | 'failed';
export type TrialCardStatus = 'available' | 'active' | 'used';
export type OrderStatus = 'paid' | 'refunding' | 'refunded';

export interface TrialCard {
  id: string;
  days: number;
  source: string;
  description: string;
  status: TrialCardStatus;
  orderNo?: string;
  usedAt?: string;
}

export interface SubscriptionOrder {
  id: string;
  orderNo: string;
  plan: SubscriptionPlan;
  deviceName: string;
  paymentMethod: PaymentMethod;
  paidAt: string;
  amount: number;
  status: OrderStatus;
}

interface SubscriptionStore {
  selectedPlan: SubscriptionPlan;
  subscribedPlan: SubscriptionPlan | null;
  paymentMethod: PaymentMethod;
  entitlement: EntitlementType;
  dialogueEnabled: boolean;
  trialCards: TrialCard[];
  orders: SubscriptionOrder[];
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
  { id: 'device-update-7', days: 7, source: '设备更新福利', description: '设备更新后免费获取', status: 'available' },
  { id: 'repair-compensation-10', days: 10, source: '维修补偿', description: '维修服务补偿体验时长', status: 'available' },
  { id: 'activity-gift-3', days: 3, source: '活动赠送', description: '参加活动获得', status: 'available' },
  { id: 'activity-gift-1-a', days: 1, source: '活动赠送', description: '参加活动获得', status: 'used', orderNo: 'TC202605180001', usedAt: '2026.05.18' },
  { id: 'activity-gift-1-b', days: 1, source: '活动赠送', description: '参加活动获得', status: 'used', orderNo: 'TC202605260002', usedAt: '2026.05.26' },
];

export const formatSubscriptionDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const formatPaymentTime = (date: Date) => (
  `${formatSubscriptionDate(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
);

const parseDate = (dateText: string) => {
  const [year, month, day] = dateText.split('.').map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
};

export const isDateExpired = (dateText: string, now = new Date()) => {
  const expiry = parseDate(dateText);
  if (!expiry) return false;
  expiry.setHours(23, 59, 59, 999);
  return expiry.getTime() < now.getTime();
};

const addDays = (dateText: string, days: number) => {
  const date = parseDate(dateText) ?? new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return formatSubscriptionDate(date);
};

const addOneMonth = (date: Date) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
};

const initialState = {
  selectedPlan: 'one-month' as SubscriptionPlan,
  subscribedPlan: null as SubscriptionPlan | null,
  paymentMethod: 'alipay' as PaymentMethod,
  entitlement: 'none' as EntitlementType,
  dialogueEnabled: false,
  trialCards: initialTrialCards,
  orders: [] as SubscriptionOrder[],
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
        if (state.entitlement === 'none' || (!state.autoRenewEnabled && isDateExpired(state.expiryDate))) return;
        set({ dialogueEnabled });
      },
      setPaymentState: (paymentState) => set({ paymentState }),
      grantVoiceConsent: () => set({ voiceConsentGranted: true }),
      activateTrial: () => {
        const state = get();
        const now = new Date();
        const selectedCard = state.trialCards.find(
          (card) => card.id === state.selectedTrialCardId && card.status === 'available',
        ) ?? state.trialCards.find((card) => card.status === 'available');
        if (!selectedCard) return;

        const hasValidEntitlement = state.entitlement !== 'none'
          && state.expiryDate
          && !isDateExpired(state.expiryDate);
        const expiryDate = addDays(hasValidEntitlement ? state.expiryDate : formatSubscriptionDate(new Date()), selectedCard.days);
        const nextChargeDate = state.autoRenewEnabled && state.nextChargeDate
          ? addDays(state.nextChargeDate, selectedCard.days)
          : state.nextChargeDate;

        set({
          entitlement: state.entitlement === 'subscription' ? 'subscription' : 'trial',
          dialogueEnabled: true,
          trialCards: state.trialCards.map((card) => (
            card.id === selectedCard.id
              ? {
                  ...card,
                  status: 'active' as TrialCardStatus,
                  orderNo: card.orderNo ?? `TC${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getTime()).slice(-4)}`,
                  usedAt: formatPaymentTime(now),
                }
              : card
          )),
          selectedTrialCardId: '',
          activeTrialCardId: [state.activeTrialCardId, selectedCard.id].filter(Boolean).join(','),
          paymentState: 'success',
          expiryDate,
          nextChargeDate,
        });
      },
      activateSubscription: () => {
        const state = get();
        const now = new Date();
        const plan = state.selectedPlan;
        const autoRenewEnabled = plan === 'auto-renew';
        const hasValidEntitlement = state.entitlement !== 'none'
          && state.expiryDate
          && !isDateExpired(state.expiryDate);
        const entitlementExpiry = hasValidEntitlement ? parseDate(state.expiryDate) : null;
        const expiry = addOneMonth(entitlementExpiry ?? now);
        const amount = plan === 'auto-renew' ? 69.9 : 79.9;
        const id = `order-${now.getTime()}`;

        set({
          entitlement: 'subscription',
          dialogueEnabled: true,
          subscribedPlan: plan,
          autoRenewEnabled,
          paymentState: 'success',
          expiryDate: formatSubscriptionDate(expiry),
          nextChargeDate: autoRenewEnabled ? formatSubscriptionDate(expiry) : '',
          orders: [
            {
              id,
              orderNo: `RP${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getTime()).slice(-6)}`,
              plan,
              deviceName: '肉派派',
              paymentMethod: state.paymentMethod,
              paidAt: formatPaymentTime(now),
              amount,
              status: 'paid',
            },
            ...state.orders,
          ],
        });
      },
      resetPrototype: () => set(initialState),
    }),
    { name: 'ropet-subscription-prototype' },
  ),
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DialogueStore {
  points: number;
  dialogueCards: number;
  dialogueCardInventory: Record<string, number>;
  activeDialogueCard: {
    days: number;
    expiryDate: string;
  } | null;
  pointOrders: {
    id: string;
    orderNo: string;
    deviceName: string;
    points: number;
    amount: number;
    channel?: string;
    paidAt: string;
    status: 'paid';
  }[];
  cardCost: number;
  exchangeCard: (count?: number) => boolean;
  exchangeDialogueCard: (days: number, cost: number, count?: number) => boolean;
  useCard: () => boolean;
  useDialogueCard: (days: number) => boolean;
  clearActiveDialogueCard: () => void;
  addPoints: (amount: number) => void;
  purchasePoints: (points: number, amount: number, deviceName?: string, channel?: string) => void;
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const parseDate = (dateText: string) => {
  const [year, month, day] = dateText.split('.').map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
};

const addDaysFrom = (dateText: string | undefined, days: number) => {
  const base = dateText ? parseDate(dateText) : null;
  const now = new Date();
  const date = base && base.getTime() > now.getTime() ? base : now;
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

const formatPaymentTime = (date: Date) => (
  `${formatDate(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
);

export const useDialogueStore = create<DialogueStore>()(
  persist(
    (set, get) => ({
      points: 1300,
      dialogueCards: 0,
      dialogueCardInventory: {},
      activeDialogueCard: null,
      pointOrders: [],
      cardCost: 1200,
      exchangeCard: (count = 1) => {
        const state = get();
        const cost = state.cardCost * count;
        if (state.points < cost) return false;
        const inventory = state.dialogueCardInventory ?? {};
        set({
          points: state.points - cost,
          dialogueCards: state.dialogueCards + count,
          dialogueCardInventory: {
            ...inventory,
            1: (inventory[1] ?? 0) + count,
          },
        });
        return true;
      },
      exchangeDialogueCard: (days, cost, count = 1) => {
        const state = get();
        const totalCost = cost * count;
        if (state.points < totalCost) return false;
        const key = String(days);
        const inventory = state.dialogueCardInventory ?? {};
        set({
          points: state.points - totalCost,
          dialogueCardInventory: {
            ...inventory,
            [key]: (inventory[key] ?? 0) + count,
          },
          dialogueCards: days === 1 ? state.dialogueCards + count : state.dialogueCards,
        });
        return true;
      },
      useCard: () => {
        const state = get();
        const inventory = state.dialogueCardInventory ?? {};
        const oneDayCount = inventory[1] ?? state.dialogueCards;
        if (oneDayCount <= 0) return false;
        set({
          dialogueCards: Math.max(0, state.dialogueCards - 1),
          dialogueCardInventory: {
            ...inventory,
            1: Math.max(0, oneDayCount - 1),
          },
          activeDialogueCard: {
            days: 1,
            expiryDate: addDaysFrom(state.activeDialogueCard?.expiryDate, 1),
          },
        });
        return true;
      },
      useDialogueCard: (days) => {
        const state = get();
        const key = String(days);
        const inventory = state.dialogueCardInventory ?? {};
        const count = inventory[key] ?? 0;
        if (count <= 0) return false;
        set({
          dialogueCards: days === 1 ? Math.max(0, state.dialogueCards - 1) : state.dialogueCards,
          dialogueCardInventory: {
            ...inventory,
            [key]: Math.max(0, count - 1),
          },
          activeDialogueCard: {
            days,
            expiryDate: addDaysFrom(state.activeDialogueCard?.expiryDate, days),
          },
        });
        return true;
      },
      clearActiveDialogueCard: () => set({ activeDialogueCard: null }),
      addPoints: (amount) => set((state) => ({ points: state.points + amount })),
      purchasePoints: (points, amount, deviceName = '肉派派', channel = 'App Store') => {
        const now = new Date();
        set((state) => ({
          points: state.points + points,
          pointOrders: [
            {
              id: `points-${now.getTime()}`,
              orderNo: `PT${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getTime()).slice(-6)}`,
              deviceName,
              points,
              amount,
              channel,
              paidAt: formatPaymentTime(now),
              status: 'paid',
            },
            ...state.pointOrders,
          ],
        }));
      },
    }),
    { name: 'ropet-dialogue-prototype' },
  ),
);

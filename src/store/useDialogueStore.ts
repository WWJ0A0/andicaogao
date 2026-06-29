import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DialogueStore {
  points: number;
  dialogueCards: number;
  dialogueCardInventory: Record<string, number>;
  activeDialogueCard: {
    fills: number;
    activatedAt: string;
  } | null;
  placedVoiceBatteries: number;
  pointOrders: {
    id: string;
    orderNo: string;
    deviceName: string;
    points: number;
    amount: number;
    channel?: string;
    paidAt: string;
    status: 'creating' | 'unpaid' | 'failed' | 'cancelled' | 'paid' | 'processing' | 'timeout';
  }[];
  cardCost: number;
  exchangeCard: (count?: number) => boolean;
  exchangeDialogueCard: (days: number, cost: number, count?: number) => boolean;
  useCard: () => boolean;
  useDialogueCard: (days: number) => boolean;
  addVoiceBatteryToSlot: () => boolean;
  consumePlacedVoiceBattery: () => boolean;
  clearActiveDialogueCard: () => void;
  addPoints: (amount: number) => void;
  purchasePoints: (points: number, amount: number, deviceName?: string, channel?: string) => void;
  recordPointOrder: (
    points: number,
    amount: number,
    deviceName?: string,
    channel?: string,
    status?: 'creating' | 'unpaid' | 'failed' | 'cancelled' | 'paid' | 'processing' | 'timeout',
  ) => void;
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
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
      placedVoiceBatteries: 0,
      pointOrders: [],
      cardCost: 5000,
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
      exchangeDialogueCard: (_days, cost, count = 1) => {
        const state = get();
        const totalCost = cost * count;
        if (state.points < totalCost) return false;
        const key = '1';
        const inventory = state.dialogueCardInventory ?? {};
        set({
          points: state.points - totalCost,
          dialogueCardInventory: {
            ...inventory,
            [key]: (inventory[key] ?? 0) + count,
          },
          dialogueCards: state.dialogueCards + count,
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
            fills: 1,
            activatedAt: formatPaymentTime(new Date()),
          },
        });
        return true;
      },
      useDialogueCard: (days) => {
        const state = get();
        const key = '1';
        const inventory = state.dialogueCardInventory ?? {};
        const count = Math.max(inventory[key] ?? 0, days === 1 ? state.dialogueCards : 0);
        if (count <= 0) return false;
        set({
          dialogueCards: Math.max(0, state.dialogueCards - 1),
          dialogueCardInventory: {
            ...inventory,
            [key]: Math.max(0, count - 1),
          },
          activeDialogueCard: {
            fills: 1,
            activatedAt: formatPaymentTime(new Date()),
          },
        });
        return true;
      },
      addVoiceBatteryToSlot: () => {
        const state = get();
        if (state.placedVoiceBatteries >= 4) return false;
        const inventory = state.dialogueCardInventory ?? {};
        const inventoryCount = inventory[1] ?? 0;
        const oneDayCount = Math.max(inventoryCount, state.dialogueCards);
        if (oneDayCount <= 0) return false;

        set({
          dialogueCards: Math.max(0, state.dialogueCards - 1),
          dialogueCardInventory: {
            ...inventory,
            1: Math.max(0, oneDayCount - 1),
          },
          placedVoiceBatteries: Math.min(4, state.placedVoiceBatteries + 1),
        });
        return true;
      },
      consumePlacedVoiceBattery: () => {
        const state = get();
        if (state.placedVoiceBatteries <= 0) return false;
        set({
          placedVoiceBatteries: Math.max(0, state.placedVoiceBatteries - 1),
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
      recordPointOrder: (points, amount, deviceName = '肉派派', channel = 'App Store', status = 'processing') => {
        const now = new Date();
        set((state) => ({
          pointOrders: [
            {
              id: `points-${now.getTime()}`,
              orderNo: `PT${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getTime()).slice(-6)}`,
              deviceName,
              points,
              amount,
              channel,
              paidAt: formatPaymentTime(now),
              status,
            },
            ...state.pointOrders,
          ],
        }));
      },
    }),
    { name: 'ropet-dialogue-prototype' },
  ),
);

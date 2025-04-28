import api from '@/lib/axios';
import { create } from 'zustand';

interface SyncState {
    syncInProgress: string[];
    syncError: string | null;
    syncSuccess: boolean;
    startCustomerSync: (customerId: string) => Promise<void>;
}

export const useSyncStore = create<SyncState>((set, get) => ({
    syncInProgress: [],
    syncError: null,
    syncSuccess: false,
    startCustomerSync: async (customerId: string) => {
        try {
            set({ syncInProgress: [...get().syncInProgress, customerId] });
            const response = await api.post(`/sync/${customerId}`);
            if (response.status === 200) {
                set({ syncSuccess: true, syncInProgress: get().syncInProgress.filter(id => id !== customerId) });
              
            }else{
                set({ syncError: "Sync failed", syncInProgress: get().syncInProgress.filter(id => id !== customerId) });
            }
        } catch (error) {
            set({ syncError: "An error occurred during sync", syncInProgress: get().syncInProgress.filter(id => id !== customerId) });

        } 
       

    }
}));
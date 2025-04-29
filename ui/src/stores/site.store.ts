import { ISite } from '@/interfaces';
import api from '@/lib/axios';
import { AxiosResponse } from 'axios';
import { create } from 'zustand';

interface SiteState {
    siteIsUpdating: boolean;
    siteError: string | null;
    siteSuccess: boolean;
    resetSuccess: () => void;
    updateSite: ( siteId:string, data: Partial<ISite>) => Promise<any | void>;
}

export const useSiteStore = create<SiteState>((set, get) => ({
    siteIsUpdating: false,
    siteError: null,
    siteSuccess: false,
    updateSite: async (siteId:string, data: Partial<ISite>) => {
        try {
            set({ siteIsUpdating: true });
            data.id = siteId;
            const response = await api.put(`/sites/${siteId}`, data);
            if (response.status === 200) {
                set({ siteSuccess: true, siteIsUpdating: false });
                
            } else {
                set({ siteError: "Update failed", siteIsUpdating: false });
              
            }
            return response.data;
        } catch (error) {
            set({ siteError: "An error occurred during update", siteIsUpdating: false });
        }
    },
    resetSuccess: () => set({ siteSuccess: false, siteError: null  }),
}));
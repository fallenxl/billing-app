import api from '@/lib/axios';
import { create } from 'zustand';

interface ExportState {
    exportInProgress: boolean;
    exportError: string | null;
    exportSuccess: boolean;
    startExport: (exportData: any) => Promise<void>;
}

export const useExportStore = create<ExportState>((set, get) => ({
    exportInProgress: false,
    exportError: null,
    exportSuccess: false,
    startExport: async (exportData) => {
        try {
            set({ exportInProgress: true, exportError: null, exportSuccess: false });
            const response = await api.post('/export/', exportData);
            if (response.status === 200) {
                console.log("Export successful:", response.data);
                set({ exportSuccess: true, exportInProgress: false });
            } else {
                set({ exportError: "Export failed", exportInProgress: false });
            }
        } catch (error) {
            set({ exportError: "An error occurred during export", exportInProgress: false });
        }
    }
}));
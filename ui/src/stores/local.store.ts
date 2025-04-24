import { ILocal} from '@/interfaces';
import { create } from 'zustand';

interface LocalsState {
    localsSelected: ILocal[];
    addLocal: (local: ILocal) => void;
    removeLocal: (localId: string) => void;
    resetLocals: () => void;
}

export const useLocalsStore = create<LocalsState>((set, get) => ({
    localsSelected: [],
    addLocal: (local) => set((state) => ({ localsSelected: [...state.localsSelected, local] })),
    removeLocal: (localId) => set((state) => ({ localsSelected: state.localsSelected.filter(local => local.id.id !== localId) })),
    resetLocals: () => set({ localsSelected: [] }),
}));
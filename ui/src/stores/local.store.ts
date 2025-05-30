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
    addLocal: (local) => set((state) => {
        const existLocal = state.localsSelected.find(existingLocal => existingLocal.id === local.id);
        if (existLocal) {
            // If the local already exists, do not add it again
            return state;
        }
        return { localsSelected: [...state.localsSelected, local] }
    }),
    removeLocal: (localId) => set((state) => ({ localsSelected: state.localsSelected.filter(local => local.id !== localId) })),
    resetLocals: () => set(() => ({ localsSelected: [] }))
}));
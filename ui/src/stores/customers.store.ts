import config from '@/config';
import { ICustomer } from '@/interfaces';
import api from '@/lib/axios';
import axios from 'axios';
import {create} from 'zustand';

interface CustomersState {
    customers: ICustomer[] | null;
    setCustomers: (customers: ICustomer[]) => void;
    fetchCustomers: () => Promise<void>;
}

export const useCustomersStore = create<CustomersState>((set) => ({
    customers: null,
    setCustomers: (customers) => set({customers}),
    fetchCustomers: async () => {
        try {
            const response = await api.get('/customers/')
            
            set({customers: response.data.data});
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    },
}));
import { ICustomer, ISite } from '@/interfaces';
import api from '@/lib/axios';
import { create } from 'zustand';

interface CustomersState {
    customers: ICustomer[] | null;
    customersSelected: ICustomer[] ;
    setCustomers: (customers: ICustomer[]) => void;
    fetchCustomers: () => Promise<void>;
    fetchSitesByCustomerId: (customerId: string) => Promise<ISite[] | null>;
    fetchCustomerById: (customerId: string) => Promise<ICustomer | null>;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
    customers: null,
    customersSelected: [],
    allCustomersLoaded: false,
    setCustomers: (customers) => set({ customers }),
    fetchCustomers: async () => {
        try {
            const response = await api.get('/customers/')
            set({ customers: response.data.data});
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    },
    fetchSitesByCustomerId: async (customerId) => {
        try {
            const existingCustomer = get().customersSelected?.find(customer => customer.id.id === customerId);
            if (existingCustomer && existingCustomer.sites ) {
                return existingCustomer.sites as ISite[];
            }
            const response = await api.get(`/customers/${customerId}/sites`);
            const sites = response.data.data as ISite[];
            if (response.status !== 200) {
                throw new Error('Failed to fetch sites data');
            }
            const customer = get().customers?.find(customer => customer.id.id === customerId);
            if (customer) { 
                customer.sites = sites;
                set({ customersSelected: [...get().customersSelected || [], customer] });
            }
            return sites
        } catch (error) {
            console.error('Error fetching sites by customer ID:', error);
            return null;
        }
    },
    fetchCustomerById: async (customerId) => {
        try {
            const existingCustomer = get().customers?.find(customer => customer.id.id  === customerId);
            if (existingCustomer) {

                return existingCustomer as ICustomer;
            }
            const response = await api.get(`/customers/${customerId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch customer data');
            }
            set({ customersSelected: [...get().customersSelected || [], response.data.data]});
            return response.data.data as ICustomer;
        } catch (error) {
            console.error('Error fetching customer by ID:', error);
            return null;
        }
    },
}));
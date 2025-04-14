import { ICustomer, ILocal, ISite } from '@/interfaces';
import api from '@/lib/axios';
import { create } from 'zustand';

interface CustomersState {
    customers: ICustomer[] | null;
    customersSelected: ICustomer[] ;
    setCustomers: (customers: ICustomer[]) => void;
    fetchCustomers: () => Promise<void>;
    fetchSitesByCustomerId: (customerId: string) => Promise<ISite[] | null>;
    fetchCustomerById: (customerId: string) => Promise<ICustomer | null>;
    fetchSiteById: (siteId: string) => Promise<ISite | null>;
    fetchLocalsBySiteId: (siteId: string) => Promise<ILocal[] | null>;
    fetchLocalsByCustomerAndSiteId: (customerId: string, siteId: string) => Promise<any>;
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
            const customer = get().customersSelected?.find(customer => customer.id.id === customerId);
            if (customer) { 
                customer.sites = sites;
                set({ customersSelected: get().customersSelected?.map(c => c.id.id === customerId ? customer : c) });
            }
            return sites
        } catch (error) {
            console.error('Error fetching sites by customer ID:', error);
            return null;
        }
    },
    fetchCustomerById: async (customerId) => {
        try {
            const existingCustomer = get().customersSelected?.find(customer => customer.id.id  === customerId);
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
    fetchSiteById: async (siteId) => {
        try {
            const existingCustomer = get().customersSelected?.find(customer => customer.sites?.some(site => site.to.id === siteId));
            if (existingCustomer) {
                const site = existingCustomer.sites?.find(site => site.to.id === siteId);
                return site as ISite;
            }
            const response = await api.get(`/sites/${siteId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch site data');
            }
            return response.data.data as ISite;
        } catch (error) {
            console.error('Error fetching site by ID:', error);
            return null;
        }
    },
    fetchLocalsBySiteId: async (siteId) => {
        try {
            const existingCustomer = get().customersSelected?.find(customer => customer.sites?.some(site => site.to.id === siteId));
            if (existingCustomer) {
                const site = existingCustomer.sites?.find(site => site.to.id === siteId);
                if (site && site.locals) {
                    return site.locals as ILocal[];
                }
            }

            const response = await api.get(`/sites/${siteId}/locals`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch locals data');
            }
            const customer = get().customersSelected?.find(customer => customer.sites?.some(site => site.to.id === siteId));
            if (customer) {
                const site = customer.sites?.find(site => site.to.id === siteId);
                if (site) {
                    site.locals = response.data.data as ILocal[];
                    customer.sites = customer.sites ? customer.sites.map(s => s.to.id === siteId ? site : s) : null;
                    set({ customersSelected: get().customersSelected?.map(c => c.id.id === customer.id.id ? customer : c) });
                }
            }
            return response.data.data as ILocal[];
        } catch (error) {
            console.error('Error fetching locals by site ID:', error);
            return null;
        }
    },

    fetchLocalsByCustomerAndSiteId: async (customerId, siteId) => {
        try {
            
            const customer = await get().fetchCustomerById(customerId);
            const site = await get().fetchSiteById(siteId);

            const locals = await get().fetchLocalsBySiteId(siteId);
            return [customer, site, locals];
            
        } catch (error) {
            console.error('Error fetching locals by customer and site ID:', error);
            return null;
        }
    },
}));
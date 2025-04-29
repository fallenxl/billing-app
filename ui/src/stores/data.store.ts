import { ICustomer, ILocal, ISite, LocalsData } from '@/interfaces';
import api from '@/lib/axios';
import { create } from 'zustand';
export interface LocalsOptions {
    query: string;
    page: number;
    size: number;
}
interface DataState {
    customers: ICustomer[] | null;
    customersSelected: ICustomer[];
    setCustomers: (customers: ICustomer[]) => void;
    fetchCustomers: () => Promise<void>;
    fetchSitesByCustomerId: (customerId: string) => Promise<ISite[] | null>;
    fetchCustomerById: (customerId: string) => Promise<ICustomer | null>;
    fetchSiteById: (siteId: string) => Promise<ISite | null>;
    fetchLocalsBySiteId: (siteId: string, options?: LocalsOptions) => Promise<LocalsData | null>;
    fetchLocalsByCustomerAndSiteId: (customerId: string, siteId: string) => Promise<any>;
    updateSiteSelected: (siteId: string, site: ISite) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
    customers: null,
    customersSelected: [],
    allCustomersLoaded: false,
    setCustomers: (customers) => set({ customers }),
    fetchCustomers: async () => {
        try {
            const response = await api.get('/customers/')
            set({ customers: response.data.data });
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    },
    fetchSitesByCustomerId: async (customerId) => {
        try {
            let existingCustomer = get().customersSelected?.find(customer => customer.id.id === customerId);
            if (existingCustomer && existingCustomer.sites) {
                return existingCustomer.sites as ISite[];
            }
            if (!existingCustomer) {
                const fetchedCustomer = await get().fetchCustomerById(customerId);
                if (fetchedCustomer) {
                    existingCustomer = fetchedCustomer;
                }
            }
            if (!existingCustomer) {
                throw new Error('Customer not found');
            }
            const response = await api.get(`/customers/${existingCustomer.id.id}/sites`);
            const sites = response.data.data as ISite[];
            if (response.status !== 200) {
                throw new Error('Failed to fetch sites data');
            }
            console.log('Fetched sites:', sites);
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
            const existingCustomer = get().customersSelected?.find(customer => customer.id.id === customerId);
            if (existingCustomer) {

                return existingCustomer as ICustomer;
            }
            const response = await api.get(`/customers/${customerId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch customer data');
            }
            set({ customersSelected: [...get().customersSelected || [], response.data.data] });
            return response.data.data as ICustomer;
        } catch (error) {
            console.error('Error fetching customer by ID:', error);
            return null;
        }
    },
    fetchSiteById: async (siteId) => {
        try {
            const existingCustomer = get().customersSelected?.find(customer => customer.sites?.some(site => site.id === siteId));
            if (existingCustomer) {
                const site = existingCustomer.sites?.find(site => site.id === siteId);
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
    fetchLocalsBySiteId: async (siteId, options) => {
        try {
            const site = await get().fetchSiteById(siteId);
            if (!site) throw new Error('Site not found');

            if (site.localsData && site.localsData.locals.length > 0) {
                return site.localsData as LocalsData;
            }
            const page = options?.page || 0;
            const size = options?.size || 50;
            const query = options?.query ? `?query=${options.query}` : '';
            const response = await api.get(`/sites/${site.id}/locals?page=${page}&size=${size}&q=${query}`);
            if (response.status !== 200) throw new Error('Failed to fetch locals data');

            const customers = get().customersSelected ?? [];
            const updatedCustomers = customers.map(customer => {
                if (customer.sites?.some(s => s.id === siteId)) {
                    return {
                        ...customer,
                        sites: customer.sites?.map(s => {
                            if (s.id === siteId) {
                                return {
                                    ...s,
                                    localsData: {
                                        ...s.localsData,
                                        locals: response.data.data as ILocal[],
                                        hasNext: response.data.hasNext,
                                        totalElements: response.data.totalElements,
                                        totalPages: response.data.totalPages,
                                    },
                                };
                            }
                            return s;
                        }),
                    };
                }
                return customer;
            });

            set({ customersSelected: updatedCustomers });

            return {
                locals: response.data.data as ILocal[],
                hasNext: response.data.hasNext,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
            };
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
    updateSiteSelected: (siteId, site) => set((state) => {
        const updatedCustomers = state.customersSelected.map(customer => {
            if (customer.sites?.some(s => s.id === siteId)) {
                return {
                    ...customer,
                    sites: customer.sites?.map(s => (s.id === siteId ? { ...s, ...site } : s)),
                };
            }
            return customer;
        });
        set({ customersSelected: updatedCustomers });
        return { customersSelected: updatedCustomers };
    }),
}));
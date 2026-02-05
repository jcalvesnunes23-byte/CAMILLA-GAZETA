import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Booking } from '../types';
import { supabase } from '../lib/supabaseClient';

interface DayAvailability {
    available: boolean;
    slots: string[]; // ['09:00', '10:30', ...]
}

interface StudioContextType {
    services: Service[];
    bookings: Booking[];
    isAdminAuthenticated: boolean;
    availability: Record<string, DayAvailability>; // Key is "YYYY-MM-DD"
    bookedSlots: { date: string; time: string; status: string }[];
    loading: boolean;

    // Actions
    login: (password: string) => Promise<boolean>;
    logout: () => void;
    updateService: (service: Service) => Promise<void>;
    addService: (service: Service) => Promise<void>;
    deleteService: (id: string) => Promise<void>;
    addBooking: (booking: Booking) => Promise<void>;
    updateBookingStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled') => Promise<void>;
    toggleDayAvailability: (date: string) => Promise<void>;
    updateDaySlots: (date: string, slots: string[]) => Promise<void>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const ADMIN_PASSWORD = '231105';

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string; status: string }[]>([]);
    const [availability, setAvailability] = useState<Record<string, DayAvailability>>({});
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Load initial data from Supabase
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);

            // Check if admin is authenticated (from session storage)
            const authStatus = sessionStorage.getItem('studio_admin_auth');
            const isAdmin = authStatus === 'true';
            setIsAdminAuthenticated(isAdmin);

            // Progressive fetching: fire all and handle individually
            const servicesPromise = supabase.from('services').select('*').order('created_at', { ascending: true })
                .then(res => {
                    if (res.error) throw res.error;
                    const mapped = (res.data || []).map(s => ({
                        id: s.id,
                        name: s.name,
                        price: parseFloat(s.price),
                        description: s.description || '',
                        image: s.image || '',
                        popular: s.popular || false
                    }));
                    setServices(mapped);
                    return mapped;
                });

            const availabilityPromise = supabase.from('availability').select('*')
                .then(res => {
                    if (res.error) throw res.error;
                    const mapped: Record<string, DayAvailability> = {};
                    (res.data || []).forEach(a => {
                        mapped[a.date] = { available: a.available, slots: a.slots || [] };
                    });

                    // Pre-populate defaults for the next 30 days
                    const today = new Date();
                    const defaultSlots = ['09:00', '10:30', '13:00', '14:30', '16:00', '19:00'];
                    for (let i = 0; i < 30; i++) {
                        const date = new Date(today);
                        date.setDate(today.getDate() + i);
                        const dateStr = date.toISOString().split('T')[0];
                        const isSunday = date.getDay() === 0;
                        if (!mapped[dateStr] && !isSunday) {
                            mapped[dateStr] = { available: true, slots: defaultSlots };
                        }
                    }
                    setAvailability(mapped);
                    return mapped;
                });

            const publicBookingsPromise = supabase.from('public_appointments').select('*')
                .then(res => {
                    if (!res.error && res.data) setBookedSlots(res.data);
                });

            if (isAdmin) {
                supabase.from('appointments').select('*').neq('status', 'pending').order('created_at', { ascending: false })
                    .then(res => {
                        if (!res.error && res.data) {
                            const mapped: Booking[] = res.data.map(b => ({
                                id: b.id,
                                serviceId: b.service_id,
                                date: b.date,
                                time: b.time,
                                customerName: b.user_name,
                                customerEmail: b.user_email,
                                customerPhone: b.user_phone,
                                paymentMethod: b.payment_method || 'pix',
                                paymentOption: b.payment_option || 'full',
                                createdAt: b.created_at,
                                status: b.status || 'confirmed',
                                totalAmount: parseFloat(b.total_amount || b.value || 0),
                                depositAmount: parseFloat(b.deposit_amount || 0)
                            }));
                            setBookings(mapped);
                        }
                    });
            }

            // We wait for services at least to turn off the first "hard" loading if needed
            await servicesPromise;

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Authentication
    const login = async (password: string): Promise<boolean> => {
        if (password === ADMIN_PASSWORD) {
            setIsAdminAuthenticated(true);
            sessionStorage.setItem('studio_admin_auth', 'true');
            await loadInitialData(); // Reload data with admin access
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAdminAuthenticated(false);
        sessionStorage.removeItem('studio_admin_auth');
        setBookings([]); // Clear sensitive data
    };

    // Services CRUD
    const updateService = async (service: Service) => {
        try {
            const { data, error } = await supabase
                .from('services')
                .update({
                    name: service.name,
                    price: service.price,
                    description: service.description,
                    image: service.image,
                    popular: service.popular
                })
                .eq('id', service.id)
                .select()
                .single();

            if (error) throw error;

            const updatedService: Service = {
                id: data.id,
                name: data.name,
                price: parseFloat(data.price),
                description: data.description,
                image: data.image,
                popular: data.popular
            };

            setServices(prev => prev.map(s => s.id === service.id ? updatedService : s));
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    };

    const addService = async (service: Service) => {
        try {
            const { data, error } = await supabase
                .from('services')
                .insert({
                    name: service.name,
                    price: service.price,
                    description: service.description,
                    image: service.image,
                    popular: service.popular || false
                })
                .select()
                .single();

            if (error) throw error;

            const newService: Service = {
                id: data.id,
                name: data.name,
                price: parseFloat(data.price),
                description: data.description,
                image: data.image,
                popular: data.popular
            };

            setServices(prev => [...prev, newService]);
        } catch (error) {
            console.error('Error adding service:', error);
            throw error;
        }
    };

    const deleteService = async (id: string) => {
        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    };

    // Bookings CRUD
    const addBooking = async (booking: Booking) => {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .insert({
                    service_id: booking.serviceId,
                    date: booking.date,
                    time: booking.time,
                    user_name: booking.customerName,
                    user_email: booking.customerEmail,
                    user_phone: booking.customerPhone,
                    payment_option: booking.paymentOption,
                    total_amount: booking.totalAmount,
                    deposit_amount: booking.depositAmount,
                    value: booking.totalAmount,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;

            const newBooking: Booking = {
                id: data.id,
                serviceId: data.service_id,
                date: data.date,
                time: data.time,
                customerName: data.user_name,
                customerEmail: data.user_email,
                customerPhone: data.user_phone,
                paymentOption: data.payment_option,
                createdAt: data.created_at,
                status: data.status,
                totalAmount: parseFloat(data.total_amount),
                depositAmount: parseFloat(data.deposit_amount)
            };

            setBookings(prev => [newBooking, ...prev]);
            setBookedSlots(prev => [...prev, {
                date: data.date,
                time: data.time,
                status: data.status
            }]);
        } catch (error) {
            console.error('Error adding booking:', error);
            throw error;
        }
    };

    const updateBookingStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
            loadInitialData();
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    // Availability CRUD
    const toggleDayAvailability = async (date: string) => {
        const current = availability[date] || { available: false, slots: [] };
        const newAvailable = !current.available;

        try {
            const { error } = await supabase
                .from('availability')
                .upsert({
                    date,
                    available: newAvailable,
                    slots: current.slots
                }, { onConflict: 'date' });

            if (error) throw error;

            setAvailability(prev => ({
                ...prev,
                [date]: { ...current, available: newAvailable }
            }));
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    const updateDaySlots = async (date: string, slots: string[]) => {
        const current = availability[date] || { available: true, slots: [] };

        try {
            const { error } = await supabase
                .from('availability')
                .upsert({
                    date,
                    available: current.available,
                    slots
                }, { onConflict: 'date' });

            if (error) throw error;

            setAvailability(prev => ({
                ...prev,
                [date]: { ...current, slots }
            }));
        } catch (error) {
            console.error('Error updating slots:', error);
        }
    };

    return (
        <StudioContext.Provider
            value={{
                services,
                bookings,
                bookedSlots,
                isAdminAuthenticated,
                availability,
                loading,
                login,
                logout,
                updateService,
                addService,
                deleteService,
                addBooking,
                updateBookingStatus,
                toggleDayAvailability,
                updateDaySlots
            }}
        >
            {children}
        </StudioContext.Provider>
    );
};

export const useStudio = () => {
    const context = useContext(StudioContext);
    if (!context) {
        throw new Error('useStudio must be used within StudioProvider');
    }
    return context;
};

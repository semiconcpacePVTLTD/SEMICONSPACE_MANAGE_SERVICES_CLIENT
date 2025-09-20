import React, { createContext, useContext, useState, useEffect } from 'react';

const ServicesContext = createContext();

export const useServices = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
};

export const ServicesProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(
                    `http://${import.meta.env.VITE_BACKEND_HOST_ADMIN}:${import.meta.env.VITE_BACKEND_CATALOG_PORT}/catalog-service/listServices`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }

                const result = await response.json();
                const allServices = result?.data || [];
                setServices(allServices);
                setError(null);
            } catch (err) {
                console.error('Error fetching services for context:', err);
                setError(err.message);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const value = {
        services,
        loading,
        error,
        refetch: () => {
            setLoading(true);
            fetchServices();
        }
    };

    return (
        <ServicesContext.Provider value={value}>
            {children}
        </ServicesContext.Provider>
    );
};

export default ServicesContext;
import React from 'react';
import { useServices } from '@/contexts/ServicesContext';
import Footer18 from './Footer18';

export default function Footer18WithServices(props) {
    const { services, loading } = useServices();

    // Pass the services to the original Footer18 component
    return <Footer18 {...props} services={services} />;
}
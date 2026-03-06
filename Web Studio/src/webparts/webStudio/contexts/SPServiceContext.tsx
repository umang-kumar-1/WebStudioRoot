import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { initializeSP } from '../services/SPService';

interface SPServiceContextType {
    context: WebPartContext;
    isInitialized: boolean;
}

const SPServiceContext = createContext<SPServiceContextType | null>(null);

interface SPServiceProviderProps {
    context: WebPartContext;
    children: React.ReactNode;
}

export const SPServiceProvider: React.FC<SPServiceProviderProps> = ({ context, children }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize SP instance once when provider mounts
    useEffect(() => {
        try {
            initializeSP(context);
            setIsInitialized(true);
            console.log('✅ SharePoint service initialized');
        } catch (error) {
            console.error('❌ Failed to initialize SharePoint service:', error);
        }
    }, [context]);

    return (
        <SPServiceContext.Provider value={{ context, isInitialized }}>
            {children}
        </SPServiceContext.Provider>
    );
};

export const useSPContext = (): SPServiceContextType => {
    const context = useContext(SPServiceContext);
    if (!context) {
        throw new Error('useSPContext must be used within SPServiceProvider');
    }
    return context;
};

export default SPServiceContext;

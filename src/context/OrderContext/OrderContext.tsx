import {FC, ReactNode, createContext, useState, useMemo, useContext} from "react";

interface OrderIdSchema {
    orderId: string | undefined;
    setOrderId: (id: string | undefined) => void;
}

const OrderProviderContext = createContext<OrderIdSchema | undefined>(undefined);

interface IOrderProvider {
    children: ReactNode;
}

const OrderProvider: FC<IOrderProvider> = ({ children }) => {
    const [orderId, setOrderId] = useState<string | undefined>(undefined);

    const value = useMemo(() => ({orderId, setOrderId}),[orderId])

    return (<OrderProviderContext.Provider value={value}>{children}</OrderProviderContext.Provider>)
}

const useOrderId = () => {
    const context = useContext(OrderProviderContext);

    if (!context) {
        throw new Error('useOrderId must be used within a OrderProvider');
    }

    return context;
}

export {OrderProvider, useOrderId}

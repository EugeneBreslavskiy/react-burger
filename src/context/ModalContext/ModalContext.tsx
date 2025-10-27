import {FC, ReactNode, createContext, useState, useMemo, useContext} from "react";

interface RenderModalSchema {
    render: boolean;
    children: ReactNode;
}

interface ModalContextSchema {
    renderModal?: {
        render: boolean;
        children: ReactNode | null;
    };
    setRenderModal: (render: RenderModalSchema) => void;
}

const ModalContext = createContext<ModalContextSchema | undefined>(undefined);

interface IModalProvider {
    children: ReactNode;
}

const ModalProvider: FC<IModalProvider> = ({ children }) => {
    const [renderModal, setRenderModal] = useState<RenderModalSchema | undefined>({render: false, children: <></>});

    const value = useMemo(() => ({renderModal, setRenderModal}),[renderModal])

    return (<ModalContext.Provider value={value}>{children}</ModalContext.Provider>)
}

const useModal = () => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }

    return context;
}

export {ModalProvider, useModal}

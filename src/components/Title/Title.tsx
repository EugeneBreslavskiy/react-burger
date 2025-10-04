import {FC, ReactNode} from "react";

interface ITitle {
    children: ReactNode;
}

const Title: FC<ITitle> = ({children}) => {
    return (<h1 className={'text text_type_main-large'}>{children}</h1>)
}


export {Title}

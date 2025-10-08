import {FC, useEffect} from 'react';
import {BurgerOrderDetailsSchema} from "../../types/ingredients";
import DoneIcon from '../../images/done.svg'
import {useOrderId} from "../../context/OrderContext/OrderContext";

const BurgerOrderDetails: FC<BurgerOrderDetailsSchema> = ({id}) => {
    const {setOrderId} = useOrderId();

    useEffect(() => {
        return () => {
            setOrderId(undefined);
        }
    }, []);

    return (
        <section>
            <div>
                <span>
                    {id}
                </span>
                <span>
                    идентификатор заказа
                </span>
            </div>
            <div>
                <img alt={"Статус заказа"} src={DoneIcon}/>
                <div>
                    <span>
                        Ваш заказ начали готовить
                    </span>
                    <span>
                        Дождитесь готовности на орбитальной станции
                    </span>
                </div>
            </div>
        </section>
    )
}

export {BurgerOrderDetails};

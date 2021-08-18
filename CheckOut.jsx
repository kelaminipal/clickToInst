import MainLayout from "../layouts/MainLayout";
import c from "./checkOut.module.scss";
import {useEffect, useRef, useState} from "react";

import {useDispatch, useSelector} from "react-redux";

import {approveOrder, changeValue, getCartItems} from "../../features/cart/CartSlice";
import * as React from "react";



const CheckOut = () => {
    const dispatch = useDispatch()
    const stateCart = useSelector(state=>state.cart)
    const stateAreItems = useSelector(state => state.cart.areItems)
    const stateItems = useSelector(state => state.cart.cartItems)
    const email = useSelector(state => state.auth.email)
    const [managerId, setManagerId] = useState('');

    useEffect(() => {
        document.title = "Корзина"


        if (email) {

            dispatch(getCartItems(email))

        }
    }, [dispatch, email])



     function CardList() {
        const [cards, setCards] = useState(stateItems);

        function handleCardQuantityChange(id, quantity) {
            // dispatch(changeValue((value) => value.map((item,i) => (item._id + i  === id ? { ...item, quantity } : item))))
            setCards((value) => value.map((item,i) => (item._id + i  === id ? { ...item, quantity } : item)));
        }

        return (
            <div>
                {cards.map((data,i) => (
                    <Card unit={data.unit} key={data._id + i } path={data.path} imgSrc={data.images[0]} title={data.title} description={data.description} quantity={data.quantity}
                          onQuantityChanged={(val) => handleCardQuantityChange(data._id + i, val)} />
                ))}
            </div>
        );
    }
    function Card({ title, path, unit, imgSrc, quantity, onQuantityChanged }) {
        const input = useRef();

        return (
            <div className={c.newProduct}>
                <img className={c.newProductImages} src={`https://xn--j1ano.com${path}${imgSrc}`} alt=""/>
                <div className={c.firstDiv}>{title}
                <h4 className={c.minOrder}><span>Минимальный заказ {unit}</span>
                                    </h4></div>


                <div className={c.quantity}>
                    <button className={c.dicrease}
                            onClick={() => onQuantityChanged(input.current.valueAsNumber === 1 ? 1 : input.current.valueAsNumber - 1)}>-
                    </button>
                    <input id="drue" name="drue" ref={input} value={quantity}
                           onChange={(e) => e.target.valueAsNumber === 0 ? onQuantityChanged(e.target.valueAsNumber + 1) : onQuantityChanged(e.target.valueAsNumber)}
                           type="number"/>
                    <button className={c.increase}
                            onClick={() => onQuantityChanged(input.current.valueAsNumber + 1)}>+
                    </button>
                </div>


            </div>
        );
    }

    let ids = stateItems.map(x=>{
        return x._id
    })

    const ApproveOrder = (e)=>{
        e.preventDefault();
        const elements = e.target["drue"]


        if(elements.length >= 2){

            let valuesOfInputArray = []
            elements.forEach(x=>{

                valuesOfInputArray.push(x.attributes[3].value)
            })



                const managerId = e.target["inputManagers"].value

                dispatch(approveOrder({email,ids,valuesOfInputArray,managerId}))

        }
        else{

            let valuesOfInputArray = []
            valuesOfInputArray.push(elements.value)

            const managerId = e.target["inputManagers"].value

            dispatch(approveOrder({email,ids,valuesOfInputArray,managerId}))
        }











    }





    return (
        <MainLayout>

            <div className={c.container}>
                <h2 className="component__headline">Корзина</h2>
                <>

                    {stateCart.loading ? <div className="con"><div className="container2">
                            <div className="box"></div></div>
                        </div>  : stateAreItems === true ? stateItems.length ?  <>
                        <form className={c.form} onSubmit={e=>ApproveOrder(e)}>
                            <label htmlFor="myBrowser">Введите номер менеджера</label>
                            <input onChange={e => setManagerId(e.target.value.slice(0,3))} className={c.manager} value={managerId} type="number"  id="inputManagers" name="inputManagers"/>


                            <CardList/>

                            <button type="submit"  className={c.approveOrdersBtn}>Подтвердить заказ</button>


                            </form>
                        </> : <center><h2>Нет Элементов в корзине</h2> </center>: null

                       }


                </>


            </div>


        </MainLayout>


)
}
export default CheckOut
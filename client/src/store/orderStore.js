import {create} from "zustand";
import { persist } from "zustand/middleware";

const useOrderStore = create(
    persist(
        (set,get)=>({
            orders: [],
            addOrder: (order)=>
                set((state)=>({
                    orders: [order, ...state.orders]
                })),

                getOrderById:(orderId)=>{
                    return get().orders.find(
                        (order)=> String(order.id)===String(orderId)
                    );
                },
                clearOrders:()=>
                    set({
                        orders:[],
                    }),
        }),
        {
            name:"smart-commerce-orders",
            partialize: (state)=>({
                orders:state.orders,
            }),
        }
    )
);

export default useOrderStore;
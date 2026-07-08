import {create} from "zustand";
import {persist} from "zustand/middleware";
import { coupons } from "../data/coupons.js";
import { getSubtotal } from "../utils/cartCalculations.js";
import { validateCoupon } from "../utils/couponUtils.js";

const useCartStore = create(
  persist((set)=>({
  items:[],
  coupons:null,
  copnMessage:"",
  couponError:"",
  addToCart:(product)=>set((state)=>{
    const existingItem = state.items.find(
      (item)=>item.id===product.id
    );

    if(product.stock <=0){
      return state;
    }


    if(existingItem){
      if(existingItem.quantity >= product.stock){
        return state;
      }

      return{
        items: state.items.map((item)=>
        item.id === product.id
        ?{
          ...item,
          quantity: item.quantity + 1,
        }
        : item
        ),
      };
    }

    return{
      items:[
        ...state.items,
        {
          ...product,
          quantity : 1,
        },
      ],
    };
  }),

  increaseQuantity:(id)=>set((state)=>({
    items:state.items.map((item)=>{
      if(item.id !== id)return item;
      if(item.quantity >= item.stock){
        alert("No more stock available!");
        return item;
      }
      return{
        ...item,
        quantity:item.quantity + 1,
      };
    }),
  })),

  decreaseQuantity : (id)=>set((state)=>({
    items: state.items.map((item)=>{
      return item.id === id
      ?{
        ...item,
        quantity: item.quantity - 1,
      }
      :item
  }).filter((item)=> item.quantity > 0),
  })),


  removeFromCart: (id)=>set((state)=>({
    items: state.items.filter((item)=>
      item.id !==id
    ),
  })),
  clearCart : () => set({items:[],
    coupon:null,
    couponMessage:"",
    couponError:"",

  }),

  applyCoupon:(couponCode,Subtotal)=>set(()=>{
    const result = validateCoupon(couponCode,getSubtotal);
    if(!result.isValid){
      return{
        coupon:null,
        couponMessage:"",
        couponError:result.message,
      };
    }

    return{
      coupon:result.coupon,
      couponMessage:"",
      couponError:"",
    };
  }),
  removeCoupon:()=>set({
    coupon:null,
    couponMessage:"",
    couponError:"",
  }),
})),
 {
      name: "smart-commerce-cart",
      partialize: (state) => ({
        items: state.items,
        coupon:state.coupon,
      }),
    }
  )

export default useCartStore;


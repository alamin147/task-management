import { baseApi } from "./baseApi";

const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteCartProduct: builder.mutation({
      query: (itemFromCart) => {
        let updatedItemCartData = itemFromCart.itemCartData.filter(
          (items: any) => items.itemId !== itemFromCart.currItemData.itemId
        );
        return {
          url: "/deleteCart",
          method: "DELETE",
          body: updatedItemCartData,
        };
      },
      // invali.datesTags: ["carts", "gadgets"],
    }),
    
  }),
});

export const {
  
} = api;

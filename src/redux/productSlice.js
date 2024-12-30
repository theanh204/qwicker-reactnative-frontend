import { createSlice, createSelector } from "@reduxjs/toolkit";

const INIT_PRODUCT = {
  categoryId: null,
  quantity: 1,
  mass: null,
  file: null,
};

const INIT_PRODUCT2 = {
  categoryId: "2",
  quantity: 1,
  mass: "Nhẹ hơn 10 kg",
  file: "/92haksdfslkasdfkljgdlks",
};

const productSlice = createSlice({
  name: "productSlice",
  initialState: {
    product: INIT_PRODUCT2,
    status: "idle",
  },
  reducers: {
    resetProductSlice: (state, action) => {
      Object.assign(state.product, INIT_PRODUCT);
    },
    removeProductData: (state, action) => {
      state.product = INIT_PRODUCT;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
  },
});
export const getProduct = (state) => state.productSlice.product;
export const isProductFulFill = createSelector(getProduct, (product) => {
  const { categoryId, mass, quantity, file } = product;
  return categoryId && mass && quantity && file;
});
export const { removeProductData, setProduct, resetProductSlice } =
  productSlice.actions;
export default productSlice.reducer;

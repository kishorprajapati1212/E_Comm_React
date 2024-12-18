import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const saveorderproduct = createAsyncThunk('user/orderproducts', async (productdata, thunkAPI) => {
  console.log(productdata)
  return productdata;
})

export const saveorderform = createAsyncThunk('user/orderform', async (formdata, thunkAPI) => {
  return formdata;
})

export const saveorderdeatil = createAsyncThunk("user/orderdeatils", async ({ orderdata, paymentId }, thunkAPI) => {
  try {
    const Backend_url =  import.meta.env.VITE_REACT_BACKEND_URL 

    const res = await axios.post(`${Backend_url}/addorder`, { orderdata, paymentId });
    // console.log(paymentId)

    console.log(res.data)
    return res.data
  } catch (error) {
    throw error
  }
})


export const dispalyorder = createAsyncThunk("user/orderstatus", async (userid, thunkAPI) => {
  try {
    const Backend_url =  import.meta.env.VITE_REACT_BACKEND_URL 

    // console.log(userid)
    const orderdata = await axios.get(`${Backend_url}/getorder/${userid}`)
    // console.log(orderdata.data)
    return orderdata.data

  } catch (error) {
    throw error
  }
})

const Orderslice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    product: null,
    orderform: null,
    eror: null,
    orderdata: null
  },
  reducer: {
    clearorder: (state) => {
      state.product = null;
      state.orderform = null;
      state.error = null
    }
  },
  extraReducers: (bulider) => {
    bulider
      .addCase(saveorderproduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(saveorderproduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveorderproduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveorderform.fulfilled, (state, action) => {
        state.loading = false;
        state.orderform = action.payload;
      })
      .addCase(saveorderform.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveorderform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(dispalyorder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderdata = action.payload; // Update orderdata here
      })

  }
})

export default Orderslice.reducer;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { configENV } from "@/config";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: configENV.server_prod_url,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      
      // console.log("token from 12",token)
      if (token) {
        headers.set("authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["tasks","subtask"],

  endpoints: () => ({}),
});

import React, { ReactNode, useEffect, useReducer, useState } from "react";
import { createContext } from "react";

import axios from "axios";
import Product from "../components/Product/Product";

interface ContextProviderProps {
  children: ReactNode;
}

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined
);

interface StoreContextType {
  products: Product[];
  dispatch: (action: Action) => void;
  setToken: (token: string) => void;
  cartTotalAmount: () => number;
  priceAmount: (amount: string) => string;
  totalItems: () => number;
  token: string;
  serverURL: string;
}

export interface PaidProucts {
  userId: String;
  items: Product[];
  amount: number;
  address: {
    firstName: string;
    lastName: string;
  };
  date: Date;
  payment: boolean;
}

// View Interface recipet of paid products
export interface Reciept {
  fullname: string;
  data: Product[];
  amount: number;
  date: Date;
}

export interface Product {
  _id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  image: string;
}

export const ACTIONS = {
  ADD_PRODUCT: "add-product",
  REMOVE_PRODUCT: "remove-product",
  FETCH_PRODUCT: "fetch-product",
  EDIT_PRODUCT: "edit-product",
} as const;

type Action =
  | { type: typeof ACTIONS.ADD_PRODUCT; payLoad: Product }
  | { type: typeof ACTIONS.REMOVE_PRODUCT; payLoad: number }
  | { type: typeof ACTIONS.FETCH_PRODUCT; payLoad: Product[] }
  | { type: typeof ACTIONS.EDIT_PRODUCT; payLoad: Product };

function reducer(product: Product[], action: Action): Product[] {
  switch (action.type) {
    case ACTIONS.ADD_PRODUCT:
      return [...product, action.payLoad];
    case ACTIONS.REMOVE_PRODUCT:
      return product.filter((product) => product._id !== action.payLoad);
    case ACTIONS.FETCH_PRODUCT:
      return [...action.payLoad];
    case ACTIONS.EDIT_PRODUCT:
      return product.map((product) => {
        if (product._id === action.payLoad._id) {
          return {
            ...product,
            name: action.payLoad.name,
            category: action.payLoad.category,
            quantity: action.payLoad.quantity,
            price: action.payLoad.price,
          };
        } else {
          return product;
        }
      });
    default:
      return product;
  }
}

const ContextProvider: React.FC<ContextProviderProps> = (props) => {
  const [products, dispatch] = useReducer(reducer, []);
  const [token, setToken] = useState("");

  const serverURL = "http://localhost:3000";

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);

        await fetchData();
      } else {
        dispatch({ type: ACTIONS.FETCH_PRODUCT, payLoad: [] });
      }
    }
    loadData();
  }, [token]);

  useEffect(() => {
    if (products.length > 0) {
      console.log(cartTotalAmount());
    }
  }, [products]);

  async function fetchData() {
    if (token) {
      const response = await axios.post(
        `${serverURL}/api/cart/products`,
        {},
        {
          headers: {
            token,
          },
        }
      );

      dispatch({ type: ACTIONS.FETCH_PRODUCT, payLoad: response.data.data });
    }
  }

  // Cart PRoducts Information functions
  const cartTotalAmount = () => {
    // Calculate all the total price of the product in cart. If there is no product return 0.
    const sumAmount = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    return sumAmount;
  };

  // Add a coma in the price(00, 000, 000)
  const priceAmount = (amount: string) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const totalItems = () => {
    return products.length;
  };

  const contextValue: StoreContextType = {
    products,
    dispatch,
    token,
    setToken,
    serverURL,
    cartTotalAmount,
    priceAmount,
    totalItems,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default ContextProvider;

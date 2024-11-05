import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";

interface ContextProviderProps {
  children: ReactNode;
}

interface StoreContextType {
  serverUrl: string;

  numberOfUsers: number;
  numberOfPayments: number;
  totalAmount: number;
  profit: number;
  monthlyData: number[];
  range: number;
}

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined
);

const ContextProvider: React.FC<ContextProviderProps> = (props) => {
  const serverUrl = "http://localhost:3000";

  const [monthlyData, setMonthlyData] = useState<number[]>(
    new Array(12).fill(0)
  );
  const paymentState = {
    userId: "",
    items: [],
    amount: 0,
    address: {},
    date: new Date(),
    currency: "",
    payment: false,
  };
  const [data, setData] = useState<(typeof paymentState)[]>([]);

  const [range, setRange] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(`${serverUrl}/api/payments/getdata`);
        const configResponse = await axios.post(
          `${serverUrl}/api/config/pricerange`
        );

        if (response.data.success && configResponse.data.success) {
          const paymentsData = response.data.data;
          const priceRange = configResponse.data.range;
          const profitPercentage = priceRange / 100;

          setRange(priceRange);

          setData(paymentsData);

          // Calculate total amount
          const totalAmount = paymentsData.reduce(
            (sum: number, payment: typeof paymentState) => sum + payment.amount,
            0
          );

          const updateMonthlyData = new Array(12).fill(0);
          // Calculate payment value every month
          paymentsData.forEach((payment: { date: string; amount: number }) => {
            const month = new Date(payment.date).getMonth();
            updateMonthlyData[month] += payment.amount;
          });

          setMonthlyData(updateMonthlyData);

          // Calculate profit
          setProfit(totalAmount * profitPercentage);
        } else {
          console.log("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Unique users
  const numberOfUsers = new Set(data.map((payment) => payment.userId)).size;

  // Total payments
  const numberOfPayments = data.length;

  // Total amount in the database.
  const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0);

  const contextValue: StoreContextType = {
    serverUrl,

    numberOfUsers,
    numberOfPayments,
    totalAmount,
    profit,
    monthlyData,
    range,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default ContextProvider;

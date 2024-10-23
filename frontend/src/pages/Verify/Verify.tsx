import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const paymentId = searchParams.get("paymentId");

  const [good, setGood] = useState(false);
  const navigate = useNavigate();

  const context = useContext(StoreContext);

  if (!context) return <div>Context not available</div>;
  const { serverURL } = context;

  const verifyPayment = async () => {
    const response = await axios.post(`${serverURL}/api/payments/verify`, {
      success,
      paymentId,
    });

    if (response.data.success) {
      console.log(response.data.success);
      navigate("/Paid");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return <div>{good}</div>;
};

export default Verify;

import { useContext, useEffect, useState } from "react";
import "./FormData.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

interface Payment {
  amount: 0;
}

const FormData = () => {
  const [fucos, setFucos] = useState(false);
  const [range, setRange] = useState(0);

  const [payments, setPayments] = useState(0);
  const [users, setUsers] = useState(0);

  const [totalOrders, setTotalOrders] = useState(0);

  const onChangeHandler = (e: any) => {
    setRange(e.target.value);
  };

  const pricePercentage = () => {
    return fucos ? range : range + "%";
  };

  const context = useContext(StoreContext);

  if (!context) return <div>Loading.....</div>;

  const { serverUrl } = context;

  const priceAmount = (amount: string) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const [usersResponse, ordersResponse, paymentsResponse] =
          await Promise.all([
            axios.get(`${serverUrl}/api/user/totalusers`),
            axios.get(`${serverUrl}/api/payments/totalpaid`),
            axios.post(`${serverUrl}/api/payments/paidlist`, {}),
          ]);

        // Check and handle users response
        if (usersResponse.data.success) {
          setUsers(usersResponse.data.count);
        } else {
          console.log("Error fetching users data");
        }

        // Check and handle orders response
        if (ordersResponse.data.success) {
          setTotalOrders(ordersResponse.data.count);
        } else {
          console.log("Error fetching total orders data");
        }

        // Check and handle payments response
        if (paymentsResponse.data.success) {
          const paidList: Payment[] = paymentsResponse.data.data;
          const totalPaids = paidList.reduce(
            (amount, item) => amount + item.amount,
            0
          );
          setPayments(totalPaids);
        } else {
          console.log("Error fetching payments data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const updatePriceRange = async () => {
    const response = await axios.post(`${serverUrl}/api/config/updaterange`, {
      key: "priceIncreasePercentage",
      value: range,
    });

    if (response.data.success) {
      toast.success("Prica range Updated");
    } else {
      alert("Error updating price");
    }
  };

  return (
    <div className="form-container">
      <div className="header">
        <div className="income-cont">
          <h5>Total amount: {priceAmount(payments.toString())}</h5>
        </div>
        <div className="monthly-cont">
          <h5>This month: 1232</h5>
        </div>
      </div>
      <hr />
      <div className="content">
        <div className="left">
          <div>
            {" "}
            Fee: {"  "}
            <input
              type="text"
              className="fee"
              value={pricePercentage()}
              onChange={onChangeHandler}
              onFocus={() => setFucos(true)}
              onBlur={() => setFucos(false)}
            />
          </div>
          <input
            type="range"
            className="form-range range"
            id="customRange1"
            min={0}
            max={100}
            value={range}
            onChange={onChangeHandler}
          ></input>
          <button onClick={updatePriceRange}>Save</button>
        </div>

        <div className="right">
          Users: {users}
          <br />
          Orders: {totalOrders}
        </div>
      </div>
    </div>
  );
};

export default FormData;

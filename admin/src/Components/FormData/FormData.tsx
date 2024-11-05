import { useContext, useEffect, useState } from "react";
import "./FormData.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const FormData = () => {
  const [fucos, setFucos] = useState(false);
  const [priceRange, setPriceRange] = useState(0);

  const context = useContext(StoreContext);

  if (!context) return <div>Loading.....</div>;

  const {
    range,
    serverUrl,
    numberOfUsers,
    numberOfPayments,
    profit,
    totalAmount,
  } = context;

  console.log(numberOfUsers, numberOfPayments, profit, totalAmount);

  const onChangeHandler = (e: any) => {
    setPriceRange(e.target.value);
  };

  const pricePercentage = () => {
    return fucos ? priceRange : priceRange + "%";
  };

  useEffect(() => {
    setPriceRange(range);
  }, [range]);

  const priceAmount = (amount: string) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const updatePriceRange = async () => {
    const response = await axios.post(`${serverUrl}/api/config/updaterange`, {
      value: priceRange,
    });

    if (response.data.success) {
      toast.success("Transaction price range updated");
    } else {
      console.log("Error updating tranaction payment");
    }
  };

  return (
    <div className="form-container">
      <div className="header">
        <div className="income-cont">
          <h5>
            Total amount: {priceAmount(totalAmount.toFixed(2).toString())}
          </h5>
        </div>
        <div className="monthly-cont">
          <h5>Total profit: {priceAmount(profit.toFixed(2))}</h5>
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
            value={priceRange}
            onChange={onChangeHandler}
          ></input>
          <button onClick={updatePriceRange}>Save</button>
        </div>

        <div className="right">
          Users:{" " + numberOfUsers}
          <br />
          Orders: {" " + numberOfPayments}
        </div>
      </div>
    </div>
  );
};

export default FormData;

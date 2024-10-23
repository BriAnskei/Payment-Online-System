import "./Paid.css";
import { useContext, useEffect, useState } from "react";
import {
  PaidProucts,
  Product,
  Reciept,
  StoreContext,
} from "../../context/StoreContext";
import axios from "axios";
import RecieptCom from "../../components/Modal/Reciept/Reciept";

const Paid = () => {
  const context = useContext(StoreContext);
  if (!context) {
    return <div>Loading......</div>;
  }
  const { serverURL, token, priceAmount } = context;
  const [paid, setPaid] = useState<PaidProucts[]>([]);

  const [reciept, setReciept] = useState<Reciept>({
    fullname: "",
    data: [],
    amount: 0,
    date: new Date(),
  });

  const [showRecipet, setShowRecipet] = useState(false);

  const fetchPayments = async () => {
    const response = await axios.post(
      `${serverURL}/api/payments/paid`,
      {},
      {
        headers: {
          token,
        },
      }
    );

    if (response.data.success) {
      setPaid(response.data.data); // get the Data
    } else {
      alert("Error fetching products");
    }
  };

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, []);

  // Setter function for the reciept modal
  const recieptHandler = (
    fullname: string,
    data: Product[],
    amount: number,
    date: Date
  ) => {
    setReciept({
      fullname: fullname,
      data: data,
      amount: amount,
      date: date,
    });
    setShowRecipet(true);
  };

  return (
    <>
      {showRecipet && <RecieptCom data={reciept} setShow={setShowRecipet} />}

      <div className="paid">
        <div className="paid-title">
          <h2>PAID PRODUCTS</h2>
        </div>
        <div className="container">
          {paid.map((product, index) => {
            return (
              <div className="paids-paid" key={index}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaq3mzqr497zR90DSKdkFQ-Ip-3m_dB4kKgQ&s"
                  alt=""
                />

                {product.items.map((item, index) => {
                  return (
                    <p key={index}>
                      {item.quantity > 1 ? (
                        <>{item.name + " " + "x" + item.quantity}</>
                      ) : (
                        <>{item.name}</>
                      )}
                      {product.items.length > 1 && ", "}
                    </p>
                  );
                })}

                <p>${priceAmount(product.amount.toString())}</p>
                <p>Items: {product.items.length}</p>

                <button
                  onClick={() =>
                    recieptHandler(
                      product.address.firstName +
                        " " +
                        product.address.lastName,
                      product.items,
                      product.amount,
                      product.date
                    )
                  }
                >
                  Receipt
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Paid;

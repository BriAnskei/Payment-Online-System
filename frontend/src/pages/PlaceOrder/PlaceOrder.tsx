import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const [currency, setCurrentcy] = useState("USD");
  const [priceRange, setPriceRange] = useState(0);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const context = useContext(StoreContext);

  if (!context) {
    location.reload();
    return <div>Loading.....</div>;
  }

  const { cartTotalAmount, priceAmount, products, serverURL, token } = context;

  const currencySymbol = currency === "PHP" ? "₱" : "$";

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // returns the totol amount based on currency
  const totalAmount = () => {
    return currency === "PHP" ? cartTotalAmount() * 58 : cartTotalAmount();
  };

  // calculate price range
  const totalPrice = () => {
    return cartTotalAmount() * (priceRange / 100);
  };

  useEffect(() => {
    async function fetchPriceRange() {
      const response = await axios.post(`${serverURL}/api/config/pricerange`);
      console.log(response);
      if (response.data.success) {
        setPriceRange(response.data.range);
      } else {
        console.log("Error fetching price range");
      }
    }
    fetchPriceRange();
  }, []);

  const placePayment = async (e: any) => {
    e.preventDefault();

    let orderData = {
      address: data,
      items: products,
      amount: totalAmount(),
      currency: currency,
    };

    try {
      let response = await axios.post(
        `${serverURL}/api/payments/placeorder`,
        orderData,

        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error processing payment");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };

  return (
    <>
      <div className="place-order-cont">
        <form className="place-order" onSubmit={placePayment}>
          <div className="place-order-left">
            <p className="tittle">Payment Information</p>
            <div className="multi-fields">
              <input
                required
                type="text"
                placeholder="First name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
              />
              <input
                required
                type="text"
                placeholder="Last name"
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
              />
            </div>

            <input
              required
              type="email"
              placeholder="Email address"
              name="email"
              onChange={handleChange}
              value={data.email}
            />
            <input
              required
              type="text"
              placeholder="Street"
              name="street"
              onChange={handleChange}
              value={data.street}
            />
            <div className="multi-fields">
              <input
                required
                type="text"
                name="city"
                placeholder="City"
                onChange={handleChange}
                value={data.city}
              />
              <input
                required
                type="text"
                name="state"
                placeholder="State"
                onChange={handleChange}
                value={data.state}
              />
            </div>
            <div className="multi-fields">
              <input
                required
                type="text"
                name="zipcode"
                placeholder="Zip code"
                onChange={handleChange}
                value={data.zipcode}
              />
              <input
                required
                type="text"
                name="country"
                placeholder="Country"
                onChange={handleChange}
                value={data.country}
              />
            </div>
            <input
              required
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              value={data.phone}
            />
          </div>
          <div className="place-order-right">
            <div className="cart-total">
              <h2>Cart Totals</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>
                    {currencySymbol}
                    {priceAmount(totalAmount().toFixed(2).toString())}
                  </p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>
                    Payment Fee{" "}
                    <span>
                      <b>{priceRange}%</b> processing fee will be added to the
                      total purchase price
                    </span>
                  </p>
                  <p>
                    {currencySymbol}{" "}
                    {priceAmount(
                      (totalAmount() === 0
                        ? 0
                        : totalPrice() * (currency === "PHP" ? 58 : 1)
                      ).toFixed(2)
                    )}
                  </p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <b>
                    Total {currencySymbol}
                    {priceAmount(
                      (
                        totalAmount() +
                        totalPrice() * (currency === "PHP" ? 58 : 1)
                      )
                        .toFixed(2)
                        .toString()
                    )}
                  </b>
                </div>
              </div>
              <div className="form-actions">
                <select
                  name="currency"
                  onChange={(e) => {
                    setCurrentcy(e.target.value);
                  }}
                  value={currency}
                >
                  <option value="USD">USD</option>
                  <option value="PHP">PHP</option>
                </select>
                <button type="submit">PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PlaceOrder;
function fetchPriceRange() {
  throw new Error("Function not implemented.");
}

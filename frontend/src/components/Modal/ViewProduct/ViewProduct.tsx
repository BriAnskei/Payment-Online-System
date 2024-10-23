import { useContext } from "react";
import { Product, StoreContext } from "../../../context/StoreContext";
import "./ViewProduct.css";
import { assests } from "../../../assets/assets";

interface Prop {
  product: Product;
  setShow: (bool: boolean) => void;
}

const ViewProduct = ({ product, setShow }: Prop) => {
  const context = useContext(StoreContext);
  if (!context) return <div>Loading.....</div>;
  const { serverURL, priceAmount } = context;

  return (
    <>
      <div className="modal-popup">
        <div className="modal-container">
          <div className="title">
            <img src={assests.cross_icon} onClick={() => setShow(false)} />
          </div>
          <img src={`${serverURL}/images/${product.image}`} id="body-image" />
          <div className="product-disc">
            <h4>{product.name.toLocaleUpperCase()}</h4>
            <hr />
            <p>
              <b>Category:</b> {product.category} <br />
              <b>Price:</b> {priceAmount(product.price.toString())}
              <br />
              <b>Quantity:</b> {product.quantity} <br />
              {product.quantity > 1 && (
                <>
                  <b>Total: </b>{" "}
                  {priceAmount((product.price * product.quantity).toString())}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;

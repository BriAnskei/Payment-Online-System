import React, { useContext } from "react";
import "./Product.css";
import { ACTIONS, StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { editProductProp } from "../../pages/Home/Home";

export interface ProductProp {
  _id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  image: string;
  action?: {
    fetchData: (prop: editProductProp) => void;
    setShowEditModal: (bol: boolean) => void;
    setShowView: (bol: boolean) => void;
    fetchView: (prop: ProductProp) => void;
  };
}

const Product = ({
  _id,
  name,
  quantity,
  price,
  category,
  image,
  action,
}: ProductProp) => {
  const context = useContext(StoreContext);

  if (!context) return <div>Context not available</div>;

  const { dispatch, serverURL, token, priceAmount } = context;

  const removeProduct = async (_Id: number) => {
    const response = await axios.post(
      `${serverURL}/api/cart/remove`,
      { _id, image },
      {
        headers: {
          token,
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message);
      dispatch({ type: ACTIONS.REMOVE_PRODUCT, payLoad: _id });
    } else {
      alert(response.data.message);
    }
  };

  const EditProductProp = {
    _id: _id,
    name: name,
    quantity: quantity,
    price: price,
    category: category,
    image: image,
  };

  const viewProduct = {
    _id: _id,
    name: name,
    quantity: quantity,
    price: price,
    category: category,
    image: image,
  };

  return (
    <>
      <tr>
        <td className="cart-items">
          <img src={`${serverURL}/images/${image}`} id="product-img" />
        </td>
        <td>{name}</td>
        <td>{category}</td>
        <td>{quantity}</td>
        <td>${priceAmount(price.toString())}</td>

        <td>
          <span className="edit">
            <button
              onClick={() => {
                action?.fetchData(EditProductProp);
                action?.setShowEditModal(true);
              }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGn4wKHhj16-YCyvKU3d6ZeCZxLRaRhryFlg&s"
                alt=""
              />
            </button>
          </span>
          <span
            className="view"
            onClick={() => {
              action?.fetchView(viewProduct);
              action?.setShowView(true);
            }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVMYvsMq0YBTgbWeklQvlWNz08ogsXboC35A&s"
              alt=""
            />
          </span>
          <span className="cross" onClick={() => removeProduct(_id)}>
            x
          </span>
        </td>
      </tr>
    </>
  );
};

export default Product;

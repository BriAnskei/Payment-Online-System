import React, { useContext, useEffect, useState } from "react";
import "./Home.css";

import { AddProductModal } from "../../components/Modal/AddProductModal";
import { Product, StoreContext } from "../../context/StoreContext";
import ProductCom from "../../components/Product/Product";
import EditFormModal from "../../components/Modal/EditProductModal";

import { useNavigate } from "react-router-dom";
import ViewProduct from "../../components/Modal/ViewProduct/ViewProduct";
import { toast } from "react-toastify";

export interface editProductProp {
  _id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  image: string;
}

const Home = () => {
  const [showEditModal, setShowEdit] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState<editProductProp>({
    _id: 0,
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    image: "",
  });

  const [showView, setShowView] = useState(false);
  const [selectedView, setSelected] = useState<Product>({
    _id: 0,
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    image: "",
  });

  const context = useContext(StoreContext);

  if (!context) return <div>Context not available</div>;

  const { products, cartTotalAmount, totalItems, priceAmount, token } = context;

  const navigate = useNavigate();

  const navPlaceOrder = (e: any) => {
    if (!token) {
      toast.error("Please log in to procced");
    } else if (products.length > 0) {
      navigate("/order");
    } else {
      toast.error("No Orders");
    }
  };

  return (
    <>
      {showEditModal && (
        <EditFormModal
          data={selectedEdit}
          show={showEditModal}
          action={{ setShowEdit: setShowEdit }}
        />
      )}

      {showView && <ViewProduct product={selectedView} setShow={setShowView} />}

      <div className="product-container">
        <div className="container-option">
          <div className="d-grid gap-2 col-6 ">
            <AddProductModal />
          </div>

          <div className="list-info">
            <span className="price-text">
              PRICE:{priceAmount(cartTotalAmount().toString())}
            </span>{" "}
            / <span className="total-text">ITEMS: {totalItems()}</span>
          </div>
        </div>
        <div className="table-list">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => {
                return (
                  <ProductCom
                    key={index}
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    quantity={product.quantity}
                    category={product.category}
                    image={product.image}
                    action={{
                      fetchData: setSelectedEdit,
                      setShowEditModal: setShowEdit,
                      setShowView: setShowView,
                      fetchView: setSelected,
                    }}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="botton-action">
          <button onClick={navPlaceOrder}> CHECKOUT</button>
        </div>
      </div>
    </>
  );
};

export default Home;

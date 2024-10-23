import React, { useContext, useState, useRef, useEffect } from "react";
import { StoreContext, ACTIONS } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./modalInput.css";

export const Prop = {
  _id: 0,
  name: "",
  category: "",
  quantity: 0,
  price: 0,
  image: "",
};

export const AddProductModal = () => {
  const [product, setProduct] = useState(Prop);
  const [image, setImage] = useState<File | null>(null);

  // Ref for the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const context = useContext(StoreContext);

  if (!context) {
    return <div>Loading.....</div>;
  }

  const { dispatch, serverURL, token, priceAmount } = context;

  const [priceFucos, setPriceFucos] = useState(false);

  // Handle the changes of inputs and store it directly in the object
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPrice = () => {
    return priceFucos
      ? product.price
      : priceAmount(product.price.toString()) + ".00";
  };

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
    }
  };

  // Save product
  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    let quantity = product.quantity.toString();

    if (quantity[0] === "0") {
      toast.error(`The entered quantity (${quantity}) is not valid.`);
      return;
    }

    product["_id"] = Date.now(); // Set the Id of the  product that will be directed in the data base

    const formData = new FormData();
    formData.append("_id", product._id.toString());
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("quantity", product.quantity.toString());
    formData.append("price", product.price.toString());
    if (image) {
      formData.append("image", image);
    }

    let response = await axios.post(`${serverURL}/api/cart/add`, formData, {
      headers: {
        token,
      },
    });

    if (response.data.success) {
      toast.success(response.data.message);
      product["image"] = response.data.image;
      dispatch({ type: ACTIONS.ADD_PRODUCT, payLoad: product });
    } else {
      alert("Error adding product");
    }

    // Reset the product and image state
    setProduct(Prop);
    setImage(null);

    // Clear the Image file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <button
        className="btn btn-dark"
        type="button"
        // if there is no logged user  in the app, the modal won't popup  and display an Error
        data-bs-toggle={!token ? undefined : "modal"}
        data-bs-target={!token ? undefined : "#staticBackdrop4"}
        onClick={() => {
          if (!token) toast.error("You must be logged in to add a product");
        }}
      >
        Add Product
      </button>

      <div
        className="modal fade"
        id="staticBackdrop4"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel4"
        aria-hidden="true"
      >
        <div className="modal-dialog d-flex justify-content-center">
          <div className="modal-content w-75">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel4">
                Add Product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setProduct(Prop);
                  setImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              ></button>
            </div>

            <div className="modal-body p-4">
              <form onSubmit={handleClick}>
                <div className="form-row">
                  <div className="mb-3">
                    <label htmlFor="validationDefault01" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationDefault01"
                      placeholder="Enter task name"
                      name="name"
                      value={product.name}
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="validationDefault02" className="form-label">
                      Category
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="validationDefault01"
                      placeholder="Enter product name"
                      name="category"
                      value={product.category}
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="validationDefault02" className="form-label">
                      Quantity
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      id="validationDefault01"
                      placeholder="Enter product name"
                      name="quantity"
                      value={product.quantity}
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlTextarea1"
                      className="form-label"
                    >
                      Price
                    </label>
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      id="validationDefault01"
                      placeholder="Enter Price"
                      name="price"
                      value={formatPrice()}
                      onChange={handleChange}
                      onFocus={() => setPriceFucos(true)}
                      onBlur={() => setPriceFucos(false)} //   If the input is  not on fucos, set the fucos point to false
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlTextarea1"
                      className="form-label"
                    >
                      Image
                    </label>
                    <br />
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      ref={fileInputRef}
                      onChange={imageHandler}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark"
                  aria-label="Close"
                >
                  ADD
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;

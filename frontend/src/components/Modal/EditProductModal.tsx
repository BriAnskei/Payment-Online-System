import React, { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import { editProductProp } from "../../pages/Home/Home";
import axios from "axios";
import { ACTIONS, StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "./modalInput.css";

interface Prop {
  data: editProductProp;
  show: boolean;
  action: {
    setShowEdit: (bol: boolean) => void;
  };
}

const EditFormModal: React.FC<Prop> = ({ data, show, action }) => {
  const [product, setProduct] = useState<editProductProp>({
    _id: data._id,
    name: data.name,
    quantity: data.quantity,
    price: data.price,
    category: data.category,
    image: data.image,
  });

  const context = useContext(StoreContext);

  if (!context) {
    return <div>Loading.....</div>;
  }

  const { dispatch, serverURL, token, priceAmount } = context;

  const [isFucos, setIsFucos] = useState(false);

  const formatPrice = () => {
    return isFucos
      ? product.price
      : priceAmount(product.price.toString()) + ".00";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await axios.post(`${serverURL}/api/cart/update`, product, {
      headers: {
        token,
      },
    });

    if (response.data.success) {
      dispatch({ type: ACTIONS.EDIT_PRODUCT, payLoad: product });
      toast.success(response.data.message);
      action.setShowEdit(!show);
    } else {
      alert("Error Editing Product");
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => action.setShowEdit(false)}
      dialogClassName="w-75"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTaskName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTaskTime">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="text"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTaskDescription">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              name="price"
              value={formatPrice()}
              onBlur={() => setIsFucos(false)}
              onFocus={() => setIsFucos(true)}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTaskLevel">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => action.setShowEdit(false)}>
            Close
          </Button>
          <Button type="submit" variant="btn btn-dark">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditFormModal;

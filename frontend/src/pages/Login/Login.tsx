import { useContext, useState } from "react";
import "./Login.css";
import { assests } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Login");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const context = useContext(StoreContext);
  if (!context) return <div>Context not available</div>;

  const { serverURL, setToken } = context;

  const onChangeHandler = (e: any) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let newUrl = serverURL;
    if (state === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/registration";
    }

    const response = await axios.post(newUrl, user);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      toast.success("Welcome");
      navigate("/");
    } else {
      alert(response.data.message);
    }
  };

  return (
    <>
      <div className="login-form">
        <div className="login-logo">
          <img src={assests.loginLogo} alt="" />
        </div>
        <form onSubmit={handleSubmit}>
          {state === "Sign up" && (
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                name="name"
                value={user.name}
                onChange={onChangeHandler}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              name="email"
              value={user.email}
              onChange={onChangeHandler}
              required
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={user.password}
              onChange={onChangeHandler}
              placeholder="Password"
            />
          </div>
          <div className="form-group form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              required
            />
            <label
              className="form-check-label"
              htmlFor="exampleCheck1"
              aria-required
            >
              By continuing, I agree to the terms of use & privacy policy
            </label>
          </div>
          <div className="login-action">
            <button type="submit" className="btn btn-primary">
              {state === "Login" ? "Login" : "Sign up"}
            </button>
            <p>
              {state === "Login" ? (
                <span onClick={() => setState("Sign up")}>
                  Create a new account?
                </span>
              ) : (
                <span onClick={() => setState("Login")}>Login Account</span>
              )}
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;

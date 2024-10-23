import React, { useContext } from "react";
import "./Navbar.css";
import { StoreContext } from "../../context/StoreContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const context = useContext(StoreContext);

  if (!context) {
    return <div>Context not available</div>;
  }

  const { token, setToken } = context;

  const handleLogClick = (e: any) => {
    e.preventDefault();
    if (token) {
      localStorage.removeItem("token");
      toast.success("Logout successfully");
      setToken("");
    }
  };

  return (
    <>
      <div className="col-sm-auto  sticky-top  sidebar">
        <div className="d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top">
          <Link
            to={"/"}
            className="d-block p-3 link-dark text-decoration-none"
            title=""
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            data-bs-original-title="Icon-only"
          >
            <i className="bi-credit-card fs-1"></i>
          </Link>
          <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center justify-content-between w-100 px-3 align-items-center">
            <li className="nav-item">
              <Link
                to={"/"}
                className="nav-link py-3 px-2"
                title=""
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-original-title="Home"
              >
                <i className="bi-house fs-1"></i>
              </Link>
            </li>
            <li>
              <Link
                to={"/paid"}
                className="nav-link py-3 px-2"
                title=""
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-original-title="Dashboard"
              >
                <i className="bi-credit-card fs-1"></i>
              </Link>
            </li>
            <li>
              <Link
                to={"/about"}
                className="nav-link py-3 px-2"
                title=""
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-original-title="Orders"
              >
                <i className="bi-info-circle fs-1"></i>
              </Link>
            </li>
            <li>
              <Link
                to={"/login"}
                className="nav-link py-3 px-2"
                title=""
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-original-title="Orders"
              >
                <i
                  className={`${
                    token ? "bi-box-arrow-right" : "bi-person"
                  } fs-1`}
                  onClick={token ? handleLogClick : undefined}
                ></i>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;

import "./App.css";
import FormData from "./Components/FormData/FormData";
import Navbar from "./Components/Navbar/Navbar";
import Graph from "./Components/Panel/Chart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div className="app-container">
        <ToastContainer />
        <Navbar />
        <Graph />
        <FormData />
      </div>
    </>
  );
}

export default App;

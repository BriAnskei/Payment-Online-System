import "./Reciept.css";
import { Reciept, StoreContext } from "../../../context/StoreContext";
import { assests } from "../../../assets/assets";
import { useContext } from "react";
import { toPng } from "html-to-image";

interface prop {
  data: Reciept;
  setShow: (bool: boolean) => void;
}

const RecieptCom = ({ data, setShow }: prop) => {
  const context = useContext(StoreContext);
  if (!context) return <div>Please refresh the page</div>;

  const { priceAmount } = context;

  // make the date Data in to a format Date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const downLoadRecipet = (e: any) => {
    const reciept = document.getElementById("reciept");

    if (reciept) {
      toPng(reciept)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "receipt.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error("Failed to generate image:", error);
        });
    }
  };

  return (
    <div className="outer-modal">
      <div className="inner-modal">
        <div className="title">
          <img src={assests.cross_icon} onClick={() => setShow(false)} />
        </div>
        <table className="body-wrap" id="reciept">
          <tbody>
            <tr>
              <td></td>
              <td className="container" width="600">
                <div className="content">
                  <table
                    className="main"
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                  >
                    <tbody>
                      <tr>
                        <td className="content-wrap aligncenter">
                          <table width="100%" cellPadding="0" cellSpacing="0">
                            <tbody>
                              <tr>
                                <td className="content-block">
                                  <h2>Thanks for using our app</h2>
                                </td>
                              </tr>
                              <tr>
                                <td className="content-block">
                                  <table className="invoice">
                                    <tbody>
                                      <tr>
                                        <td>
                                          {data.fullname}
                                          <br />
                                          {formatDate(data.date.toString())}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <table
                                            className="invoice-items"
                                            cellPadding="0"
                                            cellSpacing="0"
                                          >
                                            <tbody>
                                              {data.data.map(
                                                (product, index) => {
                                                  return (
                                                    <tr key={index}>
                                                      <td>
                                                        {product.quantity >
                                                        1 ? (
                                                          <>
                                                            {product.name.toLocaleUpperCase() +
                                                              " " +
                                                              "x" +
                                                              product.quantity}
                                                          </>
                                                        ) : (
                                                          product.name.toLocaleUpperCase()
                                                        )}
                                                      </td>
                                                      <td>
                                                        $
                                                        {priceAmount(
                                                          (
                                                            product.price *
                                                            product.quantity
                                                          ).toString()
                                                        )}
                                                      </td>
                                                    </tr>
                                                  );
                                                }
                                              )}

                                              <tr className="total">
                                                <td
                                                  className="alignright"
                                                  width="80%"
                                                >
                                                  Total
                                                </td>
                                                <td className="alignright">
                                                  ${" "}
                                                  {priceAmount(
                                                    data.amount.toString()
                                                  )}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td className="content-block">
                                  <a onClick={downLoadRecipet}>Download</a>
                                </td>
                              </tr>
                              <tr>
                                <td className="content-block">
                                  Company Inc. 123 Van Ness, San Francisco 94102
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="footer">
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td className="aligncenter content-block">
                            Questions? Email{" "}
                            <a href="mailto:">support@company.inc</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecieptCom;

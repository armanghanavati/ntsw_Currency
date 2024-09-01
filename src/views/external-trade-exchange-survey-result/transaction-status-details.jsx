import { useSelector } from "react-redux";
import CanvasJSReact from "@canvasjs/react-charts";
import { Modal } from "antd";
import themeColors from "../../configs/theme";
const TransactionStatusDetails = ({
  inputsData,
  showModale,
  setShowModale,
}) => {
  const { theme } = useSelector((state) => state);

  let CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const options = {
    data: [
      {
        type: "pie",
        indexLabel: "{label}: {y}%",
        width: 320,
        indexLabelPlacement: "inside",
        legendText: "{label}",
        dataPoints: [
          {
            y: Number(inputsData?.detailsStatus?.Active),
            indexLabel: String(inputsData?.detailsStatus?.Active) + "%",
            label: "معاملات باز",
            color: "rgb(255, 206, 85)",
            axisX: {
              labelPadding: -5, //  کاهش  فاصله  بین  متن  و  خط
            },
            axisY: {
              labelFontSize: 12, //  کاهش  اندازه  فونت
              labelPadding: -5, //  کاهش  فاصله  بین  متن  و  خط
              scaleBreaks: {
                autoCalculate: true,
              },
            },
          },
          {
            y: Number(inputsData?.detailsStatus?.Cancel),
            indexLabel: String(inputsData?.detailsStatus?.Cancel) + "%",
            label: "لغو شده",
            color: "rgb(223, 81, 56)",
          },
          {
            y: Number(inputsData?.detailsStatus?.Close),
            indexLabel: String(inputsData?.detailsStatus?.Close) + "%",
            label: "مختومه",
            color: "rgb(140, 196, 116)",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Modal
        className="questionModalDetails"
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
        onCancel={() =>
          setShowModale((prvs) => ({
            ...prvs,
            showModaleStatus: false,
          }))
        }
        footer={[<div></div>]}
        open={showModale.showModaleStatus}
        title={"جزئیات وضعیت معاملات"}
      >
        <div style={{ padding: "10px", display: "flex", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "0 20",
            }}
          >
            <span style={{ fontSize: "18px" }}>
              وضعیت معاملات صرافی : (کد{" "}
              {inputsData?.detailsList &&
                inputsData?.detailsList[0]?.sfcVCodeInt}
              )
            </span>
            <p style={{ fontSize: "16px", marginTop: "10px" }}>
              این نمودار وضعیت معاملات صرافی با واردکنندگان در سامانه نیما
              (معاملات صورت گرفته در بستر سامانه جامع تجارت) را نمایش می دهد.
            </p>
            <ul
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              <li style={{ fontWeight: "bold" }}>
                معاملات باز ({String(inputsData?.detailsStatus?.Active)}%)
                <i
                  className="fa fa-square yellow"
                  style={{ color: "#ffce55", margin: "0 10px" }}
                />
              </li>
              <li style={{ fontWeight: "bold" }}>
                لغو شده ({String(inputsData?.detailsStatus?.Cancel)}%)
                <i
                  className="fa fa-square yellow"
                  style={{ color: "#df5138", margin: "0 10px" }}
                />
              </li>
              <li style={{ fontWeight: "bold" }}>
                مختومه ({String(inputsData?.detailsStatus?.Close)}%)
                <i
                  className="fa fa-square yellow"
                  style={{ color: "#8cc474", margin: "0 10px" }}
                />
              </li>
            </ul>
            <CanvasJSChart options={options} />
            <p style={{ fontSize: "18px" }}>
              تعداد کل معاملات : {inputsData?.detailsStatus?.TotalCount} مورد
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "0 20px",
              textAlign: "right",
            }}
          >
            <p style={{ fontSize: "18px" }}>راهنمای وضعیت ها</p>
            <hr style={{ width: "100%", color: "rgb(0, 0, 0)" }} />
            <strong
              style={{
                color: "#8cc474",
                fontSize: "16px",
                fontWeight: "bold",
                margin: "20px 0 15px 0",
              }}
            >
              مختومه :
            </strong>
            <p>
              معاملاتی که واردکننده، صدور حواله ارزی توسط صرافی را تائید نموده و
              بدین ترتیب معامله پایان یافته است.
            </p>
            <strong
              style={{
                color: "#df5138",
                fontSize: "16px",
                fontWeight: "bold",
                margin: "30px 0 20px 0",
              }}
            >
              لغو شده :
            </strong>
            <p>
              معاملاتی که یکی از طرفین انصراف داده و طرف مقابل با انصراف وی
              موافقت کرده است و بدین ترتیب معامله" کان لم یکن " شده است.
            </p>
            <strong
              style={{
                color: "#ffce55",
                fontSize: "16px",
                fontWeight: "bold",
                margin: "30px 0 20px 0",
              }}
            >
              معاملات باز :
            </strong>
            <p>
              کلیه معاملات غیر از معاملات " مختومه " و " لغو شده " را شامل می
              شود.
            </p>
            <p
              style={{
                marginTop: "20px",
                fontSize: "16px",
              }}
            >
              <strong
                style={{
                  color: "#df5138",
                  fontWeight: "bold",
                }}
              >
                تذکر :
              </strong>
              معاملاتی که در آن ها یکی از طرفین انصراف داده ولی هنوز طرف مقابل
              با انصراف وی موافقت نکرده یا مخالفت کرده است نیز جزو
              <b style={{ fontWeight: "bold" }}>"معاملات باز "</b> محسوب می
              شوند.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TransactionStatusDetails;

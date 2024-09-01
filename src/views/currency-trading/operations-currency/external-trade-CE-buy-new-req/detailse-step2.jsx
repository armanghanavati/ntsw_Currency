import { useState } from "react";
import { Modal, Table, Checkbox, Progress, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import themeColors from "../../../../configs/theme";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import { Button } from "../../../../components";
import CanvasJSReact from "@canvasjs/react-charts";
const DetailseStep2 = ({
  inputsData,
  dataDetails,
  getSurveyCommentsInfo,
  showModale,
  setShowModale,
  setInputsData,
  tableParams,
  setTableParams,
}) => {
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const options = {
    // animationEnabled: true,
    // exportEnabled: true,
    data: [
      {
        type: "pie",
        indexLabel: "{label}",
        dataPoints: [
          {
            y: inputsData?.detailsStatus?.Active,
            label: "معاملات باز",
            color: "rgb(255, 206, 85)",
          },
          {
            y: inputsData?.detailsStatus?.Cancel,
            label: "لغو شده",
            color: "rgb(223, 81, 56)",
          },
          {
            y: inputsData?.detailsStatus?.Close,
            label: "مختومه",
            color: "rgb(140, 196, 116)",
          },
        ],
      },
    ],
  };
  const { role, GUid, theme, colorMode } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleChangePageSize = (event) => {
    event.preventDefault();
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        pageSize: Number(event.target.value) || 0,
        current: 1,
      },
    });
    getSurveyCommentsInfo();
  };
  const getRequestStatusDetail = () => {
    const postData = {
      UrlVCodeInt: role,
      SessionID: GUid,
      SfcVCodeInt:
        inputsData?.detailsList && inputsData?.detailsList[0]?.sfcVCodeInt,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getRequestStatusDetail.url,
      method: endpoints.RestAPIs.buyCurrency.getRequestStatusDetail.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorDesc === "برای این صرافی  معامله ای یافت نشد") {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        } else {
          setInputsData({ ...inputsData, detailsStatus: res?.data });
          setShowModale((prvs) => ({
            ...prvs,
            showModaleStatus: true,
          }));
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  const columnsDetails = [
    {
      title: "کد صرافی",
      dataIndex: "sfcVCodeInt",
      align: "center",
    },
    {
      title: "نام صرافی",
      dataIndex: "sfcNameStr",
      align: "center",
    },
    {
      title: "نام تجاری صرافی",
      dataIndex: "sfcBizNameStr",
      align: "center",
    },
    {
      title: "امتیاز کلی نظرسنجی",
      dataIndex: "sfcCityNameStr",
      width: "450px",
      align: "center",
      render: (_, record) => (
        <>
          <div
            style={{
              margin: "0 20px",
              display: "flex",
              flexDirection: "column",
              gap: "3.3px",
            }}
          >
            <label
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Progress
                percent={dataDetails?.Rate5}
                style={{
                  width: "70%",
                  direction: "ltr",
                  display: "flex",
                  gap: "10px",
                }}
              />
              5 ستاره
            </label>
            <label
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Progress
                percent={dataDetails?.Rate4}
                style={{
                  width: "70%",
                  direction: "ltr",
                  display: "flex",
                  gap: "10px",
                }}
              />{" "}
              4 ستاره
            </label>
            <label
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Progress
                percent={dataDetails?.Rate3}
                style={{
                  width: "70%",
                  direction: "ltr",
                  display: "flex",
                  gap: "10px",
                }}
              />{" "}
              3 ستاره
            </label>
            <label
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Progress
                percent={dataDetails?.Rate2}
                style={{
                  width: "70%",
                  direction: "ltr",
                  display: "flex",
                  gap: "10px",
                }}
              />{" "}
              2 ستاره
            </label>
            <label
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Progress
                percent={dataDetails?.Rate5}
                style={{
                  width: "70%",
                  direction: "ltr",
                  display: "flex",
                  gap: "10px",
                }}
              />
              1 ستاره
            </label>
          </div>
          <div
            style={{
              marginTop: "10px",
              backgroundColor: "antiquewhite",
              display: "flex",
              padding: "5px",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            از مجموع
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 5px",
                width: "20px",
                height: "20px",
                backgroundColor: "#d9534f",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#fff",
                borderRadius: "2px",
              }}
            >
              {dataDetails?.RateSurveyCount}
            </span>
            نظر
          </div>
        </>
      ),
    },
    {
      title: "پیشنهادات واردکنندگان",
      dataIndex: "bnkNameEnStr",
      width: "450px",
      align: "center",
      render: (_, record) => (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                flex: "10%",
              }}
            >
              <i
                class="fa fa-check"
                style={{
                  fontSize: "2em",
                  color: "lime",
                }}
              />
            </span>
            <span style={{ fontWeight: "bold", flex: "10%" }}>
              {dataDetails?.Agree}
            </span>
            <p style={{ fontWeight: "bold", flex: "80%" }}>
              معامله با این صرافی را بپیشنهاد کرده اند
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "18px 0",
            }}
          >
            <span style={{ flex: "10%" }}>
              <i
                class="fa fa-minus"
                style={{
                  fontSize: "2em",
                  color: "gray",
                }}
              />
            </span>
            <span style={{ fontWeight: "bold", flex: "10%" }}>
              {dataDetails?.NoComment}
            </span>
            <p style={{ fontWeight: "bold", flex: "80%" }}>
              در خصوص معامله با این صرافی نظری نداشته اند
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0",
            }}
          >
            <span style={{ flex: "10%" }}>
              <i
                class="fa fa-close"
                style={{
                  fontSize: "2em",
                  color: "red",
                }}
              />
            </span>
            <span
              style={{
                fontWeight: "bold",
                flex: "10%",
              }}
            >
              {dataDetails?.Opposite}
            </span>
            <p
              style={{
                fontWeight: "bold",
                flex: "80%",
              }}
            >
              معامله با این صرافی را پیشنهاد نکرده اند
            </p>
          </div>
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "antiquewhite",
              display: "flex",
              padding: "5px",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            از مجموع
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 5px",
                width: "20px",
                height: "20px",
                backgroundColor: "#d9534f",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#fff",
                borderRadius: "2px",
              }}
            >
              {dataDetails?.SurveyCountOfferToOther}
            </span>{" "}
            نظر
          </div>
        </div>
      ),
    },
    {
      title: "وضعیت معاملات",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
          }}
          onClick={getRequestStatusDetail}
        >
          <i class="fa fa-plus"></i>
          <span>جزئیات</span>
        </div>
      ),
    },
  ];

  const comments =
    inputsData?.CommentsList &&
    inputsData?.CommentsList?.map((item) => {
      return (
        <div
          style={{
            borderRight: "1px solid rgb(197, 195, 195)",
            borderLeft: "1px solid rgb(197, 195, 195)",
            borderTop: "1px solid rgb(197, 195, 195)",
            borderBottom: "1px solid rgb(197, 195, 195)",
            padding: "10px",
            height: "150px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#ff7d025c",
              padding: "5px",
              marginBottom: "25px",
              fontSize: "12px",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              شرح :
            </span>
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              {item?.AnswerInsertDateStr}
            </span>
          </div>
          <span
            style={{
              width: "100%",
              textAlign: "right",
              marginRight: "35px",
              fontSize: "12px",
            }}
          >
            {item?.Comment}
          </span>
        </div>
      );
    });

  const handelCheckBox = (e) => {
    getSurveyCommentsInfo(false, e.target.checked);
  };

  return (
    <div>
      <Modal
        className="questionModalDetails"
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
        onCancel={() =>
          setShowModale((prvs) => ({
            ...prvs,
            showModaleDetails: false,
          }))
        }
        footer={[
          <div>
            <Button
              backgroundColor={themeColors.btn.disable}
              onCancel={() =>
                setShowModale((prvs) => ({
                  ...prvs,
                  showModaleStatus: false,
                }))
              }
            >
              بستن
            </Button>
          </div>,
        ]}
        open={showModale.showModaleDetails}
        title={"جزئیات نظرسنجی"}
      >
        <div style={{ padding: "10px" }}>
          <Table
            dataSource={inputsData?.detailsList}
            columns={columnsDetails}
            pagination={tableParams.pagination}
            // loading={loading}
            // onChange={handleTableChange}
            onHeaderRow={() => {
              return {
                style: { backgroundColor: colorMode },
              };
            }}
          />
          <div
            style={{
              border: " 1px solid #c5c3c3",
              padding: "7px 7px  7px 20px",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            <span
              style={{
                width: "50%",
                fontWeight: "bold",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              مجموع کامنت های واردکنندگان درباره این صرافی :
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // padding: "4px 6px 4px 6px",
                  margin: "0 5px",
                  width: "25px",
                  height: "23px",
                  backgroundColor: "#d9534f",
                  fontSize: "12px",
                  color: "#fff",
                  borderRadius: "2px",
                }}
              >
                {dataDetails?.TotalCountOfSurvey}
              </span>
              مورد
            </span>
            <div
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "end",
                gap: "5px",
                fontSize: "13px",
              }}
            >
              <Checkbox
                onChange={handelCheckBox}
                value={inputsData?.duplicateStatus}
                name={"duplicateStatus"}
              ></Checkbox>
              <label>عدم نمایش کامنت های تکراری واردکنندگان یکسان</label>
            </div>
          </div>
          <span style={{ marginBottom: "10px" }} className="page-size-combo">
            <label className="page-size-combo--label" htmlFor="page-size">
              نمایش محتویات
            </label>
            <select
              className="page-size-combo--selector"
              id="page-size"
              value={tableParams.pagination.pageSize}
              onChange={handleChangePageSize}
            >
              <option
                value="10"
                style={{
                  backgroundColor: themeColors[theme]?.bg,
                }}
              >
                10
              </option>
              <option
                value="25"
                style={{
                  backgroundColor: themeColors[theme]?.bg,
                }}
              >
                25
              </option>
              <option
                value="50"
                style={{
                  backgroundColor: themeColors[theme]?.bg,
                }}
              >
                50
              </option>
              <option
                value="100"
                style={{
                  backgroundColor: themeColors[theme]?.bg,
                }}
              >
                100
              </option>
            </select>
          </span>
          {comments?.length === 0 ? (
            <p
              style={{
                borderRight: "1px solid black",
                borderLeft: "1px solid black",
                borderTop: "1px solid black",
                borderBottom: "1px solid #111",
                padding: "10px",
                height: "100px",
                marginTop: "30px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              موردی یافت نشد
            </p>
          ) : (
            comments
          )}
        </div>
      </Modal>
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
        <div style={{ padding: "10px", display: "flex" }}>
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
                معاملات باز (%)
                <i
                  className="fa fa-square yellow"
                  style={{ color: "#ffce55", margin: "0 10px" }}
                />
              </li>
              <li style={{ fontWeight: "bold" }}>
                لغو شده (%)
                <i
                  className="fa fa-square yellow"
                  style={{ color: "#df5138", margin: "0 10px" }}
                />
              </li>
              <li style={{ fontWeight: "bold" }}>
                مختومه (%)
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
    </div>
  );
};

export default DetailseStep2;

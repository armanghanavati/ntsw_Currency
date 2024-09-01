import { useEffect, useState } from "react";
import { Modal, Table, Checkbox, Progress, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import themeColors from "../../configs/theme";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import { endpoints } from "../../services/endpoints";
import axios from "axios";
import { Button } from "../../components";
import CanvasJSReact from "@canvasjs/react-charts";
import TransactionStatusDetails from "./transaction-status-details";
const DetailseSurvey = ({
  inputsData,
  dataDetails,
  setDataDetails,
  showModale,
  setShowModale,
  setInputsData,
  hasMounted,
  setHasMounted,
}) => {
  const { role, GUid, theme, colorMode } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const getSurveyInfo = () => {
    const postData = {
      UrlVCodeInt: role,
      SessionID: GUid,
      sfcVCodeInt: inputsData?.detailsList[0]?.sfcVCodeInt,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSurveyInfo.url,
      method: endpoints.RestAPIs.buyCurrency.getSurveyInfo.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          setDataDetails((prevDataDetails) => ({
            ...prevDataDetails,
            ...res?.data,
          }));
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  const getSurveyCommentsInfo = (prevent = false) => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      startIndex: Number(
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
          1
      ),
      pageSize: tableParams?.pagination?.pageSize,
      sfcVCodeInt: inputsData?.detailsList?.[0]?.sfcVCodeInt,
      duplicateStatus: !!inputsData?.checkedComments ? true : false,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSurveyCommentsInfo.url,
      method: endpoints.RestAPIs.buyCurrency.getSurveyCommentsInfo.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          if (prevent === true) {
            getSurveyInfo();
          }
          // setInputsData({
          //   ...inputsData,
          //   CommentsList: res?.data?.CommentsList,
          // });

          setInputsData((prev) => ({
            ...prev,
            CommentsList: res?.data?.CommentsList,
            TotalCount: res.data?.TotalCount,
          }));
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: res.data?.TotalCount || 0,
            },
          });
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
    setHasMounted(false);
  };
  useEffect(() => {
    getSurveyCommentsInfo();
  }, [
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    inputsData?.checkedComments,
  ]);

  useEffect(() => {
    if (hasMounted) getSurveyCommentsInfo(true);
  }, [hasMounted]);

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
      width: "500px",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignContent: "space-between",
            flexDirection: "column",
            paddingTop: "10px",
          }}
        >
          <div className="overallScore">
            <label className="overallScore--label">
              <Progress
                strokeLinecap="square"
                percent={dataDetails?.Rate5}
                className="overallScore--star"
              />
              5 ستاره
            </label>
            <label className="overallScore--label">
              <Progress
                percent={dataDetails?.Rate4}
                className="overallScore--star"
              />
              4 ستاره
            </label>
            <label className="overallScore--label">
              <Progress
                percent={dataDetails?.Rate3}
                className="overallScore--star"
              />
              3 ستاره
            </label>
            <label className="overallScore--label">
              <Progress
                className="overallScore--star"
                percent={dataDetails?.Rate2}
              />
              2 ستاره
            </label>
            <label className="overallScore--label">
              <Progress
                percent={dataDetails?.Rate1}
                className="overallScore--star"
              />
              1 ستاره
            </label>
          </div>
          <div className="total">
            از مجموع
            <span
              className="opinion"
              style={{ color: themeColors?.btn?.content }}
            >
              {dataDetails?.RateSurveyCount}
            </span>
            نظر
          </div>
        </div>
      ),
    },
    {
      title: "پیشنهادات واردکنندگان",
      dataIndex: "bnkNameEnStr",
      width: "500px",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignContent: "space-between",
            flexDirection: "column",
          }}
        >
          <div className="importersSuggestions">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "5px 0",
              }}
            >
              <span
                style={{
                  flex: "10%",
                }}
              >
                <i
                  className="fa fa-check"
                  style={{
                    fontSize: "2em",
                    color: "lime",
                  }}
                />
              </span>
              <span style={{ fontWeight: "bold", flex: "10%" }}>
                {Number(dataDetails?.Agree?.toFixed(1)) + "%"}
              </span>
              <p style={{ fontWeight: "bold", flex: "80%" }}>
                معامله با این صرافی را بپیشنهاد کرده اند
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "15px 0",
              }}
            >
              <span style={{ flex: "10%" }}>
                <i
                  className="fa fa-minus"
                  style={{
                    fontSize: "2em",
                    color: "gray",
                  }}
                />
              </span>
              <span style={{ fontWeight: "bold", flex: "10%" }}>
                {Number(dataDetails?.NoComment?.toFixed(1)) + "%"}
              </span>
              <p style={{ fontWeight: "bold", flex: "80%" }}>
                در خصوص معامله با این صرافی نظری نداشته اند
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "6px 0",
              }}
            >
              <span style={{ flex: "10%" }}>
                <i
                  className="fa fa-close"
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
                {Number(dataDetails?.Opposite?.toFixed(1)) + "%"}
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
          </div>
          <div className="total">
            از مجموع
            <span
              className="opinion"
              style={{ color: themeColors?.btn?.content }}
            >
              {dataDetails?.SurveyCountOfferToOther}
            </span>
            نظر
          </div>
        </div>
      ),
    },
    {
      title: "وضعیت معاملات",
      align: "center",
      render: (_, record) => (
        <div className="tradeStatus" onClick={getRequestStatusDetail}>
          <i className="fa fa-plus"></i>
          <span>جزئیات</span>
        </div>
      ),
    },
  ];

  const handleChangePaginationOfTable = (page, pageSize) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        pageSize: pageSize,
        current: page,
      },
    });
  };

  const comments =
    inputsData?.CommentsList &&
    inputsData?.CommentsList?.map((item) => {
      return (
        <div className="parentComments">
          <div className="description">
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
              تاریخ ثبت : {item?.AnswerInsertDateStr}
            </span>
          </div>
          <span className="comments">{item?.Comment}</span>
        </div>
      );
    });

  const handelCheckBox = (e) => {
    if (e.target.checked === true) {
      setInputsData({
        ...inputsData,
        checkedComments: e.target.checked,
        duplicateStatus: true,
      });
    } else {
      setInputsData({
        ...inputsData,
        checkedComments: e.target.checked,
        duplicateStatus: false,
      });
    }
  };

  const closeModal = () => {
    setShowModale((prvs) => ({
      ...prvs,
      showModaleDetails: false,
    }));
    setInputsData({ ...inputsData, duplicateStatus: false });
  };
  return (
    <div>
      <Modal
        className="questionModalDetails"
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
        onCancel={closeModal}
        footer={[
          <div>
            <Button
              backgroundColor={themeColors.btn.primary}
              onClick={closeModal}
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
            pagination={false}
            hasPageSizeCombo={false}
            rowKey="sfcVCodeInt"
            // onChange={handleTableChange}
            onHeaderRow={() => {
              return {
                style: { backgroundColor: colorMode },
              };
            }}
          />
          <div className="totalComments">
            <span className="parent-total-comments">
              مجموع کامنت های واردکنندگان درباره این صرافی :
              <span
                className="total-comments"
                style={{ color: themeColors?.btn?.content }}
              >
                {inputsData?.TotalCount}
              </span>
              مورد
            </span>
            <div className="not-displaying-comments">
              <Checkbox
                onChange={handelCheckBox}
                value={inputsData?.duplicateStatus}
                checked={inputsData?.duplicateStatus}
                name={"duplicateStatus"}
              >
                عدم نمایش کامنت های تکراری واردکنندگان یکسان
              </Checkbox>
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
            <p className="nothing-found">موردی یافت نشد</p>
          ) : (
            comments
          )}
          <Pagination
            onChange={handleChangePaginationOfTable}
            pageSize={tableParams.pagination.pageSize}
            current={tableParams.pagination.current}
            total={tableParams.pagination.total}
          />
        </div>
      </Modal>
      <TransactionStatusDetails
        inputsData={inputsData}
        showModale={showModale}
        setShowModale={setShowModale}
      />
    </div>
  );
};

export default DetailseSurvey;

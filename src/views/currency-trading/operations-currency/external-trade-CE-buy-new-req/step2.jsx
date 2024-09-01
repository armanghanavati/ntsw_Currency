import { useState, useEffect } from "react";
import { Col, Modal, Row, Table, Tooltip, Rate } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Button, ComboBox, DatePicker, Input } from "../../../../components";
import Validation from "../../../../utils/Validation";
import themeColors from "../../../../configs/theme";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import DetailseStep2 from "./detailse-step2";
const Step2 = ({ inputsData, setInputsData, errors, setErrors }) => {
  const [dataDetails, setDataDetails] = useState({});
  const [hasMounted, setHasMounted] = useState(false);
  const { role, GUid, stepsOfCreatePage, theme, colorMode } = useSelector(
    (state) => state
  );
  const [showModale, setShowModale] = useState({
    showModale: false,
    showModaleDetails: false,
    showModaleStatus: false,
  });
  const dispatch = useDispatch();
  const handleChangeInputs = (name, value, validationNameList = undefined) => {
    if (name === "sfrTypeTny" && value === 2) {
      setInputsData({ ...inputsData, showExchange: true });
    } else if (name === "sfrTypeTny" && value === 1) {
      setInputsData({ ...inputsData, showExchange: false });
    }
    if (name === "DateF") {
      if (Validation.minimumDate(inputsData?.DateT, value) === true) {
        setErrors({
          ...errors,
          DateT: [],
        });
      } else {
        setErrors({
          ...errors,
          DateT: Validation.minimumDate(inputsData?.DateT, value),
        });
      }
    } else if (name === "DateT") {
      if (Validation.maximumDate(inputsData?.DateF, value) === true) {
        setErrors({
          ...errors,
          DateF: [],
        });
      } else {
        setErrors({
          ...errors,
          DateF: Validation.maximumDate(inputsData?.DateF, value),
        });
      }
    }
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    setErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

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
    getsarrafiCompanyListWithSurveyStatus();
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const getsarrafiCompanyListWithSurveyStatus = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      startIndex: tableParams?.pagination?.current,
      pageSize: tableParams?.pagination?.pageSize,
      sfcVCodeInt: inputsData?.sfcVCodeInt || "",
      sfcNameStr: inputsData?.sfcNameStr || "",
      surveyStatus: inputsData?.surveyStatus || 1,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getsarrafiCompanyListWithSurveyStatus
        .url,
      method:
        endpoints.RestAPIs.buyCurrency.getsarrafiCompanyListWithSurveyStatus
          .method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Error === 0) {
          setInputsData({
            ...inputsData,
            sarrafiCompanyList: res?.data?.sarrafiCompanyList,
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
  };

  const select = (e, record) => {
    setInputsData((prvs) => ({
      ...prvs,
      exchangeName: record?.sfcNameStr,
      sfcVCodeInt: record?.sfcVCodeInt,
    }));
    setShowModale((prvs) => ({
      ...prvs,
      showModale: false,
    }));
  };

  const view = (e, record) => {
    e.preventDefault();
    dispatch(
      handleMessageModal({
        isModalOpen: true,
        title: "آدرس و تلفن",
        type: "warning",
        describe: (
          <>
            <div
              style={{
                color: "#737373",
                fontSize: "12px",
                margin: "10px 0",
              }}
            >
              <b
                style={{
                  color: "red",
                  padding: "0 5px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                آدرس :
              </b>
              <span>{record?.sfcAddressStr}</span>
            </div>
            <div>
              <b
                style={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                تلفن :
              </b>
              <span>
                {record?.sfcPhoneNumberStr === null
                  ? "null"
                  : record?.sfcPhoneNumberStr}
              </span>
            </div>
          </>
        ),
      })
    );
  };

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
          setDataDetails(res?.data);
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
  const getSurveyCommentsInfo = (prevent = false, checked) => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      startIndex: tableParams?.pagination?.current,
      pageSize: tableParams?.pagination?.pageSize,
      sfcVCodeInt: inputsData?.detailsList[0]?.sfcVCodeInt,
      duplicateStatus: checked || checked === undefined ? true : false,
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
            setInputsData({
              ...inputsData,
              CommentsList: res?.data?.CommentsList,
            });
          }
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

  const details = (e, record) => {
    e.preventDefault();
    setShowModale((prvs) => ({
      ...prvs,
      showModaleDetails: true,
    }));
    setInputsData({ ...inputsData, detailsList: [record] });
    setHasMounted(true);
  };

  useEffect(() => {
    if (hasMounted) getSurveyCommentsInfo(true);
  }, [hasMounted]);

  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (item, record, index) => (
        <>
          {index +
            1 +
            (Number(tableParams?.pagination?.current || 1) - 1) *
              Number(tableParams.pagination.pageSize || 1)}
        </>
      ),
    },
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
      title: "شهرت صرافی",
      dataIndex: "sfcBizNameStr",
      align: "center",
    },
    {
      title: "شهر",
      dataIndex: "sfcCityNameStr",
      align: "center",
    },
    {
      title: "آدرس و تلفن",
      dataIndex: "bnkNameEnStr",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={(e) => view(e, record)}>مشاهده</Button>
        </div>
      ),
    },
    {
      title: "نتایج نظرسنجی ",
      dataIndex: "cnyNameStr",
      align: "center",
      render: (_, record) => (
        <div style={{ padding: "5px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "25px",
                height: "23px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "2px",
                backgroundColor: "#024158",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {Math.round(record?.RateAverage)}
            </span>
            <Rate disabled={true} value={Math.round(record?.RateAverage)} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              از مجموع <b>({record?.survayCount})</b> نظر
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "3px",
                cursor: "pointer",
              }}
              onClick={(e) => details(e, record)}
            >
              <i class="fa fa-plus" />
              <span>جزئیات</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "عملیات",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onClick={(e) => select(e, record)}
            backgroundColor={themeColors.btn.secondary}
          >
            <i class="fa fa-check" />
            انتخاب
          </Button>
        </div>
      ),
    },
  ];

  const selectExchange = () => {
    setShowModale((prvs) => ({
      ...prvs,
      showModale: true,
    }));
    getsarrafiCompanyListWithSurveyStatus();
  };

  const getSarrafiRequestType = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSarrafiRequestType.url,
      method: endpoints.RestAPIs.buyCurrency.getSarrafiRequestType.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          setInputsData({
            ...inputsData,
            requestType: res?.data?.Result,
            sfrTypeTny: res?.data?.Result[0]?.value,
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
  };
  const getSurveyStatus = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSurveyStatus.url,
      method: endpoints.RestAPIs.buyCurrency.getSurveyStatus.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          setDataDetails({ ...dataDetails, viewOrder: res?.data?.Result });
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

  useEffect(() => {
    getSarrafiRequestType();
    getSurveyStatus();
  }, []);

  return (
    <div>
      {stepsOfCreatePage.CNR === 2 && (
        <>
          <Row style={{ marginTop: "30px" }}>
            <Col sm={24} md={12} xl={8}>
              <ComboBox
                title="نوع درخواست"
                defaultValue={inputsData?.sfrTypeTny || 1}
                name="sfrTypeTny"
                onChange={handleChangeInputs}
                options={inputsData?.requestType}
                width="150px"
                optionTitle="descriptionPersian"
                optionValue="value"
                // validations={[["required"]]}
                // error={errors?.sfrTypeTny}
              />
            </Col>
            {!!inputsData?.showExchange && (
              <>
                <Col sm={24} md={12} xl={8}>
                  <Input
                    title="نام صرافی"
                    value={inputsData?.exchangeName}
                    name="exchangeName"
                    onChange={handleChangeInputs}
                    labelWidth="150px"
                  />
                </Col>
                <Button onClick={selectExchange}>
                  <i class="fa fa-plus" />
                  انتخاب صرافی
                </Button>
              </>
            )}
            <Modal
              className="questionModalDetails"
              style={{
                backgroundColor: themeColors[theme]?.menueBg,
                color: themeColors[theme]?.text,
              }}
              onCancel={() =>
                setShowModale((prvs) => ({
                  ...prvs,
                  showModale: false,
                }))
              }
              footer={[<div></div>]}
              open={showModale.showModale}
              title={"انتخاب بانک مقصد"}
            >
              <div style={{ padding: "10px" }}>
                <Row>
                  <Col sm={24} md={12} xl={10}>
                    <Input
                      title="کد صرافی"
                      value={inputsData?.sfcVCodeInt}
                      name="sfcVCodeInt"
                      onChange={handleChangeInputs}
                      labelWidth="50px"
                    />
                  </Col>
                  <Col sm={24} md={12} xl={10}>
                    <Input
                      title="نام صرافی"
                      value={inputsData?.sfcNameStr}
                      name="sfcNameStr"
                      onChange={handleChangeInputs}
                      labelWidth="50px"
                    />
                  </Col>
                  <Col sm={24} md={12} xl={4}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <Button onClick={getsarrafiCompanyListWithSurveyStatus}>
                        جستجو
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24} md={12} xl={10}>
                    <ComboBox
                      title="ترتیب نمایش"
                      defaultValue={inputsData?.surveyStatus || 1}
                      name="surveyStatus"
                      onChange={handleChangeInputs}
                      options={dataDetails?.viewOrder}
                      width="150px"
                      optionTitle="descriptionPersian"
                      optionValue="value"
                      // validations={[["required"]]}
                      // error={errors?.surveyStatus}
                    />
                  </Col>
                </Row>
                <span className="page-size-combo">
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
                <Table
                  dataSource={inputsData?.sarrafiCompanyList}
                  columns={columns}
                  pagination={tableParams.pagination}
                  // loading={loading}
                  onChange={handleTableChange}
                  onHeaderRow={() => {
                    return {
                      style: { backgroundColor: colorMode },
                    };
                  }}
                />
              </div>
            </Modal>
            <DetailseStep2
              inputsData={inputsData}
              setInputsData={setInputsData}
              dataDetails={dataDetails}
              getSurveyCommentsInfo={getSurveyCommentsInfo}
              showModale={showModale}
              tableParams={tableParams}
              setTableParams={setTableParams}
              setShowModale={setShowModale}
            />
          </Row>
          <Row>
            <Col sm={24} md={12} xl={8}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <DatePicker
                    value={inputsData?.sfrPaymentDedlineDateStr}
                    name="sfrPaymentDedlineDateStr"
                    onChange={handleChangeInputs}
                    validations={[
                      ["minimumDate", inputsData?.sfrRequestValidationDateStr],
                    ]}
                    error={errors?.sfrPaymentDedlineDateStr}
                    required
                    labelWidth="100px"
                    title="مهلت پرداخت"
                  />
                </div>
                <Tooltip title="حداکثر تاریخ قابل قبول که باید تا آن زمان، مبلغ ارزی به حساب مورد نظر برسد را در این فیلد مشخص نمائید. این فیلد بدین منظور در نظر گرفته شده که در صورتی که صرافی/بانک عامل، توانایی انجام حواله تا تاریخ مدنظر را داشته باشد اقدام به ارائه پیشنهاد بر روی درخواست شما نماید.">
                  <span>
                    <div className="tooltip-company-profile">
                      <i
                        className="fa fa-2x fa-question-circle no-margin success"
                        style={{ fontSize: "1.5em", color: "#53a93f" }}
                      />
                      <div className="tooltip-animation" />
                    </div>
                  </span>
                </Tooltip>
              </div>
            </Col>
            <Col sm={24} md={12} xl={8}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <DatePicker
                    value={inputsData?.sfrRequestValidationDateStr}
                    name="sfrRequestValidationDateStr"
                    onChange={handleChangeInputs}
                    validations={[
                      ["maximumDate", inputsData?.sfrPaymentDedlineDateStr],
                    ]}
                    error={errors?.sfrRequestValidationDateStr}
                    required
                    labelWidth="100px"
                    space="5px"
                    title="تاریخ اعتبار درخواست"
                  />
                </div>
                <Tooltip title="حداکثر زمانی را که صرافی/بانک های مورد نظر می توانند درخواست شما را مشاهده نموده و بر روی آن پیشنهاد ارائه نمایند، در این فیلد وارد کنید. (تاریخ اعتبار درخواست نمی تواند از تاریخ اعتبار گواهی بیشتر باشد.)">
                  <span>
                    <div className="tooltip-company-profile">
                      <i
                        className="fa fa-2x fa-question-circle no-margin success"
                        style={{ fontSize: "1.5em", color: "#53a93f" }}
                      />
                      <div className="tooltip-animation" />
                    </div>
                  </span>
                </Tooltip>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12} xl={8}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Input
                    value={inputsData?.sfrCreatorPersonNameStr}
                    name="sfrCreatorPersonNameStr"
                    onChange={handleChangeInputs}
                    type="text"
                    labelWidth="150px"
                    space="5px"
                    title="نام و نام خانوادگی"
                  />
                </div>
                <Tooltip title="در این فیلد می توانید نماینده ای را جهت تسهیل در فرآیند ارتباطی بین خودتان و صرافی/بانک معرفی نمایید.">
                  <span>
                    <div className="tooltip-company-profile">
                      <i
                        className="fa fa-2x fa-question-circle no-margin success"
                        style={{ fontSize: "1.5em", color: "#53a93f" }}
                      />
                      <div className="tooltip-animation" />
                    </div>
                  </span>
                </Tooltip>
              </div>
            </Col>
            <Col sm={24} md={12} xl={8}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Input
                    value={inputsData?.sfrCreatorPersonMobileNoStr}
                    name="sfrCreatorPersonMobileNoStr"
                    onChange={handleChangeInputs}
                    type="text"
                    labelWidth="150px"
                    space="5px"
                    title="شماره تماس"
                  />
                </div>
                <Tooltip title="در این فیلد می توانید شماره تماس نماینده خود را وارد کنید. تلفنی که در این قسمت وارد می شود به صرافی/بانک های مورد نظر نمایش داده می شود. همچنین بلافاصله پس از ارائه پیشنهاد بر روی درخواست شما، پیامک اطلاع رسانی ، به این شماره ارسال خواهد شد.">
                  <span>
                    <div className="tooltip-company-profile">
                      <i
                        className="fa fa-2x fa-question-circle no-margin success"
                        style={{ fontSize: "1.5em", color: "#53a93f" }}
                      />
                      <div className="tooltip-animation" />
                    </div>
                  </span>
                </Tooltip>
              </div>
            </Col>
          </Row>
          <Col sm={24} md={24} xl={24} style={{ padding: "0" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Input
                  value={inputsData?.sfrRequestReasonStr}
                  name="sfrRequestReasonStr"
                  onChange={handleChangeInputs}
                  validations={[["required"]]}
                  error={errors?.sfrRequestReasonStr}
                  required
                  type="textarea"
                  labelWidth="145px"
                  title="توضیحات"
                  placeholder={
                    "نمونه ای از اطلاعات قابل درج: علت درخواست حواله، شماره و تاریخ پروفرما، کالای مورد معامله، ملاحظات در خصوص مبدأ حواله، بانکی که مبلغ معامله را از آن پرداخت می کنید."
                  }
                />
              </div>
              <Tooltip title="در این فیلد هر توضیحی که تمایل دارید به اطلاع صرافی/بانک مورد نظر برسد می توانید وارد نمائید.">
                <span>
                  <div className="tooltip-company-profile">
                    <i
                      className="fa fa-2x fa-question-circle no-margin success"
                      style={{ fontSize: "1.5em", color: "#53a93f" }}
                    />
                    <div className="tooltip-animation" />
                  </div>
                </span>
              </Tooltip>
            </div>
          </Col>
        </>
      )}
    </div>
  );
};

export default Step2;

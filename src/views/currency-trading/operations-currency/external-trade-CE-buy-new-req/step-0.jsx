import React, { useState, useEffect } from "react";
import { Col, Row, Tooltip } from "antd";
import { Input, ComboBox, DatePicker } from "../../../../components";
import Validation from "../../../../utils/Validation";
import { useSelector, useDispatch } from "react-redux";
import CurrencyTable from "../currency-table/currency-table";
import axios from "axios";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import { endpoints } from "../../../../services/endpoints";
import Step1 from "./step1";

const Step0 = ({ inputsData, setInputsData, setErrors, errors, editingId }) => {
  const { GUid, role, stepsOfCreatePage } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [curencyType, setCurencyType] = useState(undefined);
  const [counter, setCounter] = useState(undefined);
  const [remittance, setRemittance] = useState([]);
  // remittance
  const handleChangeInputs = (name, value, validationNameList = undefined) => {
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
    if (name === "orderNos") {
      setCounter(true);
    }
  };

  useEffect(() => {
    if (counter) {
      getFishRemainPrice();
    }
    setCounter(false);
  }, [counter]);

  const convertCurrency4CreateSarrafiRequest = () => {
    const postData = {
      UrlVCodeInt: role,
      SsdsshGUID: GUid,
      curVCodeIntFish: inputsData?.curVCodeInt,
      Money: inputsData?.Money,
      curVCodeIntSarrafiRequest: inputsData?.curVCodeIntSarrafiRequest,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.convertCurrency4CreateSarrafiRequest
        .url,
      method:
        endpoints.RestAPIs.buyCurrency.convertCurrency4CreateSarrafiRequest
          .method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Error === 0) {
          setInputsData({ ...inputsData, amountDollars: res?.data?.Result });
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

  const handleConvert = () => {
    if (
      !!inputsData?.curVCodeIntSarrafiRequest &&
      !!inputsData?.orderNos &&
      !!inputsData?.Money &&
      !!inputsData.convert
    ) {
      convertCurrency4CreateSarrafiRequest();
    }
  };

  useEffect(() => {
    handleConvert();
  }, [inputsData?.orderNos, inputsData.convert]);

  const getFishRemainPrice = () => {
    const postData = {
      UrlVCodeInt: role,
      SsdsshGUID: GUid,
      fishID: inputsData?.orderNos,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getFishRemainPrice.url,
      method: endpoints.RestAPIs.buyCurrency.getFishRemainPrice.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Error === 0) {
          let tarikhEtebar = res?.data?.TarikhEtebar.split("/");
          let date = {
            year: tarikhEtebar[0],
            month: tarikhEtebar[1],
            day: tarikhEtebar[2],
          };
          setInputsData({
            ...inputsData,
            remainPriceMny: res?.data?.remainPriceMny,
            curNameStr: res?.data?.curNameStr,
            TarikhEtebar: date,
            curVCodeInt: res?.data?.curVCodeInt,
            isShowInput: true,
            convert: !!inputsData.convert ? inputsData.convert + 1 : 1,
          });
        } else {
          setInputsData({
            ...inputsData,
            isShowInput: false,
            convert: 0,
          });
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

  const getFishList = () => {
    const postData = {
      UrlVCodeInt: role,
      SsdsshGUID: GUid,
      orderNo: editingId?.orderNos,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getFishList.url,
      method: endpoints.RestAPIs.buyCurrency.getFishList.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Error === 0) {
          setInputsData({
            ...inputsData,
            optionOrderNos: res?.data?.fishInfoList,
            optionOrder: res?.data?.fishInfoList,
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

  const getInrterNationalCurrencyListForNima = () => {
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getInrterNationalCurrencyListForNima
        .url,
      method:
        endpoints.RestAPIs.buyCurrency.getInrterNationalCurrencyListForNima
          .method,
    })
      .then((res) => {
        setCurencyType(res?.data);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  const getHavaleType = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getHavaleType.url,
      method: endpoints.RestAPIs.buyCurrency.getHavaleType.method,
      data: postData,
    })
      .then((res) => {
        setRemittance(res?.data?.Result);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    getInrterNationalCurrencyListForNima();
    getFishList();
    getHavaleType();
  }, []);

  return (
    <>
      {stepsOfCreatePage?.CNR === 0 && (
        <>
          <Row style={{ padding: "30px 10px 0" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: "0 10px",
              }}
            >
              {/* <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  margin: "0",
                }}
              > */}
              <ComboBox
                title="ردیف گواهی"
                defaultValue={inputsData?.orderNos}
                name="orderNos"
                onChange={handleChangeInputs}
                options={inputsData?.optionOrderNos}
                width="220px"
                optionTitle="fishName"
                optionValue="fishID"
                validations={[["required"]]}
                error={errors?.orderNos}
                disabled={inputsData?.dataSource?.length >= 1}
              />
              {/* </div> */}
              <Tooltip title="گواهی ثبت آماری (تخصیص ارز) خود را از این لیست انتخاب نمایید.">
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
            <Col sm={24} md={12} xl={8}>
              <Input
                value={inputsData?.curNameStr}
                name="curNameStr"
                onChange={handleChangeInputs}
                // validations={[["required"]]}
                // error={errors?.curNameStr}
                type="text"
                space="5px"
                title="نوع ارز گواهی"
                readOnly
              />
            </Col>
            <Col sm={24} md={12} xl={8}>
              <Input
                value={inputsData?.remainPriceMny}
                name="remainPriceMny"
                onChange={handleChangeInputs}
                // validations={[["required"]]}
                // error={errors?.remainPriceMny}
                type="number"
                space="5px"
                title="سقف خرید"
                readOnly
              />
            </Col>
            <Col sm={24} md={12} xl={8}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <DatePicker
                    title="تاریخ اعتبار گواهی"
                    name="TarikhEtebar"
                    onChange={handleChangeInputs}
                    value={inputsData?.TarikhEtebar}
                    diabeld
                    // validations={[["maximumDate", inputsData?.DateT]]}
                    // error={errors?.TarikhEtebar}
                  />
                </div>
                <Tooltip title="تاریخ اعتبار گواهی، تاریخی است تا آن زمان گواهی شما معتبر بوده و می توانید بر روی آن خرید ارز انجام دهید.">
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
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <ComboBox
                    title="نوع ارز درخواست"
                    defaultValue={inputsData?.curVCodeIntSarrafiRequest}
                    name="curVCodeIntSarrafiRequest"
                    onChange={handleChangeInputs}
                    options={curencyType}
                    optionTitle="curNameStr"
                    optionValue="curVCodeInt"
                    validations={[["required"]]}
                    error={errors?.curVCodeIntSarrafiRequest}
                    disabled={inputsData?.dataSource?.length >= 1}
                  />
                </div>
                <Tooltip title="نوع ارز مورد نظر را در این فیلد می توانید انتخاب کنید. نوع ارز درخواستی می تواند با نوع ارز گواهی و ثبت سفارش متفاوت باشد.">
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
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Input
                    title="مبلغ"
                    value={inputsData?.Money}
                    name="Money"
                    onChange={handleChangeInputs}
                    labelWidth="310px"
                    validations={[["required"]]}
                    error={errors?.Money}
                    isCurrency={true}
                    onBlur={handleConvert}
                    readOnly={inputsData?.dataSource?.length >= 1}
                  />
                </div>
                <Tooltip title="در این فیلد می توانید حداکثر تا معادل عدد درج شده در فیلد سقف خرید به نوع ارز درخواست، عددی را درج نمائید. در صورت تفاوت ارز گواهی با ارز درخواستی، نرخ تبدیل بین ارز ها بر اساس نرخ تبدیل اعلام شده روزانه توسط بانک مرکزی محاسبه می شود.">
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
            {inputsData?.isShowInput && (
              <Col sm={24} md={12} xl={8}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Input
                      title={`مبلغ به ${inputsData?.curNameStr}`}
                      value={inputsData?.amountDollars}
                      name="amountDollars"
                      onChange={handleChangeInputs}
                      labelWidth="310px"
                      readOnly={inputsData?.dataSource?.length >= 1}
                      // validations={[["required"]]}
                      // error={errors?.orderNos}
                    />
                  </div>
                  <Tooltip title="در این فیلد می توانید حداکثر تا معادل عدد درج شده در فیلد سقف خرید به نوع ارز درخواست، عددی را درج نمائید. در صورت تفاوت ارز گواهی با ارز درخواستی، نرخ تبدیل بین ارز ها بر اساس نرخ تبدیل اعلام شده روزانه توسط بانک مرکزی محاسبه می شود.">
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
            )}
          </Row>
          <Col sm={24} md={12} xl={8}>
            <div
              style={{
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
                <ComboBox
                  title="نوع حواله"
                  defaultValue={inputsData?.sfrHavaleTypeInt}
                  name="sfrHavaleTypeInt"
                  onChange={handleChangeInputs}
                  options={remittance}
                  optionTitle="descriptionPersian"
                  optionValue="descriptionEng"
                  validations={[["required"]]}
                  error={errors?.sfrHavaleTypeInt}
                />
              </div>
              <Tooltip title="منظور از «خالص» ، واریز کل وجه درج شده به حساب مورد نظر بدون کسر کارمزدها و هزینه های انتقال و تبدیل ارز است. در صورتی که با انتخاب «ناخالص» ، به صرافی اجازه می دهید کارمزدها و هزینه های انتقال و تبدیل ارز را از مبلغ درخواست کسر نموده و مبلغی کمتر از مبلغ درج شده را به حساب مورد نظر واریز نماید.">
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
          <CurrencyTable
            inputsData={inputsData}
            setInputsData={setInputsData}
            errors={errors}
            setErrors={setErrors}
          />
        </>
      )}
      {stepsOfCreatePage?.CNR >= 1 && (
        <Step1
          inputsData={inputsData}
          setInputsData={setInputsData}
          errors={errors}
          setErrors={setErrors}
          editingId={editingId}
        />
      )}
    </>
  );
};

export default Step0;

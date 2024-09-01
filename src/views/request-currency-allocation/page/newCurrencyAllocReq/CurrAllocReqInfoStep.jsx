import React, { useRef, useEffect, useState } from "react";
import { Row, Col, Form } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import { endpoints } from "../../../../services/endpoints";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import axios from "axios";
import Validation from "../../../../utils/Validation";
import SendDocModal from "./sendDocModal";
import FormCurrAllocReqStep from "./FormCurrAllocReqStep";

const CurrAllocReqInfoStep = ({
  inputsData,
  docs,
  setDocs,
  desFinancialCost,
  setDesFinancialCost,
  setInputsData,
  errors,
  setErrors,
  docsData,
  setDocsData,
  currencyAllocReqId,
  tableDocId,
  refreshReq,
}) => {
  const { role, GUid } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const history = useHistory();

  let postData = {};
  const [form] = Form.useForm();


  const [open, setOpen] = useState(false);
  const [restImageDoc, setRestImageDoc] = useState(0);

  const [changeFieldsEdit, setChangeFieldsEdit] = useState(true)
  const [dealingTypeList, setDealingTypeList] = useState([]);
  const [reqCurrency, setReqCurrency] = useState([]);
  const [currAllocReqComPerList, setCurrAllocReqComPerList] = useState([]);
  const [currAllocReqFacLocList, setCurrAllocReqFacLocList] = useState([]);
  const [repDeadlineTypeList, setRepDeadlineTypeList] = useState([]);
  const [suppLocList, setSuppLocList] = useState([]);
  const [rateTypeList, setRateTypeList] = useState([]);
  const [reqTypeList, setReqTypeList] = useState([]);
  let setAlldata = {};

  const handleFilterDeleteFile = (id) => {
    const fiterDoc = docsData.filter((item, index) => index !== id);
    setDocsData(fiterDoc);
  };

  const operationCarAmoInPrCurrMny = (value, event) => {
    let part = value.split(".");
    if (
      part[0].length > 18 ||
      (part[1] && part[0].length + part[1].length > 18)
    ) {
      part[0] = part[0].slice(0, 18);
    }
    if (part[1] && part[1].length > 8) {
      part[1] = part[1].slice(0, 8);
    }
    value = part.join(".");
  }

  const handelCheckBox = (e) => {
    setInputsData((prev) => (
      {
        ...prev,
        appExt: e.target.checked
      }
    ));
  };

  const handleChangeInputs = (name, value, validationNameList = undefined, event) => {
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

    // if (name === "carAmountInProformaCurrencyMny") {
    //   operationCarAmoInPrCurrMny(value)
    // }
    if (name === "carDeadlinePerMonthInt") {
      console.log("HHHHH");
    }

    // مبلغ ارز ویرایش
    if (name === "carAmountInProformaCurrencyMny" && state?.editCurrAlloc && !!value && !!inputsData?.reqCurrencyItem) {
      handleConvertCurrencyForEditCurrencyAllocationRequest(inputsData?.reqCurrencyItem, value);
    }
    if (name === "carAmountInProformaCurrencyMny" && value === undefined && state?.editCurrAlloc) {
      setInputsData((prevstate) => {
        return {
          ...prevstate,
          carAmountMny: undefined
        };
      });
    }

    // مبلغ ارز
    if (name === "carAmountInProformaCurrencyMny" && !state?.editCurrAlloc &&
      !!value &&
      !!inputsData?.reqCurrencyItem) {
      handleConvertCurrency4CreateSarrafiRequest(inputsData?.reqCurrencyItem, value);
    }
    if (name === "carAmountInProformaCurrencyMny" && value === undefined) {
      console.log("Hello world");
      setInputsData((prevstate) => {
        return {
          ...prevstate,
          carAmountMny: undefined
        };
      });
    }

    // ارز درخواست
    if (name === "reqCurrencyItem" && !!value && !state?.editCurrAlloc) {
      console.log(value, inputsData?.carAmountMny);
      handleConvertCurrency4CreateSarrafiRequest(value, inputsData?.carAmountInProformaCurrencyMny);
    }
    if (name === "reqCurrencyItem" && state?.editCurrAlloc && !!value) {
      handleConvertCurrencyForEditCurrencyAllocationRequest(value, inputsData?.carAmountInProformaCurrencyMny);
    }

    // نوع معامله
    if (name === "dealingTypeItem" && !!value) {
      handleGetCurrencyAllocationRequestCommittedPersonList(value);
    }
    if (name === "dealingTypeItem") {
      setInputsData((prevstate) => {
        return {
          ...prevstate,
          deadLineAndExpireDeadLineEditableFlag: undefined,
          cfrFinancialCostTariffInt: undefined,
          currAllocReqComPerItem: undefined,
          currAllocReqFacLocItem: undefined,
          repDeadlineTypeItem: undefined,
          suppLocItem: undefined,
          reqTypeItem: undefined,
          rateTypeItem: undefined,
          carDeadlinePerMonthInt: undefined,
          expirationDate: undefined,
          carDeadlinePerMonthInt: undefined,
          carExpireDeadlinePerDayInt: undefined,
          carFinancialCostDescriptionStr: undefined,
        };
      });
      form.resetFields();
      setChangeFieldsEdit(false)
      setErrors({});
    }

    // متعهد
    if (name === "currAllocReqComPerItem" && !!value) {
      handleGetCurrencyAllocationRequestFacilityLocationList(value);
    }
    if (name === "currAllocReqComPerItem") {
      setInputsData((prevstate) => {
        return {
          ...prevstate,
          deadLineAndExpireDeadLineEditableFlag: undefined,
          currAllocReqFacLocItem: undefined,
          repDeadlineTypeItem: undefined,
          suppLocItem: undefined,
          rateTypeItem: undefined,
          cfrFinancialCostTariffInt: undefined,
          reqTypeItem: undefined,
          carDeadlinePerMonthInt: undefined,
          carExpireDeadlinePerDayInt: undefined,
          carFinancialCostDescriptionStr: undefined,
        };
      });
      form.resetFields();
      setErrors({});

    }

    // محل تسحیلات
    if (name === "currAllocReqFacLocItem" && !!value) {
      handleGetCurrencyAllocationRequestRepaymentDeadlineTypeList(value);
    }
    if (name === "currAllocReqFacLocItem") {
      setInputsData((prevState) => {
        return {
          ...prevState,
          deadLineAndExpireDeadLineEditableFlag: undefined,
          repDeadlineTypeItem: undefined,
          suppLocItem: undefined,
          rateTypeItem: undefined,
          reqTypeItem: undefined,
          carDeadlinePerMonthInt: undefined,
          expirationDate: undefined,
          carDeadlinePerMonthInt: undefined,
          carExpireDeadlinePerDayInt: undefined,
          carFinancialCostDescriptionStr: undefined,
          cfrFinancialCostTariffInt: undefined,
        };
      });
      form.resetFields();
      setErrors({});


    }

    // مهلت بازپرداخت
    if (name === "repDeadlineTypeItem" && !!value) {
      handleGetCurrencyAllocationRequestCurrencySupplyLocationList(value);
    }
    if (name === "repDeadlineTypeItem") {
      setInputsData((prevState) => {
        return {
          ...prevState,
          deadLineAndExpireDeadLineEditableFlag: undefined,
          suppLocItem: undefined,
          rateTypeItem: undefined,
          reqTypeItem: undefined,
          carDeadlinePerMonthInt: undefined,
          expirationDate: undefined,
          carDeadlinePerMonthInt: undefined,
          carExpireDeadlinePerDayInt: undefined,
          carFinancialCostDescriptionStr: undefined,
          cfrFinancialCostTariffInt: undefined,
        };
      });
      setErrors({});

      form.resetFields();
    }

    // محل تامین ارز
    if (name === "suppLocItem" && !!value) {
      handleGetCurrencyAllocationRequestCurrencyRateTypeList(value);
    }
    if (name === "suppLocItem") {
      setInputsData((prevState) => {
        return {
          ...prevState,
          deadLineAndExpireDeadLineEditableFlag: undefined,
          rateTypeItem: undefined,
          reqTypeItem: undefined,
          carDeadlinePerMonthInt: undefined,
          expirationDate: undefined,
          cfrFinancialCostTariffInt: undefined,
          carDeadlinePerMonthInt: undefined,
          carExpireDeadlinePerDayInt: undefined,
          carFinancialCostDescriptionStr: undefined,
        };
      });
      setErrors({});

      form.resetFields();
    }
    // -----------------
    // نرخ ارز
    if (name === "rateTypeItem" && !!value) {
      handleGetCurrencyAllocationRequestRequestTypeList(value);
    }
    if (name === "rateTypeItem") {
      setInputsData((prevState) => {
        return {
          ...prevState,
          deadLineAndExpireDeadLineEditableFlag: undefined,
          reqTypeItem: undefined,
          carDeadlinePerMonthInt: undefined,
          cfrFinancialCostTariffInt: undefined,
          expirationDate: undefined,
          carDeadlinePerMonthInt: undefined,
          carExpireDeadlinePerDayInt: undefined,
          carFinancialCostDescriptionStr: undefined,
        };
      });

      setErrors({});
      form.resetFields();
    }

    // نوع درخواست
    if (name === "reqTypeItem" && !!value) {
      handleGetCurrencyAllocationRequestFieldsRelations(value);
    }
    if (name === "reqTypeItem") {
      setInputsData((prevState) => {
        return {
          ...prevState,
          carDeadlinePerMonthInt: undefined,
          expirationDate: undefined,
          carDeadlinePerMonthInt: undefined,
          carExpireDeadlinePerDayInt: undefined,
          carFinancialCostDescriptionStr: undefined,
        };
      });
      setErrors({});
      form.resetFields();

    }
  };

  // سرویس مبلغ درخواست برای ویرایش
  const handleConvertCurrencyForEditCurrencyAllocationRequest = (curName, valueMoney) => {
    postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      carVCodeLng: inputsData?.carVCodeLng,
      carAmountInProformaCurrencyMny: valueMoney,
      carcurVCodeInt: curName,
    };

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .convertCurrencyForEditCurrencyAllocationRequest.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .convertCurrencyForEditCurrencyAllocationRequest.method,
      data: postData,
    })
      .then((res) => {
        console.log(res);
        if (res?.data?.ErrorCode === 0) {
          setInputsData((prev) => ({
            ...prev,
            carAmountMny: res?.data?.carAmountMny,
          }));
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ---------------------------------------------------------------------------------------------------------------------------------------------------------
  // سرویس مبلغ درخواست برای ایجاد
  const handleConvertCurrency4CreateSarrafiRequest = (curName, valueMoney) => {
    postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      curVCodeIntFish: curName,
      Money: valueMoney,
      curVCodeIntSarrafiRequest: state?.dataOfOrder?.prfcurVCodeInt,
    };

    axios({
      url: endpoints.RestAPIs.import.convertCurrency4CreateSarrafiRequest.url,
      method:
        endpoints.RestAPIs.import.convertCurrency4CreateSarrafiRequest.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.Error === 0) {
          setInputsData((prev) => ({
            ...prev,
            carAmountMny: res?.data?.Result,
          }));
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // لیست ارز درخواست
  const handleNTSW_GetCurrencyListByList = () => {
    // postData = {
    //   urlVCodeInt: role,
    //   ssdsshGUID: GUid,
    //   curVCodeIntFish: 0,
    //   Money: inputsData?.reqInOrderRegCurr,
    //   curVCodeIntSarrafiRequest: 0,
    // };
    axios({
      url: endpoints.RestAPIs.generalData.ntsw_GetCurrencyListByList.url,
      method: endpoints.RestAPIs.generalData.ntsw_GetCurrencyListByList.method,
      // data: postData,
    })
      .then((res) => {
        if (res?.data) {
          const filterFixSarrafi = res?.data?.filter((item) => item?.curNameStr !== "")
          setReqCurrency(filterFixSarrafi);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //->   لیست نوع معامله
  const handleGetCurrencyAllocationRequestDealingTypeList = () => {
    postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .getCurrencyAllocationRequestDealingTypeList.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .getCurrencyAllocationRequestDealingTypeList.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          setDealingTypeList(res?.data?.DealingTypeList);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //->   لیست متعهد
  const handleGetCurrencyAllocationRequestCommittedPersonList = (value) => {
    postData = {
      dealingTypeCode: value,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .getCurrencyAllocationRequestCommittedPersonList.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .getCurrencyAllocationRequestCommittedPersonList.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res.data?.ErrorCode === 0) {
          console.log(res.data);
          setCurrAllocReqComPerList(res?.data?.CommittedPersonList);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //->   محل تسهیلات
  const handleGetCurrencyAllocationRequestFacilityLocationList = (value) => {
    postData = {
      DealingTypeCode: inputsData?.dealingTypeItem,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      CommittedPersonCode: value,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .getCurrencyAllocationRequestFacilityLocationList.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .getCurrencyAllocationRequestFacilityLocationList.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res.data?.ErrorCode === 0) {
          setCurrAllocReqFacLocList(res?.data?.FacilityLocationList);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //->   مهلت بازپرداخت
  const handleGetCurrencyAllocationRequestRepaymentDeadlineTypeList = (
    value
  ) => {
    postData = {
      DealingTypeCode: inputsData?.dealingTypeItem,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      CommittedPersonCode: inputsData?.currAllocReqComPerItem,
      FacilityLocationCode: value,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .getCurrencyAllocationRequestRepaymentDeadlineTypeList.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .getCurrencyAllocationRequestRepaymentDeadlineTypeList.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res.data?.ErrorCode === 0) {
          setRepDeadlineTypeList(res?.data?.RepaymentDeadlineTypeList);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // محل تامین ارز
  const handleGetCurrencyAllocationRequestCurrencySupplyLocationList = (
    value
  ) => {
    postData = {
      DealingTypeCode: inputsData?.dealingTypeItem,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      CommittedPersonCode: inputsData?.currAllocReqComPerItem,
      FacilityLocationCode: inputsData?.currAllocReqFacLocItem,
      RepaymentDeadlineTypeCode: value,
    };
    console.log(postData, "tamin arz");
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .getCurrencyAllocationRequestCurrencySupplyLocationList.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .getCurrencyAllocationRequestCurrencySupplyLocationList.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));

        if (res.data?.ErrorCode === 0) {
          setSuppLocList(res?.data?.CurrencySupplyLocationList);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // نرخ ارز
  const handleGetCurrencyAllocationRequestCurrencyRateTypeList = (value) => {
    postData = {
      DealingTypeCode: inputsData?.dealingTypeItem,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      CommittedPersonCode: inputsData?.currAllocReqComPerItem,
      FacilityLocationCode: inputsData?.currAllocReqFacLocItem,
      RepaymentDeadlineTypeCode: inputsData?.repDeadlineTypeItem,
      CurrencySupplyLocationCode: value,
    };
    console.log(postData);
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .getCurrencyAllocationRequestCurrencyRateTypeList.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .getCurrencyAllocationRequestCurrencyRateTypeList.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res.data?.ErrorCode === 0) {
          setRateTypeList(res?.data?.CurrencyRateTypeList);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // نوع درخواست
  const handleGetCurrencyAllocationRequestRequestTypeList = (value) => {
    postData = {
      DealingTypeCode: inputsData?.dealingTypeItem,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      CommittedPersonCode: inputsData?.currAllocReqComPerItem,
      FacilityLocationCode: inputsData?.currAllocReqFacLocItem,
      RepaymentDeadlineTypeCode: inputsData?.repDeadlineTypeItem,
      CurrencySupplyLocationCode: inputsData?.suppLocItem,
      CurrencyRateTypeCode: value,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .getCurrencyAllocationRequestRequestTypeList.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .getCurrencyAllocationRequestRequestTypeList.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res.data?.ErrorCode === 0) {
          setReqTypeList(res.data?.RequestTypeList);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // مدت به ماه و مهلت انقضا
  const handleGetCurrencyAllocationRequestFieldsRelations = (value) => {
    const postData = {
      RequestTypeCode: value,
      DealingTypeCode: inputsData?.dealingTypeItem,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      CommittedPersonCode: inputsData?.currAllocReqComPerItem,
      FacilityLocationCode: inputsData?.currAllocReqFacLocItem,
      RepaymentDeadlineTypeCode: inputsData?.repDeadlineTypeItem,
      CurrencySupplyLocationCode: inputsData?.suppLocItem,
      CurrencyRateTypeCode: inputsData?.rateTypeItem,
    };
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .getCurrencyAllocationRequestFieldsRelations.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .getCurrencyAllocationRequestFieldsRelations.method,
      data: postData,
    })
      .then((res) => {
        console.log("rersersersersersrserse", res);
        if (res.data?.ErrorCode === 0) {
          setInputsData((prev) => {
            return {
              ...prev,
              perMonth: res?.data?.DeadlinePerMonthLabel,
              perDay: res?.data?.ExpireDeadlinePerDayLabel,
              cfrFinancialCostTariffInt: res?.data?.cfrFinancialCostTariffInt,
              cfrMaxDeadlinePerMonthInt: res?.data?.cfrMaxDeadlinePerMonthInt,
              cfrMaxExpireDeadlinePerDayInt:
                res?.data?.cfrMaxExpireDeadlinePerDayInt,
            };
          });
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // اطلاعات ویرایش
  const handleAllocReqDetForEdit = () => {
    postData = {
      carVCodeLng: state?.editCurrAlloc,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .getCurrencyAllocationRequestDetailForEditing.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .getCurrencyAllocationRequestDetailForEditing.method,
      data: postData,
    })
      .then((res) => {
        console.log(res);
        if (res?.data?.ErrorCode === 0) {
          const currAllocReq = res?.data?.CurrencyAllocationRequest;
          const setAlldataEdit = {
            reqCurrencyItem: currAllocReq?.carcurVCodeInt,
            dealingTypeItem: currAllocReq?.cdtVCodeInt,
            currAllocReqComPerItem: currAllocReq?.ccpVCodeInt,
            prfVCodeInt: currAllocReq?.prfVCodeInt,
            carAmountInProformaCurrencyMny:
              currAllocReq?.carAmountInProformaCurrencyMny,
            carRowNoInt: currAllocReq?.carRowNoInt,
            carAmountMny: currAllocReq?.carAmountMny,
            carVersionInt: currAllocReq?.carVersionInt,
            suppLocItem: currAllocReq?.ccsVCodeInt,
            reqTypeItem: currAllocReq?.crtVCodeInt,
            currAllocReqFacLocItem: currAllocReq?.cflVCodeInt,
            repDeadlineTypeItem: currAllocReq?.crdVCodeInt,
            rateTypeItem: currAllocReq?.ccrVCodeInt,
            carExpireDeadlinePerDayInt:
              currAllocReq?.carExpireDeadlinePerDayInt,
            carFinancialCostTariffInt: currAllocReq?.carFinancialCostTariffInt,
            carFinancialCostDescriptionStr: currAllocReq?.carFinancialCostDescriptionStr,
            deadLineAndExpireDeadLineEditableFlag:
              res?.data?.DeadLineAndExpireDeadLineEditableFlag,
            renewalRequestFeasibility: res?.data?.RenewalRequestFeasibility,
            amountFieldsVisibility: res?.data?.AmountFieldsVisibility,
            prfcurNameStr: currAllocReq?.prfcurNameStr,
            prfOrderNoStr: currAllocReq?.prfOrderNoStr,
            allocatedAmountInRequestCurrency:
              res?.data?.AllocatedAmountInRequestCurrency,
            allocatedAmountInProformaCurrency:
              res?.data?.AllocatedAmountInProformaCurrency,
            proformaFishAmountInProformaCurrency:
              res?.data?.ProformaFishAmountInProformaCurrency,
            carDeadlinePerMonthInt: currAllocReq?.carDeadlinePerMonthInt,
            carVCodeLng: currAllocReq?.carVCodeLng,
          };
          setInputsData((prev) => ({ ...prev, ...setAlldataEdit }));
          dispatch(handleLoading(false));
          setDocsData(currAllocReq?.DocumentList);
        } else {
          dispatch(handleLoading(false));
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editServicesField = () => {
    if (state?.editCurrAlloc && changeFieldsEdit) {
      handleAllocReqDetForEdit();

      if (!!inputsData?.rateTypeItem) {
        handleGetCurrencyAllocationRequestRequestTypeList(
          inputsData?.rateTypeItem
        );
      }

      if (!!inputsData?.dealingTypeItem) {
        console.log("Helllo edit");
        handleGetCurrencyAllocationRequestCommittedPersonList(
          inputsData?.dealingTypeItem
        );
      }

      // محل تسحیلات
      if (!!inputsData?.currAllocReqComPerItem) {
        handleGetCurrencyAllocationRequestFacilityLocationList(
          inputsData?.currAllocReqComPerItem
        );
      }
      // مهلت باز پرداخت
      if (!!inputsData?.currAllocReqFacLocItem) {
        handleGetCurrencyAllocationRequestRepaymentDeadlineTypeList(
          inputsData?.currAllocReqFacLocItem
        );
      }
      // محل تامین ارز
      if (!!inputsData?.repDeadlineTypeItem) {
        handleGetCurrencyAllocationRequestCurrencySupplyLocationList(
          inputsData?.repDeadlineTypeItem
        );
      }
      // نرخ ارز
      if (!!inputsData?.suppLocItem) {
        handleGetCurrencyAllocationRequestCurrencyRateTypeList(
          inputsData?.suppLocItem
        );
      }

      // مهلت و مدت
      if (!!inputsData?.reqTypeItem) {
        handleGetCurrencyAllocationRequestFieldsRelations(
          inputsData?.reqTypeItem
        );
      }

      // مبلغ درخواست
      if (!!inputsData?.reqCurrencyItem) {
        handleConvertCurrencyForEditCurrencyAllocationRequest(inputsData?.reqCurrencyItem, inputsData?.carAmountMny);
      }
    }
  };

  useEffect(() => {
    handleGetCurrencyAllocationRequestDealingTypeList();
    handleNTSW_GetCurrencyListByList();
    setRestImageDoc(restImageDoc + 1);
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        currAllocReqComPerItem: undefined,
        currAllocReqFacLocItem: undefined,
        repDeadlineTypeItem: undefined,
        suppLocItem: undefined,
        rateTypeItem: undefined,
      };
    });
    form.resetFields();
    editServicesField();
  }, [inputsData?.dealingTypeItem, changeFieldsEdit]);

  return (
    <>
      <div id={currencyAllocReqId}>
        <FormCurrAllocReqStep
          handelCheckBox={handelCheckBox}
          setErrors={setErrors}
          refreshReq={refreshReq}
          tableDocId={tableDocId}
          setAlldata={setAlldata}
          errors={errors}
          setOpen={setOpen}
          setDocs={setDocs}
          open={open}
          docsData={docsData}
          docs={docs}
          handleFilterDeleteFile={handleFilterDeleteFile}
          dealingTypeList={dealingTypeList}
          currAllocReqComPerList={currAllocReqComPerList}
          currAllocReqFacLocList={currAllocReqFacLocList}
          repDeadlineTypeList={repDeadlineTypeList}
          suppLocList={suppLocList}
          rateTypeList={rateTypeList}
          reqTypeList={reqTypeList}
          reqCurrency={reqCurrency}
          inputsData={inputsData}
          form={form}
          handleChangeInputs={handleChangeInputs}
        />
        {open && (
          <SendDocModal
            open={open}
            docsData={docsData}
            setDocsData={setDocsData}
            setOpen={setOpen}
            docs={docs}
            setDocs={setDocs}
            setInputsData={setInputsData}
            restImageDoc={restImageDoc}
            setErrors={setErrors}
            errors={errors}
          />
        )}
      </div>
    </>
  );
};

export default CurrAllocReqInfoStep;

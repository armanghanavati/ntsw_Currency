import {
  handleLoading,
  handleQuestionModal,
} from "../../../../state/action-creators";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { handleMessageModal } from "../../../../state/action-creators";
import currencyOperationTypes from "../../../../enums/currency-operation-types";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import moment from "jalali-moment";

const useSendRequest = ({
  currencyOperationType,
  pgtGUID,
  prfVCodeInt,
  prfOrderNoStr,
  selectedRowKeysForGoods,
  tabledataSourceForGoods,
  backupTabledataSourceForGoods,
  tabledataSourceForBillOfLading,
  inputsData,
  errors,
  setErrors,
  hasShippingDocument,
  form,
}) => {
  const dispatch = useDispatch();
  const { role, GUid } = useSelector((state) => state);
  const history = useHistory();

  const changeDateFormat = (date) => {
    if (date) {
      const temp = moment.from(date, "YYYY/MM/DD").format("YYYY-MM-DD");
      return temp;
    } else {
      return undefined;
    }
  };

  const handleValidation = ({
    inputsName = [],
    inputsData,
    errors,
    setErrors,
  }) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        (inputsData[item] === undefined ||
          inputsData[item] === null ||
          JSON.stringify(inputsData[item])?.trim() === "") &&
        item !== undefined
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setErrors(err);
    return err;
  };

  const permitForSkip = ({ inputsName, inputsData, errors, setErrors }) => {
    const error = handleValidation({
      inputsName,
      inputsData,
      errors,
      setErrors,
    });
    for (var key in error) {
      if (error[key]?.length > 0) {
        if (inputsName?.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSendRequest = ({ setTableParams, tableParams }) => {
    form.resetFields();
    if (
      permitForSkip({
        inputsName: [
          hasShippingDocument && "sanadHaml",
          "pcoIranBorderVCodeInt",
          "prfCustomInt",
          "pcoCountrySource",
          !hasShippingDocument && "bolTransitSettlementFreightAmountLng",
          !hasShippingDocument && "bolTransitSettlementInspectionAmountLng",
          !hasShippingDocument && "bolTransitSettlementDiscountLng",
          !hasShippingDocument && "bolTransitSettlelementOtherAmountLng",
        ],
        inputsData,
        errors,
        setErrors,
      })
    ) {
      if (inputsData.bolTransitSettlementAmountLng < 0) {
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: "مبلغ کل منشا ارز نمیتواند منفی باشد",
          })
        );
      } else if (
        tabledataSourceForBillOfLading.length > 0 ||
        (!!setTableParams &&
          currencyOperationType === currencyOperationTypes.NoCurrencyTransfer)
      ) {
        onFormSubmit({ setTableParams, tableParams });
      } else {
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: "وارد کردن بارنامه اجباریست.",
          })
        );
      }
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "لطفا تمامی فیلدها را با اطلاعات صحیح پر نمایید.",
        })
      );
    }
  };

  const getFieldsNameOnForm = (name) => {
    let temp;
    switch (name) {
      case "pfgGrossWeightAsKGDbl":
        temp = "وزن ناخالص";
        break;
      case "pfgNetWeightAsKGDbl":
        temp = "وزن خالص ";
        break;
      case "pfgCountInt":
        temp = "تعداد/مقدار";
        break;
      case "pfgpckCountInt":
        temp = "تعداد بسته";
        break;
      case "pcgFOBPriceMny":
        temp = "مبلغ فوب";
        break;
      default:
        temp = "یکی از فیلدها";
        break;
    }
    return temp;
  };

  const onFormSubmit = ({ setTableParams, tableParams }) => {
    dispatch(handleLoading(true));
    form
      .validateFields()
      .then(() => {
        showWarningTempPreCotageGoods({ setTableParams, tableParams });
      })
      .catch((errors) => {
        let message = "";
        errors?.errorFields?.map(({ errors, name }) => {
          const splitedName = name[0].split("-");
          message =
            message +
            `<span key={name[0]}>
        در ردیف کالایی ${
          Number(splitedName[1]) + 1
        }: برای ${getFieldsNameOnForm(splitedName[0])} ${errors[0]} 
       </span> <br/>`;
        });
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: `<div className="flex-order-column">${message}</div>`,
          })
        );
        dispatch(handleLoading(false));
      });
  };

  const showWarningTempPreCotageGoods = ({ setTableParams, tableParams }) => {
    dispatch(handleLoading(true));
    const prevDataForTabledataSourceForGoods = JSON.parse(
      backupTabledataSourceForGoods
    );
    const temp = tabledataSourceForGoods.map((item, index) => ({
      ...item,
      pcgFOBPriceMny:
        prevDataForTabledataSourceForGoods[index]?.pcgFOBPriceMny ==
        +item?.pcgFOBPriceMny
          ? prevDataForTabledataSourceForGoods[index]?.pcgFOBPriceMny
          : +item?.pcgFOBPriceMny,
      pcgPackagesCountInt:
        prevDataForTabledataSourceForGoods[index]?.pfgpckCountInt ==
        item?.pfgpckCountInt
          ? prevDataForTabledataSourceForGoods[index]?.pfgpckCountInt
          : item?.pfgpckCountInt,
      pcgCountInt:
        prevDataForTabledataSourceForGoods[index]?.pfgCountInt ==
        item?.pfgCountInt
          ? prevDataForTabledataSourceForGoods[index]?.pfgCountInt
          : item?.pfgCountInt,
      pcgGrossWeightInt:
        prevDataForTabledataSourceForGoods[index]?.pfgGrossWeightAsKGDbl ==
        item?.pfgGrossWeightAsKGDbl
          ? prevDataForTabledataSourceForGoods[index]?.pfgGrossWeightAsKGDbl
          : item?.pfgGrossWeightAsKGDbl,
      pcgNetWeightAsKGDbl:
        prevDataForTabledataSourceForGoods[index]?.pfgNetWeightAsKGDbl ==
        item?.pfgNetWeightAsKGDbl
          ? prevDataForTabledataSourceForGoods[index]?.pfgNetWeightAsKGDbl
          : item?.pfgNetWeightAsKGDbl,
      isSelected: selectedRowKeysForGoods.includes(item?.pfgVCodeLng),
      // دیتای قبلی کالا در ایتم هایی با پیشوند pfg قرار میگیرند
      pfgpckCountInt: prevDataForTabledataSourceForGoods[index]?.pfgpckCountInt,
      pfgCountInt: prevDataForTabledataSourceForGoods[index]?.pfgCountInt,
      pfgGrossWeightAsKGDbl:
        prevDataForTabledataSourceForGoods[index]?.pfgGrossWeightAsKGDbl,
      pfgNetWeightAsKGDbl:
        prevDataForTabledataSourceForGoods[index]?.pfgNetWeightAsKGDbl,
    }));
    const postData = {
      GoodElement: temp,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfVCodeInt,
      pgtGUID,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.showWarningTempPreCotageGoods.url,
      method: endpoints.RestAPIs.preCotage.showWarningTempPreCotageGoods.method,
      data: postData,
    })
      .then((res) => {
        const onYesModal = () => {
          setTempPreCotageGoods({ setTableParams, tableParams });
        };
        if (res?.data?.Result?.Error === 0) {
          setTempPreCotageGoods({ setTableParams, tableParams });
        } else if (res?.data?.Result?.Error === 1) {
          dispatch(
            handleQuestionModal({
              isModalOpen: true,
              title: "هشدار",
              describe: res?.data?.Result?.ErrorDesc,
              name: `SHOW_WARNING_TEMP_PRE_COTAGE_GOODS`,
              onYes: onYesModal,
            })
          );
          dispatch(handleLoading(false));
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.Result?.ErrorDesc,
            })
          );
          dispatch(handleLoading(false));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  // useEffect(() => {
  //   if (questionModal.name === "SHOW_WARNING_TEMP_PRE_COTAGE_GOODS") {
  //     if (questionModal.answer === "yes") {
  //       dispatch(
  //         handleQuestionModal({
  //           isModalOpen: false,
  //           title: "",
  //           describe: "",
  //           name: "",
  //         })
  //       );
  //       setTempPreCotageGoods({});
  //     } else if (questionModal.answer === "no") {
  //       dispatch(
  //         handleQuestionModal({
  //           isModalOpen: false,
  //           title: "",
  //           describe: "",
  //           name: "",
  //         })
  //       );
  //     }
  //   }
  // }, [questionModal.answer, questionModal.isModalOpen]);

  const setTempPreCotageGoods = ({ setTableParams, tableParams }) => {
    dispatch(handleLoading(true));
    const prevDataForTabledataSourceForGoods = JSON.parse(
      backupTabledataSourceForGoods
    );
    const postData = {
      GoodElement: tabledataSourceForGoods.map((item, index) => ({
        ...item,
        pcgFOBPriceMny:
          prevDataForTabledataSourceForGoods[index]?.pfgpckCountInt ==
          +item?.pcgFOBPriceMny
            ? prevDataForTabledataSourceForGoods[index]?.pcgFOBPriceMny
            : +item?.pcgFOBPriceMny,
        pcgPackagesCountInt:
          prevDataForTabledataSourceForGoods[index]?.pfgpckCountInt ==
          +item?.pfgpckCountInt
            ? prevDataForTabledataSourceForGoods[index]?.pfgpckCountInt
            : item?.pfgpckCountInt,
        pcgCountInt:
          prevDataForTabledataSourceForGoods[index]?.pfgCountInt ==
          +item?.pfgCountInt
            ? prevDataForTabledataSourceForGoods[index]?.pfgCountInt
            : item?.pfgCountInt,
        pcgGrossWeightInt:
          prevDataForTabledataSourceForGoods[index]?.pfgGrossWeightAsKGDbl ==
          +item?.pfgGrossWeightAsKGDbl
            ? prevDataForTabledataSourceForGoods[index]?.pfgGrossWeightAsKGDbl
            : item?.pfgGrossWeightAsKGDbl,
        pcgNetWeightAsKGDbl:
          prevDataForTabledataSourceForGoods[index]?.pfgNetWeightAsKGDbl ==
          +item?.pfgNetWeightAsKGDbl
            ? prevDataForTabledataSourceForGoods[index]?.pfgNetWeightAsKGDbl
            : item?.pfgNetWeightAsKGDbl,
        isSelected: selectedRowKeysForGoods.includes(item?.pfgVCodeLng),
        // دیتای قبلی کالا در ایتم هایی با پیشوند pfg قرار میگیرند
        pfgpckCountInt:
          prevDataForTabledataSourceForGoods[index]?.pfgpckCountInt,
        pfgCountInt: prevDataForTabledataSourceForGoods[index]?.pfgCountInt,
        pfgGrossWeightAsKGDbl:
          prevDataForTabledataSourceForGoods[index]?.pfgGrossWeightAsKGDbl,
        pfgNetWeightAsKGDbl:
          prevDataForTabledataSourceForGoods[index]?.pfgNetWeightAsKGDbl,
      })),
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfVCodeInt,
      pgtGUID,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.setTempPreCotageGoods.url,
      method: endpoints.RestAPIs.preCotage.setTempPreCotageGoods.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.Error === 0) {
          if (
            !setTableParams &&
            currencyOperationType === currencyOperationTypes.NoCurrencyTransfer
          ) {
            setPrecotage();
          } else if (
            currencyOperationType !== currencyOperationTypes.NoCurrencyTransfer
          ) {
            showWarningCreatePrecotage({ setTableParams, tableParams });
          }
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
          dispatch(handleLoading(false));
        }
        if (
          !!setTableParams &&
          currencyOperationType === currencyOperationTypes.NoCurrencyTransfer
        ) {
          setTableParams(tableParams);
          dispatch(handleLoading(false));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  const showWarningCreatePrecotage = ({ setTableParams, tableParams }) => {
    dispatch(handleLoading(true));
    const postData = {
      prfVCodeInt,
      authorize: {
        urlVCodeInt: role,
        ssdsshGUID: GUid,
        pgtGUID,
      },
      prfOrderNoStr,
      pcobolVCodeInt: hasShippingDocument ? inputsData?.sanadHaml : -1,
      pcoDiscountMny: inputsData?.bolTransitSettlementDiscountLng,
      pcoGoodsPriceMny: Number(inputsData?.totalOfPcgFOBPriceMny),
      pcoAmountLng: Number(inputsData?.bolTransitSettlementAmountLng),
      pcoFreightCostMny: inputsData?.bolTransitSettlementFreightAmountLng,
      pcoOtherCostMny: inputsData?.bolTransitSettlelementOtherAmountLng,
      pcoIranBorderVCodeInt: inputsData?.pcoIranBorderVCodeInt,
      pcoCountrySource: inputsData?.pcoCountrySource,
      pcoDestinationCustom: inputsData?.prfCustomInt,
      pcoInspectionAmountMny:
        inputsData?.bolTransitSettlementInspectionAmountLng,
      PcoBillOfLaddingList: tabledataSourceForBillOfLading.map((item) => ({
        BillOfLaddingTrackingcode: item?.BillOfLaddingTrackingcode,
        BillOfLadingNumber: item?.BillOfLadingNumber,
        pcbBOLNoStr: item?.BillOfLadingNumber,
        pcbBOLDate: item?.pcbBOLDate || changeDateFormat(item?.date),
        BillOfLadingID: item?.BillOfLadingID,
        TravellingDate: item?.TravellingDate,
        PortOfDischargeName: item?.PortOfDischargeName,
        IsBillOfLadingContainerStr: item?.IsBillOfLadingContainerStr,
        urlVCodeInt: role,
        ssdsshGUID: GUid,
      })),
      PreCotageBOLLst: tabledataSourceForBillOfLading.map((item) => ({
        pcbBOLNoStr: item?.BillOfLadingNumber,
        pcbBOLDate: item?.pcbBOLDate || changeDateFormat(item?.date),
        BillOfLadingID: item?.BillOfLadingID,
        BOLTrackingCode: item?.BillOfLaddingTrackingcode,
        TravellingDate: item?.TravellingDate,
        PortOfDischargeName: item?.PortOfDischargeName,
        IsBillOfLadingContainerStr: item?.IsBillOfLadingContainerStr,
      })),
    };
    axios({
      url: endpoints.RestAPIs.preCotage.showWarningCreatePrecotage.url,
      method: endpoints.RestAPIs.preCotage.showWarningCreatePrecotage.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.ErrorCode === 0) {
          if (!setTableParams) {
            setPrecotage();
          }
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
          dispatch(handleLoading(false));
        }
        if (!!setTableParams) {
          setTableParams(tableParams);
          dispatch(handleLoading(false));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  const setPrecotage = () => {
    dispatch(handleLoading(true));
    const postData = {
      pgtGUID,
      prfVCodeInt,
      prfOrderNoStr,
      pcobolVCodeInt: hasShippingDocument ? inputsData?.sanadHaml : -1,
      pcoDiscountMny: inputsData?.bolTransitSettlementDiscountLng,
      pcoGoodsPriceMny: +inputsData?.totalOfPcgFOBPriceMny,
      pcoAmountLng: +inputsData?.bolTransitSettlementAmountLng,
      pcoFreightCostMny: inputsData?.bolTransitSettlementFreightAmountLng,
      pcoOtherCostMny: inputsData?.bolTransitSettlelementOtherAmountLng,
      pcoIranBorderVCodeInt: inputsData?.pcoIranBorderVCodeInt,
      pcoCountrySource: inputsData?.pcoCountrySource,
      pcoDestinationCustom: inputsData?.prfCustomInt,
      pcoInspectionAmountMny:
        inputsData?.bolTransitSettlementInspectionAmountLng,
      PcoBillOfLaddingList: tabledataSourceForBillOfLading.map((item) => ({
        BillOfLaddingTrackingcode: item?.BillOfLaddingTrackingcode,
        BillOfLadingNumber: item?.BillOfLadingNumber,
        pcbBOLNoStr: item?.BillOfLadingNumber,
        pcbBOLDate: item?.pcbBOLDate || changeDateFormat(item?.date),
        BillOfLadingID: item?.BillOfLadingID,
        TravellingDate: item?.TravellingDate,
        PortOfDischargeName: item?.PortOfDischargeName,
        IsBillOfLadingContainerStr: item?.IsBillOfLadingContainerStr,
        urlVCodeInt: role,
        ssdsshGUID: GUid,
      })),
      PreCotageBOLLst: tabledataSourceForBillOfLading.map((item) => ({
        pcbBOLNoStr: item?.BillOfLadingNumber,
        pcbBOLDate: item?.pcbBOLDate || changeDateFormat(item?.date),
        BillOfLadingID: item?.BillOfLadingID,
        BOLTrackingCode: item?.BillOfLaddingTrackingcode,
        TravellingDate: item?.TravellingDate,
        PortOfDischargeName: item?.PortOfDischargeName,
        IsBillOfLadingContainerStr: item?.IsBillOfLadingContainerStr,
      })),
      ssdsshGUID: GUid,
      urlVCodeInt: role,
    };
    axios({
      url:
        currencyOperationType === currencyOperationTypes.Bank
          ? endpoints.RestAPIs.preCotage.setPrecotageForBanki.url
          : endpoints.RestAPIs.preCotage.setPrecotageWithoutCurrencyTransfer
              .url,
      method:
        currencyOperationType === currencyOperationTypes.Bank
          ? endpoints.RestAPIs.preCotage.setPrecotageForBanki.method
          : endpoints.RestAPIs.preCotage.setPrecotageWithoutCurrencyTransfer
              .method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.data?.Result?.Error === 0) {
          if (currencyOperationType === currencyOperationTypes.Bank) {
            history.push("OriginOfBankCurrency");
          } else if (
            currencyOperationType === currencyOperationTypes.NoCurrencyTransfer
          ) {
            history.push("CurrencyOriginWithoutCurrencyTransfer");
          }
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.Result?.ErrorDesc,
              type: "success",
            })
          );
        } else if (res?.data?.ErrorCode === 12 || res?.data?.ErrorCode === 1) {
          dispatch(
            handleMessageModal({
              type: "warning",
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
          if (currencyOperationType === currencyOperationTypes.Bank) {
            history.push("OriginOfBankCurrency");
          } else if (
            currencyOperationType === currencyOperationTypes.NoCurrencyTransfer
          ) {
            history.push("CurrencyOriginWithoutCurrencyTransfer");
          }
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.Result?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  return [handleSendRequest];
};

export default useSendRequest;

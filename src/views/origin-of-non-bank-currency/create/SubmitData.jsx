import { Button } from "../../../components";
import {
  handleLoading,
  handleQuestionModal,
  handleStepsOfCreatePage,
} from "../../../state/action-creators";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import themeColors from "../../../configs/theme";
import { handleMessageModal } from "../../../state/action-creators";

const SubmitData = ({
  prfVCodeInt,
  pgtGUID,
  tableDataSourceForBillOfLading,
  tableDataSourceForGoods,
  selectedRowKeysForGoods,
  errors,
  setErrors,
  setInputsData,
  inputsData,
  form,
}) => {
  const dispatch = useDispatch();
  const { stepsOfCreatePage, role, GUid } = useSelector((state) => state);

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        (inputsData[item] === 0 ||
          inputsData[item] === undefined ||
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

  const permitForSkip = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (var key in error) {
      if (error[key]?.length > 0) {
        if (inputsName?.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSendRequest = (event) => {
    event?.preventDefault();
    if (stepsOfCreatePage?.ONBC === 0) {
      if (
        permitForSkip([
          "pcoIranBorderVCodeInt",
          "prfCustomInt",
          "pcoCountrySource",
          "bolTransitSettlementFreightAmountLng",
          "bolTransitSettlementInspectionAmountLng",
          "bolTransitSettlementDiscountLng",
          "bolTransitSettlelementOtherAmountLng",
        ])
      ) {
        if (tableDataSourceForBillOfLading?.length > 0) {
          if (selectedRowKeysForGoods?.length > 0) {
            onFormSubmit();
          } else {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: "حداقل یک کالا را انتخاب نمایید.",
              })
            );
          }
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
    }
  };

  const onFormSubmit = () => {
    dispatch(handleLoading(true));
    form
      .validateFields()
      .then(() => {
        showWarningTempPreCotageGoods();
      })
      .catch((errors) => {
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: "لطفا مقادیر معتبر وارد نمایید!",
          })
        );
        dispatch(handleLoading(false));
      });
  };

  const showWarningTempPreCotageGoods = () => {
    dispatch(handleLoading(true));
    const temp = tableDataSourceForGoods.map((item) => ({
      ...item,
      pcgFOBPriceMny: Number(item?.pcgFOBPriceMny),
      pcgPackagesCountInt: item?.pfgpckCountInt,
      pcgCountInt: item?.pfgCountInt,
      isSelected: selectedRowKeysForGoods.includes(item?.pfgVCodeLng),
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
        dispatch(handleLoading(false));
        if (res?.data?.Result?.Error === 0) {
          setTempPreCotageGoods();
        } else {
          dispatch(
            handleQuestionModal({
              isModalOpen: true,
              title: "هشدار",
              describe: res?.data?.Result?.ErrorDesc,
              name: `SHOW_WARNING_TEMP_PRE_COTAGE_GOODS`,
              onYes: setTempPreCotageGoods,
            })
          );
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
  //         handleQuestionModal({ isModalOpen: false, title: "", describe: "" })
  //       );
  //       setTempPreCotageGoods();
  //     } else if (questionModal.answer === "no") {
  //       dispatch(
  //         handleQuestionModal({ isModalOpen: false, title: "", describe: "" })
  //       );
  //     }
  //   }
  // }, [questionModal.answer, questionModal.isModalOpen]);

  const setTempPreCotageGoods = () => {
    dispatch(handleLoading(true));
    const postData = {
      GoodElement: tableDataSourceForGoods.map((item) => ({
        ...item,
        pcgFOBPriceMny: Number(item?.pcgFOBPriceMny),
        pcgPackagesCountInt: item.pfgpckCountInt,
        pcgCountInt: item.pfgCountInt,
        isSelected: selectedRowKeysForGoods.includes(item?.pfgVCodeLng),
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
        dispatch(handleLoading(false));
        if (res?.data?.Error === 0) {
          dispatch(
            handleStepsOfCreatePage({ ONBC: stepsOfCreatePage?.ONBC + 1 })
          );
          setInputsData({
            ...inputsData,
            prfTotalPriceMny:
              inputsData?.bolTransitSettlementFreightAmountLng +
              inputsData?.bolTransitSettlementInspectionAmountLng +
              inputsData?.bolTransitSettlementDiscountLng +
              inputsData?.bolTransitSettlelementOtherAmountLng,
          });
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  const showWarningCreatePrecotage = () => {
    dispatch(handleLoading(true));
    // const postData = {
    //   prfVCodeInt,
    //   authorize: {
    //     urlVCodeInt: role,
    //     ssdsshGUID: GUid,
    //     pgtGUID,
    //   },
    //   prfOrderNoStr,
    //   pcobolVCodeInt: inputsData?.sanadHaml,
    //   pcoDiscountMny: inputsData?.bolTransitSettlementDiscountLng,
    //   pcoGoodsPriceMny: Number(inputsData?.totalOfPcgFOBPriceMny),
    //   pcoFreightCostMny: inputsData?.bolTransitSettlementFreightAmountLng,
    //   pcoOtherCostMny: inputsData?.bolTransitSettlelementOtherAmountLng,
    //   // pcoAmountLng: 0,
    //   pcoIranBorderVCodeInt: inputsData?.pcoIranBorderVCodeInt,
    //   pcoCountrySource: inputsData?.pcoCountrySource,
    //   pcoDestinationCustom: inputsData?.prfCustomInt,
    //   pcoInspectionAmountMny:
    //     inputsData?.bolTransitSettlementInspectionAmountLng,
    //   PcoBillOfLaddingList: tabledataSourceForBillOfLading.map((item) => ({
    //     BillOfLaddingTrackingcode: item?.BillOfLaddingTrackingcode,
    //     BillOfLadingNumber: item?.BillOfLadingNumber,
    //     pcbBOLNoStr: item?.BillOfLadingNumber,
    //     pcbBOLDate: item?.pcbBOLDate,
    //     BillOfLadingID: item?.BillOfLadingID,
    //     urlVCodeInt: role,
    //     ssdsshGUID: GUid,
    //   })),
    //   PreCotageBOLLst: tabledataSourceForBillOfLading.map((item) => ({
    //     pcbBOLNoStr: item?.BillOfLadingNumber,
    //     pcbBOLDate: item?.pcbBOLDate,
    //     BillOfLadingID: item?.BillOfLadingID,
    //     BOLTrackingCode: item?.BillOfLaddingTrackingcode,
    //   })),
    // };
    axios({
      url: endpoints.RestAPIs.preCotage.showWarningCreatePrecotage.url,
      method: endpoints.RestAPIs.preCotage.showWarningCreatePrecotage.method,
      //   data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.data?.ErrorCode === 0) {
          //   setPrecotage();
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  return (
    <Button
      onClick={handleSendRequest}
      backgroundColor={themeColors.btn.secondary}
    >
      ثبت و اتمام
      <i className="fa fa-step-backward" aria-hidden="true"></i>
    </Button>
  );
};

export default SubmitData;

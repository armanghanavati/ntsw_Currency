import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import { Button, Modal } from "../../../../components";
import {
  handleLoading,
  handleMessageModal,
  handleQuestionModal,
} from "../../../../state/action-creators";
import currencyOperationTypes from "../../../../enums/currency-operation-types";
import themeColors from "../../../../configs/theme";
import { useHistory } from "react-router-dom";

const Cancel = ({
  prfIsBankOPTny,
  pcoVCodeInt,
  pcoIDNoStr,
  pcoStatusTny,
  isIncludeTraceCode,
}) => {
  const { role, GUid } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const [isShowModal, setIsShowModal] = useState(false);

  const handleCancle = (e) => {
    e.preventDefault();
    dispatch(
      handleQuestionModal({
        isModalOpen: true,
        title: `ابطال منشا ارز ${
          prfIsBankOPTny === currencyOperationTypes.Bank
            ? "بانکی"
            : prfIsBankOPTny === currencyOperationTypes.NonBank
            ? "غیر بانکی"
            : prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
            ? "ثبت آماری"
            : "بدون انتقال ارز"
        }`,
        describe: `آیا قصد دارید منشا ارز ${
          prfIsBankOPTny === currencyOperationTypes.Bank
            ? "بانکی"
            : prfIsBankOPTny === currencyOperationTypes.NonBank
            ? "غیر بانکی"
            : prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
            ? "ثبت آماری"
            : "بدون انتقال ارز"
        } با کد <span class='text-red'>${pcoVCodeInt}</span> را که مربوط می شود به ثبت ${
          prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
            ? "آماری"
            : "سفارش"
        } <span class='text-red'>${pcoIDNoStr}</span> ابطال نمایید؟`,

        name: `CANCEL_ORIGIN_OF_CURRENCY`,
        onYes: handleOnYesQuestionModal,
      })
    );
  };

  const handleOnYesQuestionModal = () => {
    if ((pcoStatusTny === 3 || pcoStatusTny === 6) && isIncludeTraceCode) {
      setIsShowModal(true);
    } else {
      cancel();
    }
  };

  // useEffect(() => {
  //   if (questionModal.name === "CANCEL_ORIGIN_OF_CURRENCY") {
  //     if (questionModal.answer === "yes") {
  //       if ((pcoStatusTny === 3 || pcoStatusTny === 6) && isIncludeTraceCode) {
  //         setIsShowModal(true);
  //       } else {
  //         cancel();
  //       }
  //       dispatch(
  //         handleQuestionModal({
  //           isModalOpen: false,
  //           title: "",
  //           describe: "",
  //           name: "",
  //         })
  //       );
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

  const cancel = (event) => {
    event?.preventDefault();
    dispatch(handleLoading(true));
    const postData = {
      pcoVCodeInt: pcoVCodeInt,
      prfIsBankOPTny,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url:
        prfIsBankOPTny === currencyOperationTypes.NonBank
          ? endpoints.RestAPIs.preCotage.ebtalPreCotageDISBNK.url
          : endpoints.RestAPIs.preCotage.ebtalPreCotageBNK.url,
      method:
        prfIsBankOPTny === currencyOperationTypes.NonBank
          ? endpoints.RestAPIs.preCotage.ebtalPreCotageDISBNK.method
          : endpoints.RestAPIs.preCotage.ebtalPreCotageBNK.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.Result?.Error === 0) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.Result?.ErrorDesc,
              type: "success",
            })
          );
          switch (prfIsBankOPTny) {
            case currencyOperationTypes.Bank:
              history.push("OriginOfBankCurrency");
              break;
            case currencyOperationTypes.NonBank:
              history.push("OriginOfNonBankCurrency");
              break;
            case currencyOperationTypes.NoCurrencyTransfer:
              history.push("CurrencyOriginWithoutCurrencyTransfer");
              break;
            case currencyOperationTypes.StatisticalRegistration:
              history.push("CurrencyOriginOfStatisticalRegistration");
              break;
            default:
              break;
          }
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.Result?.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  const onCancelModal = (event) => {
    event?.preventDefault();
    setIsShowModal(false);
  };

  return (
    <>
      <Button
        name="return"
        onClick={handleCancle}
        backgroundColor={themeColors.btn.danger}
      >
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        ابطال منشا ارز
      </Button>
      <Modal
        title="پیغام سیستم"
        open={isShowModal}
        setIsOpen={setIsShowModal}
        footer={[
          <Button onClick={cancel}>موافقم</Button>,
          <Button
            backgroundColor={themeColors.btn.danger}
            onClick={onCancelModal}
          >
            انصراف
          </Button>,
        ]}
        width={600}
        onCancel={onCancelModal}
      >
        <form className="form modal--text">
          در صورت ابطال منشا ارز، شناسه رهگیری های مربوطه نیز ابطال خواهند شد.
        </form>
      </Modal>
    </>
  );
};

export default Cancel;

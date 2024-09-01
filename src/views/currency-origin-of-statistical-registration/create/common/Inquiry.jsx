// باتن استعلام از بانک یا افزودن قلم که بعد از فراخوانی سرویس ایتم را به جدول منشا ارز اضافه میکند
import { Col, Row } from "antd";
import { Button } from "../../../../components";
import axios from "axios";
import { endpoints } from "../../../../services/endpoints";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import currencyOperationTypes from "../../../../enums/currency-operation-types";

const Inquiry = ({
  permitForSkip,
  prfOrderNoStr,
  inputsData,
  setInputsData,
  setErrors,
  setTableDataSourceForCurrencyOrigins,
  form,
  currencyOperationType = currencyOperationTypes.StatisticalRegistration,
  currencyOriginOptions,
  customsOptions,
  roleTypeCheckList1,
  currencyOptions,
}) => {
  const {
    role,
    GUid,
    roleDetails: { roleType },
    loading,
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const handleInquiry = (event) => {
    event?.preventDefault();
    if (
      permitForSkip([
        "prfcurVCodeInt",
        inputsData?.prfcurVCodeInt ===
          inputsData?.exportImportIdForCurrencyOriginType &&
          "pcsExportCotageID",
        inputsData?.prfcurVCodeInt ===
          inputsData?.exportImportIdForCurrencyOriginType &&
          "pcsReleaseYearStr",
        inputsData?.prfcurVCodeInt ===
          inputsData?.exportImportIdForCurrencyOriginType && "pcsctmVCodeInt",
        "pcsAmountLng",
        "pcscurVCodeInt",
      ]) === true
    ) {
      if (!!inputsData?.currencyConvertError) {
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: "در محاسبه معادل ارز خطایی رخ داده است!",
          })
        );
      } else if (
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
      ) {
        precotageSourceInqueryFrontierBackpackSailor();
      } else {
        setTableDataSourceForCurrencyOrigins((prev) => [
          ...prev,
          {
            ...inputsData,
            pcscurVCodeInt: inputsData?.pcscurVCodeInt,
            pcsAmountLng: inputsData?.pcsAmountLng,
            pcsctmVCodeInt: inputsData?.pcsctmVCodeInt,
            pcsExportCotageID: inputsData?.pcsExportCotageID,
            pcsReleaseYearStr: inputsData?.pcsReleaseYearStr,
          },
        ]);
        setInputsData({
          prfOrderNoStr: inputsData?.prfOrderNoStr,
          curNameStr: inputsData?.curNameStr,
          prfTotalPriceMny: inputsData?.prfTotalPriceMny,
          prfcurVCodeInt: inputsData?.prfcurVCodeInt,
        });
        setErrors({});
        form.resetFields();
      }
    }
  };

  const precotageSourceInqueryFrontierBackpackSailor = () => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      pcscurVCodeInt: inputsData?.pcscurVCodeInt,
      pcsAmountLng: inputsData?.pcsAmountLng,
      pcsSourceTypeTny: inputsData?.prfcurVCodeInt,
      pcsctmVCodeInt:
        inputsData?.prfcurVCodeInt ===
        inputsData?.exportImportIdForCurrencyOriginType
          ? inputsData?.pcsctmVCodeInt
          : undefined,
      pcsExportCotageID:
        inputsData?.prfcurVCodeInt ===
        inputsData?.exportImportIdForCurrencyOriginType
          ? inputsData?.pcsExportCotageID
          : undefined,
      pcsReleaseYearStr:
        inputsData?.prfcurVCodeInt ===
        inputsData?.exportImportIdForCurrencyOriginType
          ? inputsData?.pcsReleaseYearStr
          : undefined,
      prfOrderNoStr,
      pcsMerchantDescStr:
        inputsData?.prfcurVCodeInt !==
        inputsData?.exportImportIdForCurrencyOriginType
          ? inputsData?.pcsMerchantDescStr
          : undefined,
      rltTypeTny: 0,
    };
    axios({
      url: endpoints.RestAPIs.preCotageSG[
        roleTypeCheckList1.includes(roleType)
          ? "precotageSourceInqueryFrontierBackpackSailor"
          : "precotageSourceInquery"
      ].url,
      method:
        endpoints.RestAPIs.preCotageSG[
          roleTypeCheckList1.includes(roleType)
            ? "precotageSourceInqueryFrontierBackpackSailor"
            : "precotageSourceInquery"
        ].method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res.data?.ErrorCode === 0) {
          setTableDataSourceForCurrencyOrigins((prev) => [
            ...prev,
            {
              ...inputsData,
              pcsMerchantDescStr:
                inputsData?.prfcurVCodeInt !==
                inputsData?.exportImportIdForCurrencyOriginType
                  ? inputsData?.pcsMerchantDescStr
                  : undefined,
              pcscurVCodeInt: inputsData?.pcscurVCodeInt,
              // نام ارز به صورت فارسی برای نمایش
              curNameStr: currencyOptions.find(
                ({ curVCodeInt }) => curVCodeInt === inputsData?.pcscurVCodeInt
              )?.curNameStr,
              pcsAmountLng: inputsData?.pcsAmountLng,
              convertCurrencyAmount: inputsData?.convertCurrencyAmount,
              pcsctmVCodeInt:
                inputsData?.prfcurVCodeInt ===
                inputsData?.exportImportIdForCurrencyOriginType
                  ? inputsData?.pcsctmVCodeInt
                  : undefined,
              pcsExportCotageID:
                inputsData?.prfcurVCodeInt ===
                inputsData?.exportImportIdForCurrencyOriginType
                  ? inputsData?.pcsExportCotageID
                  : undefined,
              pcsReleaseYearStr:
                inputsData?.prfcurVCodeInt ===
                inputsData?.exportImportIdForCurrencyOriginType
                  ? inputsData?.pcsReleaseYearStr
                  : undefined,
              prfcurVCodeInt: inputsData?.prfcurVCodeInt,
              // نام منشا ارز به صورت فارسی برای نمایش
              pcsSourceTypeStr: currencyOriginOptions.find(
                (item) => item.value === inputsData?.prfcurVCodeInt
              )?.descriptionPersian,
              // نام گمرک به صورت فارسی برای نمایش
              ctmNameStr:
                inputsData?.prfcurVCodeInt ===
                inputsData?.exportImportIdForCurrencyOriginType
                  ? customsOptions.find(
                      (item) => item.ctmVCodeInt === inputsData?.pcsctmVCodeInt
                    )?.ctmNameStr
                  : undefined,
            },
          ]);
          setInputsData({
            prfOrderNoStr: inputsData?.prfOrderNoStr,
            curNameStr: inputsData?.curNameStr,
            prfTotalPriceMny: inputsData?.prfTotalPriceMny,
            exportImportIdForCurrencyOriginType:
              inputsData?.exportImportIdForCurrencyOriginType,
            disabledPrfcurVCodeInt: inputsData?.disabledPrfcurVCodeInt,
            prfcurVCodeInt: inputsData?.prfcurVCodeInt,
          });
          setErrors({});
          form.resetFields();
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
    <Row>
      <Col sm={24} md={12} xl={8}>
        <Button onClick={handleInquiry} loading={loading}>
          {!inputsData?.prfcurVCodeInt ||
          inputsData?.prfcurVCodeInt ===
            inputsData?.exportImportIdForCurrencyOriginType ? (
            <>
              <i class="fa fa-info-circle" aria-hidden="true"></i>
              استعلام از بانک مرکزی
            </>
          ) : (
            <>
              <i class="fa fa-plus" aria-hidden="true"></i>
              افزودن قلم
            </>
          )}
        </Button>
      </Col>
    </Row>
  );
};
export default Inquiry;

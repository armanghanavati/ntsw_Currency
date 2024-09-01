import { Col, Form, Row } from "antd";
import { ComboBox, Input, VerticalSpace, InfoBox } from "../../../components";
import Validation from "../../../utils/Validation";
import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { useEffect } from "react";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import currencyOperationTypes from "../../../enums/currency-operation-types";

const DataForAddItemToCurrencyOriginsTable = ({
  prfVCodeInt,
  prfOrderNoStr,
  currencyOperationType,
  inputsData,
  setInputsData,
  errors,
  setErrors,
  form,
  showHTML = true,
  currencyOriginOptions,
  setCurrencyOriginOptions,
  customsOptions,
  setCustomsOptions,
  currencyOptions,
  setCurrencyOptions,
  roleTypeCheckList2,
}) => {
  const dispatch = useDispatch();

  const {
    role,
    GUid,
    roleDetails: { roleType },
  } = useSelector((state) => state);

  const getCurrencyOptions = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url:
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.generalData.getInrterNationalCurrencyListSG.url
          : endpoints.RestAPIs.generalData.getInrterNationalCurrencyListByList
              .url,
      method:
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.generalData.getInrterNationalCurrencyListSG
              .method
          : endpoints.RestAPIs.generalData.getInrterNationalCurrencyListByList
              .method,
      data: postData,
    })
      .then((res) => {
        setCurrencyOptions(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCustomList = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.generalData.getCustomList.url,
      method: endpoints.RestAPIs.generalData.getCustomList.method,
      data: postData,
    })
      .then((res) => {
        setCustomsOptions(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getListOfPreCotageSourceType = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotageSG.getListOfPreCotageSourceType.url,
      method:
        endpoints.RestAPIs.preCotageSG.getListOfPreCotageSourceType.method,
      data: postData,
    })
      .then((res) => {
        setCurrencyOriginOptions(res?.data?.Result);
        const exportImportIdForCurrencyOriginType = res?.data?.Result?.find(
          (item) => item.descriptionEng === "export"
        )?.value;
        if (!roleTypeCheckList2.includes(roleType)) {
          setInputsData({
            ...inputsData,
            prfcurVCodeInt: exportImportIdForCurrencyOriginType,
            exportImportIdForCurrencyOriginType,
            disabledPrfcurVCodeInt: true,
          });
        } else {
          setInputsData({
            ...inputsData,
            exportImportIdForCurrencyOriginType,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCurrencyOptions();
    getCustomList();
    getListOfPreCotageSourceType();
  }, []);

  const convertPreCotageSourceCurrencyToProformaCurrency = (
    callServiceAgain = true
  ) => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfVCodeInt,
      pcsAmountLng: inputsData?.pcsAmountLng,
      pcscurVCodeInt: inputsData?.pcscurVCodeInt,
    };
    axios({
      url: endpoints.RestAPIs.preCotageSG
        .convertPreCotageSourceCurrencyToProformaCurrency.url,
      method:
        endpoints.RestAPIs.preCotageSG
          .convertPreCotageSourceCurrencyToProformaCurrency.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.ErrorCode === 0) {
          setInputsData({
            ...inputsData,
            currencyTypeTitle: currencyOptions.find(
              (x) => x?.curVCodeInt === inputsData?.pcscurVCodeInt
            ),
            convertCurrencyAmount: res?.data?.Result,
            currencyConvertError: undefined,
          });
          dispatch(handleLoading(false));
        } else {
          if (callServiceAgain) {
            convertPreCotageSourceCurrencyToProformaCurrency(false);
          } else {
            dispatch(handleLoading(false));
            setInputsData({
              ...inputsData,
              currencyConvertError: "در محاسبه معادل ارز خطایی رخ داده است!",
              convertCurrencyAmount: undefined,
            });
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: res?.data?.ErrorDesc,
              })
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
        if (callServiceAgain) {
          convertPreCotageSourceCurrencyToProformaCurrency(false);
        } else {
          dispatch(handleLoading(false));
          setInputsData({
            ...inputsData,
            currencyConvertError: "در محاسبه معادل ارز خطایی رخ داده است!",
            convertCurrencyAmount: undefined,
          });
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: "در محاسبه معادل ارز خطایی رخ داده است!",
            })
          );
        }
      });
  };

  useEffect(() => {
    if (
      currencyOperationType ===
        currencyOperationTypes.StatisticalRegistration &&
      !!inputsData?.pcsAmountLng &&
      !!inputsData?.pcscurVCodeInt &&
      errors?.pcsAmountLng?.length === 0
    ) {
      convertPreCotageSourceCurrencyToProformaCurrency();
    }
  }, [inputsData?.pcscurVCodeInt]);

  const convertCurrencyValue = () => {
    if (
      currencyOperationType ===
        currencyOperationTypes.StatisticalRegistration &&
      !!inputsData?.pcsAmountLng &&
      !!inputsData?.pcscurVCodeInt
    ) {
      if (errors?.pcsAmountLng?.length === 0) {
        convertPreCotageSourceCurrencyToProformaCurrency();
      } else {
        setInputsData({
          ...inputsData,
          currencyConvertError: "در محاسبه معادل ارز خطایی رخ داده است!",
          convertCurrencyAmount: undefined,
        });
      }
    }
  };

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
  };

  return (
    <>
      {showHTML && (
        <Form form={form}>
          <Row>
            <Col sm={24} md={12} xl={8}>
              <Input
                value={inputsData?.prfOrderNoStr || prfOrderNoStr}
                title={`شماره ثبت ${
                  currencyOperationType ===
                  currencyOperationTypes.StatisticalRegistration
                    ? "آماری"
                    : "سفارش"
                }`}
                readOnly={true}
              />
            </Col>
            <Col sm={24} md={12} xl={8}>
              <Input
                value={inputsData?.prfTotalPriceMny}
                title="مبلغ کل"
                readOnly={true}
              />
            </Col>
            <Col sm={24} md={12} xl={8}>
              <Input
                value={inputsData?.curNameStr}
                title={`نوع ارز ثبت ${
                  currencyOperationType ===
                  currencyOperationTypes.StatisticalRegistration
                    ? "آماری"
                    : "سفارش"
                }`}
                readOnly={true}
              />
            </Col>
          </Row>
          <div className="container-with-border container-with-border__contain">
            <Row>
              <Col sm={24} md={12} xl={8}>
                <Form.Item
                  initialValue={inputsData?.prfcurVCodeInt}
                  name="prfcurVCodeInt"
                >
                  <ComboBox
                    title="نوع منشا ارز"
                    name="prfcurVCodeInt"
                    onChange={handleChangeInputs}
                    options={currencyOriginOptions}
                    defaultValue={inputsData?.prfcurVCodeInt}
                    optionTitle="descriptionPersian"
                    optionValue="value"
                    validations={[["required"]]}
                    error={errors.prfcurVCodeInt}
                    preventDefaultSelect={false}
                    disabled={inputsData?.disabledPrfcurVCodeInt}
                  />
                </Form.Item>
              </Col>
              {inputsData?.prfcurVCodeInt ===
                inputsData?.exportImportIdForCurrencyOriginType && (
                <>
                  <Col sm={24} md={12} xl={8}>
                    <Input
                      title="شماره کوتاژ صادراتی"
                      name="pcsExportCotageID"
                      onChange={handleChangeInputs}
                      value={inputsData?.pcsExportCotageID}
                      error={errors.pcsExportCotageID}
                      validations={[["required"], ["decimal", 0]]}
                      maxLength={10}
                    />
                  </Col>
                  <Col sm={24} md={12} xl={8}>
                    <Input
                      title="سال ترخیص"
                      name="pcsReleaseYearStr"
                      onChange={handleChangeInputs}
                      value={inputsData?.pcsReleaseYearStr}
                      error={errors.pcsReleaseYearStr}
                      placeholder="سال(شمسی) مثال:1394"
                      validations={[["required"], ["year"]]}
                      type="number"
                    />
                  </Col>
                  <Col sm={24} md={12} xl={8}>
                    <Form.Item
                      initialValue={inputsData?.pcsctmVCodeInt}
                      name="pcsctmVCodeInt"
                    >
                      <ComboBox
                        title="گمرک صادرکننده"
                        name="pcsctmVCodeInt"
                        onChange={handleChangeInputs}
                        options={customsOptions}
                        defaultValue={inputsData?.pcsctmVCodeInt}
                        optionTitle="ctmNameStr"
                        optionValue="ctmVCodeInt"
                        validations={[["required"]]}
                        error={errors.pcsctmVCodeInt}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              {inputsData?.prfcurVCodeInt &&
                inputsData?.prfcurVCodeInt !==
                  inputsData?.exportImportIdForCurrencyOriginType && (
                  <>
                    <Col sm={24} md={12} xl={8}>
                      <Input
                        title="توضیحات بازرگان"
                        name="pcsMerchantDescStr"
                        onChange={handleChangeInputs}
                        value={inputsData?.pcsMerchantDescStr}
                        error={errors.pcsMerchantDescStr}
                      />
                    </Col>
                    <Col sm={24} md={24} xl={24}>
                      <div className="info-box text-small">
                        * منظور از ارز با منشا خارجی، ارزی است که از طریق صرافی
                        یا صادرات تامین نشده است و ناشی از درآمد ارزی در خارج از
                        کشور می‌باشد.
                      </div>
                    </Col>
                  </>
                )}
            </Row>
          </div>
          <VerticalSpace space="10px" />
          <div className="container-with-border container-with-border__contain">
            <Row>
              <Col sm={24} md={12} xl={8}>
                <Form.Item
                  initialValue={inputsData?.pcscurVCodeInt}
                  name="pcscurVCodeInt"
                >
                  <ComboBox
                    title="نوع ارز"
                    name="pcscurVCodeInt"
                    onChange={handleChangeInputs}
                    options={currencyOptions}
                    defaultValue={inputsData?.pcscurVCodeInt}
                    optionTitle="curNameStr"
                    optionValue="curVCodeInt"
                    validations={[["required"]]}
                    error={errors.pcscurVCodeInt}
                    // onBlur={convertCurrencyValue}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12} xl={8}>
                <Input
                  title="مبلغ ارزی"
                  name="pcsAmountLng"
                  onChange={handleChangeInputs}
                  value={inputsData?.pcsAmountLng}
                  isCurrency={true}
                  error={errors.pcsAmountLng}
                  validations={[["required"], ["decimal", 0]]}
                  onBlur={convertCurrencyValue}
                />
              </Col>
            </Row>
            {((!!inputsData?.currencyTypeTitle &&
              !!inputsData?.convertCurrencyAmount) ||
              !!inputsData?.currencyConvertError) &&
              !!inputsData?.pcscurVCodeInt && (
                <Row>
                  <Col sm={24} md={24} xl={24}>
                    <InfoBox
                      currencyTypeTitle={inputsData?.curNameStr}
                      currencyConvertError={inputsData?.currencyConvertError}
                      convertCurrencyAmount={inputsData?.convertCurrencyAmount}
                    />
                  </Col>
                </Row>
              )}
          </div>
        </Form>
      )}
    </>
  );
};
export default DataForAddItemToCurrencyOriginsTable;

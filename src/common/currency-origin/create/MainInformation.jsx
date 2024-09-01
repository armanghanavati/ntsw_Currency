import { Col, Form, Row } from "antd";
import { ComboBox, Input, GuideBox } from "../../../components";
import Validation from "../../../utils/Validation";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import { useEffect } from "react";
import { useState } from "react";
import currencyOperationTypes from "../../../enums/currency-operation-types";

const MainInformation = ({
  prfOrderNoStr,
  prfVCodeInt,
  inputsData,
  setInputsData,
  errors,
  setErrors,
  hasShippingDocument,
  currencyOperationType,
  showHTML = true,
}) => {
  const { role, GUid } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [sanadHamlOptions, setSanadHamlOptions] = useState([]);
  const [bordersOptions, setBordersOptions] = useState([]);
  const [custemsOptions, setCustemsOptions] = useState([]);
  const [sourceCountriesOptions, setSourceCountriesOptions] = useState([]);

  const getSanadHamlList4SetPreCotageForBanki = ({ newInputsData }) => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfOrderNoStr,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.getSanadHamlList4SetPreCotageForBanki
        .url,
      method:
        endpoints.RestAPIs.preCotage.getSanadHamlList4SetPreCotageForBanki
          .method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.data?.Error === 0) {
          setSanadHamlOptions(res?.data?.SanadHaml || []);
          if (
            Array.isArray(res?.data?.SanadHaml) &&
            res?.data?.SanadHaml?.length === 1
          ) {
            getFieldsInfo4SetPreCotageForBanki(
              res?.data?.SanadHaml[0]?.bolVCodeInt,
              {
                ...inputsData,
                ...newInputsData,
                infoServiceHasCalled:
                  res?.data?.SanadHaml.length === 1 ? false : true,
                lcCode: JSON.stringify(Number(res?.data?.LCCode)),
                sanadHaml:
                  res?.data?.SanadHaml?.length === 1
                    ? res?.data?.SanadHaml[0]?.bolVCodeInt
                    : undefined,
              }
            );
          } else {
            setInputsData({
              ...inputsData,
              ...newInputsData,
              infoServiceHasCalled: true,
              lcCode: JSON.stringify(Number(res?.data?.LCCode)),
            });
          }
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

  const getFieldsInfo4SetPreCotageWithoutSanadhaml = ({ newInputsData }) => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfVCodeInt,
    };
    axios({
      url: endpoints.RestAPIs.preCotage
        .getFieldsInfo4SetPreCotageWithoutSanadhaml.url,
      method:
        endpoints.RestAPIs.preCotage.getFieldsInfo4SetPreCotageWithoutSanadhaml
          .method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.data?.Error === 0) {
          setInputsData({
            ...inputsData,
            ...newInputsData,
            ...res?.data?.Mansha,
            lcCode: res?.data?.Mansha?.LCCode,
            infoServiceHasCalled: true,
          });
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

  const getBordersCustemsSource4SetPreCotage = () => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfVCodeInt,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.getBordersCustemsSource4SetPreCotage
        .url,
      method:
        endpoints.RestAPIs.preCotage.getBordersCustemsSource4SetPreCotage
          .method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.data?.Error === 0) {
          let newInputsData;
          setBordersOptions(res?.data?.prfBordersList);
          setCustemsOptions(res?.data?.prfCustemsList);
          setSourceCountriesOptions(res?.data?.prfSourceList);

          newInputsData = {
            pcoCountrySource:
              res?.data?.prfSourceList?.length === 1
                ? res?.data?.prfSourceList[0]?.prfSourceInt
                : undefined,
            pcoIranBorderVCodeInt:
              res?.data?.prfBordersList.length === 1
                ? res?.data?.prfBordersList[0]?.prfBorderInt
                : undefined,
            prfCustomInt:
              res?.data?.prfCustemsList.length === 1
                ? res?.data?.prfCustemsList[0]?.prfCustomInt
                : undefined,
            isBarFarabaran: isBarFarabaran({
              options: res?.data?.prfCustemsList,
              value: Array.isArray(res?.data?.prfCustemsList)
                ? res?.data?.prfCustemsList[0]?.prfCustomInt
                : null,
            }),
            comboServiceHasCalled: true,
          };
          if (hasShippingDocument === true) {
            getSanadHamlList4SetPreCotageForBanki({
              newInputsData: { ...newInputsData },
            });
          } else {
            getFieldsInfo4SetPreCotageWithoutSanadhaml({
              newInputsData: {
                ...newInputsData,
              },
            });
          }
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

  useEffect(() => {
    if (prfVCodeInt) {
      getBordersCustemsSource4SetPreCotage();
    }
  }, [prfVCodeInt]);

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

    if (name === "sanadHaml") {
      if (!!value) {
        getFieldsInfo4SetPreCotageForBanki(value);
      } else {
        setInputsData({
          ...inputsData,
          bolTransitSettlementFreightAmountLng: undefined,
          bolTransitSettlementInspectionAmountLng: undefined,
          bolTransitSettlementDiscountLng: undefined,
          bolTransitSettlelementOtherAmountLng: undefined,
          bolTransitSettlementFOBAmountLng: undefined,
          bolTransitSettlementAmountLng: calculateBolTransitSettlementAmountLng(
            { totalOfPcgFOBPriceMny: inputsData?.totalOfPcgFOBPriceMny }
          ),
          [name]: value,
        });
      }
    } else if (
      name === "bolTransitSettlementFreightAmountLng" ||
      name === "bolTransitSettlementInspectionAmountLng" ||
      name === "bolTransitSettlementDiscountLng" ||
      name === "bolTransitSettlelementOtherAmountLng"
    ) {
      const total = calculateBolTransitSettlementAmountLng({
        bolTransitSettlementFreightAmountLng:
          +inputsData?.bolTransitSettlementFreightAmountLng,
        bolTransitSettlementInspectionAmountLng:
          +inputsData?.bolTransitSettlementInspectionAmountLng,
        bolTransitSettlementDiscountLng:
          +inputsData?.bolTransitSettlementDiscountLng,
        bolTransitSettlelementOtherAmountLng:
          +inputsData?.bolTransitSettlelementOtherAmountLng,
        totalOfPcgFOBPriceMny: +inputsData?.totalOfPcgFOBPriceMny,
        [name]: +value,
      });

      setInputsData((prevstate) => {
        return {
          ...prevstate,
          [name]: +value,
          prfTotalPriceMny: total,
          bolTransitSettlementAmountLng: total,
        };
      });
    } else if (name === "prfCustomInt") {
      setInputsData((prevstate) => {
        return {
          ...prevstate,
          [name]: value,
          isBarFarabaran: isBarFarabaran({
            options: custemsOptions,
            value,
          }),
        };
      });
    } else {
      setInputsData((prevstate) => {
        return {
          ...prevstate,
          [name]: value,
        };
      });
    }
  };

  const getFieldsInfo4SetPreCotageForBanki = (
    SanadHaml,
    newinputsData = {}
  ) => {
    dispatch(handleLoading(true));
    const postData = {
      LCCode: inputsData?.lcCode || newinputsData?.lcCode,
      SanadHaml,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.getFieldsInfo4SetPreCotageForBanki.url,
      method:
        endpoints.RestAPIs.preCotage.getFieldsInfo4SetPreCotageForBanki.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.data?.Error === 0) {
          const total = calculateBolTransitSettlementAmountLng({
            bolTransitSettlementFreightAmountLng:
              +res?.data?.Mansha?.bolTransitSettlementFreightAmountLng || 0,
            bolTransitSettlementInspectionAmountLng:
              +res?.data?.Mansha?.bolTransitSettlementInspectionAmountLng || 0,
            bolTransitSettlementDiscountLng:
              +res?.data?.Mansha?.bolTransitSettlementDiscountLng || 0,
            bolTransitSettlelementOtherAmountLng:
              +res?.data?.Mansha?.bolTransitSettlelementOtherAmountLng || 0,
            totalOfPcgFOBPriceMny:
              +inputsData?.totalOfPcgFOBPriceMny ??
              +res?.data?.Mansha?.totalOfPcgFOBPriceMny,
          });
          setInputsData({
            ...inputsData,
            ...newinputsData,
            ...res?.data?.Mansha,
            totalOfPcgFOBPriceMny:
              inputsData?.totalOfPcgFOBPriceMny ??
              res?.data?.Mansha?.totalOfPcgFOBPriceMny,
            prfTotalPriceMny: !total ? 0 : Number(total).toFixed(2),
            bolTransitSettlementAmountLng: !total
              ? 0
              : Number(total).toFixed(2),
            infoServiceHasCalled: true,
            sanadHaml: SanadHaml,
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

  const calculateBolTransitSettlementAmountLng = ({
    bolTransitSettlementFreightAmountLng,
    bolTransitSettlementInspectionAmountLng,
    bolTransitSettlementDiscountLng,
    bolTransitSettlelementOtherAmountLng,
    totalOfPcgFOBPriceMny,
  }) => {
    const freight = +bolTransitSettlementFreightAmountLng || 0,
      inspection = +bolTransitSettlementInspectionAmountLng || 0,
      discount = +bolTransitSettlementDiscountLng || 0,
      other = +bolTransitSettlelementOtherAmountLng || 0,
      goodsFob = +totalOfPcgFOBPriceMny || 0;
    const temp = freight + goodsFob + inspection - discount + other;
    return !temp || isNaN(temp) ? 0 : +temp.toFixed(10);
  };

  useEffect(() => {
    if (inputsData?.infoServiceHasCalled) {
      const total = calculateBolTransitSettlementAmountLng({
        bolTransitSettlementFreightAmountLng:
          inputsData?.bolTransitSettlementFreightAmountLng,
        bolTransitSettlementInspectionAmountLng:
          inputsData?.bolTransitSettlementInspectionAmountLng,
        bolTransitSettlementDiscountLng:
          inputsData?.bolTransitSettlementDiscountLng,
        bolTransitSettlelementOtherAmountLng:
          inputsData?.bolTransitSettlelementOtherAmountLng,
        totalOfPcgFOBPriceMny: inputsData?.totalOfPcgFOBPriceMny,
      });
      setInputsData((prevstate) => {
        return {
          ...prevstate,
          prfTotalPriceMny:
            !total || isNaN(total) ? 0 : Number(total).toFixed(2),
          bolTransitSettlementAmountLng:
            !total || isNaN(total) ? 0 : Number(total).toFixed(2),
        };
      });
    }
  }, [inputsData?.totalOfPcgFOBPriceMny]);

  const isBarFarabaran = ({ value, options }) => {
    const currentCustomObj = options.find(
      (customs) => customs.prfCustomInt === value
    );
    return currentCustomObj?.ctmIsBarFarabaranTny === 1 ? true : false;
  };

  return (
    <>
      {showHTML && (
        <Form form={form}>
          <Row>
            {hasShippingDocument && (
              <Col sm={24} lg={12} xl={8}>
                <Form.Item
                  initialValue={inputsData?.sanadHaml}
                  name="sanadHaml"
                >
                  <GuideBox
                    tooltipTitle="یکی از اسناد حملی که بانک عامل در پرتال ارزی درج کرده است را انتخاب کنید."
                    GuidedComponent={
                      <ComboBox
                        width="unset"
                        title="انتخاب سند حمل"
                        name="sanadHaml"
                        onChange={handleChangeInputs}
                        options={sanadHamlOptions}
                        defaultValue={inputsData?.sanadHaml}
                        optionTitle="bolRowNoStr"
                        optionValue="bolVCodeInt"
                        className={errors?.sanadHaml?.length > 0 && "error"}
                        validations={[["required"]]}
                        disabled={sanadHamlOptions.length === 1}
                        preventDefaultSelect={false}
                      />
                    }
                    error={errors?.sanadHaml}
                  />
                </Form.Item>
              </Col>
            )}
            {currencyOperationType !==
              currencyOperationTypes.NoCurrencyTransfer &&
              currencyOperationType !== currencyOperationTypes.NonBank && (
                <Col sm={24} lg={12} xl={8}>
                  <Input
                    labelWidth="unset"
                    value={inputsData?.lcCode}
                    title="شماره ابزار پرداخت"
                    readOnly={"readOnly"}
                  />
                </Col>
              )}
            {currencyOperationType === currencyOperationTypes.NonBank && (
              <Col sm={24} lg={12} xl={8}>
                <Input
                  labelWidth="unset"
                  value={prfOrderNoStr}
                  title="شماره ثبت سفارش"
                  readOnly={"readOnly"}
                />
              </Col>
            )}
          </Row>
          <Row>
            <Col sm={24} lg={12} xl={8}>
              <Form.Item
                initialValue={inputsData?.pcoCountrySource}
                name="pcoCountrySource"
              >
                <GuideBox
                  tooltipTitle="از بین کشورهای مبدأ حمل درج شده در پرونده، کشور مبدأ این محموله را انتخاب کنید."
                  GuidedComponent={
                    <ComboBox
                      width="unset"
                      title="کشور مبدا حمل"
                      name="pcoCountrySource"
                      onChange={handleChangeInputs}
                      options={sourceCountriesOptions}
                      defaultValue={inputsData?.pcoCountrySource}
                      optionTitle="prfSourceStr"
                      optionValue="prfSourceInt"
                      className={
                        errors?.pcoCountrySource?.length > 0 && "error"
                      }
                      validations={[["required"]]}
                      disabled={sourceCountriesOptions.length === 1}
                    />
                  }
                  error={errors?.pcoCountrySource}
                />
              </Form.Item>
            </Col>
            <Col sm={24} lg={12} xl={8}>
              <Form.Item
                initialValue={inputsData?.pcoIranBorderVCodeInt}
                name="pcoIranBorderVCodeInt"
              >
                <GuideBox
                  tooltipTitle="از بین مرزهای ورودی درج شده در پرونده، مرز ورودی این محموله را انتخاب کنید."
                  GuidedComponent={
                    <ComboBox
                      width="unset"
                      title="مرز ورودی"
                      name="pcoIranBorderVCodeInt"
                      onChange={handleChangeInputs}
                      options={bordersOptions}
                      defaultValue={inputsData?.pcoIranBorderVCodeInt}
                      optionTitle="prfBorderStr"
                      optionValue="prfBorderInt"
                      className={
                        errors?.pcoIranBorderVCodeInt?.length > 0 && "error"
                      }
                      validations={[["required"]]}
                      disabled={bordersOptions.length === 1}
                    />
                  }
                  error={errors?.pcoIranBorderVCodeInt}
                />
              </Form.Item>
            </Col>
            <Col sm={24} lg={12} xl={8}>
              <Form.Item
                initialValue={inputsData?.prfCustomInt}
                name="prfCustomInt"
              >
                <GuideBox
                  tooltipTitle="از بین گمرک‌های مقصد درج شده در پرونده، گمرک مقصد این محموله را انتخاب کنید."
                  GuidedComponent={
                    <ComboBox
                      width="unset"
                      title="گمرک مقصد"
                      name="prfCustomInt"
                      onChange={handleChangeInputs}
                      options={custemsOptions}
                      defaultValue={inputsData?.prfCustomInt}
                      optionTitle="prfCustomStr"
                      optionValue="prfCustomInt"
                      className={errors?.prfCustomInt?.length > 0 && "error"}
                      validations={[["required"]]}
                      disabled={custemsOptions.length === 1}
                    />
                  }
                  error={errors?.prfCustomInt}
                />
              </Form.Item>
            </Col>
            <Col sm={24} lg={12} xl={8}>
              <GuideBox
                tooltipTitle="این قسمت به صورت خودکار بر اساس مجموع مبلغ فوب کالاهای انتخاب شده از جدول کالاها (پایین صفحه) تکمیل می‌شود."
                GuidedComponent={
                  <Input
                    labelWidth="unset"
                    title="مبلغ فوب کالا"
                    value={inputsData?.totalOfPcgFOBPriceMny || 0}
                    isCurrency={true}
                    className={errors?.goodsTotal?.length > 0 && "error"}
                    readOnly={"readOnly"}
                  />
                }
                error={errors?.goodsTotal}
              />
            </Col>
            <Col sm={24} lg={12} xl={8}>
              <GuideBox
                tooltipTitle="در پرونده‌های بانکی نیازمند سند حمل، این قسمت به صورت خودکار بر اساس سند حمل درج شده در بانک عامل، تکمیل می‌شود. در سایر پرونده‌ها، باید این قسمت را بر اساس اسناد تکمیل کنید."
                GuidedComponent={
                  <Input
                    labelWidth="unset"
                    title="مبلغ حمل"
                    name="bolTransitSettlementFreightAmountLng"
                    onChange={handleChangeInputs}
                    value={inputsData?.bolTransitSettlementFreightAmountLng}
                    isCurrency={true}
                    readOnly={hasShippingDocument && "readOnly"}
                    className={
                      errors?.bolTransitSettlementFreightAmountLng?.length >
                        0 && "error"
                    }
                    validations={[["required"]]}
                  />
                }
                error={errors?.bolTransitSettlementFreightAmountLng}
              />
            </Col>
            <Col sm={24} lg={12} xl={8}>
              <GuideBox
                tooltipTitle="در پرونده‌های بانکی نیازمند سند حمل، این قسمت به صورت خودکار بر اساس سند حمل درج شده در بانک عامل، تکمیل می‌شود. در سایر پرونده‌ها، باید این قسمت را بر اساس اسناد تکمیل کنید."
                GuidedComponent={
                  <Input
                    labelWidth="unset"
                    title="مبلغ بازرسی"
                    name="bolTransitSettlementInspectionAmountLng"
                    onChange={handleChangeInputs}
                    value={inputsData?.bolTransitSettlementInspectionAmountLng}
                    isCurrency={true}
                    readOnly={hasShippingDocument && "readOnly"}
                    className={
                      errors?.bolTransitSettlementInspectionAmountLng?.length >
                        0 && "error"
                    }
                    validations={[["required"]]}
                  />
                }
                error={errors?.bolTransitSettlementInspectionAmountLng}
              />
            </Col>
            <Col sm={24} lg={12} xl={8}>
              <GuideBox
                tooltipTitle="در پرونده‌های بانکی نیازمند سند حمل، این قسمت به صورت خودکار بر اساس سند حمل درج شده در بانک عامل، تکمیل می‌شود. در سایر پرونده‌ها، باید این قسمت را بر اساس اسناد تکمیل کنید."
                GuidedComponent={
                  <Input
                    labelWidth="unset"
                    title="تخفیف"
                    name="bolTransitSettlementDiscountLng"
                    onChange={handleChangeInputs}
                    value={inputsData?.bolTransitSettlementDiscountLng}
                    isCurrency={true}
                    readOnly={hasShippingDocument && "readOnly"}
                    className={
                      errors?.bolTransitSettlementDiscountLng?.length > 0 &&
                      "error"
                    }
                    validations={[["required"]]}
                  />
                }
                error={errors?.bolTransitSettlementDiscountLng}
              />
            </Col>
            <Col sm={24} lg={12} xl={8}>
              <GuideBox
                tooltipTitle="در پرونده‌های بانکی نیازمند سند حمل، این قسمت به صورت خودکار بر اساس سند حمل درج شده در بانک عامل، تکمیل می‌شود. در سایر پرونده‌ها، باید این قسمت را بر اساس اسناد تکمیل کنید."
                GuidedComponent={
                  <Input
                    labelWidth="unset"
                    title="سایر هزینه‌ها"
                    name="bolTransitSettlelementOtherAmountLng"
                    onChange={handleChangeInputs}
                    value={inputsData?.bolTransitSettlelementOtherAmountLng}
                    isCurrency={true}
                    readOnly={hasShippingDocument && "readOnly"}
                    className={
                      errors?.bolTransitSettlelementOtherAmountLng?.length >
                        0 && "error"
                    }
                    validations={[["required"]]}
                  />
                }
                error={errors?.bolTransitSettlelementOtherAmountLng}
              />
            </Col>
            <Col sm={24} lg={12} xl={8}>
              <GuideBox
                tooltipTitle="این قسمت به صورت خودکار بر اساس مجموع مبالغ (مبلغ فوب، مبلغ حمل، مبلغ بازرسی، تخفیف و سایر هزینه‌ها) تکمیل می‌شود."
                GuidedComponent={
                  <Input
                    labelWidth="unset"
                    title="مبلغ کل"
                    name="bolTransitSettlementAmountLng"
                    value={inputsData?.bolTransitSettlementAmountLng}
                    isCurrency={true}
                    readOnly={"readOnly"}
                    className={
                      errors?.bolTransitSettlementAmountLng?.length > 0 &&
                      "error"
                    }
                  />
                }
                error={errors?.bolTransitSettlementAmountLng}
              />
            </Col>
          </Row>
          {hasShippingDocument && (
            <Row>
              <Col sm={24} lg={12} xl={8}>
                <GuideBox
                  tooltipTitle="این قسمت به صورت خودکار بر اساس سند حمل درج شده در بانک عامل تکمیل می‌شود. مجموع مبالغ فوب کالاهای منتخب از جدول کالاها باید با مبلغ فوب سند حمل برابر باشد."
                  GuidedComponent={
                    <Input
                      labelWidth="unset"
                      title="مبلغ فوب سند حمل"
                      name="bolTransitSettlementFOBAmountLng"
                      onChange={handleChangeInputs}
                      value={inputsData?.bolTransitSettlementFOBAmountLng}
                      isCurrency={true}
                      className={
                        errors?.bolTransitSettlementFOBAmountLng?.length > 0 &&
                        "error"
                      }
                      readOnly={"readOnly"}
                    />
                  }
                  error={errors?.bolTransitSettlementFOBAmountLng}
                />
              </Col>

              <Col sm={24} lg={12} xl={16}>
                <span class="text-small text-small--bold text-red">
                  توجه: مجموع مبلغ فوب کالاهای انتخاب شده از جدول پایین، باید با
                  مبلغ فوب سند حمل برابر باشد.
                </span>
              </Col>
            </Row>
          )}
        </Form>
      )}
    </>
  );
};

export default MainInformation;

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
  handleStepsOfCreatePage,
} from "../../../../state/action-creators";
import Step0 from "./step-0";
import StepsNavigationBar from "../../../../common/StepsNavigationBar";
import { Button } from "../../../../components";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import EmergingProblem from "../../emerging-problem/emerging-problem";
import { Modal } from "antd";
import themeColors from "../../../../configs/theme";
import convertJalaliDateToGregorian from "../../../../configs/helpers/convert-jalali-date-to-gregorian";

const LoadVerificationsGenuineExtention = () => {
  const { GUid, role, theme, stepsOfCreatePage } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(undefined);
  const [hasMount, setHasMount] = useState(false);
  const [modalRecord, setModalRecord] = useState(1);
  const { search } = useLocation();

  const steps = [
    {
      title: "تعیین مبلغ",
    },
    {
      title: "اطلاعات مقصد",
    },
    {
      title: "اطلاعات تکمیلی",
    },
  ];

  useEffect(() => {
    dispatch(
      handleStepsOfCreatePage({
        CNR: 0,
      })
    );
    if (search.toLowerCase().includes("request")) {
      setEditingId({ ...inputsData, orderNos: search.split("=")[1] });
    }
    setHasMount(true);
  }, []);

  const createOrEditeSarrafiRequestVIZ1 = () => {
    const postData = {
      sfrVCodeInt: 0,
      sarrafiRequestDetailList: [
        {
          sfdVCodeInt: 0,
          sfdsfrVCodeInt: 0,
          sfdsffVCodeInt: inputsData?.orderNos,
          sffFishIDCBI: null,
          sfdAmountMny: inputsData?.Money,
          sfdEqualentAmountFishMny: inputsData?.remainPriceMny,
          sfdcurVCodeIntFish: inputsData?.curNameStr,
          sfdcurDescFishStr: null,
          sfdStatusTny: 0,
          sfdActiveStatusTny: 0,
          sfdInsertDate: new Date().toLocaleDateString("fa-IR-u-nu-latn"),
          sfdEditDate: null,
          sfdVersionTny: 0,
        },
      ],
      curVCodeInt: inputsData?.curVCodeIntSarrafiRequest,
      sfrHavaleTypeInt: inputsData?.sfrHavaleTypeInt,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.createOrEditeSarrafiRequestVIZ1.url,
      method:
        endpoints.RestAPIs.buyCurrency.createOrEditeSarrafiRequestVIZ1.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Error === 0) {
          setInputsData({ ...inputsData, sfrVCodeInt: res?.data?.Result });
          dispatch(
            handleStepsOfCreatePage({
              CNR: stepsOfCreatePage?.CNR + 1,
            })
          );
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

  const createOrEditeSarrafiRequestVIZ2_2 = () => {
    const postData = {
      sarrafiRequest: {
        sarrafiRequestDetailList: [
          {
            sfdVCodeInt: 0,
            sfdsfrVCodeInt: inputsData?.sfrVCodeInt,
            sfdsffVCodeInt: 0,
            sffFishIDCBI: "string",
            sfdAmountMny: 0,
            sfdEqualentAmountFishMny: 0,
            sfdcurVCodeIntFish: 0,
            sfdcurDescFishStr: "string",
            sfdStatusTny: 0,
            sfdActiveStatusTny: 0,
            sfdInsertDate: "2023-10-25T13:13:38.435Z",
            sfdEditDate: "2023-10-25T13:13:38.435Z",
            sfdVersionTny: 0,
          },
        ],
        sarrafiPaymentList: [
          {
            sfpVCodeInt: 0,
            sfpsofVCodeInt: 0,
            sfpPaymentCodeStr: "string",
            sfpPaymentDate: "2023-10-25T13:13:38.435Z",
            sfpPaymentDateStr: "string",
            sfpPaymentAmountMny: 0,
            paymentType: "string",
            bankSender: "string",
            sfpUserDescStr: "string",
            sfpStatusTny: 0,
            sfpStatusStr: "string",
            sfpInsertDate: "2023-10-25T13:13:38.435Z",
            sfpInsertDateStr: "string",
          },
        ],
        sarrafiSana: {
          havaleDocsInfoList: [
            {
              docGUID: "string",
              docCaptionStr: "string",
              docFormat: "string",
              docInsertTime: "2023-10-25T13:13:38.435Z",
              docInsertTimeStr: "string",
            },
          ],
          sfsVCodeInt: 0,
          sfssofVCodeInt: 0,
          sfsSanaCodeStr: "string",
          sfsSanaDate: "2023-10-25T13:13:38.435Z",
          sfsSanaDateStr: "string",
          sfsAmountMny: 0,
          sfscurUnitPriceMny: 0,
          sfsRialTottalAmountMny: 0,
          sfsPaymentTypeTny: 0,
          sfsPaymentTypeStr: "string",
          sfsTransactionTypeTny: 0,
          sfsTransactionTypeStr: "string",
          customerType: 0,
          sfsprsNameStr: "string",
          sfsprsFamilyStr: "string",
          sfscmpNameStr: "string",
          sfsStatusTny: 0,
          sarrafiName: "string",
          currencyName: "string",
        },
        rowNumber: 0,
        sfrVCodeInt: inputsData?.sfrVCodeInt,
        sfrCBIID: "string",
        requestID: 0,
        sfrurlVCodeIntOwner: 0,
        sfrurlVCodeIntUser: 0,
        sfrcurVCodeInt: inputsData?.curVCodeIntSarrafiRequest || null,
        sfrcurNameStr: "string",
        sffBankShobeNameStr: "string",
        sfrTotalAmountMny: 0,
        sfrcnyVCodeIntDestination:
          inputsData?.sfrcnyVCodeIntDestination || null,
        cnyNameDestination: "string",
        sfrbnkVCodeIntDestination: 0,
        bnkNameDestination: "string",
        sfrbnkAddressStr: inputsData?.sfrbnkAddressStr || null,
        sfrBankDestinationStr: inputsData?.bnkNameEnStr,
        sfrswiftCodeStr: inputsData?.bnkSwiftCodeStr,
        sfrAccountNumDestinationStr:
          inputsData?.sfrAccountNumDestinationStr || null,
        sfrIBANStr: inputsData?.sfrIBANStr || null,
        sfrOtherPaymentCodeStr: inputsData?.sfrOtherPaymentCodeStr || null,
        sfrOtherPaymentTypeInt: 0,
        sfrOtherPaymentTypeStr: "string",
        sfrBeneficiaryNameStr: inputsData?.sfrBeneficiaryNameStr || null,
        sfrBeneficiaryAddressStr: inputsData?.sfrBeneficiaryAddressStr || null,
        sfrBeneficiaryTelAndFaxStr:
          inputsData?.sfrBeneficiaryTelAndFaxStr || null,
        sfrHavaleTypeInt: inputsData?.sfrHavaleTypeInt || null,
        sfrRequestReasonStr: "string",
        sfrPaymentDedlineDate: "2023-10-25T13:13:38.435Z",
        sfrPaymentDedlineDateStr: "string",
        sfrRequestValidationDate: "2023-10-25T13:13:38.435Z",
        sfrRequestValidationDateStr: "string",
        sfrsfcVCodeIntSelectedSarafi: 0,
        sfrsfcNameSelectedSarafi: "string",
        sfcShabaNoStrSelectedSarafi: "string",
        sofAccountNoStr: "string",
        sofAccountCardNoStr: "string",
        sofShenaseVarizStr: "string",
        sfcAccountOwnerNameStrSelectedSarafi: "string",
        sfcbnkNameStrSelectedSarafi: "string",
        sofRialPaymentDedlineDateSelectedSarafi: "string",
        sfrTypeTny: 0,
        sfrStatusTny: 0,
        sfrStatusStr: "string",
        sfrActiveStatusTny: 0,
        sfrActiveStatusStr: "string",
        sfrInsertDate: "2023-10-25T13:13:38.435Z",
        sfrEditDate: "2023-10-25T13:13:38.435Z",
        sfrVersionTny: 0,
        orderNos: "string",
        countOfActiveOffer: 0,
        sfrCreatorPersonNameStr: "string",
        sfrCreatorPersonMobileNoStr: "string",
        sfrCurrencyRateType: 0,
        sfrCurrencyRateTypestr: "string",
        isShowEditRequestButton: true,
        isShowCancelRequestButton: true,
        isShowOfferPart: true,
        isShowCacelOfferButton: true,
        isShowResultOfCacelOfferButtons: true,
        isShowPickOfferButton: true,
        isShowPaymenPart: true,
        isShowAddPaymentButton: true,
        isShowHavalePart: true,
        isShowFinalOKPart: true,
        Error: 0,
        ErrorDesc: "string",
      },
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      requestStatus: 0,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.createOrEditeSarrafiRequestVIZ2_2.url,
      method:
        endpoints.RestAPIs.buyCurrency.createOrEditeSarrafiRequestVIZ2_2.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Result?.Error === 0) {
          dispatch(
            handleStepsOfCreatePage({
              CNR: stepsOfCreatePage?.CNR + 1,
            })
          );
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
        dispatch(handleLoading(false));
      });
  };

  const createSarrafiRequestVIZ3 = () => {
    const postData = {
      sarrafiRequest: {
        sarrafiRequestDetailList: [
          {
            sfdVCodeInt: 0,
            sfdsfrVCodeInt: 0,
            sfdsffVCodeInt: 0,
            sffFishIDCBI: "string",
            sfdAmountMny: 0,
            sfdEqualentAmountFishMny: 0,
            sfdcurVCodeIntFish: 0,
            sfdcurDescFishStr: "string",
            sfdStatusTny: 0,
            sfdActiveStatusTny: 0,
            sfdInsertDate: "2023-10-31T04:45:35.759Z",
            sfdEditDate: "2023-10-31T04:45:35.759Z",
            sfdVersionTny: 0,
          },
        ],
        sarrafiPaymentList: [
          {
            sfpVCodeInt: 0,
            sfpsofVCodeInt: 0,
            sfpPaymentCodeStr: "string",
            sfpPaymentDate: "2023-10-31T04:45:35.759Z",
            sfpPaymentDateStr: "string",
            sfpPaymentAmountMny: 0,
            paymentType: "string",
            bankSender: "string",
            sfpUserDescStr: "string",
            sfpStatusTny: 0,
            sfpStatusStr: "string",
            sfpInsertDate: "2023-10-31T04:45:35.759Z",
            sfpInsertDateStr: "string",
          },
        ],
        sarrafiSana: {
          havaleDocsInfoList: [
            {
              docGUID: "string",
              docCaptionStr: "string",
              docFormat: "string",
              docInsertTime: "2023-10-31T04:45:35.759Z",
              docInsertTimeStr: "string",
            },
          ],
          sfsVCodeInt: 0,
          sfssofVCodeInt: 0,
          sfsSanaCodeStr: "string",
          sfsSanaDate: "2023-10-31T04:45:35.759Z",
          sfsSanaDateStr: "string",
          sfsAmountMny: 0,
          sfscurUnitPriceMny: 0,
          sfsRialTottalAmountMny: 0,
          sfsPaymentTypeTny: 0,
          sfsPaymentTypeStr: "string",
          sfsTransactionTypeTny: 0,
          sfsTransactionTypeStr: "string",
          customerType: 0,
          sfsprsNameStr: "string",
          sfsprsFamilyStr: "string",
          sfscmpNameStr: "string",
          sfsStatusTny: 0,
          sarrafiName: "string",
          currencyName: "string",
        },
        rowNumber: 0,
        sfrVCodeInt: inputsData?.sfrVCodeInt,
        sfrCBIID: "string",
        requestID: 0,
        sfrurlVCodeIntOwner: 0,
        sfrurlVCodeIntUser: 0,
        sfrcurVCodeInt: 0,
        sfrcurNameStr: "string",
        sffBankShobeNameStr: "string",
        sfrTotalAmountMny: 0,
        sfrcnyVCodeIntDestination: 0,
        cnyNameDestination: "string",
        sfrbnkVCodeIntDestination: 0,
        bnkNameDestination: "string",
        sfrbnkAddressStr: "string",
        sfrBankDestinationStr: "string",
        sfrswiftCodeStr: "string",
        sfrAccountNumDestinationStr: "string",
        sfrIBANStr: "string",
        sfrOtherPaymentCodeStr: "string",
        sfrOtherPaymentTypeInt: 0,
        sfrOtherPaymentTypeStr: "string",
        sfrBeneficiaryNameStr: "string",
        sfrBeneficiaryAddressStr: "string",
        sfrBeneficiaryTelAndFaxStr: "string",
        sfrHavaleTypeInt: 0,
        sfrRequestReasonStr: inputsData?.sfrRequestReasonStr,
        sfrPaymentDedlineDate: "",
        sfrPaymentDedlineDateStr: convertJalaliDateToGregorian(
          inputsData?.sfrPaymentDedlineDateStr
        ),
        sfrRequestValidationDate: "",
        sfrRequestValidationDateStr: convertJalaliDateToGregorian(
          inputsData?.sfrRequestValidationDateStr
        ),
        sfrsfcVCodeIntSelectedSarafi: inputsData?.sfcVCodeInt || null,
        sfrsfcNameSelectedSarafi: "string",
        sfcShabaNoStrSelectedSarafi: "string",
        sofAccountNoStr: "string",
        sofAccountCardNoStr: "string",
        sofShenaseVarizStr: "string",
        sfcAccountOwnerNameStrSelectedSarafi: "string",
        sfcbnkNameStrSelectedSarafi: "string",
        sofRialPaymentDedlineDateSelectedSarafi: "string",
        sfrTypeTny: inputsData?.sfrTypeTny || 1,
        sfrStatusTny: 0,
        sfrStatusStr: "string",
        sfrActiveStatusTny: 0,
        sfrActiveStatusStr: "string",
        sfrInsertDate: "2023-10-31T04:45:35.759Z",
        sfrEditDate: "2023-10-31T04:45:35.759Z",
        sfrVersionTny: 0,
        orderNos: "string",
        countOfActiveOffer: 0,
        sfrCreatorPersonNameStr: inputsData?.sfrCreatorPersonNameStr || null,
        sfrCreatorPersonMobileNoStr:
          inputsData?.sfrCreatorPersonMobileNoStr || null,
        sfrCurrencyRateType: 0,
        sfrCurrencyRateTypestr: "string",
        isShowEditRequestButton: true,
        isShowCancelRequestButton: true,
        isShowOfferPart: true,
        isShowCacelOfferButton: true,
        isShowResultOfCacelOfferButtons: true,
        isShowPickOfferButton: true,
        isShowPaymenPart: true,
        isShowAddPaymentButton: true,
        isShowHavalePart: true,
        isShowFinalOKPart: true,
        Error: 0,
        ErrorDesc: "string",
      },
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      requestStatus: 0,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.createSarrafiRequestVIZ3.url,
      method: endpoints.RestAPIs.buyCurrency.createSarrafiRequestVIZ3.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Result?.Error === 0) {
          dispatch(
            handleStepsOfCreatePage({
              CNR: stepsOfCreatePage?.CNR + 1,
            })
          );
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

  const inputName1 = [
    "bnkNameEnStr",
    "bnkSwiftCodeStr",
    "sfrBeneficiaryNameStr",
    "sfrcnyVCodeIntDestination",
  ];
  const inputName2 = [
    "sfrPaymentDedlineDateStr",
    "sfrRequestValidationDateStr",
    "sfrRequestReasonStr",
  ];

  const checkedValidationRecord = (event) => {
    event?.preventDefault();
    if (permitForNextStep(inputName2) === true) {
      createSarrafiRequestVIZ3();
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:
            "لطفا تمامی اطلاعات مربوط به درخواست تغییر را تکمیل بفرمایید.",
        })
      );
      return;
    }
  };

  const checkedValidation = (event) => {
    event?.preventDefault();
    // const checkedInputNames = InputsNames({ checkedImage, inputsData, errors })
    if (
      permitForNextStep(
        stepsOfCreatePage?.CNR === 0
          ? []
          : stepsOfCreatePage?.CNR === 1
          ? inputName1
          : ""
      ) === true
    ) {
      if (stepsOfCreatePage?.CNR === 0) {
        createOrEditeSarrafiRequestVIZ1();
      }
      if (stepsOfCreatePage?.CNR === 1) {
        createOrEditeSarrafiRequestVIZ2_2();
      }
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:
            "لطفا تمامی اطلاعات مربوط به درخواست تغییر را تکمیل بفرمایید.",
        })
      );
      return;
    }
  };

  const permitForNextStep = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (let key in error) {
      if (error[key]?.length > 0) {
        if (inputsName.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        inputsData[item] === undefined ||
        inputsData[item] === null ||
        JSON.stringify(inputsData[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setErrors(err);
    return err;
  };

  const prev = (event) => {
    event?.preventDefault();
    dispatch(
      handleStepsOfCreatePage({
        CNR: stepsOfCreatePage?.CNR - 1,
        hasAccessToStep: true,
      })
    );
  };

  useEffect(() => {
    if (modalRecord === 3) {
      setModalRecord(4);
    }
  }, [modalRecord]);
  useEffect(() => {
    if (modalRecord === 5) {
      checkedValidationRecord();
    }
  }, [modalRecord]);

  return (
    <>
      <StepsNavigationBar steps={steps} declarationType="CNR" />
      {stepsOfCreatePage?.CNR >= 0 && hasMount && (
        <>
          <Step0
            inputsData={inputsData}
            setInputsData={setInputsData}
            errors={errors}
            setErrors={setErrors}
            editingId={editingId}
          />
          <div
            style={{
              boxShadow: "0 0 4px rgba(0,0,0,.3)",
              marginTop: "20px",
              padding: "4px 8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Link
                to={{
                  pathname: `/Users/AC/Currency/ExternalTradeCEBuyManage`,
                }}
              >
                <Button>
                  <i class="btn-label fa fa-share m-2" />
                  انصراف
                </Button>
              </Link>
              {(stepsOfCreatePage?.CNR === 1 ||
                stepsOfCreatePage?.CNR === 2) && (
                <Button
                  className={"next-btn-step next-btn-step-prv"}
                  onClick={prev}
                >
                  <i
                    className="fa fa-step-forward prv-icon"
                    aria-hidden="true"
                  />
                  قبلی
                </Button>
              )}
              {stepsOfCreatePage?.CNR !== 2 && (
                <Button
                  disabled={
                    inputsData?.dataSource?.length === 0 ||
                    inputsData?.dataSource === undefined
                  }
                  className={"p-0-btn-next"}
                  onClick={checkedValidation}
                >
                  <i class="btn-label fa fa-step-backward m-0" />
                  بعدی
                </Button>
              )}
              {stepsOfCreatePage?.CNR === 2 && (
                <Button
                  onClick={() => setModalRecord(2)}
                  className={"p-0-btn-next"}
                >
                  <i class="btn-label fa fa-step-backward btnNext record-currency" />
                  ثبت و تمام
                </Button>
              )}
              <Modal
                className="questionModalDetails"
                style={{
                  backgroundColor: themeColors[theme]?.menueBg,
                  color: themeColors[theme]?.text,
                }}
                onCancel={() => setModalRecord(1)}
                footer={[
                  <div
                    className="colorFooter"
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    <Button
                      onClick={() => setModalRecord(3)}
                      backgroundColor={themeColors.btn.secondary}
                    >
                      تایید
                    </Button>
                    <Button
                      onClick={() => setModalRecord(1)}
                      backgroundColor={themeColors.btn.danger}
                    >
                      انصراف
                    </Button>
                  </div>,
                ]}
                open={modalRecord === 2}
                title={"شرایط عمومی ورود و انجام معامله در سامانه نیما"}
              >
                <div style={{ padding: "10px", textAlign: "right" }}>
                  <p>
                    1. اینجانب به عنوان خریدار‏‏/فروشنده متعهد می‌شوم نسبت به
                    ایفای دقیق و کامل تعهدات خود در معامله مطابق با توافقات
                    انجام یافته، از جمله سررسید ایفای تعهد، مبلغ، نرخ، مدارک و
                    مستندات قانونی و ... ، اقدام نمایم.
                  </p>
                  <p style={{ margin: "30px 0" }}>
                    2. اینجانب به عنوان خریدار‏‏/فروشنده حداکثر ظرف مدت 24 ساعت
                    مکلف به تأیید یا عدم تأیید عملیات انجام شده در هر مرحله
                    (آماده تایید صرافی‏/بازرگان، تایید پرداخت ریال، تایید صدور
                    حواله، تایید انصراف صرافی‏/بازرگان، تایید نهایی متقاضی،...)
                    توسط طرف مقابل معامله بوده و مسئولیت هرگونه عدم اقدام لازم
                    در این خصوص را می‌پذیرم.
                  </p>
                  <p>
                    3. اینجانب به عنوان خریدار‏‏/فروشنده مسؤلیت صحت و اصالت
                    مدارک و مستندات ارائه شده از سوی خود در فرآیند انجام معامله
                    را بر عهده می‌گیرم.
                  </p>
                  <p style={{ margin: "30px 0" }}>
                    4. آثار و تبعات ناشی از لغو يا مختومه نمودن معاملات صرفاً بر
                    عهده طرفين معامله می‌باشد.
                  </p>
                  <p>
                    5. هرگونه اقدام نماينده اشخاص حقوقي در سامانه‌هاي مربوط به
                    نيما، به منزله اقدام شخص حقوقي مي‌باشد و کليه مسئوليت‌هاي
                    اقدام نماينده، بر عهده شخص حقوقي ذيربط مي‌باشد.
                  </p>
                  <p style={{ margin: "30px 0" }}>
                    6. مسئولیت هرگونه توافق طرفین معامله که مغایر با شرایط عمومی
                    مذکور و ضوابط و مقررات ابلاغي بانک مرکزي باشد، بر عهده طرفین
                    معامله است.‏
                  </p>
                  <p>
                    7. اینجانب به عنوان خریدار‏‏/فروشنده تمامی ریسک‌ها و
                    مسئولیت‌های ناشی خرید و فروش ارز در بستر "سامانه نظام
                    یکپارچه معاملات ارزی (نیما)" را می‌پذیرم.
                  </p>
                </div>
              </Modal>
              <Modal
                style={{
                  backgroundColor: themeColors[theme]?.menueBg,
                  color: themeColors[theme]?.text,
                }}
                onCancel={() => setModalRecord(1)}
                footer={[
                  <div
                    className="colorFooter"
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    <Button
                      onClick={() => setModalRecord(5)}
                      backgroundColor={themeColors.btn.secondary}
                    >
                      تایید
                    </Button>
                  </div>,
                ]}
                open={modalRecord === 4}
                title={"تأییدیه ثبت درخواست"}
              >
                <div
                  style={{
                    padding: "10px 15px",
                    textAlign: "right",
                  }}
                >
                  <p>
                    سامانه جامع تجارت مسئولیتی در قبال تعهدات صرافی/بانک طرف
                    معامله شما نداشته و مسئولیت معامله به عهده طرفین معامله است.
                  </p>
                </div>
              </Modal>
            </div>
            <EmergingProblem style={{ marginBottom: "0" }} />
          </div>
        </>
      )}
    </>
  );
};

export default LoadVerificationsGenuineExtention;

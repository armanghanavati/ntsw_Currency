import StepsNavigationBar from "../../../../common/StepsNavigationBar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NewCurrencyRequest from "./NewCurrencyRequest";
import { Col, Row } from "antd";
import CurrAllocReqInfoStep from "./CurrAllocReqInfoStep";
import themeColors from "../../../../configs/theme";
import { Button } from "../../../../components";
import EmergingProblem from "../../../currency-trading/emerging-problem/emerging-problem";
import { endpoints } from "../../../../services/endpoints";
import {
  handleBreadCrumbData,
  handleLoading,
  handleMessageModal,
  handleQuestionModal,
  handleStepsOfCreatePage,
} from "../../../../state/action-creators";
import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import TooltipButton from "../../../../components/TooltipButton";
import QuickGuide from "../../../../components/QuickGuide";
import StringHelpers from "../../../../configs/helpers/string-helpers";

const CreateStepsCurrAllocReq = () => {
  const { stepsOfCreatePage, role, GUid, messageModal } = useSelector(
    (state) => state
  );
  const history = useHistory();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const [desFinancialCost, setDesFinancialCost] = useState("");
  const { state } = useLocation();
  const [docs, setDocs] = useState([]);
  const [docsData, setDocsData] = useState([]);

  const steps = [
    {
      title: "اطلاعات ثبت سفارش",
    },
    {
      title: " اطلاعات درخواست تخصیص ارز",
    },
  ];

  const [enabled, setEnabled] = useState(false);
  const ItemModalHandler = (event) => {
    event.preventDefault();
    setEnabled(!enabled);
  };

  const stepInfo = [
    {
      element: `${
        stepsOfCreatePage?.CNR === 0 ? "#countainer" : "#currencyAllocReqId"
      }`,
      intro: `1) ${
        state?.upgradeOrder && stepsOfCreatePage?.CNR === 0
          ? "در این صفحه اطلاعات اصلی آخرین نسخه ثبت نمایش داده می شود."
          : stepsOfCreatePage?.CNR === 1 && !state?.editCurrAlloc
          ? "در این بخش باید اقلام اطلاعاتی درخواست تخصیص ارز خود را وارد نمایید. با قرار دادن موس روی علامت سوال مقابل هریک از فیلد ها می توانید توضیحات مربوط به آن ها را مشاهده و سپس مقدار مد نظر را انتخاب نمایید. توجه نمایید گزینه های قابل انتخاب هریک از فیلد ها متناسب با اطلاعات فیلد های قبلی نمایش داده می شود بنابراین باید فیلد ها را به ترتیب از بالا راست پر نمایید."
          : stepsOfCreatePage?.CNR === 1 && state?.editCurrAlloc
          ? "در این بخش اقلام اطلاعاتی فعلی درخواست تخصیص ارز شما نمایش داده می شود. با قرار دادن موس روی علامت سوال مقابل هریک از فیلد ها می توانید توضیحات مربوط به آن ها را مشاهده و درصورت نیاز اصلاحات مد نظر خود را اعمال نمایید. توجه نمایید در صورت تغییر هریک از فیلد ها (به غیر از مبلغ و ارز درخواست) همه ی فیلد های بعد از آن را باید مجدد وارد نمایید."
          : "در این صفحه اطلاعات اصلی آخرین نسخه ثبت سفارشی که می خواهید برای آن درخواست تخصیص ارز ثبت کنید نمایش داده می شود."
      } `,
      position: "left",
    },
    {
      element: `${
        stepsOfCreatePage?.CNR === 1 && !state?.editCurrAlloc
          ? "#tableDocId"
          : stepsOfCreatePage?.CNR === 1 && state?.editCurrAlloc
          ? "#refreshReq"
          : "#cancelBtn"
      } `,
      intro: `2) ${
        state?.upgradeOrder
          ? 'با زدن دکمه "انصراف"  صفحه بروزرسانی درخواست تخصیص بسته می شود و به منوی اصلی باز خواهید گشت'
          : stepsOfCreatePage?.CNR === 1 && !state?.editCurrAlloc
          ? 'در صورتیکه فایل مستندی به درخواست پیوست کرده باشید در این جدول قابل ملاحظه خواهد بود. با زدن دکمه "حذف" در ستون عملیات می توانید فایل مد نظر را از درخواست پاک نمایید.'
          : stepsOfCreatePage?.CNR === 1 && state?.editCurrAlloc
          ? "در صورتیکه نیاز به تمدید مهلت خرید ارز داشته باشید می توانید تیک تمدید را انتخاب کنید."
          : 'با زدن دکمه "انصراف" صفحه ایجاد درخواست تخصیص بسته می شود و به منوی اصلی باز خواهید گشت.'
      }`,
      position: "left",
    },
    {
      element: `${
        stepsOfCreatePage?.CNR === 1 && !state?.editCurrAlloc
          ? "#backBtn"
          : stepsOfCreatePage?.CNR === 1 && state?.editCurrAlloc
          ? "#tableDocId"
          : "#upgradeBtn"
      }`,
      intro: `3) ${
        state?.upgradeOrder
          ? 'با زدن دکمه اعمال "بروزرسانی" درخواست خود را ثبت کرده و منتظر مشاهده نتیجه باشید.'
          : stepsOfCreatePage?.CNR === 1 && !state?.editCurrAlloc
          ? 'با زدن دکمه "قبلی" می توانید به صفحه مشاهده اطلاعات ثبت سفارش بازگردید.'
          : stepsOfCreatePage?.CNR === 1 && state?.editCurrAlloc
          ? 'در صورتیکه فایل مستندی به درخواست پیوست کرده باشید در این جدول قابل ملاحظه خواهد بود. با زدن دکمه "حذف" در ستون عملیات می توانید فایل مد نظر را از درخواست پاک نمایید.'
          : 'با زدن دکمه "بعدی" وارد مرحله بعدی ایجاد درخواست تخصیص ارز می شود.'
      }`,
      position: "left",
    },
    ...(stepsOfCreatePage?.CNR === 1
      ? [
          {
            element: `${!state?.editCurrAlloc ? "#cancelBtn" : "#cancelBtn"}`,
            intro: `4) ${
              !state?.editCurrAlloc
                ? 'با زدن دکمه "انصراف" صفحه ایجاد درخواست تخصیص بسته می شود و به منوی اصلی باز خواهید گشت.'
                : 'با زدن دکمه "انصراف" صفحه ویرایش درخواست تخصیص بسته می شود و به منوی اصلی باز خواهید گشت.'
            }`,
            position: "left",
          },
        ]
      : []),
    ...(stepsOfCreatePage?.CNR === 1
      ? [
          {
            element: "#acceptBtn",
            intro: `5) ${
              !state?.editCurrAlloc
                ? 'در صورتیکه از صحت اطلاعات وارد شده مطمئن هستید با زدن دکمه "ثبت" درخواست تخصیص ارز خود را ایجاد نمایید و منتظر مشاهده نتیجه باشید.'
                : 'در صورتیکه از صحت اطلاعات وارد شده مطمئن هستید با زدن دکمه "ویرایش" درخواست تخصیص ارز خود را اصلاح نمایید و منتظر مشاهده نتیجه باشید.'
            }`,
            position: "left",
          },
        ]
      : []),
  ];

  useEffect(() => {
    setMounted(true);
    if (!!state?.editCurrAlloc) {
      dispatch(
        handleStepsOfCreatePage({
          CNR: 1,
        })
      );
    } else {
      dispatch(
        handleStepsOfCreatePage({
          CNR: 0,
        })
      );
    }
    if (state?.upgradeOrder) {
      dispatch(handleBreadCrumbData("بروزرسانی ثبت سفارش"));
    } else if (state?.editCurrAlloc) {
      dispatch(handleBreadCrumbData("ویرایش درخواست تخصیص ارز"));
    } else {
      dispatch(handleBreadCrumbData("ایجاد درخواست تخصیص ارز"));
    }
  }, []);

  const operationAllDocs =
    !!docsData &&
    docsData?.map((item) => {
      return {
        DocumentId: item?.DocumentId || GUid,
        DocumentName: item?.DocumentName,
        DocumentFormat:
          item?.DocumentFormat?.split(".")?.[1] || item?.DocumentFormat,
        DocumentByteByBase64String: item?.DocumentByteByBase64String,
      };
    });

  const permitCreateCurrencyAllocationReq = (e) => {
    if (
      permitForNextStep([
        "carAmountInProformaCurrencyMny",
        "carDeadlinePerMonthInt",
        "carExpireDeadlinePerDayInt",
      ]) === true
    ) {
      handleCreateCurrencyAllocationRequest(e);
    }
  };

  // ثبت تخصیص ارز
  const handleCreateCurrencyAllocationRequest = (e) => {
    // e.preventDefault();
    const postData = {
      prfVCodeInt: state?.dataOfOrder.prfVCodeInt,
      carAmountInProformaCurrencyMny:
        inputsData?.carAmountInProformaCurrencyMny,
      carcurVCodeInt: inputsData?.reqCurrencyItem,
      DealingTypeCode: inputsData?.dealingTypeItem,
      CommittedPersonCode: inputsData?.currAllocReqComPerItem,
      FacilityLocationCode: inputsData?.currAllocReqFacLocItem,
      RepaymentDeadlineTypeCode: inputsData?.repDeadlineTypeItem,
      CurrencySupplyLocationCode: inputsData?.suppLocItem,
      CurrencyRateTypeCode: inputsData?.rateTypeItem,
      RequestTypeCode: inputsData?.reqTypeItem,
      carDeadlinePerMonthInt: Number(inputsData?.carDeadlinePerMonthInt),
      carExpireDeadlinePerDayInt: Number(
        inputsData?.carExpireDeadlinePerDayInt
      ),
      carFinancialCostTariffInt: inputsData?.cfrFinancialCostTariffInt,
      carFinancialCostDescriptionStr:
        inputsData?.carFinancialCostDescriptionStr,
      DocumentList: docsData?.length !== 0 ? operationAllDocs : [],
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.createCurrencyAllocationRequest
        .url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.createCurrencyAllocationRequest
          .method,
      data: postData,
    })
      .then((res) => {
        const fixText = StringHelpers.fixErrorDesc(res?.data?.ErrorDesc);
        if (res.data?.ErrorCode === 0) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              type: "success",
              describe: res?.data?.ErrorDesc,
            })
          );
          setIsRedirect(true);
        } else if (res.data?.ErrorCode === 1 || res.data?.ErrorCode === 5) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: fixText,
            })
          );
          setIsRedirect(false);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: fixText,
            })
          );
          setIsRedirect(false);
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
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

  const handleQuestionToAcceptEdit = () => {
    if (
      permitForNextStep([
        "carAmountInProformaCurrencyMny",
        "carDeadlinePerMonthInt",
        "carExpireDeadlinePerDayInt",
      ]) === true
    ) {
      dispatch(
        handleQuestionModal({
          isModalOpen: true,
          title: "هشدار",
          describe: "آیا از ویرایش اطلاعات مطمئن هستید؟",
          name: `EDIT_CURRENCT_ALLOCATION`,
          onYes: handleEditCurrAllocReq,
        })
      );
    }
    // setDescService(res?.data?.ErrorDesc);
  };

  useEffect(() => {
    if (isRedirect && !messageModal.isModalOpen) {
      history.push("/Users/AC/Currency/RequestCurrencyAllocation");
    }
  }, [messageModal.isModalOpen]);

  // تایید ویرایش
  const handleEditCurrAllocReq = () => {
    const postData = {
      carVCodeLng: state?.editCurrAlloc,
      RenewalRequest: inputsData?.appExt || false,
      prfVCodeInt: inputsData?.prfVCodeInt || state?.dataOfOrder?.prfVCodeInt,
      carAmountInProformaCurrencyMny:
        inputsData?.carAmountInProformaCurrencyMny ||
        inputsData?.reqInOrderRegCurr,
      carcurVCodeInt: inputsData?.reqCurrencyItem,
      DealingTypeCode: inputsData?.dealingTypeItem,
      CommittedPersonCode: inputsData?.currAllocReqComPerItem,
      FacilityLocationCode: inputsData?.currAllocReqFacLocItem,
      RepaymentDeadlineTypeCode: inputsData?.repDeadlineTypeItem,
      CurrencySupplyLocationCode: inputsData?.suppLocItem,
      CurrencyRateTypeCode: inputsData?.rateTypeItem,
      RequestTypeCode: inputsData?.reqTypeItem,
      carDeadlinePerMonthInt: Number(inputsData?.carDeadlinePerMonthInt),
      carExpireDeadlinePerDayInt: inputsData?.carExpireDeadlinePerDayInt,
      carFinancialCostTariffInt: inputsData?.cfrFinancialCostTariffInt,
      carFinancialCostDescriptionStr:
        inputsData?.carFinancialCostDescriptionStr,
      DocumentList: docsData?.length !== 0 ? operationAllDocs : [],
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.editCurrencyAllocationRequest
        .url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.editCurrencyAllocationRequest
          .method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        const fixText = StringHelpers.fixErrorDesc(res?.data?.ErrorDesc);
        if (res?.data?.ErrorCode === 0) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              type: "success",
              describe: res.data?.ErrorDesc,
            })
          );
          setIsRedirect(true);
        } else if (res.data?.ErrorCode === 1 || res.data?.ErrorCode === 5) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: fixText,
            })
          );
          setIsRedirect(false);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: fixText,
            })
          );
          setIsRedirect(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleApiUpgradeRegedOrder = (e) => {
  //   e.preventDefault();
  //   const postData = {
  //     prfVCodeInt: state?.dataOfOrder?.prfVCodeInt,
  //     urlVCodeInt: role,
  //     ssdsshGUID: GUid,
  //   };
  //   dispatch(handleLoading(true));
  //   axios({
  //     url: endpoints.RestAPIs.CurrencyAllocation.upgradeRegedOrder.url,
  //     method: endpoints.RestAPIs.CurrencyAllocation.upgradeRegedOrder.method,
  //     data: postData,
  //   })
  //     .then((res) => {
  //       const fixTitle = StringHelpers.fixErrorDesc(res?.data?.ErrorDesc);
  //       if (res.data?.ErrorCode === 0) {
  //         dispatch(
  //           handleMessageModal({
  //             isModalOpen: true,
  //             type: "success",
  //             describe: res?.data?.ErrorDesc,
  //           })
  //         );

  //         history.push({
  //           pathname: "/Users/AC/Currency/RequestCurrencyAllocation",
  //           state: {
  //             orderRegistrationNumber: inputsData?.prfOrderNoStr,
  //           },
  //         });
  //       } else {
  //         const fixTitle = res?.data?.ErrorDesc?.split("\\n\\r");
  //         let message = "";
  //         fixTitle?.map((item) => {
  //           message = message + `<span> ${item} </span>`
  //         });
  //         dispatch(
  //           handleMessageModal({
  //             isModalOpen: true,
  //             describe: `<div className="flex-order-column">${message}</div>`,
  //             //   describe: `<div className="modalMain">
  //             //   ${fixTitle.map((item) => {
  //             //     return <p>{item}</p>;
  //             //   })}
  //             // </div>`
  //             describe: `<div className="flex-order-column">${message}</div>`,
  //             //   describe: `<div className="modalMain">
  //             //   ${fixTitle.map((item) => {
  //             //     return <p>{item}</p>;
  //             //   })}
  //             // </div>`
  //           })
  //         );
  //       }
  //       dispatch(handleLoading(false));
  //     })
  //     .catch((err) => {
  //       dispatch(handleLoading(false));
  //     });
  // };

  const handleApiUpgradeRegedOrder = (e) => {
    e?.preventDefault();
    dispatch(handleLoading(true));
    setLoading(true);

    const postData = {
      prfVCodeInt: state?.dataOfOrder?.prfVCodeInt,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.upgradeRegedOrder.url,
      method: endpoints.RestAPIs.CurrencyAllocation.upgradeRegedOrder.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              type: "success",
              describe: res?.data?.ErrorDesc,
            })
          );
          history.push({
            pathname: "/Users/AC/Currency/RequestCurrencyAllocation",
            state: {
              orderRegistrationNumber: inputsData?.prfOrderNoStr,
            },
          });
        } else {
          const fixTitle = res?.data?.ErrorDesc?.split("\\n\\r");
          let message = "";
          fixTitle?.map((item) => {
            message = message + `<span> ${item} </span>`;
          });
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: `<div className="flex-order-column">${message}</div>`,
              //   describe: `<div className="modalMain">
              //   ${fixTitle.map((item) => {
              //     return <p>{item}</p>;
              //   })}
              // </div>`
            })
          );
        }
        dispatch(handleLoading(false));
        setLoading(false);
      })
      .catch((err) => {
        dispatch(handleLoading(false));
        setLoading(false);
      });
  };

  return (
    <>
      {!!!(state?.editCurrAlloc || state?.upgradeOrder) && (
        <Row>
          <StepsNavigationBar steps={steps} declarationType="CNR" />
        </Row>
      )}
      <QuickGuide enabled={enabled} setEnabled={setEnabled} steps={stepInfo}>
        <div className="" id="countainer">
          {stepsOfCreatePage?.CNR === 0 && mounted && <NewCurrencyRequest />}
          {stepsOfCreatePage?.CNR === 1 && mounted && (
            <CurrAllocReqInfoStep
              refreshReq={"refreshReq"}
              tableDocId={"tableDocId"}
              currencyAllocReqId={"currencyAllocReqId"}
              docsData={docsData}
              setDocsData={setDocsData}
              docs={docs}
              setDocs={setDocs}
              desFinancialCost={desFinancialCost}
              setDesFinancialCost={setDesFinancialCost}
              inputsData={inputsData}
              setInputsData={setInputsData}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          <Row className="container_next_back_Step">
            <Col className="container_next_back_end" xl={24}>
              {stepsOfCreatePage?.CNR === 0 ? (
                <>
                  <TooltipButton
                    onClick={ItemModalHandler}
                    iconClass={"fa-info-circle fs-24"}
                    backgroundColor={themeColors.comments.green}
                    tooltipText={"راهنمای سریع"}
                  />
                  <Button
                    id="cancelBtn"
                    backgroundColor={themeColors.btn.primary}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Link
                      to={{
                        pathname:
                          "/Users/AC/Currency/RequestCurrencyAllocation",
                        state: {
                          orderRegistrationNumber: inputsData?.prfOrderNoStr,
                        },
                      }}
                    >
                      <i className="fa fa-sign-out" /> انصراف
                    </Link>
                  </Button>
                  {!!!(state?.editCurrAlloc || state?.upgradeOrder) && (
                    <Button
                      id="upgradeBtn"
                      backgroundColor={themeColors.btn.primary}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          handleStepsOfCreatePage({
                            CNR: stepsOfCreatePage?.CNR + 1,
                          })
                        );
                      }}
                    >
                      بعدی
                      <i className="fa fa-step-backward" />
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <TooltipButton
                    onClick={ItemModalHandler}
                    iconClass={"fa-info-circle fs-24"}
                    backgroundColor={themeColors.comments.green}
                    tooltipText={"راهنمای سریع"}
                  />
                  <Button
                    id="cancelBtn"
                    backgroundColor={themeColors.btn.primary}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Link
                      to={{
                        pathname:
                          "/Users/AC/Currency/RequestCurrencyAllocation",
                        state: {
                          orderRegistrationNumber: inputsData?.prfOrderNoStr,
                        },
                      }}
                    >
                      <i className="fa fa-sign-out" /> انصراف
                    </Link>
                  </Button>
                  {!!!state?.editCurrAlloc && (
                    <Button
                      id="backBtn"
                      onClick={(e) => {
                        e.preventDefault();
                        setInputsData({});
                        setDocs([]);
                        dispatch(
                          handleStepsOfCreatePage({
                            CNR: stepsOfCreatePage?.CNR - 1,
                          })
                        );
                      }}
                    >
                      <i className="fa fa-step-forward" />
                      قبلی
                    </Button>
                  )}
                </>
              )}
              {stepsOfCreatePage?.CNR === 1 && (
                <Button
                  id="acceptBtn"
                  width="100px"
                  backgroundColor={themeColors.comments.green}
                  onClick={() =>
                    !!state?.editCurrAlloc
                      ? handleQuestionToAcceptEdit()
                      : permitCreateCurrencyAllocationReq()
                  }
                >
                  <i className="fa fa-check" />
                  ثبت
                </Button>
              )}
              {!!state?.upgradeOrder && (
                <Button
                  id="upgradeBtn"
                  width="140px"
                  backgroundColor={themeColors.btn.primary}
                  onClick={handleApiUpgradeRegedOrder}
                  loading={loading}
                >
                  <i className="fa fa-refresh" />
                  اعمال به روزرسانی
                </Button>
              )}
            </Col>
          </Row>
          <EmergingProblem />
        </div>
      </QuickGuide>
    </>
  );
};

export default CreateStepsCurrAllocReq;

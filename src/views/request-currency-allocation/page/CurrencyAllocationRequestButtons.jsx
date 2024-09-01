import { useHistory } from "react-router-dom";
import { Button } from "../../../components";
import themeColors from "../../../configs/theme";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import {
  handleLoading,
  handleMessageModal,
  handleQuestionModal,
} from "../../../state/action-creators";
import { useEffect, useState } from "react";
import TooltipButton from "../../../components/TooltipButton";

function CurrencyAllocationRequestButtons({
  data,
  carVCodeLng,
  enabled,
  setEnabled,
  id,
  id2,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [modalType, setModalType] = useState("");
  const { role, GUid, messageModal } = useSelector((state) => state);

  const ItemModalHandler = (event) => {
    event.preventDefault();
    setEnabled(!enabled);
  };
  //   useefect for all modals------------------------------------------
  // useEffect(() => {
  //   // و تمدید
  //   if (questionModal.name === "RenewalFeasibility") {
  //     if (questionModal.answer === "yes") {
  //     //   RenewalFeasibility();
  //     //   dispatch(
  //     //     handleQuestionModal({
  //     //       isModalOpen: false,
  //     //       title: "",
  //     //       describe: "",
  //     //       name: "",
  //     //     })
  //     //   );
  //     // } else if (questionModal.answer === "no") {
  //     //   dispatch(
  //     //     handleQuestionModal({
  //     //       isModalOpen: false,
  //     //       title: "",
  //     //       describe: "",
  //     //       name: "",
  //     //     })
  //     //   );
  //     // }
  //   }
  //   // انصراف از فرایند
  //   // if (questionModal.name === "DiscontinueFeasibility") {
  //   //   if (questionModal.answer === "yes") {
  //   //     DiscontinueFeasibility();
  //   //     dispatch(
  //   //       handleQuestionModal({
  //   //         isModalOpen: false,
  //   //         title: "",
  //   //         describe: "",
  //   //         name: "",
  //   //       })
  //   //     );
  //   //   } else if (questionModal.answer === "no") {
  //   //     dispatch(
  //   //       handleQuestionModal({
  //   //         isModalOpen: false,
  //   //         title: "",
  //   //         describe: "",
  //   //         name: "",
  //   //       })
  //   //     );
  //   //   }
  //   // }
  //   // تایید شروط
  //   // if (questionModal.name === "ConfirmConditionFeasibility") {
  //   //   if (questionModal.answer === "yes") {
  //   //     ConfirmConditionFeasibility();
  //   //     dispatch(
  //   //       handleQuestionModal({
  //   //         isModalOpen: false,
  //   //         title: "",
  //   //         describe: "",
  //   //         name: "",
  //   //       })
  //   //     );
  //   //   } else if (questionModal.answer === "no") {
  //   //     dispatch(
  //   //       handleQuestionModal({
  //   //         isModalOpen: false,
  //   //         title: "",
  //   //         describe: "",
  //   //         name: "",
  //   //       })
  //   //     );
  //   //   }
  //   // }
  //   // رد شروط
  //   // if (questionModal.name === "ignoreConditionFeasibility") {
  //   //   if (questionModal.answer === "yes") {
  //   //     ignoreConditionFeasibility();
  //   //     dispatch(
  //   //       handleQuestionModal({
  //   //         isModalOpen: false,
  //   //         title: "",
  //   //         describe: "",
  //   //         name: "",
  //   //       })
  //   //     );
  //   //   } else if (questionModal.answer === "no") {
  //   //     dispatch(
  //   //       handleQuestionModal({
  //   //         isModalOpen: false,
  //   //         title: "",
  //   //         describe: "",
  //   //         name: "",
  //   //       })
  //   //     );
  //   //   }
  //   // }
  //   // ابطال
  //   if (questionModal.name === "RevokeFeasibility") {
  //     // if (questionModal.answer === "yes") {
  //     //   RevokeFeasibility();
  //     //   dispatch(
  //     //     handleQuestionModal({
  //     //       isModalOpen: false,
  //     //       title: "",
  //     //       describe: "",
  //     //       name: "",
  //     //     })
  //     //   );
  //     // } else if (questionModal.answer === "no") {
  //     //   dispatch(
  //     //     handleQuestionModal({
  //     //       isModalOpen: false,
  //     //       title: "",
  //     //       describe: "",
  //     //       name: "",
  //     //     })
  //     //   );
  //     // }
  //   }
  //   // ارسال درخواست مجدد
  //   if (questionModal.name === "ResendFeasibility") {
  //     if (questionModal.answer === "yes") {
  //       ResendFeasibility();
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
  // }, [questionModal.answer]);
  //   تایید شروط-----------------------------------------------------------
  function ConfirmConditionFeasibility() {
    const postData = {
      carVCodeLng: data?.CurrencyAllocationRequest?.carVCodeLng,
      IsAcceptConditions: true,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .ConditionalApproveCurrencyAllocationRequest.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .ConditionalApproveCurrencyAllocationRequest.method,
      data: postData,
      // Important for binary data
    })
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          setModalType("NAVIGATE");
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              title: "موفقیت امیز",
              describe: res?.data?.ErrorDesc
                ? res?.data?.ErrorDesc
                : "موفقیت آمیز",
              type: "success",
            })
          );
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
  // ارسال درخواست مجدد ---------------------------------------------
  function ResendFeasibility() {
    const postData = {
      carVCodeLng: data?.CurrencyAllocationRequest?.carVCodeLng,

      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.ResendCurrencyAllocationRequest
        .url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.ResendCurrencyAllocationRequest
          .method,
      data: postData,
      // Important for binary data
    })
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          setModalType("NAVIGATE");
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              title: "موفقیت امیز",
              describe: res?.data?.ErrorDesc
                ? res?.data?.ErrorDesc
                : "موفقیت آمیز",

              type: "success",
            })
          );
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
  // تجزیه-------------------------------------------------------
  function DivideFeasibility() {
    history.push(
      `/Users/AC/Currency/CurrencyAllocationRequestDivide?${data?.CurrencyAllocationRequest?.carVCodeLng}`
    );
  }
  // تمدید-------------------------------------------------------------------------------
  function RenewalFeasibility() {
    const postData = {
      carVCodeLng: data?.CurrencyAllocationRequest?.carVCodeLng,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .RenewalCurrencyAllocationRequest.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.RenewalCurrencyAllocationRequest
          .method,
      data: postData,
      // Important for binary data
    })
      .then((res) => {
        if (res?.data?.ErrorCode === 0) {
          dispatch(handleLoading(false));

          dispatch(
            handleMessageModal({
              isModalOpen: true,
              title: "موفقیت امیز",
              describe: res?.data?.ErrorDesc
                ? res?.data?.ErrorDesc
                : "موفقیت آمیز",
              type: "success",
            })
          );

          setModalType("NAVIGATE");
        } else {
          dispatch(handleLoading(false));

          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
  // انصراف از فرایند----------------------------------------------------------
  function DiscontinueFeasibility() {
    const postData = {
      carVCodeLng: data?.CurrencyAllocationRequest?.carVCodeLng,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .DiscontinueCurrencyAllocationRequest.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .DiscontinueCurrencyAllocationRequest.method,
      data: postData,
      // Important for binary data
    })
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          setModalType("NAVIGATE");
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              title: "موفقیت امیز",
              describe: res?.data?.ErrorDesc
                ? res?.data?.ErrorDesc
                : "موفقیت آمیز",

              type: "success",
            })
          );
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
  useEffect(() => {
    if (messageModal?.isModalOpen == false && modalType === "NAVIGATE") {
      history.push({
        pathname: "/Users/AC/Currency/RequestCurrencyAllocation",
        state: {
          orderRegistrationNumber:
            data?.CurrencyAllocationRequest?.prfOrderNoStr,
        },
      });
    }
  }, [messageModal?.isModalOpen]);
  // ابطال---------------------------------------------------------------------------
  function RevokeFeasibility() {
    const postData = {
      carVCodeLng: data?.CurrencyAllocationRequest?.carVCodeLng,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.RevokeCurrencyAllocationRequest
        .url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.RevokeCurrencyAllocationRequest
          .method,
      data: postData,
      // Important for binary data
    })
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          setModalType("NAVIGATE");
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              title: "موفقیت امیز",
              describe: res?.data?.ErrorDesc
                ? res?.data?.ErrorDesc
                : "موفقیت آمیز",

              type: "success",
            })
          );
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
  // رد شروط---------------------------------------------------------------------------------
  function ignoreConditionFeasibility() {
    const postData = {
      carVCodeLng: data?.CurrencyAllocationRequest?.carVCodeLng,
      IsAcceptConditions: false,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .ConditionalApproveCurrencyAllocationRequest.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .ConditionalApproveCurrencyAllocationRequest.method,
      data: postData,
      // Important for binary data
    })
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          setModalType("NAVIGATE");
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              title: "موفقیت امیز",
              describe: res?.data?.ErrorDesc
                ? res?.data?.ErrorDesc
                : "موفقیت آمیز",
              type: "success",
            })
          );
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }

  // ویرایش
  const handleEditCurrAllocReq = () => {
    history.push({
      pathname: `/Users/AC/Currency/NewCurrencyRequestDetails`,
      search: `?key=${btoa(data?.CurrencyAllocationRequest?.carVCodeLng)}`,
      state: { editCurrAlloc: data?.CurrencyAllocationRequest?.carVCodeLng },
    });
  };

  // return----------------------------------------------------------------------------------
  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }} id={id}>
          {/* ویرایش  */}
          {data.EditFeasibility ? (
            <Button
              onClick={
                handleEditCurrAllocReq
                // data?.CurrencyAllocationRequest?.carVCodeLng
              }
            >
              <i class="fa fa-edit" />
              ویرایش
            </Button>
          ) : (
            ""
          )}
          {/*    ارسال درخواست مجدد*/}
          {data.ResendFeasibility ? (
            <Button
              backgroundColor={themeColors.btn.purple}
              onClick={() => {
                dispatch(
                  handleQuestionModal({
                    isModalOpen: true,
                    title: "هشدار",
                    describe:
                      "با ارسال مجدد درخواست، یک فرایند ویرایش برای درخواست آغاز شده و درخواست مجددا برای بانک ارسال می گردد.",
                    name: `ResendFeasibility`,
                    onYes: ResendFeasibility,
                  })
                );
              }}
            >
              <i class="fa  fa-paper-plane-o" />
              ارسال درخواست مجدد
            </Button>
          ) : (
            ""
          )}
          {/*  تجزیه*/}
          {data.DivideFeasibility ? (
            <Button onClick={DivideFeasibility}>
              <i class="fa fa-cubes" />
              تجزیه{" "}
            </Button>
          ) : (
            ""
          )}
          {/* تمدید */}
          {data.RenewalFeasibility ? (
            <Button
              onClick={() => {
                dispatch(
                  handleQuestionModal({
                    isModalOpen: true,
                    title: "هشدار",
                    describe:
                      "با انتخاب گزینه تمدید یک فرایند ویرایش برای درخواست آغاز شده و برای بانک ارسال می گردد.",
                    name: `RenewalFeasibility`,
                    onYes: RenewalFeasibility,
                  })
                );
              }}
              // backgroundColor={themeColors.btn.darkGreen}
            >
              <i class="fa fa-refresh" />
              تمدید{" "}
            </Button>
          ) : (
            ""
          )}
          {/*  انصراف از فرایند*/}
          {data.DiscontinueFeasibility ? (
            <Button
              onClick={() => {
                dispatch(
                  handleQuestionModal({
                    isModalOpen: true,
                    title: "هشدار",
                    describe: "آیا از انصراف درخواست مطمئن هستید؟",
                    name: `DiscontinueFeasibility`,
                    onYes: DiscontinueFeasibility,
                  })
                );
              }}
              backgroundColor={themeColors.btn.danger}
            >
              {data?.DiscontinueTitle}
            </Button>
          ) : (
            ""
          )}
          {/* ابطال */}
          {data.RevokeFeasibility ? (
            <Button
              onClick={() => {
                dispatch(
                  handleQuestionModal({
                    isModalOpen: true,
                    title: "هشدار",
                    describe: "آیا از ابطال درخواست مطمئن هستید؟",
                    name: `RevokeFeasibility`,
                    onYes: RevokeFeasibility,
                  })
                );
              }}
              backgroundColor={themeColors.btn.danger}
            >
              <i class="fa fa-times-circle" /> ابطال{" "}
            </Button>
          ) : (
            ""
          )}
          {/*    تایید شروط{ */}
          {data.ConfirmConditionFeasibility ? (
            <Button
              backgroundColor={themeColors.btn.darkGreen}
              onClick={() => {
                dispatch(
                  handleQuestionModal({
                    isModalOpen: true,
                    title: "هشدار",
                    describe: "آیا از تائید شروط مطمئن هستید؟",
                    name: `ConfirmConditionFeasibility`,
                    onYes: ConfirmConditionFeasibility,
                  })
                );
              }}
            >
              <i class="fa fa-check-square" />
              تایید شروط{" "}
            </Button>
          ) : (
            ""
          )}
          {/*  رد شروط  */}
          {data.ConfirmConditionFeasibility ? (
            <Button
              backgroundColor={themeColors.btn.danger}
              onClick={() => {
                dispatch(
                  handleQuestionModal({
                    isModalOpen: true,
                    title: "هشدار",
                    describe: "آیا از رد شروط مطمئن هستید؟",
                    name: `ignoreConditionFeasibility`,
                    onYes: ignoreConditionFeasibility,
                  })
                );
              }}
            >
              <i class="fa fa-times-circle" /> رد شروط{" "}
            </Button>
          ) : (
            ""
          )}
        </div>
        <div style={{ display: "flex", gap: "5px" }}>
          <TooltipButton
            onClick={ItemModalHandler}
            iconClass={"fa-info"}
            backgroundColor={themeColors.comments.green}
            tooltipText={"راهنمای سریع"}
          />
          <Button
            onClick={() =>
              history.push({
                pathname: "/Users/AC/Currency/RequestCurrencyAllocation",
                state: {
                  orderRegistrationNumber:
                    data?.CurrencyAllocationRequest?.prfOrderNoStr,
                },
              })
            }
            name="eight"
          >
            <i class="fa fa-arrow-right" />
            <p>بازگشت</p>
          </Button>
          {/* <Modal title="توجه" open={true} footer={<div><Button>بستن</Button><Button>تایید</Button></div>}>
           <div className="modalMain"> با انتخاب گزینه تمدید یک فرایند ویرایش برای درخواست آغاز شده و برای
            بانک ارسال می گردد.</div>
          </Modal> */}
        </div>
      </div>
    </div>
  );
}
export default CurrencyAllocationRequestButtons;

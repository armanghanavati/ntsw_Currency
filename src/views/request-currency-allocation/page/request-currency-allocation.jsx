import React, { useState } from "react";
import themeColors from "../../../configs/theme";
import { useSelector } from "react-redux";

import Validation from "../../../utils/Validation";
import { useHistory, useLocation } from "react-router-dom";
import EmergingProblem from "../../currency-trading/emerging-problem/emerging-problem";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  handleBreadCrumbData,
  handleLoading,
  handleMessageModal,
  handleOneTimeShowMod,
} from "../../../state/action-creators";
import { endpoints } from "../../../services/endpoints";
import { useEffect } from "react";
import moment from "jalali-moment";
import MainCurerncyAllotion from "./mainCurrencyAllotion";
import { Button, Modal } from "../../../components";
import StringHelpers from "../../../configs/helpers/string-helpers";

const RequestCurrencyAllocation = () => {
  const { theme, colorMode } = useSelector((state) => state);
  const [hasMounted, setHasMounted] = useState(false);
  const [openModal, setOpenModal] = useState(true);
  const [dataSource, setDataSource] = useState(undefined);
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [allocOfCurr, setAllocOfCurr] = useState({});
  const [totalCount, setTotalCount] = useState(null);
  const [option, setOption] = useState([]);
  const [optionStatus, setOptionStatus] = useState([]);
  const [optionActiveStatus, setOptionActiveStatus] = useState([]);
  const [allCurrencyReq, setAllCurrencyReq] = useState([]);
  const dispatch = useDispatch();
  const { role, GUid, oneTimeShowMod } = useSelector((state) => state);
  const [attention, setAttention] = useState([]);
  const history = useHistory();
  const { state } = useLocation();

  useEffect(() => {
    if (hasMounted) {
      fetchData();
    }
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  useEffect(() => {
    if (hasMounted) {
      if (tableParams.pagination.current === 1) {
        fetchData();
      } else {
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            current: 1,
          },
        });
      }
    }
  }, [inputsData?.orderRegistrationNumber]);

  useEffect(() => {
    setHasMounted(true);
    if (!!state?.orderRegistrationNumber) {
      setInputsData(state);
    } else {
      fetchData();
    }
  }, []);

  let postDataAllocReq = {
    prfVCodeInt: allCurrencyReq?.filter(
      (item) => inputsData?.orderRegistrationNumber == item?.name
    )?.[0]?.value,
    urlVCodeInt: role,
    ssdsshGUID: GUid,
  };

  const handleGetRegedOrderInfo = async (id) => {
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.getRegedOrderInfo.url,
      method: endpoints.RestAPIs.CurrencyAllocation.getRegedOrderInfo.method,
      data: postDataAllocReq,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          setAllocOfCurr(res?.data);
          if (id === 1) {
            dispatch(handleBreadCrumbData("بروزرسانی ثبت سفارش"));
          } else {
            dispatch(handleBreadCrumbData("ایجاد درخواست تخصیص ارز"));
          }
          history.push({
            pathname: `/Users/AC/Currency/NewCurrencyRequestDetails`,
            search: `?key=${btoa(inputsData?.orderRegistrationNumber)}`,
            state: {
              dataOfOrder: res?.data,
              upgradeOrder: id === 1 ? true : false,
            },
          });
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
  // exce
  // new create  allostion----------------------------------

  const handleOprationNewCurAllReqBtn = (e) => {
    e.preventDefault();
    if (!!inputsData?.orderRegistrationNumber) {
      handleCreateNewCurAllReq(e);
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "لطفا یک شماره ثبت سفارش انتخاب نمائید.",
          type: "warning",
        })
      );
    }
  };

  const handleCreateNewCurAllReq = (e) => {
    e.preventDefault();
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .createFeasibilityCurrencyAllocationRequest.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .createFeasibilityCurrencyAllocationRequest.method,
      data: postDataAllocReq,
    })
      .then((res) => {
        const fixDesc = StringHelpers.fixErrorDesc(res?.data?.ErrorDesc);

        if (res?.data?.ErrorCode === 0) {
          handleGetRegedOrderInfo();
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: fixDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  const handleUpdateAccOrder = (e) => {
    e.preventDefault();

    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.upgradeFeasibilityRegedOrder
        .url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.upgradeFeasibilityRegedOrder
          .method,
      data: postDataAllocReq,
    })
      .then((res) => {
        const fixDesc = StringHelpers.fixErrorDescTest(res?.data?.ErrorDesc);
        console.log(fixDesc);
        if (res?.data?.ErrorCode === 0) {
          handleGetRegedOrderInfo(1);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: fixDesc,
            })
          );
        }
        // call service
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  // function to fetch data
  function fetchData(handleDownloadExcel, prfOrderNoStr) {
    const formatDateString = (date) => {
      return date ? `${date.year}/${date.month}/${date.day}` : null;
    };

    function convertSolarToGregorian(solarDate) {
      // Parse the Solar (Persian) date using jalali-moment
      const gregorianDate = moment(solarDate, "jYYYY/jMM/jDD").format();
      // Set the time component to "00:00:00"
      return gregorianDate.split("T")[0] + "T00:00:00.000Z";
    }
    const postData = {
      startIndex: Number(
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
        1
      ),
      pageSize: handleDownloadExcel ? 10000 : tableParams.pagination.pageSize,
      OrderNumber: prfOrderNoStr ?? inputsData?.orderRegistrationNumber,
      ApprovedDateFrom: inputsData?.approvalDate
        ? convertSolarToGregorian(formatDateString(inputsData?.approvalDate))
        : null,
      ApprovedDateTo: inputsData?.confirmationDateTo
        ? convertSolarToGregorian(
          formatDateString(inputsData?.confirmationDateTo)
        )
        : null,
      CreateDateFrom: inputsData?.dateApplicationFrom
        ? convertSolarToGregorian(
          formatDateString(inputsData?.dateApplicationFrom)
        )
        : null,
      CreateDateTo: inputsData?.dateApplicationUntil
        ? convertSolarToGregorian(
          formatDateString(inputsData?.dateApplicationUntil)
        )
        : null,
      IssueDateFrom: inputsData?.dateAllotmentFrom
        ? convertSolarToGregorian(
          formatDateString(inputsData?.dateAllotmentFrom)
        )
        : null,
      IssueDateTo: inputsData?.dateAllotmentTo
        ? convertSolarToGregorian(formatDateString(inputsData?.dateAllotmentTo))
        : null,
      Statuses: inputsData?.applicationStatus,
      ActiveStatuses: inputsData?.webSite,

      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.GetCurrencyAllocationRequests
        .url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.GetCurrencyAllocationRequests
          .method,
      data: postData,
    })
      .then((res) => {
        // Set data
        setDataSource(res?.data?.CurrencyAllocationRequestList);
        setTotalCount(res.data.Count);
        if (!!handleDownloadExcel) {
          const bodyData = res?.data?.CurrencyAllocationRequestList?.map(
            (item, index) => {
              return [
                index + 1,
                item.prfOrderNoStr,
                item.carRowNoInt,
                item.carStatusStr,
                item.carActiveStatusStr,
                item.carAmountMny,
                item.curNameStr,
                item.carCreateDateShamsi,
                item.carIssueDateShamsi,
                item.ccsNameStr,
                item.ccrNameStr,
                item.crtNameStr,
                item.bchNameStr,
                item.carApprovedDateShamsi,
              ];
            }
          );

          const headerRow = [
            "ردیف",
            "کد ثبت سفارش",
            "ردیف درخواست",
            "وضعیت",
            "فرآیند فعلی",
            "مبلغ درخواست",
            "ارز درخواست",
            "تاریخ ایجاد درخواست",
            "تاریخ تخصیص",
            "محل تامین ارز",
            "نرخ ارز",
            "نوع درخواست",
            "شعبه",
            "تاریخ تایید",
          ];
          handleDownloadExcel(headerRow, bodyData, "currencyAllocationList");
        }
        if (res.data?.ErrorCode === 0) {
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
  }

  // useeffect for get attention------------------------------------------------
  useEffect(() => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .CurrencyAllocationRequestAllowedRegedOrderWarning.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .CurrencyAllocationRequestAllowedRegedOrderWarning.method,
      data: postData,
    })
      .then((res) => {
        const fixDesc = StringHelpers.fixErrorDesc(res?.data?.ErrorDesc);

        setAttention(fixDesc);
        setLoading(false);
        if (res.data?.ErrorCode === 0) {
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
  }, []);

  // useeffect to get data for combobox---------------------------------------------
  useEffect(() => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.GetRegedOrderList.url,
      method: endpoints.RestAPIs.CurrencyAllocation.GetRegedOrderList.method,
      data: postData,
    })
      .then((res) => {
        // this is set data

        const convertedData = res.data.RegedOrderList.map((item) => ({
          name: item.prfOrderNoStr,
          value: item.prfOrderNoStr,
        }));
        setOption(convertedData);
        const armanData = res.data.RegedOrderList.map((item) => ({
          name: item.prfOrderNoStr,
          value: item.prfVcodeInt,
        }));
        setAllCurrencyReq(armanData);
        setLoading(false);
        if (res.data?.ErrorCode === 0) {
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
  }, []);

  // useefect for get active status---------------------
  useEffect(() => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .GetCurrencyAllocationRequestActiveStatus.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .GetCurrencyAllocationRequestActiveStatus.method,
      data: postData,
    })
      .then((res) => {
        // this is set data

        const convertedData = res.data.Result.map((item) => ({
          name: item.descriptionPersian,
          value: item.value,
        }));
        setOptionActiveStatus(convertedData);
        setLoading(false);
        if (res.data?.ErrorCode === 0) {
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
  }, []);
  // status combobox----------------------------------
  useEffect(() => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .GetCurrencyAllocationRequestStatus.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.GetCurrencyAllocationRequestStatus
          .method,
      data: postData,
    })
      .then((res) => {
        const convertedData = res.data.Result.map((item) => ({
          name: item.descriptionPersian,
          value: item.value,
        }));
        setOptionStatus(convertedData);
        setLoading(false);
        if (res.data?.ErrorCode === 0) {
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
  }, []);
  // change input
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
    if (name === "prfOrderNoStr") {
      history.location.state = {};
    }
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  return (
    <>
      {!oneTimeShowMod && <Modal
        open={openModal}
        footer={
          <Button
            onClick={() => {
              dispatch(handleOneTimeShowMod(true))
              setOpenModal(false);
            }}
            backgroundColor={themeColors.btn.darkGreen}
          >
            بستن
          </Button>
        }
        width="350px"
        title="پیام سامانه"
        closeIcon={null}
        className="custom-modal"
      >
        <div className="modalMain">{attention}</div>
      </Modal>}
      <MainCurerncyAllotion
        handleUpdateAccOrder={handleUpdateAccOrder}
        openModal={openModal}
        setOpenModal={setOpenModal}
        attention={attention}
        inputsData={inputsData}
        handleChangeInputs={handleChangeInputs}
        option={option}
        errors={errors}
        handleOprationNewCurAllReqBtn={handleOprationNewCurAllReqBtn}
        fetchData={fetchData}
        tableParams={tableParams}
        setTableParams={setTableParams}
        dataSource={dataSource}
        loading={loading}
        totalCount={totalCount}
        setTotalCount={setTotalCount}
        optionStatus={optionStatus}
        setOptionStatus={setOptionStatus}
        optionActiveStatus={optionActiveStatus}
        setOptionActiveStatus={setOptionActiveStatus}
      />
      <EmergingProblem />
    </>
  );
};

export default RequestCurrencyAllocation;

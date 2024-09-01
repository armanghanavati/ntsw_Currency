import React, { useState, useEffect } from "react";
import { Col, Row, Table } from "antd";
import {
  Input,
  ComboBox,
  Button,
  DatePicker,
  Modal,
} from "../../../../components";
import Validation from "../../../../utils/Validation";
import themeColors from "../../../../configs/theme";
import { useSelector, useDispatch } from "react-redux";
import EmergingProblem from "../../emerging-problem/emerging-problem";
import TradingList from "../trading-list";
import axios from "axios";
import { endpoints } from "../../../../services/endpoints";
import convertJalaliDateToGregorian from "../../../../configs/helpers/convert-jalali-date-to-gregorian";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import HelperButtons from "./helper-buttons";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { ExcelExportButton } from "../../../../common";

const ExternalTradeCEBuyManage = () => {
  const { theme, colorMode, GUid, role } = useSelector((state) => state);
  const [inputsData, setInputsData] = useState({});
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingcreateSarrafi, setLoadingCreateSarrafi] = useState(false);
  const [inqueryList, setInqueryList] = useState([]);
  const [listOfRequest, setListOfRequest] = useState([]);
  const [sarrafiRequestList, setSarrafiRequestList] = useState([]);

  const [dataSource, setDataSource] = useState(undefined);
  const [openModal, setOpenModal] = useState(true);

  let history = useHistory();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const getBankiOrderNoList = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfVCodeInt: 0,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getBankiOrderNoList.url,
      method: endpoints.RestAPIs.buyCurrency.getBankiOrderNoList.method,
      data: postData,
    })
      .then((res) => {
        setInqueryList(res?.data?.OrderList);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  const manageDetermineSarrafiRequest = () => {
    const postData = {
      UrlVCodeInt: role,
      SsdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.manageDetermineSarrafiRequest.url,
      method:
        endpoints.RestAPIs.buyCurrency.manageDetermineSarrafiRequest.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          setInputsData({
            ...inputsData,
            modalNotifications: Object.entries(res?.data),
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

  const getListOfRequest_Excel = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfVCodeInt: 0,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getListOfRequest_Excel.url,
      method: endpoints.RestAPIs.buyCurrency.getListOfRequest_Excel.method,
      data: postData,
    })
      .then((res) => {
        setListOfRequest([res?.data?.sarrafiRequestList]);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  const getSarrafiRequestStatus = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSarrafiRequestStatus.url,
      method: endpoints.RestAPIs.buyCurrency.getSarrafiRequestStatus.method,
      data: postData,
    })
      .then((res) => {
        setSarrafiRequestList(res?.data?.sarrafiRequestList);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    getBankiOrderNoList();
    manageDetermineSarrafiRequest();
    getListOfRequest_Excel();
    getSarrafiRequestStatus();
  }, []);

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

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const handleChangePageSize = (event) => {
    event.preventDefault();
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        pageSize: Number(event.target.value) || 0,
        current: 1,
      },
    });
  };

  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (item, record, index) => (
        <>
          {index +
            1 +
            (Number(tableParams?.pagination?.current || 1) - 1) *
              Number(tableParams.pagination.pageSize || 1)}
        </>
      ),
    },
    {
      title: "کد درخواست",
      dataIndex: "sfrVCodeInt",
      align: "center",
    },
    {
      title: "ثبت سفارش های مرتبط",
      dataIndex: "orderNos",
      align: "center",
    },
    {
      title: "مبلغ",
      dataIndex: "sfrTotalAmountMny",
      align: "center",
    },
    {
      title: "نوع ارز",
      dataIndex: "sfrcurNameStr",
      align: "center",
    },
    {
      title: "بانک و شعبه",
      dataIndex: "sffBankShobeNameStr",
      align: "center",
    },
    {
      title: "وضعیت",
      dataIndex: "sfrStatusStr",
      align: "center",
    },
    {
      title: "تاریخ اعتبار درخواست",
      dataIndex: "sfrRequestValidationDateStr",
      align: "center",
    },
    {
      title: "جزئیات",
      dataIndex: "detaile",
      align: "center",
      render: (_, { sfrVCodeInt }, index) => (
        <div className="flex-order-row">
          <Link
            to={`/Users/AC/Currency/ExternalTradeCEBuyReqDetails?detaile=${sfrVCodeInt}`}
          >
            <Button type="secondary">
              جزئیات
              <i className="fa fa-search" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const getTable = () => {
    const postData = {
      urlVCodeInt: role,
      startIndex: tableParams?.pagination?.current,
      pageSize: tableParams?.pagination?.pageSize,
      status: inputsData?.status || null,
      searchText: inputsData?.searchText || null,
      validationDate:
        convertJalaliDateToGregorian(inputsData?.validationDate) || null,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    setLoading(true);
    axios({
      url: endpoints.RestAPIs.buyCurrency.getSarrafiRequestListOfUser.url,
      method: endpoints.RestAPIs.buyCurrency.getSarrafiRequestListOfUser.method,
      data: postData,
    })
      .then((res) => {
        setDataSource(res.data?.sarrafiRequestList || []);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.data?.countOfSarrafiRequest || 0,
          },
        });
        dispatch(handleLoading(false));
        setLoading(false);
      })
      .catch((err) => {
        dispatch(handleLoading(false));
        setLoading(false);
      });
  };

  useEffect(() => {
    getTable();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  const canCreateSarrafiRequest = () => {
    const postData = {
      UrlVCodeInt: role,
      SsdsshGUID: GUid,
      orderNo: inputsData?.orderNos,
    };
    dispatch(handleLoading(true));
    setLoadingCreateSarrafi(true);
    axios({
      url: endpoints.RestAPIs.buyCurrency.canCreateSarrafiRequest.url,
      method: endpoints.RestAPIs.buyCurrency.canCreateSarrafiRequest.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.Result?.Error === 0) {
          history.push(
            `/Users/AC/Currency/ExternalTradeCEBuyNewReq?request=${inputsData?.orderNos}`
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
        setLoadingCreateSarrafi(false);
      })
      .catch((err) => {
        dispatch(handleLoading(false));
        setLoadingCreateSarrafi(false);
      });
  };

  const checkedValidation = (event) => {
    event?.preventDefault();
    if (permitForNextStep(["orderNos"]) === true) {
      canCreateSarrafiRequest();
    }
    return;
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

  const getPreCotageAllDetails = (handleGenerateExcel, item) => {
    const bodyData = item?.map((item, index) => {
      return [
        index + 1,
        item?.sfrTotalAmountMny,
        item?.sfrcurNameStr,
        item?.sfcNameStr,
        item?.sfrInsertDate,
        item?.sfcNameStr,
        item?.sofCBIIDLng,
        item?.sfrVCodeInt,
      ];
    });
    const headerRow = [
      "ردیف",
      "مبلغ ارزی",
      "نوع ارز",
      "نام صرافی",
      "تاریخ ایجاد درخواست",
      "وضعیت درخواست",
      "کد پیشنهاد",
      "کد درخواست",
    ];
    handleGenerateExcel(headerRow, bodyData, "NTSW_ExportCurrencyReques");
  };

  const getPreCotageAllDetails2 = (handleGenerateExcel, item) => {
    const bodyData = item?.[0]?.map((item, index) => {
      return [
        index + 1,
        item?.sfrRequestValidationDateStr,
        item?.sffBankShobeNameStr,
        item?.sfrcurNameStr,
        item?.sfrTotalAmountMny,
        item?.orderNos,
        item?.sfrVCodeInt,
      ];
    });
    const headerRow = [
      "ردیف",
      "تاریخ اعتبار درخواست",
      "بانک و شعبه",
      "نوع ارز",
      "مبلغ",
      "ثبت سفارش های مرتبط",
      "کد درخواست",
    ];
    handleGenerateExcel(headerRow, bodyData, "NTSW_ExportCurrencyReques");
  };

  return (
    <>
      <Modal
        open={openModal}
        // className="questionModalDetails"
        className="questionModal"
        footer={
          <Button
            onClick={() => {
              setOpenModal(false);
            }}
            backgroundColor={themeColors.btn.darkGreen}
          >
            تایید
          </Button>
        }
        width="350px"
        title="📣📣📣  اطلاعیه"
        closeIcon={null}
        // className="custom-modal"
      >
        <div className="modalMain">
          <p>
            لطفا در اسرع وقت نسبت به تعیین تکلیف درخواست های ذیل اقدام نمائید:
          </p>
          {inputsData?.modalNotifications?.map((item) => {
            let years = item[0].split("t")[1];
            if (item[0].includes("list") && !!item[1])
              return (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ExcelExportButton
                    getData={getPreCotageAllDetails}
                    itemForDownload={item[1]}
                    title={` ${years} لیست معاملات سال`}
                    backgroundColor={themeColors.btn.secondary}
                  />
                </div>
              );
          })}
        </div>
      </Modal>
      <Row>
        <Col sm={24} md={12} xl={4}>
          <Button loading={loadingcreateSarrafi} onClick={checkedValidation}>
            ایجاد درخواست جدید
          </Button>
        </Col>
        <Col className="spaceCombo" sm={24} md={12} xl={4}>
          <ComboBox
            title="شماره ثبت سفارش"
            defaultValue={inputsData?.orderNos}
            name="orderNos"
            onChange={handleChangeInputs}
            options={inqueryList}
            optionTitle="prfOrderNoStr"
            optionValue="prfOrderNoStr"
            validations={[["required"]]}
            error={errors?.orderNos}
          />
        </Col>
        <Col className="space" sm={24} md={12} xl={4}>
          <DatePicker
            title="تاریخ"
            name="validationDate"
            onChange={handleChangeInputs}
            value={inputsData?.validationDate}
            validations={[["required"]]}
          />
        </Col>
        <Col className="space" sm={24} md={12} xl={4}>
          <ComboBox
            title="وضعیت"
            defaultValue={inputsData?.status}
            name="status"
            onChange={handleChangeInputs}
            options={sarrafiRequestList}
            optionTitle="sfrStatusStr"
            optionValue="sfrStatusCode"
            validations={[["required"]]}
            error={errors?.status}
          />
        </Col>
        <Col style={{ display: "flex" }} sm={24} md={12} xl={4}>
          <Input
            value={inputsData?.searchText}
            name="searchText"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            error={errors?.searchText}
            type="text"
            space="5px"
            title="متن جستجو"
          />
        </Col>
        <Col sm={24} md={12} xl={2}>
          <div className="marginBtn">
            <Button onClick={() => getTable()}>
              <i className="fa fa-search" />
              جستجو
            </Button>
          </div>
        </Col>
      </Row>
      <HelperButtons inputsData={inputsData} setInputsData={setInputsData} />
      <span className="page-size-combo">
        <label className="page-size-combo--label" htmlFor="page-size">
          نمایش محتویات
        </label>
        <select
          className="page-size-combo--selector"
          id="page-size"
          value={tableParams.pagination.pageSize}
          onChange={handleChangePageSize}
        >
          <option
            value="10"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            10
          </option>
          <option
            value="25"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            25
          </option>
          <option
            value="50"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            50
          </option>
          <option
            value="100"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            100
          </option>
        </select>
      </span>
      <TradingList title={"لیست خرید ارز"} hideBtn={true}>
        <ExcelExportButton
          getData={getPreCotageAllDetails2}
          itemForDownload={listOfRequest}
          backgroundColor={themeColors.btn.secondary}
          icon="fa fa-download"
        />
      </TradingList>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
      />
      <EmergingProblem />
    </>
  );
};

export default ExternalTradeCEBuyManage;

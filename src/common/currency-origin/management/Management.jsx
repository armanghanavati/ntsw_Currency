import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { Col, Row } from "antd";
import {
  DatePicker,
  ComboBox,
  Button,
  Table,
  VerticalSpace,
} from "../../../components";
import { handleMessageModal } from "../../../state/action-creators";
import Validation from "../../../utils/Validation";
import { ExcelExportButton } from "../../../common";
import currencyOperationTypes from "../../../enums/currency-operation-types";
import preCotageStatus from "../../../enums/pre-cotage-status";
import StringHelpers from "../../../configs/helpers/string-helpers";
import ShowTrackingCode from "../details/operation-buttons/ShowTrackingCode";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const Management = ({
  children,
  filters,
  setFilters,
  currencyOperationType,
}) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const history = useHistory();
  const { role, GUid } = useSelector((state) => state);

  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [errors, setErrors] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (_, {}, index) => (
        <>
          {index +
            1 +
            (Number(tableParams?.pagination?.current || 1) - 1) *
              Number(tableParams.pagination.pageSize || 1)}
        </>
      ),
    },

    {
      title: `شماره ثبت ${
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? "آماری"
          : "سفارش"
      }`,
      dataIndex: "prfOrderNoStr",
      align: "center",
    },
    {
      title: "کد یکتای منشا ارز",
      dataIndex: "pcoVCodeInt",
      align: "center",
    },
    {
      title: "تاریخ منشا ارز",
      dataIndex: "pcoDate",
      align: "center",
    },
    {
      title: "شماره SATA",
      dataIndex: "pcoSATAID",
      align: "center",
    },
    {
      title: "مبلغ منشا ارز",
      align: "center",
      render: (_, { Mablaghkol, pcoTotalAmount }) => (
        <>
          {StringHelpers.formatNumber(
            currencyOperationType ===
              currencyOperationTypes.StatisticalRegistration
              ? pcoTotalAmount
              : Mablaghkol
          )}
        </>
      ),
    },
    {
      title: "وضعیت",
      dataIndex: "pcoStatusStr",
      align: "center",
    },
    ...(currencyOperationType === currencyOperationTypes.StatisticalRegistration
      ? []
      : [
          {
            title: "تاریخ ترخیص",
            dataIndex: "pcoClearanceDate",
            align: "center",
          },
        ]),
    {
      title: "جزئیات منشا ارز",
      align: "center",
      render: (_, { pcoVCodeInt }) => {
        const redirectToDetailsPage = () => {
          history.push({
            pathname: `/Users/AC/Currency/${
              currencyOperationType === currencyOperationTypes.Bank
                ? "OriginOfBankCurrencyDetails"
                : currencyOperationType === currencyOperationTypes.NonBank
                ? "OriginOfNonBankCurrencyDetails"
                : currencyOperationType ===
                  currencyOperationTypes.StatisticalRegistration
                ? "CurrencyOriginOfStatisticalRegistrationDetails"
                : "CurrencyOriginWithoutCurrencyTransferDetails"
            }`,
            search: `?key=${btoa(pcoVCodeInt)}`,
            state: {
              filters: { pcoStatusTny: filters?.pcoStatusTny },
            },
          });
        };

        return (
          <div className="flex-order-row">
            <Button onClick={redirectToDetailsPage} type="secondary">
              جزئیات
              <i className="fa fa-info"></i>
            </Button>
          </div>
        );
      },
    },
    {
      title: "جزئیات شناسه رهگیری",
      align: "center",
      render: (
        _,
        {
          pcoVCodeInt,
          trackingIDButtonName,
          isIncludeTraceCode,
          prfVCodeInt,
          prfVcodeInt,
        }
      ) => (
        <div className="flex-order-row">
          {isIncludeTraceCode && (
            // <Button
            //   onClick={(event) => {
            //     window.open(
            //       `${endpoints.BaseUrlAddress}/Users/TrackingInterceptionCode.aspx`
            //     );
            //   }}
            //   type="secondary"
            //   width={"135px"}
            //   backgroundColor={themeColors.btn.secondary}
            // >
            //   <i class="fa fa-barcode" aria-hidden="true"></i>
            //   {trackingIDButtonName}
            // </Button>
            <ShowTrackingCode
              type="secondary"
              pcoVcodeInt={pcoVCodeInt}
              requestCode={prfVCodeInt || prfVcodeInt}
              callBackUrl={currencyOperationType}
              title={trackingIDButtonName}
              width={"135px"}
            />
          )}
        </div>
      ),
    },
  ];

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

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const permitForSearchButton = () => {
    for (var key in errors) {
      if (errors[key]?.length > 0) {
        return false;
      }
    }
    return true;
  };

  const handleSearch = (event) => {
    event?.preventDefault();
    if (permitForSearchButton() === true) {
      if (tableParams.pagination.current === 1) {
        getTable();
      } else {
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            current: 1,
          },
        });
      }
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "لطفا مقادیر مجاز وارد نمایید.",
        })
      );
    }
  };

  const getTable = (handleDownloadExcel, pcoStatusTny) => {
    setLoading(true);
    const postData = {
      startIndex:
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? undefined
          : !!handleDownloadExcel
          ? 0
          : (tableParams.pagination.current - 1) *
            tableParams.pagination.pageSize,
      pageSize:
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? undefined
          : !!handleDownloadExcel
          ? 1000
          : tableParams.pagination.pageSize,
      PagingStartIndex:
        currencyOperationType !== currencyOperationTypes.StatisticalRegistration
          ? undefined
          : !!handleDownloadExcel
          ? 0
          : (tableParams.pagination.current - 1) *
            tableParams.pagination.pageSize,
      PageSize:
        currencyOperationType !== currencyOperationTypes.StatisticalRegistration
          ? undefined
          : !!handleDownloadExcel
          ? 1000
          : tableParams.pagination.pageSize,
      prfVCodeInt: filters?.prfVCodeInt || -1,
      prfIsBankOPTny:
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? undefined
          : currencyOperationType,
      pcoStatusTny: pcoStatusTny || filters?.pcoStatusTny,
      beginDate:
        filters?.beginDate &&
        `${filters?.beginDate?.year}/${filters?.beginDate?.month}/${filters?.beginDate?.day}`,
      endDate:
        filters?.endDate &&
        `${filters?.endDate?.year}/${filters?.endDate?.month}/${filters?.endDate?.day}`,
      prfOrderNoStr:
        currencyOperationType ===
          currencyOperationTypes.StatisticalRegistration &&
        filters?.prfOrderNoStr
          ? filters?.prfOrderNoStr
          : "",
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url:
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.preCotageSG.getPreCotageList.url
          : endpoints.RestAPIs.preCotage.getAllPreCotageList.url,
      method:
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.preCotageSG.getPreCotageList.method
          : endpoints.RestAPIs.preCotage.getAllPreCotageList.method,
      data: postData,
    })
      .then((res) => {
        const data = res?.data?.preCotage || res?.data?.precotageList || [];
        setDataSource(data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res?.data?.totalCount || res?.data?.TotalCount || 0,
          },
        });
        if (!!handleDownloadExcel) {
          if (data?.length > 0) {
            const bodyData = data?.map((item, index) => {
              return [
                index + 1,
                item.pcoVCodeInt,
                item?.prfVCodeInt || item?.prfVcodeInt,
                item.prfOrderNoStr,
                item.pcoDate,
                item.pcoSATAID,
                item.pcoStatusStr,
                // item.pcoTotalAmount,
                currencyOperationType ===
                currencyOperationTypes.StatisticalRegistration
                  ? item?.pcoTotalAmount
                  : item?.ComboBoxMablaghkol || item?.pcoTotalAmount,
                item.pcogoodspricemny,
                currencyOperationType ===
                currencyOperationTypes.StatisticalRegistration
                  ? item?.pcoFreightCostMny || 0
                  : item?.pcofrightcostmny || 0,
                item.pcoInspectionCostMny || 0,
                currencyOperationTypes.StatisticalRegistration
                  ? item?.pcoOtherCostMny || 0
                  : item.pcoothercostmny || 0,
                currencyOperationTypes.StatisticalRegistration
                  ? item?.pcoDiscountMny || 0
                  : item.pcodiscountmny || 0,
                item.pcocountrysourceName,
                item.pcoiranborderName,
                item.pcodestitioncustomName,
              ];
            });

            const headerRow = [
              "ردیف",
              "کد یکتای منشا ارز",
              "شماره پرونده",
              `شماره ثبت ${
                currencyOperationType ===
                currencyOperationTypes.StatisticalRegistration
                  ? "آماری"
                  : "سفارش"
              }`,
              "تاریخ منشا ارز",
              "شماره ساتا",
              "وضعیت",
              "مبلغ کل منشا ارز",
              "مبلغ فوب منشا ارز ",
              "مبلغ کرایه حمل",
              "مبلغ بازرسی",
              "سایر هزینه‌ها",
              "مبلغ تخفیف",
              "کشور مبدا حمل",
              "مرز ورودی",
              "گمرک مقصد",
            ];
            handleDownloadExcel(
              headerRow,
              bodyData,
              "NTSW_ExportCurrencyReques"
            );
          } else {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: "دیتایی برای دانلود وجود ندارد",
              })
            );
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (hasMounted) {
      getTable();
    }
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  useEffect(() => {
    if (hasMounted) {
      handleSearch();
    }
  }, [filters?.prfVCodeInt]);

  useEffect(() => {
    getTable(undefined, state?.filters?.pcoStatusTny);
    setFilters(state?.filters);
    setHasMounted(true);
  }, []);

  const handleChangeInputs = (name, value, validationNameList) => {
    if (name === "beginDate") {
      if (Validation.minimumDate(filters?.endDate, value) === true) {
        setErrors({
          ...errors,
          endDate: [],
        });
      } else {
        setErrors({
          ...errors,
          endDate: Validation.minimumDate(filters?.endDate, value),
        });
      }
    } else if (name === "endDate") {
      if (Validation.maximumDate(filters?.beginDate, value) === true) {
        setErrors({
          ...errors,
          beginDate: [],
        });
      } else {
        setErrors({
          ...errors,
          beginDate: Validation.maximumDate(filters?.beginDate, value),
        });
      }
    }
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
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
    setFilters((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  return (
    <>
      {children}
      <VerticalSpace space="0.5rem" />
      <Row>
        <Col sm={24} md={12} xl={6}>
          <DatePicker
            title="تاریخ منشا ارز از"
            defaultValue={filters?.beginDate}
            name="beginDate"
            onChange={handleChangeInputs}
            error={errors?.beginDate}
            validations={[["maximumDate", filters?.endDate]]}
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <DatePicker
            title="تاریخ منشا ارز تا"
            name="endDate"
            defaultValue={filters?.endDate}
            onChange={handleChangeInputs}
            error={errors?.endDate}
            validations={[["minimumDate", filters?.beginDate]]}
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <ComboBox
            title="وضعیت"
            name="pcoStatusTny"
            onChange={handleChangeInputs}
            options={preCotageStatus}
            defaultValue={filters?.pcoStatusTny}
            error={errors?.pcoStatusTny}
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <Button name="getTable" onClick={handleSearch} loading={loading}>
            <i className="fa fa-search" aria-hidden="true"></i>
            جستجو منشا ارز
          </Button>
        </Col>
      </Row>
      <div className="gap-shadow" />
      <VerticalSpace space="12px" />
      <Row>
        <Col sm={24} md={12} xl={6}>
          <ExcelExportButton getData={getTable} loading={loading} />
        </Col>
      </Row>
      <VerticalSpace space="0.5rem" />
      <Table
        handleChangePageSize={handleChangePageSize}
        dataSource={dataSource}
        columns={columns}
        pagination={tableParams?.pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
      />
    </>
  );
};

export default Management;

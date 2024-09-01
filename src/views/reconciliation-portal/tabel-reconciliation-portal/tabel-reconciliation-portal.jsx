import React, { useEffect, useState } from "react";
import TradingList from "../../currency-trading/operations-currency/trading-list";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../../services/endpoints";
import StringHelpers from "../../../configs/helpers/string-helpers";
import { Table } from "../../../components";

const TabelReconciliationPortal = ({ dataSource, setDataSource }) => {
  // const [dataSource, setDataSource] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const { colorMode, role, GUid } = useSelector((state) => state);
  const dispatch = useDispatch();
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
      title: "سال",
      dataIndex: "cnpYear",
      align: "center",
    },
    {
      title: "معادل یورویی مبلغ",
      dataIndex: "cnpUserEuroAmount",
      align: "center",
      render: (item, { cnpUserEuroAmount }, index) => (
        <>{StringHelpers.formatNumber(cnpUserEuroAmount)}</>
      ),
    },
    {
      title: "وضعیت تولیدی/غیر تولیدی",
      dataIndex: "cnpProductTypeStr",
      align: "center",
    },
    {
      title: "نرخ وجه المصالحه به ازای هر یورو (ریال)",
      dataIndex: "cnpRateInt",
      align: "center",
      render: (item, { cnpRateInt }, index) => (
        <>{StringHelpers.formatNumber(cnpRateInt)}</>
      ),
    },
    {
      title: "مبلغ ریالی وجه المصالحه",
      dataIndex: "cnpRialAmount",
      align: "center",
      render: (item, { cnpRialAmount }, index) => (
        <>{StringHelpers.formatNumber(cnpRialAmount)}</>
      ),
    },
    {
      title: "وضعیت پرداخت",
      dataIndex: "cnpPaymentStatusStr",
      align: "center",
    },
    {
      title: "کد رهگیری تراکنش",
      dataIndex: "cnpTrackingId",
      align: "center",
      render: (item, { cnpTrackingId }, index) => <>{cnpTrackingId}</>,
    },
    {
      title: "وضعیت ارسال اطلاعات پرداخت به بانک مرکزی",
      dataIndex: "cnpSendToCbiStatusStr",
      align: "center",
    },
  ];

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

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

  const getAllConciliationPayment = (generateExcel) => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      startIndex:
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize,
      pageSize: tableParams.pagination.pageSize,
    };
    dispatch(handleLoading(true));
    setLoading(true);
    axios({
      url: endpoints.RestAPIs.currencyTrading.getAllConciliationPayment.url,
      method:
        endpoints.RestAPIs.currencyTrading.getAllConciliationPayment.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          setDataSource(res?.data?.Result?.PaymentList);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: res?.data?.Result?.TotalCount || 0,
            },
          });
          if (!!generateExcel) {
            handleGenerateExcel({
              data: res?.data?.Result?.PaymentList,
              generateExcel,
            });
          }
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
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

  const handleGenerateExcel = ({ generateExcel, data }) => {
    const bodyData = data?.map((item, index) => {
      return [
        index +
          1 +
          (Number(tableParams?.pagination?.current || 1) - 1) *
            Number(tableParams.pagination.pageSize || 1),
        item.cnpYear,
        item.cnpEuroAmount,
        item.cnpProductTypeStr,
        item?.cnpRateInt,
        item.cnpRialAmount,
        item.cnpPaymentStatusStr,
        item.cnpVCodeInt,
        item.cnpSendToCbiStatusStr,
      ];
    });

    const headerRow = [
      "ردیف",
      "سال",
      "معادل یورویی مبلغ",
      "وضعیت تولیدی/غیر تولیدی",
      "نرخ وجه المصالحه به ازای هر یورو (ریال)",
      "مبلغ ریالی وجه المصالحه",
      "وضعیت پرداخت",
      "کد رهگیری تراکنش",
      "وضعیت ارسال اطلاعات پرداخت به بانک مرکزی",
    ];
    generateExcel(headerRow, bodyData, "NTSW_ExportReconciliationPortal");
  };

  useEffect(() => {
    getAllConciliationPayment();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  return (
    <>
      <TradingList
        title="سوابق پرداخت"
        loading={loading}
        getData={getAllConciliationPayment}
      />
      <Table
        handleChangePageSize={handleChangePageSize}
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
    </>
  );
};

export default TabelReconciliationPortal;

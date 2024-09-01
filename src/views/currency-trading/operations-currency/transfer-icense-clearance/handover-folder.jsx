import React, { useState } from "react";
import { Row, Table } from "antd";
import { Button } from "../../../../components";
import themeColors from "../../../../configs/theme";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmergingProblem from "../../emerging-problem/emerging-problem";

const HandoverFolder = () => {
  const [loading, setLoading] = useState(false);
  const { theme, colorMode } = useSelector((state) => state);
  const [dataSource, setDataSource] = useState(undefined);
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
      title: "نام متقاضی",
      dataIndex: "nameApplicant",
      align: "center",
    },
    {
      title: "سریال اظهارنامه",
      dataIndex: "declerationSeries",
      align: "center",
    },
    {
      title: "مبلغ",
      dataIndex: "amount",
      align: "center",
    },
    {
      title: "نوع ارز",
      dataIndex: "tradingType",
      align: "center",
    },
    {
      title: "تاریخ درخواست",
      dataIndex: "dateRequest",
      align: "center",
    },
    {
      title: "تاریخ پاسخ",
      dataIndex: "answerDate",
      align: "center",
    },
    {
      title: "نرخ ارز (ریال)",
      dataIndex: "exchangeRate",
      align: "center",
    },
    {
      title: "جمع مبلغ ریالی",
      dataIndex: "totalAmount",
      align: "center",
    },
    {
      title: "نوع معامله ریالی",
      dataIndex: "rialTransactionType",
      align: "center",
    },
    {
      title: "شماره شبا",
      dataIndex: "shabaNumber",
      align: "center",
      render: (_, { id }, index) => (
        <div className="flex-order-row">
          <Link to={`/Users/AC/Base/CardFileDetaile?${id}`}>
            <Button name={`linkToDetails-${index}`} type="secondary">
              مشاهده
            </Button>
          </Link>
        </div>
      ),
    },
    {
      title: "وضعیت",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "تایید",
      dataIndex: "confirmation",
      align: "center",
    },
    {
      title: "رد",
      dataIndex: "reject",
      align: "center",
    },
  ];

  return (
    <>
      <Row
        style={{
          backgroundColor: "white",
          alignItems: "center",
          margin: "10px 0",
          justifyContent: "center",
        }}
      >
        <Button
          style={{
            padding: "0",
            backgroundColor: "rgb(93, 178, 255)",
            border: "1px solid rgb(93, 178, 255)",
            color: "white",
            width: "fit-content",
          }}
        >
          <a
            class="btn btn-blue btn-labeled guideBtn"
            href="../Upload/VaredatDarMogabelSaderatGeir.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i class="fa fa-file btn-label" style={{ fontSize: "14px" }} />
            راهـنمای فرآیند
          </a>
        </Button>
        <Button
          style={{
            padding: "0",
            backgroundColor: "rgb(93, 178, 255)",
            border: "1px solid rgb(93, 178, 255)",
            color: "white",
            width: "fit-content",
          }}
        >
          <a
            class="btn btn-blue guideBtn"
            href="../Upload/RahnemayeVagozariParvanehSaderati.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i class="fa fa-file" style={{ fontSize: "14px" }} />
            راهنـمای کاربری
          </a>
        </Button>
      </Row>
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

export default HandoverFolder;

import React, { useState } from "react";
import { Row, Table, Col } from "antd";
import { Button } from "../../../../components";
import themeColors from "../../../../configs/theme";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TradingList from "../trading-list";
import EmergingProblem from "../../emerging-problem/emerging-problem";

const MyAds = () => {
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
      title: "کد آگهی",
      dataIndex: "cdAd",
      align: "center",
    },
    {
      title: "تاریخ ثبت آگهی",
      dataIndex: "adRegistrationDate",
      align: "center",
    },
    {
      title: "سریال اظهارنامه",
      dataIndex: "declarationSeries",
      align: "center",
    },
    {
      title: "مبلغ",
      dataIndex: "amount",
      align: "center",
    },
    {
      title: "ارز",
      dataIndex: "currency",
      align: "center",
    },
    {
      title: "نرخ فروش (ریال)",
      dataIndex: "salesRate",
      align: "center",
    },
    {
      title: "زمان پایان نمایش در تابلو",
      dataIndex: "endTimeShow",
      align: "center",
    },
    {
      title: "وضعیت آگهی",
      dataIndex: "statusAd",
      align: "center",
    },
    {
      title: "جزئیات آگهی",
      dataIndex: "detailsAd",
      align: "center",
      render: (_, { id }, index) => (
        <div className="flex-order-row">
          <Link to={`/Users/AC/Base/CardFileDetaile?${id}`}>
            <Button name={`linkToDetails-${index}`} type="secondary">
              جزئیات آگهی
              <i class="fa fa-search" />
            </Button>
          </Link>
        </div>
      ),
    },
    {
      title: "حذف آگهی",
      dataIndex: "deleteAd",
      align: "center",
      render: (_, { id }, index) => (
        <div className="flex-order-row">
          <Link to={`/Users/AC/Base/CardFileDetaile?${id}`}>
            <Button
              backgroundColor={themeColors.btn.danger}
              name={`linkToDetails-${index}`}
              type="secondary"
            >
              حذف آگهی
              <i class="fa fa-remove" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <Row
        style={{
          padding: "0 40px",
        }}
      >
        <Col sm={24} md={24} xl={8}>
          <div>
            <Button>
              <i class="fa fa-plus" />
              ایجاد آگهی جدید
            </Button>
          </div>
        </Col>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button
            style={{
              height: "30px",
              border: "none",
              backgroundColor: "#53a93f",
              color: "white",
              padding: "1px 10px",
            }}
            className="fontBtn"
          >
            <div class="gap-icon">
              <i class="fa fa-comment" />
              مشارکت در بازطراحی و بهبود عملکرد سامانه نیما
            </div>
          </Button>
          <Button>
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
          <Button>
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
        </div>
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

export default MyAds;

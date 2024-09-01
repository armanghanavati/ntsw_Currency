import React, { useState } from "react";
import { Col, Row, Table } from "antd";
import { Input, ComboBox, Button } from "../../../components";
import Validation from "../../../utils/Validation";
import themeColors from "../../../configs/theme";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmergingProblem from "../emerging-problem/emerging-problem";
import TradingList from "./trading-list";

const BuyCurrency = () => {
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const inputName = ["orderRegistrationNumber", "date", "status", "searchText"];

  const [option, setOption] = useState([
    { number: 1223434 },
    { number: 6768678 },
    { number: 6666567 },
    { number: 7867667 },
    { number: 5667656 },
    { number: 4545345 },
  ]);

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
      title: "کد درخواست",
      dataIndex: "cdrequest",
      align: "center",
    },
    {
      title: "ثبت سفارش های مرتبط",
      dataIndex: "registrationRelatedOrders",
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
      title: "بانک و شعبه",
      dataIndex: "branch",
      align: "center",
    },
    {
      title: "وضعیت",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "تاریخ اعتبار درخواست",
      dataIndex: "applicationValidityDate",
      align: "center",
    },
    {
      title: "جزئیات",
      dataIndex: "detaile",
      align: "center",
      render: (_, { id }, index) => (
        <div className="flex-order-row">
          <Link to={`/Users/AC/Base/CardFileDetaile?${id}`}>
            <Button name={`linkToDetails-${index}`} type="secondary">
              جزئیات
              <i class="fa fa-search" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col sm={24} md={12} xl={4}>
          <Button>ایجاد درخواست جدید</Button>
        </Col>
        <Col className="spaceCombo" sm={24} md={12} xl={4}>
          <ComboBox
            title="شماره ثبت سفارش"
            defaultValue={inputsData?.orderRegistrationNumber}
            name="orderRegistrationNumber"
            onChange={handleChangeInputs}
            options={option}
            optionTitle="شماره ثبت سفارش"
            optionValue="id"
            validations={[["required"]]}
            error={errors?.orderRegistrationNumber}
          />
        </Col>
        <Col className="space" sm={24} md={12} xl={4}>
          <Input
            value={inputsData?.date}
            name="date"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            error={errors?.date}
            type="text"
            space="5px"
            title="تاریخ"
          />
        </Col>
        <Col className="space" sm={24} md={12} xl={4}>
          <ComboBox
            title="وضعیت"
            defaultValue={inputsData?.status}
            name="status"
            onChange={handleChangeInputs}
            options={option}
            optionTitle="وضعیت"
            optionValue="id"
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
            <Button>
              <i class="fa fa-search" />
              جستجو
            </Button>
          </div>
        </Col>
      </Row>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #e5e5e5",
          margin: "20px 0",
        }}
      />
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
            height: "30px",
            border: "none",
            backgroundColor: "#53a93f",
            color: "white",
          }}
        >
          <i class="fa fa-comment" />
          مشارکت در بازطراحی و بهبود عملکرد سامانه نیما
        </Button>
        <Button>
          <a
            class="gap-icon"
            href="../Upload/Varedat-Aban-97.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i class="fa fa-image" style={{ fontSize: "15px" }} />
            اینـفـوگـرافی
          </a>
        </Button>
        <Button>
          <a
            class="gap-icon"
            href="https://www.aparat.com/v/D1LAM"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i class="fa fa-film" style={{ fontSize: "15px" }} />
            فیـلم آمـوزشی
          </a>
        </Button>
        <Button>
          <a
            class="gap-icon"
            href="../Upload/buyCurrency.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            <i class="fa fa-file" style={{ fontSize: "15px" }} />
            فایل راهنــما
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
      <TradingList title={"لیست خرید ارز"} />
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

export default BuyCurrency;

import React, { useState } from "react";
import { Col, Row, Table } from "antd";
import { Input, ComboBox, Button } from "../../../components";
import Validation from "../../../utils/Validation";
import themeColors from "../../../configs/theme";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmergingProblem from "../emerging-problem/emerging-problem";

const RequestCurrencyAllocation = () => {
  const { theme, colorMode } = useSelector((state) => state);
  const [dataSource, setDataSource] = useState(undefined);
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });
  const [option, setOption] = useState([
    { number: 1223434 },
    { number: 6768678 },
    { number: 6666567 },
    { number: 7867667 },
    { number: 5667656 },
    { number: 4545345 },
  ]);
  const inputName = [
    "orderRegistrationNumber",
    "approvalDate",
    "confirmationDateTo",
    "dateApplicationFrom",
    "dateApplicationUntil",
    "dateAllotment",
    "dateAllotmentTo",
    "applicationStatus",
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

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
      title: "کد ثبت سفارش",
      dataIndex: "cdOrder",
      align: "center",
    },
    {
      title: "ردیف درخواست",
      dataIndex: "request",
      align: "center",
    },
    {
      title: "وضعیت",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "فرآیند فعلی",
      dataIndex: "currentProcess",
      align: "center",
    },
    {
      title: "مبلغ درخواست",
      dataIndex: "amount",
      align: "center",
    },
    {
      title: "ارز درخواست",
      dataIndex: "currency",
      align: "center",
    },
    {
      title: "تاریخ ایجاد درخواست",
      dataIndex: "dateRequestCreate",
      align: "center",
    },
    {
      title: "تاریخ تخصیص",
      dataIndex: "allocation",
      align: "center",
    },
    {
      title: "تاریخ تائید",
      dataIndex: "confirmation",
      align: "center",
    },
    {
      title: "محل تامین ارز",
      dataIndex: "placeSupply",
      align: "center",
    },
    {
      title: "نرخ ارز",
      dataIndex: "rate",
      align: "center",
    },
    {
      title: "نوع درخواست",
      dataIndex: "type",
      align: "center",
    },
    {
      title: "شعیه",
      dataIndex: "branch",
      align: "center",
    },
    {
      title: "عملیات",
      dataIndex: "operation",
      align: "center",
      render: (_, { id }, index) => (
        <div className="flex-order-row">
          <Link to={`/Users/AC/Base/CardFileDetaile?${id}`}>
            <Button name={`linkToDetails-${index}`} type="secondary">
              عملیات
              <i class="fa fa-search" />
            </Button>
          </Link>
        </div>
      ),
    },
    {
      title: "تاریخچه",
      dataIndex: "history",
      align: "center",
      render: (_, { id }, index) => (
        <div className="flex-order-row">
          <Link to={`/Users/AC/Base/CardFileDetaile?${id}`}>
            <Button name={`linkToDetails-${index}`} type="secondary">
              تاریخچه
              <i class="fa fa-edit" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
      <form style={{ paddingRight: "15px" }}>
        <Row>
          <Col sm={24} md={12} xl={6}>
            <ComboBox
              title="شماره ثبت سفارش"
              defaultValue={inputsData?.orderRegistrationNumber}
              name="orderRegistrationNumber"
              onChange={handleChangeInputs}
              options={option}
              optionTitle="شماره ثبت سفارش"
              optionValue="id"
              width="200px"
              validations={[["required"]]}
              error={errors?.orderRegistrationNumber}
            />
          </Col>
          <Button>
            <i class="fa fa-plus-square" />
            ایجاد درخواست تخصیص ارز جدید
          </Button>
          <div className="marginBtnUpdate">
            <Button>
              <i class="fa fa-refresh" />
              بروزرسانی ثبت سفارش
            </Button>
          </div>
        </Row>
        <Row>
          <Col sm={24} md={12} xl={6}>
            <Input
              value={inputsData?.approvalDate}
              name="approvalDate"
              onChange={handleChangeInputs}
              validations={[["required"], ["approvalDate"]]}
              error={errors?.approvalDate}
              type="approvalDate"
              space="30px"
              title="تاریخ تائید از"
              labelWidth="200px"
            />
          </Col>
          <Col sm={24} md={12} xl={6}>
            <Input
              value={inputsData?.confirmationDateTo}
              name="confirmationDateTo"
              onChange={handleChangeInputs}
              validations={[["required"]]}
              error={errors?.confirmationDateTo}
              type="text"
              space="30px"
              title="تاریخ تائید تا"
              labelWidth="200px"
            />
          </Col>
          <Col sm={24} md={12} xl={6}>
            <Input
              value={inputsData?.dateApplicationFrom}
              name="dateApplicationFrom"
              onChange={handleChangeInputs}
              validations={[["required"]]}
              error={errors?.dateApplicationFrom}
              type="text"
              space="30px"
              title="تاریخ درخواست از"
              labelWidth="200px"
            />
          </Col>
          <Col sm={24} md={12} xl={6}>
            <Input
              value={inputsData?.dateApplicationUntil}
              name="dateApplicationUntil"
              onChange={handleChangeInputs}
              validations={[["required"]]}
              error={errors?.dateApplicationUntil}
              type="text"
              space="30px"
              title="تاریخ درخواست تا"
              labelWidth="200px"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={12} xl={6}>
            <Input
              value={inputsData?.dateAllotment}
              name="dateAllotment"
              onChange={handleChangeInputs}
              validations={[["required"]]}
              error={errors?.dateAllotment}
              type="text"
              space="30px"
              title="تاریخ تخصیص از"
              labelWidth="200px"
            />
          </Col>
          <Col sm={24} md={12} xl={6}>
            <Input
              value={inputsData?.dateAllotmentTo}
              name="dateAllotmentTo"
              onChange={handleChangeInputs}
              validations={[["required"]]}
              error={errors?.dateAllotmentTo}
              type="text"
              space="30px"
              title="تاریخ تخصیص تا"
              labelWidth="200px"
            />
          </Col>
          <Col sm={24} md={12} xl={6}>
            <Input
              value={inputsData?.applicationStatus}
              name="applicationStatus"
              onChange={handleChangeInputs}
              validations={[["required"]]}
              error={errors?.applicationStatus}
              type="text"
              space="30px"
              title="وضعیت درخواست"
              labelWidth="200px"
            />
          </Col>
          <Col sm={24} md={12} xl={6}>
            <Input
              value={inputsData?.webSite}
              name="webSite"
              onChange={handleChangeInputs}
              validations={[["required"]]}
              error={errors?.webSite}
              type="text"
              space="30px"
              title="فرآیند فعلی"
              labelWidth="200px"
            />
          </Col>
        </Row>
        <Row>
          <Button>
            <i class="fa fa-search" />
            جستجو
          </Button>
          <Button backgroundColor={themeColors.btn.secondary}>
            <i
              class="fa fa-2x fa-info-circle"
              style={{ marginLeft: "0px", fontSize: "24px" }}
            />
          </Button>
        </Row>
      </form>
      <div className="gap-shadow" />
      <Row style={{ marginTop: "13px", paddingRight: "15px" }}>
        <Col sm={24} md={12} xl={8}>
          <Button backgroundColor={themeColors.btn.purple}>
            <i class="fa fa-upload" />
            خروجی اکسل
          </Button>
        </Col>
        <Button>
          <i class="btn-label glyphicon glyphicon-film"></i>
          فیلم آموزشی
        </Button>
        <Button>
          <i class="btn-label glyphicon glyphicon-file" />
          فایل راهنما
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

export default RequestCurrencyAllocation;

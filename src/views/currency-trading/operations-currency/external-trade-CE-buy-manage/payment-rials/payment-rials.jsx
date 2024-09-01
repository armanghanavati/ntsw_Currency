import { useState } from "react";
import { useSelector } from "react-redux";
import themeColors from "../../../../../configs/theme";
import { Button, ComboBox, Input, TitleBox } from "../../../../../components";
import { Col, Row, Table } from "antd";

const PaymentRials = ({ inputsData, handleChangeInputs }) => {
  const { theme, colorMode } = useSelector((state) => state);
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

  const columns = [
    {
      title: "تاریخ ثبت",
      dataIndex: "sfrVCodeInt",
      align: "center",
    },
    {
      title: "نوع پرداخت",
      dataIndex: "orderNos",
      align: "center",
    },
    {
      title: "کد پرداخت",
      dataIndex: "sfrTotalAmountMny",
      align: "center",
    },
    {
      title: "تاریخ پرداخت",
      dataIndex: "sfrcurNameStr",
      align: "center",
    },
    {
      title: "بانک مبدأ",
      dataIndex: "sffBankShobeNameStr",
      align: "center",
    },
    {
      title: "مبلغ",
      dataIndex: "sfrStatusStr",
      align: "center",
    },
    {
      title: "وضعیت",
      dataIndex: "sfrRequestValidationDateStr",
      align: "center",
    },
    {
      title: "توضیحات کاربر",
      dataIndex: "detaile",
      align: "center",
    },
  ];

  return (
    <>
      <hr style={{ width: "80%", border: "1px dashed", margin: "30px auto" }} />
      <TitleBox title="پرداخت ریال" />
      <Row style={{ marginTop: "15px" }}>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="بانک مقصد"
            value={inputsData?.allInfo?.cnyNameDestination}
            name="cnyNameDestination"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="صاحب حساب"
            value={inputsData?.allInfo?.sfrswiftCodeStr}
            name="sfrswiftCodeStr"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="مهلت پرداخت ریال"
            value={inputsData?.allInfo?.bnkNameDestination}
            name="bnkNameDestination"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="شماره شبا"
            value={inputsData?.allInfo?.sfrOtherPaymentCodeStr}
            name="sfrOtherPaymentCodeStr"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="شماره حساب"
            value={inputsData?.searchText}
            name="searchText"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="شماره کارت"
            value={inputsData?.allInfo?.sfrbnkAddressStr}
            name="sfrbnkAddressStr"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="شناسه واریز"
            value={inputsData?.allInfo?.sfrBeneficiaryNameStr}
            name="sfrBeneficiaryNameStr"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <ComboBox
            title="نوع پرداخت"
            // options={orderRegistrationCodeOptions}
            // defaultValue={orderRegistrationCode}
            optionTitle="prfOrderNoStr"
            optionValue="prfVCodeInt"
            name="sfrBeneficiaryTelAndFaxStr"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="شناسه پرداخت"
            value={inputsData?.allInfo?.sfrBeneficiaryAddressStr}
            name="sfrBeneficiaryAddressStr"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="بانک مبداً"
            value={inputsData?.searchText}
            name="searchText"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="مبلغ پرداخت شده"
            value={inputsData?.searchText}
            name="searchText"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="تاریخ پرداخت"
            value={inputsData?.searchText}
            name="searchText"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="text"
            space="5px"
            readOnly
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            title="توضیحات"
            value={inputsData?.searchText}
            name="searchText"
            onChange={handleChangeInputs}
            validations={[["required"]]}
            type="textarea"
            space="5px"
            readOnly
          />
        </Col>
      </Row>
      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}
      >
        <Button>ثبت</Button>
      </div>
      <Table
        // dataSource={inputsData?.allInfo?.sarrafiRequestDetailList}
        columns={columns}
        // style={{ margin: "10px 0 20px" }}
        // pagination={tableParams.pagination}
        // loading={loading}
        // onChange={handleTableChange}
        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
      />
      <div
        style={{ display: "flex", justifyContent: "end", marginTop: "20px" }}
      >
        <Button backgroundColor={themeColors.btn.warning}>
          <i class="fa fa-warning"></i>لغو انتخاب
        </Button>
        <Button backgroundColor={themeColors.btn.secondary}>انتخاب</Button>
      </div>
    </>
  );
};
export default PaymentRials;

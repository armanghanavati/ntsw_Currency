import React from "react";
import { Col, Row } from "antd";
import { Input } from "../../../../../components";

const AllInfo = ({ inputsData, handleChangeInputs }) => {
  return (
    <Row>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="کشور مقصد"
          value={inputsData?.allInfo?.cnyNameDestination}
          name="cnyNameDestination"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="کد سوئیفت"
          value={inputsData?.allInfo?.sfrswiftCodeStr}
          name="sfrswiftCodeStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={12}>
        <Input
          title="بانک مقصد"
          value={inputsData?.allInfo?.bnkNameDestination}
          name="bnkNameDestination"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="سایر کدها"
          value={inputsData?.allInfo?.sfrOtherPaymentCodeStr}
          name="sfrOtherPaymentCodeStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="کد"
          value={inputsData?.searchText}
          name="searchText"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={12}>
        <Input
          title="آدرس بانک"
          value={inputsData?.allInfo?.sfrbnkAddressStr}
          name="sfrbnkAddressStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="صاحب حساب مقصد"
          value={inputsData?.allInfo?.sfrBeneficiaryNameStr}
          name="sfrBeneficiaryNameStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="تلفن و فکس"
          value={inputsData?.allInfo?.sfrBeneficiaryTelAndFaxStr}
          name="sfrBeneficiaryTelAndFaxStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={12}>
        <Input
          title="آدرس"
          value={inputsData?.allInfo?.sfrBeneficiaryAddressStr}
          name="sfrBeneficiaryAddressStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
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
      <Col sm={24} md={12} xl={6}>
        <Input
          title="IBAN"
          value={inputsData?.allInfo?.sfrIBANStr}
          name="sfrIBANStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={12}>
        <Input
          title="توضیحات"
          value={inputsData?.allInfo?.sfrDescriptionStr}
          name="sfrDescriptionStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="مهلت پرداخت"
          value={inputsData?.allInfo?.sfrPaymentDedlineDateStr}
          name="sfrPaymentDedlineDateStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="تاریخ اعتبار درخواست"
          value={inputsData?.allInfo?.sfrRequestValidationDateStr}
          name="sfrRequestValidationDateStr"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={12}>
        <Input
          title="نام صرافی"
          value={inputsData?.allInfo?.sfcShabaNoStrSelectedSarafi}
          name="sfcShabaNoStrSelectedSarafi"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="نام و نام خانوادگی"
          value={inputsData?.searchText}
          name="searchText"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Input
          title="شماره تماس"
          value={inputsData?.searchText}
          name="searchText"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
      <Col sm={24} md={12} xl={12}>
        <Input
          title="نوع نرخ"
          value={inputsData?.searchText}
          name="searchText"
          onChange={handleChangeInputs}
          validations={[["required"]]}
          type="text"
          space="5px"
          readOnly
        />
      </Col>
    </Row>
  );
};

export default AllInfo;

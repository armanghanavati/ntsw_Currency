// اطلاعات اصلی منشا ارز
import { Col, Row } from "antd";
import React from "react";
import { Input, TitleBox, VerticalSpace } from "../../components";

const BasicInformation = ({ inputsData }) => {
  return (
    <>
      <Row>
        <Col sm={24} md={24} lg={24}>
          <TitleBox title={"اطلاعات اصلی منشا ارز"} />
        </Col>
      </Row>
      <VerticalSpace space="1rem" />
      <Row>
        <Col sm={24} md={24} xl={8}>
          <Input
            value={inputsData?.proformaId}
            title="شماره پرونده"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input
            value={inputsData?.orderNumber}
            title={`شماره ${inputsData?.proformaType}`}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input
            title="وضعیت منشا"
            value={inputsData?.preCotageStatus}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input
            title="کشور مبدا حمل"
            value={inputsData?.countrySource}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input
            title="مرز ورودی"
            value={inputsData?.iranEntryBorder}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input
            title="گمرک مقصد"
            value={inputsData?.destinationCustom}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input
            title={`نوع ارز ${inputsData?.proformaType}`}
            value={inputsData?.gg}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input
            title="مبلغ فوب"
            value={inputsData?.goodsFOBAmount}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input
            title="مبلغ حمل"
            value={inputsData?.freightAmount}
            readOnly={true}
          />
        </Col>

        <Col sm={24} md={24} xl={8}>
          <Input
            title="تخفیف"
            value={inputsData?.discountAmount}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input
            title="سایر هزینه ها"
            value={inputsData?.otherAmount}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={8}>
          <Input title="مبلغ کل" value={inputsData?.amount} readOnly={true} />
        </Col>
        {inputsData?.isShowMainInfoFields && (
          <>
            <Col sm={24} md={24} xl={8}>
              <Input
                title="کد یکتای منشا ارز"
                value={inputsData?.id}
                readOnly={true}
              />
            </Col>
            <Col sm={24} md={24} xl={8}>
              <Input
                title="تاریخ منشا"
                value={inputsData?.preCotageDate}
                readOnly={true}
              />
            </Col>
            <Col sm={24} md={24} xl={8}>
              <Input
                title="کد SATA"
                value={inputsData?.sataId}
                readOnly={true}
              />
            </Col>
            <Col sm={24} md={24} xl={24}>
              <Input
                title="پاسخ بانک"
                value={inputsData?.cbiAnswer}
                labelWidth="220px"
                readOnly={true}
                type="textarea"
              />
            </Col>
          </>
        )}
      </Row>
      <VerticalSpace space="2rem" />
    </>
  );
};

export default BasicInformation;

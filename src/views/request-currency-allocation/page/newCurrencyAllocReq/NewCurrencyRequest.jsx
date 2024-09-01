import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Input, TitleBox, Tooltip } from "../../../../components";
import { Col, Row } from "antd";

const NewCurrencyRequest = ({ guide3, guide2, guide1 }) => {
  const { state } = useLocation();
  const dataOrder = state?.dataOfOrder;

  return (
    <div id="countainer">
      <Col style={{ margin: "10px 0 10px 0" }} xl={24}>
        <TitleBox title="اطلاعات اصلی" />
      </Col>
      <Row>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfVCodeInt} readOnly title="شماره پرونده" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfNumberStr}
            readOnly
            title="شماره پیش فاکتور"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfLevel} readOnly title="سطح دسترسی" />
        </Col>
        {/* <Col sm={24} md={12} xl={8}>
          <Input
          centerText
              align="right"
          readOnly title="وضعیت درخواست" />
        </Col> */}
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.fdrFIDACodeStr}
            readOnly
            title="شناسه فروشنده خارجی"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfSellerNameEnStr}
            readOnly
            title="فروشنده خارجی"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfSellerTellStr}
            readOnly
            title="تلفن فروشنده خارجی"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfcnyVCodeTnyBeneficiaryStr}
            readOnly
            title="کشور ذینفع"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfDate} readOnly title="تاریخ صدور" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfExpireDate}
            readOnly
            title="تاریخ اعتبار"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfActivetyUnit}
            readOnly
            title="شناسه کسب و کار"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfOwnerName} readOnly title="ثبت کننده" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.plbDescritpionStr}
            readOnly
            title="برچسب پرونده"
          />
        </Col>
        <Col style={{ margin: "10px 0 10px 0" }} xl={24}>
          <TitleBox title="اطلاعات گمرکی و حمل ونقل" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfcntNameStr}
            readOnly
            title="نوع قرارداد"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfBorders} readOnly title="مرز ورودی" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfTransportTypes}
            readOnly
            title="روش حمل"
          />
        </Col>

        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfSources}
            readOnly
            title="کشورهای مبدا حمل"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfLoadingPlaceStr}
            readOnly
            title="محل بارگیری"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfCustoms} readOnly title="گمرک مقصد" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            readOnly
            value={dataOrder?.prfTransportNationTypeStr}
            title="ناوگان حمل ونقل"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfTransportCountStr}
            readOnly
            title="حمل به دفعات"
          />
        </Col>
        <Col style={{ margin: "10px 0 10px 0" }} xl={24}>
          <TitleBox title="اطلاعات مالی و بانکی" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfTotalPriceMny?.toLocaleString()}
            readOnly
            title="مبلغ کل پرونده"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfIsBankOPStr}
            readOnly
            title="نوع عملیات ارزی"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfcurNameStr} readOnly title="نوع ارز" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            type="textarea"
            value={dataOrder?.prfCurrencyTypes}
            readOnly
            title="تامین ارز"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfOtherCostMny?.toLocaleString()}
            readOnly
            title="سایر هزینه ها"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfDiscountMny?.toLocaleString()} readOnly title="تخفیف" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfFreightCostMny?.toLocaleString()}
            readOnly
            title="هزینه حمل"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfbnkNameStr} readOnly title="بانک" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.prfbchBranchNameStr} readOnly title="شعبه" />
        </Col>
        <Col style={{ margin: "10px 0 10px 0" }} xl={24}>
          <TitleBox title="اطلاعات ثبت سفارش" />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfOrderNoStr}
            readOnly
            title="شماره ثبت سفارش"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfOrderDate}
            readOnly
            title="تاریخ صدور ثبت سفارش"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfOrderExpireDate}
            readOnly
            title="تاریخ اعتبار ثبت سفارش"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfPriorityTny}
            readOnly
            title="گروه کالایی پرونده"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.romDescritpionStr}
            readOnly
            title="حالت ثبت سفارش"
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.prfRequestCode}
            readOnly
            title="شماره درخواست بازرگانی"
          />
        </Col>
        <Col style={{ margin: "10px 0 10px 0" }} xl={24}>
          <TitleBox title="اطلاعات درخواست تخصیص ارز" />
        </Col>
        <Col className="rowContainer" sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.allocatedPrice?.toLocaleString()}
            readOnly
            title="مجموع مبلغ تخصیص یافته"
          />
          <Tooltip title=" مجموع مبلغ به ارز ثبت سفارش درخواست های تخصیص ارز تایید شده پرونده (به غیر از درخواست های سود و کارمزد) را نشان می دهد. " />
        </Col>
        <Col className="rowContainer" sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"

            value={dataOrder?.unAllocatedPrice?.toLocaleString()}
            readOnly
            title="مجموع مبلغ در حال فرآیند"
          />
          <Tooltip title="مجموع مبلغ به ارز ثبت سفارش درخواست های تخصیص ارز پرونده (به غیر از درخواست های سود و کارمزد) که در حال حاضر در حال اجرای یک فرایند است را نشان می دهد. " />
        </Col>
        <Col className="rowContainer" sm={24} md={12} xl={8}>
          <Input
            centerText
            align="right"
            value={dataOrder?.remainPrice?.toLocaleString()} readOnly title="مبلغ مانده" />
          <Tooltip title="امکان ثبت درخواست تخصیص ارز جدید با نوع درخواست های پیش پرداخت، میان پرداخت و اصل حداکثر تا سقف مبلغ مانده وجود دارد." />
        </Col>
      </Row>
    </div>
  );
};

export default NewCurrencyRequest;

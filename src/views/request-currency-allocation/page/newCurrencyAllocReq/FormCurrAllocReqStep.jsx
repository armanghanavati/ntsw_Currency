import React, { useRef, useEffect, useState } from "react";
import {
  Button,
  ComboBox,
  GuideBox,
  Input,
  Modal,
  Table,
  VerticalSpace,
  Tooltip,
} from "../../../../components";
import { Row, Col, Form, Checkbox } from "antd";
import { useLocation } from "react-router-dom";
import { endpoints } from "../../../../services/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { handleMessageModal } from "../../../../state/action-creators";
import axios from "axios";
import Validation from "../../../../utils/Validation";
import themeColors from "../../../../configs/theme";
import SendDocModal from "./sendDocModal";

const FormCurrAllocReqStep = ({
  setAlldata,
  docsData,
  setDocs,
  inputsData,
  handleFilterDeleteFile,
  form,
  handleChangeInputs,
  reqCurrency,
  reqAmount,
  handelCheckBox,
  dealingTypeList,
  currAllocReqComPerList,
  currAllocReqFacLocList,
  repDeadlineTypeList,
  suppLocList,
  rateTypeList,
  reqTypeList,
  errors,
  setOpen,
  open,
  docs,
  tableDocId,
  refreshReq,
  setErrors,
}) => {
  const { state } = useLocation();
  let tableParams = {
    pagination: {
      current: 1,
      pageSize: 25,
    },
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
      title: "نام سند",
      align: "center",
      render: (item, { DocumentName, fullName }, index) => (
        <>{DocumentName ? DocumentName : fullName}</>
      ),
    },
    {
      title: "پسوند فایل",
      align: "center",
      render: (item, { DocumentFormat, format }, index) => (
        <>{DocumentFormat ? DocumentFormat : format}</>
      ),
    },
    {
      title: "عملیات",
      dataIndex: "manufactureCountry",
      align: "center",
      render: (item, record, index) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            backgroundColor={themeColors?.comments?.red}
            onClick={(e) => {
              e.preventDefault();
              handleFilterDeleteFile(index);
            }}
          >
            <i className="fa fa-trash" />
            حذف
          </Button>
        </div>
      ),
    },
  ];

  const allDataOfOrder = state?.dataOfOrder;
  console.log(
    "🚀 ~ allDataOfOrder:",
    allDataOfOrder?.prfOrderNoStr,
    inputsData?.prfOrderNoStr
  );

  console.log(inputsData?.reqTypeItem);

  return (
    <>
      <Form className="p-1" form={form}>
        <Row>
          <Col md={24} lg={24} xl={12} xxl={8}>
            <Input
              value={allDataOfOrder?.prfOrderNoStr || inputsData?.prfOrderNoStr}
              // value={allDataOfOrder?.prfOrderNoStr}
              readOnly
              name="prfOrderNoStr"
              type="number"
              centerText
              align="right"
              title="شماره ثبت سفارش"
            />
          </Col>
        </Row>
        <Row>
          {!!state?.editCurrAlloc && (
            <>
              <Col
                className="set-field-container rowContainer"
                md={12}
                lg={24}
                xl={12}
                xxl={8}
              >
                <Input
                  type="number"
                  centerText
                  align="right"
                  name="prfVCodeInt"
                  value={inputsData?.prfVCodeInt}
                  readOnly
                  title="شماره پرونده"
                />
              </Col>
              <Col
                className="set-field-container rowContainer"
                md={12}
                lg={24}
                xl={12}
                xxl={8}
              >
                <Input
                  type="number"
                  centerText
                  align="right"
                  value={inputsData?.carRowNoInt}
                  name="carRowNoInt"
                  readOnly
                  title="شماره ردیف"
                />
              </Col>
              <Col
                className="set-field-container rowContainer"
                md={12}
                lg={24}
                xl={12}
                xxl={8}
              >
                <Input
                  value={inputsData?.carVersionInt}
                  name="carVersionInt"
                  readOnly
                  type="number"
                  centerText
                  align="right"
                  title="نسخه"
                />
              </Col>
            </>
          )}
          {inputsData?.amountFieldsVisibility && (
            <>
              <Col
                className="set-field-container rowContainer"
                md={12}
                lg={24}
                xl={12}
                xxl={8}
              >
                <Input
                  type="number"
                  centerText
                  align="right"
                  name="allocatedAmountInProformaCurrency "
                  value={inputsData?.allocatedAmountInProformaCurrency}
                  readOnly
                  title="مبلغ تامین شده درخواست به ارز ثبت سفارش"
                  onChange={handleChangeInputs}
                />
              </Col>
              <Col
                className="set-field-container rowContainer"
                md={12}
                lg={24}
                xl={12}
                xxl={8}
              >
                <Input
                  type="number"
                  centerText
                  align="right"
                  name="allocatedAmountInRequestCurrency"
                  // AllocatedAmountInRequestCurrency

                  value={inputsData?.allocatedAmountInRequestCurrency}
                  readOnly
                  title="مبلغ تامین شده درخواست به ارز درخواست"
                  onChange={handleChangeInputs}
                />
              </Col>
              <Col
                className="set-field-container rowContainer"
                md={12}
                lg={24}
                xl={12}
                xxl={8}
              >
                <Input
                  type="number"
                  centerText
                  align="right"
                  name="proformaFishAmountInProformaCurrency"
                  value={inputsData?.proformaFishAmountInProformaCurrency}
                  readOnly
                  title="مبلغ گشایش اعتبار پرونده به ارز ثبت سفارش"
                  onChange={handleChangeInputs}
                />
              </Col>
            </>
          )}
          <Col className="rowContainer" md={24} lg={24} xl={12} xxl={8}>
            <Input
              name="prfcurNameStr"
              value={inputsData?.prfcurNameStr || allDataOfOrder?.prfcurNameStr}
              readOnly
              title="ارز ثبت سفارش"
            />
            <Tooltip title="ارز تعیین شده در پرونده ثبت سفارش را نمایش می دهد." />
          </Col>
          <Col className="rowContainer" md={24} lg={24} xl={12} xxl={8}>
            <div className="w-100">
              <Input
                type="number"
                centerText
                align="right"
                isCurrency
                maxLength={18}
                onChange={handleChangeInputs}
                value={inputsData?.carAmountInProformaCurrencyMny}
                name="carAmountInProformaCurrencyMny"
                title="مبلغ درخواست به ارز ثبت سفارش"
                error={errors?.carAmountInProformaCurrencyMny}
                validations={[["decimal", 4]]}
              />
            </div>
            <Tooltip title="مبلغ درخواست تخصیص ارز بر حسب ارز ثبت سفارش را مشخص می‌کند که توسط کاربر وارد می‌شود. مجموع مبلغ درخواست‌های تخصیص ارز یک ثبت سفارش نمی‌تواند از مبلغ کل ثبت سفارش بیشتر شود." />
          </Col>
        </Row>
        <Row>
          <Col className="rowContainer" md={24} lg={24} xl={12} xxl={8}>
            <ComboBox
              placeholder="جستجو کنید..."
              preventDefaultSelect={false}
              onChange={handleChangeInputs}
              defaultValue={inputsData?.reqCurrencyItem}
              optionTitle="curNameStr"
              optionValue="curVCodeInt"
              name="reqCurrencyItem"
              options={reqCurrency}
              title="ارز درخواست"
            />
            <Tooltip title="انوع ارز تخصیص را مشخص می‌کند. این ارز می‌تواند با ارز ثبت سفارش متفاوت باشد. در حال حاضر اگر تأمین ارز از منابع بانک مرکزی صورت گیرد، نوع ارز تأمین نمی‌تواند متفاوت با نوع ارز تخصیص باشد." />
          </Col>
          {/* <GuideBox /> */}
          <Col className="rowContainer" md={24} lg={24} xl={12} xxl={8}>
            <Input
              name="carAmountMny"
              value={!!inputsData?.reqCurrencyItem && inputsData?.carAmountMny}
              type="number"
              centerText
              align="right"
              isCurrency
              disabled
              readOnly="readOnly"
              title="مبلغ درخواست"
            />
            <Tooltip title="معادل مبلغ درخواست به ارز ثبت سفارش بر حسب ارز درخواست را مشخص می‌کند و محاسبه آن به صورت خودکار صورت می‌گیرد. این مبلغ در زمان ایجاد درخواست به صورت موقت به نرخ روز ایجاد محاسبه می‌شود. اما این مبلغ در زمان تأیید نهایی بانک مرکزی به نرخ همان روز (تاریخ تخصیص) قطعی می‌شود. به عبارت دیگر مبلغ درخواست به ارز ثبت سفارش ثابت و برابر با مقداری که کاربر وارد کرده است، باقی می‌ماند؛ اما در زمان تخصیص مبلغ درخواست مجدد محاسبه می‌شود." />
          </Col>
        </Row>
        <Row>
          <Col className="rowContainer" xl={12} md={24} lg={24} xxl={8}>
            <Form.Item
              className="containerCol"
              name="dealingTypeItem"
              initialValue={inputsData?.dealingTypeItem}
            >
              <ComboBox
                placeholder="جستجو کنید..."
                preventDefaultSelect={false}
                onChange={handleChangeInputs}
                defaultValue={inputsData?.dealingTypeItem}
                optionTitle="cdtNameStr"
                optionValue="cdtVCodeInt"
                name="dealingTypeItem"
                options={dealingTypeList}
                title="نوع معامله"
              />
            </Form.Item>
            <Tooltip
              title="شیوه پرداخت به فروشنده خارجی را مشخص می‌کند:
- پیش‌پرداخت: همان حواله ارزی است که در آن پرداخت وجه به فروشنده پیش از دریافت اسناد حمل صورت می‌گیرد؛
- حساب‌باز: پرداخت وجه مدتی پس از دریافت اسناد حمل صورت می‌گیرد، بدون آن که فروشنده سندی مالی حاکی از بدهی خریدار دریافت کند؛
- دیداری: می‌تواند برات دیداری یا اعتبار اسنادی دیداری باشد که در آن پرداخت وجه به فروشنده بلافاصله پس از دریافت اسناد حمل صورت می‌گیرد؛
- مدت‌دار: می‌تواند برات مدت‌دار یا اعتبار اسنادی مدت‌دار باشد که در آن پرداخت وجه مدتی مشخص پس از دریافت اسناد حمل صورت می‌گیرد، اما فروشنده هنگام مبادله اسناد حمل سندی حاکی از بدهی خریدار دریافت می‌کند.
"
            />
          </Col>
          <Col className="rowContainer" xl={12} md={24} xxl={8}>
            <Form.Item className="containerCol" name="currAllocReqComPerItem">
              <ComboBox
                preventDefaultSelect={false}
                placeholder={
                  inputsData?.dealingTypeItem >= 1 ? "جستجو کنید..." : ""
                }
                onChange={handleChangeInputs}
                defaultValue={inputsData?.currAllocReqComPerItem}
                optionTitle="ccpNameStr"
                optionValue="ccpVCodeInt"
                name="currAllocReqComPerItem"
                options={currAllocReqComPerList}
                disabled={inputsData?.dealingTypeItem >= 1 ? false : true}
                title="متعهد"
              />
            </Form.Item>
            <Tooltip
              title="مشخص می‌کند چه کسی پرداخت ارز به فروشنده خارجی را متعهد شده است:
- خریدار: در شیوه‌های پرداخت حواله، حساب‌باز، برات دیداری و برات مدت‌دار تعهد پرداخت با خریدار است؛
- بانک: در شیوه‌های پرداخت اعتبار اسنادی دیداری و اعتبار اسنادی مدت‌دار تعهد پرداخت با بانک عامل است."
            />
          </Col>
          <Col className="rowContainer" xl={12} md={24} xxl={8}>
            <Form.Item className="containerCol" name="currAllocReqFacLocItem">
              <ComboBox
                preventDefaultSelect={false}
                placeholder={
                  inputsData?.currAllocReqComPerItem >= 1 ? "جستجو کنید..." : ""
                }
                onChange={handleChangeInputs}
                defaultValue={inputsData?.currAllocReqFacLocItem}
                optionTitle="cflNameStr"
                optionValue="cflVCodeInt"
                name="currAllocReqFacLocItem"
                options={currAllocReqFacLocList}
                disabled={!!inputsData?.currAllocReqComPerItem ? false : true}
                title="محل تسهیلات"
              />
            </Form.Item>
            <Tooltip title="در صورتی که برای پرداخت به فروشنده خارجی، تسهیلات دریافت شده باشد، محل تسهیلات را مشخص می‌کند؛ در غیر این صورت باید مقدار «بدون تسهیلات» انتخاب شود." />
          </Col>
          <Col className="rowContainer" xl={12} md={24} xxl={8}>
            <Form.Item className="containerCol" name="repDeadlineTypeItem">
              <ComboBox
                preventDefaultSelect={false}
                placeholder={
                  inputsData?.currAllocReqFacLocItem >= 1 ? "جستجو کنید..." : ""
                }
                onChange={handleChangeInputs}
                defaultValue={inputsData?.repDeadlineTypeItem}
                optionTitle="crdNameStr"
                optionValue="crdVCodeInt"
                name="repDeadlineTypeItem"
                options={repDeadlineTypeList}
                disabled={
                  inputsData?.currAllocReqFacLocItem >= 1 ? false : true
                }
                title="مهلت بازپرداخت"
              />
            </Form.Item>
            <Tooltip title="مهلت خریدار برای پرداخت وجه را مشخص می‌کند و به صورت خودکار بر اساس مقادیر انتخاب شده در فیلدهای قبلی، مقداردهی می‌شود." />
          </Col>
          <Col className="rowContainer" xl={12} md={24} xxl={8}>
            <Form.Item className="containerCol" name="suppLocItem">
              <ComboBox
                preventDefaultSelect={false}
                placeholder={
                  inputsData?.repDeadlineTypeItem >= 1 ? "جستجو کنید..." : ""
                }
                onChange={handleChangeInputs}
                defaultValue={inputsData?.suppLocItem}
                optionTitle="ccsNameStr"
                optionValue="ccsVCodeInt"
                options={suppLocList}
                disabled={inputsData?.repDeadlineTypeItem >= 1 ? false : true}
                name="suppLocItem"
                title="محل تامین ارز"
              />
            </Form.Item>
            <Tooltip title="مشخص می‌کند ارز پرداختی به فروشنده خارجی از چه محلی تأمین می‌شود. این فیلد نباید با فیلد محل تأمین ارز ثبت سفارش در تناقض باشد. در صورتی که تأمین ارز از منابع بانک مرکزی صورت گیرد، اعم از آن که نرخ ترجیحی یا آزاد داشته باشد، باید گزینه «بانک مرکزی» انتخاب شود." />
          </Col>
          <Col className="rowContainer" xl={12} md={24} xxl={8}>
            <Form.Item className="containerCol" name="rateTypeItem">
              <ComboBox
                preventDefaultSelect={false}
                placeholder={
                  inputsData?.suppLocItem >= 1 ? "جستجو کنید..." : ""
                }
                onChange={handleChangeInputs}
                defaultValue={inputsData?.rateTypeItem}
                optionTitle="ccrNameStr"
                optionValue="ccrVCodeInt"
                options={rateTypeList}
                disabled={inputsData?.suppLocItem >= 1 ? false : true}
                name="rateTypeItem"
                title="نرخ ارز"
              />
            </Form.Item>
            <Tooltip title="مشخص می‌کند ارز با چه نرخی خریداری می‌شود. تنها در صورتی که محل تأمین ارز «بانک مرکزی» انتخاب شده باشد، امکان انتخاب «آزاد» و «ترجیحی» وجود دارد. برای سایر محل‌های تأمین ارز، به صورت خودکار مقدار «آزاد» انتخاب می‌شود." />
          </Col>
          <Col className="rowContainer" xl={12} md={24} xxl={8}>
            <Form.Item className="containerCol" name="reqTypeItem">
              <ComboBox
                preventDefaultSelect={false}
                placeholder={
                  inputsData?.rateTypeItem >= 1 ? "جستجو کنید..." : ""
                }
                onChange={handleChangeInputs}
                defaultValue={inputsData?.reqTypeItem}
                optionTitle="crtNameStr"
                optionValue="crtVCodeInt"
                options={reqTypeList}
                disabled={inputsData?.rateTypeItem >= 1 ? false : true}
                name="reqTypeItem"
                title="نوع درخواست"
              />
            </Form.Item>
            <Tooltip title="هدف از دریافت ارز را مشخص می‌کند؛ قرار است این مبلغ برای چه بخشی از هزینه‌های واردات صرف شود؟ برای پرداخت مبالغ قید شده در پیش‌فاکتور، باید یکی از گزینه‌های «پیش‌پرداخت»، «میان‌پرداخت» یا «اصل» و برای پرداخت هزینه‌های تبدیل و انتقال ارز باید «کارمزد» انتخاب شود. گزینه «سود» تنها در مواردی که از تسهیلات استفاده می‌شود، قابل انتخاب است." />
          </Col>
          <Col className="rowContainer" xl={12} md={24} xxl={8}>
            <div className="w-100">
              <Input
                isCurrency
                title={
                  !!inputsData?.reqTypeItem
                    ? inputsData?.perMonth
                    : "مدت به ماه"
                }
                type="number"
                centerText
                align="right"
                onChange={handleChangeInputs}
                value={inputsData?.carDeadlinePerMonthInt}
                readOnly={
                  inputsData?.reqTypeItem >= 1 ||
                  inputsData?.deadLineAndExpireDeadLineEditableFlag
                    ? false
                    : "readOnly"
                }
                error={errors?.carDeadlinePerMonthInt}
                validations={[
                  ["maxValue", inputsData?.cfrMaxDeadlinePerMonthInt],
                  ["minValue", 0],
                  ["decimal", 0],
                  ["required"],
                ]}
                name="carDeadlinePerMonthInt"
              />
            </div>
            <Tooltip title="به صورت پیش‌فرض باید مقدار 0 درج شود. تنها در صورت استفاده از نوع معامله دیداری با دریافت تسهیلات از بانک خارجی (ریفاینانس) و نوع درخواست اصل یا نوع معامله مدت‌دار بدون دریافت تسهیلات (یوزانس) و نوع درخواست اصل، ممکن است نیاز به درج مقداری دیگر باشد؛ برای درج مقدار مناسب در این شرایط، باید از بانک عامل راهنمایی گرفته شود.." />
          </Col>
          <Col className="rowContainer" xl={12} md={24} xxl={8}>
            <div className="w-100">
              <Input
                isCurrency
                type="number"
                centerText
                align="right"
                name="carExpireDeadlinePerDayInt"
                value={inputsData?.carExpireDeadlinePerDayInt}
                readOnly={
                  inputsData?.reqTypeItem >= 1 ||
                  inputsData?.deadLineAndExpireDeadLineEditableFlag
                    ? false
                    : "readOnly"
                }
                title={
                  !!inputsData?.reqTypeItem ? inputsData?.perDay : "مهلت انقضاء"
                }
                onChange={handleChangeInputs}
                error={errors?.carExpireDeadlinePerDayInt}
                validations={[
                  ["maxValue", inputsData?.cfrMaxExpireDeadlinePerDayInt],
                  ["minValue", 0],
                  ["required"],
                  ["decimal", 0],
                ]}
              />
            </div>
            <Tooltip title="مهلت خرید ارز بر حسب روز را مشخص می‌کند. در حالت عادی (با مدت به ماه 0) آخرین مهلت  خرید ارز برابر، تاریخ تخصیص ارز به اضافه مهلت انقضاست." />
          </Col>
          {inputsData?.cfrFinancialCostTariffInt > 0 && (
            <>
              <Col className="rowContainer" md={24} xxl={8} xl={12}>
                <Input
                  name="carFinancialCostTariffInt"
                  value={inputsData?.cfrFinancialCostTariffInt}
                  readOnly
                  error={errors.carFinancialCostTariffInt}
                  validations={[["required"]]}
                  title="تعرفه هزینه مالی"
                />
                <Tooltip title="به صورت پیش‌ فرض مقدار آن خالی است. تنها در صورتی که نوع درخواست «کارمزد» یا «سود» انتخاب شود، به صورت خودکار مقداردهی می‌شود." />
              </Col>
              <Col className="rowContainer" md={24} xxl={16} xl={16}>
                <Input
                  name="carFinancialCostDescriptionStr"
                  onChange={handleChangeInputs}
                  value={inputsData?.carFinancialCostDescriptionStr}
                  title="شرح هزینه مالی"
                />
                <Tooltip title="به صورت پیش‌فرض مقدار آن خالی است. تنها در صورتی که فیلد «تعرفه هزینه مالی» مقدار داشته باشد، کاربر باید این فیلد را نیز پر کند." />
              </Col>
            </>
          )}
          {inputsData?.renewalRequestFeasibility && (
            <Col Col id={refreshReq} className="d-flex" xl={24}>
              <Checkbox
                name="appExt"
                value={inputsData?.appExt}
                style={{ paddingTop: "5px" }}
                onChange={handelCheckBox}
              >
                درخواست تمدید دارد
              </Checkbox>
              <Tooltip title="اگر کاربر نیاز به تمدید مهلت خرید ارز داشته باشد تیک تمدید را انتخاب می کند. درصورتیکه درخواست تمدید تائید گردد تاریخ تخصیص ارز بروزرسانی می گردد و طبع آن مهلت خرید ارز از روز تائید نهایی تمدید محاسبه می گردد." />
            </Col>
          )}
        </Row>
        <Row style={{ marginTop: "20px" }} justify="center">
          <Col lg={15}>
            <Col
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
              }}
              justify="start"
              xl={24}
            >
              <Button
                className="containerCol"
                backgroundColor={themeColors?.btn?.purple}
                onClick={(e) => {
                  e.preventDefault();
                  setErrors({});
                  setDocs([]);
                  setOpen(true);
                }}
              >
                <i class="fa fa-plus" />
                افزودن مستند
              </Button>
              <Tooltip title="درصورتیکه بانک عامل برای تائید درخواست نیاز به رویت مستندات داشته باشد، مستندات مورد نیاز توسط کاربر پیوست می گردد. ارسال مستندات همراه درخواست اجباری نیست و تنها در صورت درخواست بانک عامل صورت می گیرد. " />
            </Col>
            <Col id={tableDocId} xl={24}>
              <Table
                hasPageSizeCombo={false}
                dataSource={docsData}
                // dataSource={!open && docs?.length > 0 ? docs || [] : []}
                columns={columns}
                pagination={false}
              />
            </Col>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FormCurrAllocReqStep;

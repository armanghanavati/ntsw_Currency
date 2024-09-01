// صفحه جزئیات منشا ارز بانکی، غیربانکی، ثبت آماری و بدون انتقال ارز
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { Col, Row } from "antd";
import { Button, VerticalSpace, Input } from "../../../components";
import {
  CurrencyOriginsTable,
  ExcelExportButton,
  GoodsTable,
} from "../../../common";
import BillOfLading from "./BillOfLadding";
import Cancel from "./operation-buttons/Cancel";
import ShowTrackingCode from "./operation-buttons/ShowTrackingCode";
import DeclarationOfGoodsClearance from "./operation-buttons/DeclarationOfGoodsClearance";
import SendToDomesticTrade from "./operation-buttons/SendToDomesticTrade";
import modes from "../../../enums/modes";
import currencyOperationTypes from "../../../enums/currency-operation-types";
import themeColors from "../../../configs/theme";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import StringHelpers from "../../../configs/helpers/string-helpers";

const Details = ({ prfIsBankOPTny, returnPathname }) => {
  const dispatch = useDispatch();
  const { search, state } = useLocation();
  const { role, GUid, theme } = useSelector((state) => state);
  const history = useHistory();
  const [data, setData] = useState({});
  const [pcoVCodeInt, setPcoVCodeInt] = useState();
  const [tabledataSourceForBillOfLading, setTabledataSourceForBillOfLading] =
  useState([]);
  const [isBarfarabaran, setIsBarfarabaran] = useState(false);
  const [counter, setCounter] = useState(0);

  const [tabledataSourceForGoods, setTabledataSourceForGoods] = useState();
  const [
    tabledataSourceForCurrencyOrigins,
    setTabledataSourceForCurrencyOrigins,
  ] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const getPreCotageAllDetails = (handleGenerateExcel) => {
    dispatch(handleLoading(true));
    const postData = {
      startIndex:
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize,
      pageSize: tableParams.pagination.pageSize,
      pcoVCodeInt,
      prfIsBankOPTny,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url:
        prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.preCotageSG.getPreCotageAllInfo.url
          : endpoints.RestAPIs.preCotage.getPreCotageAllDetails.url,
      method:
        prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
          ? endpoints.RestAPIs.preCotageSG.getPreCotageAllInfo.method
          : endpoints.RestAPIs.preCotage.getPreCotageAllDetails.method,
      data: postData,
    })
      .then((res) => {
        let newBillOfLadingData;
        let newGoodsData;
        let newCurrencyOriginsData;
        let newData;
        if (prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration) {
          newGoodsData = res?.data?.PreCotageGoodsList?.map((goods) => ({
            ...goods,
            pfgHSCode: goods?.gdsHSCode,
            pfgmsuStr: goods?.pckNameStr,
            KalaName: goods?.pfgCommercialDescStr,
          }));
          newBillOfLadingData = res?.data?.PreCotageBOLList;
          newCurrencyOriginsData = res?.data?.PreCotageSourceList;
        } else {
          newGoodsData = res?.data?.PreCotageGoodsLst;
          newBillOfLadingData = res?.data?.PreCotageBOLLst;
          newCurrencyOriginsData = res?.data?.PreCotageSourceLst;
        }
        setTabledataSourceForBillOfLading(newBillOfLadingData || []);
        setIsBarfarabaran(
          newBillOfLadingData?.some((item) => item?.isBarfarabaran === true)
        );
        setTabledataSourceForGoods(newGoodsData || []);
        setTabledataSourceForCurrencyOrigins(newCurrencyOriginsData || []);
        setCounter(counter + 1)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res?.data?.goodsCount || 0,
          },
        });

        // pfggcdVCodeInt این فلگ اگر
        //صفر یا تعریف نشده باشد ترو بر میگرداند
        // در صورت ترو بودن این فلک دکمه ارسال به تجارت داخلی نباید نمایش داده شود
        let doNotShowSendToDomesticTradeButton = newGoodsData?.some(
          (item) => !item?.pfggcdVCodeInt
        );
        if (res?.data?.PreCotage) {
          newData = {
            ...res?.data?.PreCotage,
            pcoIDNoStr: res?.data?.PreCotage?.pcoprfVCodeInt,
            showSendToDomesticTradeButton: !doNotShowSendToDomesticTradeButton,
          };
        } else {
          newData = {
            ...res?.data,
            prfOrderNo: res?.data?.prfOrderNoStr,
            pcoIDNoStr: res?.data?.prfVCodeInt,
            pcoIranBorderStr: res?.data?.brdNameStr,
            pcoDestinationCustomStr: res?.data?.ctmNameStr,
            pcoTotalMny: res?.data?.pcoTotalAmount,
            pcoCountryStr: res?.data?.cnyNameStr,
            pcoBankAnswer: res?.data?.pcoCBIAnswer,
            showSendToDomesticTradeButton: !doNotShowSendToDomesticTradeButton,
          };
        }
        setData(newData);
        if (!!handleGenerateExcel) {
          if (newGoodsData?.length > 0) {
            const bodyData = newGoodsData?.map((item, index) => {
              return [
                index + 1,
                item.pcgpfgVCodeLng,
                item.pfgHSCode,
                item.KalaName,
                newData?.pcoIDNoStr,
                newData?.prfOrderNo,
                newData?.pcoVCodeInt,
                newData?.pcoDate,
                newData?.pcoSATAID,
                newData?.pcoStatusStr,
                item.pcgFOBPriceMny,
                item.pcgCountInt,
                prfIsBankOPTny ===
                currencyOperationTypes.StatisticalRegistration
                  ? item?.msuNameStr
                  : item?.pfgmsuStr,
                // item.pfgmsuStr,
                item.pcgNetWeight,
                item.pcgGrossWeightInt,
                item.pcgPackageNumber,
                prfIsBankOPTny ===
                currencyOperationTypes.StatisticalRegistration
                  ? item?.pfgmsuStr
                  : item?.PackageTypeStr,
                item?.pfggcdNameStr,
              ];
            });
            const headerRow = [
              "ردیف",
              "کد مجازی کالا",
              "شماره تعرفه",
              "شرح کالا",
              "شماره پرونده",
              prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
                ? "شماره ثبت آماری"
                : "شماره ثبت سفارش",
              "کد یکتای منشاارز",
              "تاریخ منشاارز",
              "شماره ساتا",
              "وضعیت منشا ارز",
              "مبلغ فوب کالا",
              "تعداد/ مقدار",
              "واحد اندازه گیری",
              "وزن خالص (کیلوگرم)",
              "وزن ناخالص (کیلوگرم)",
              "تعداد بسته",
              "نوع بسته بندی",
              "شناسه کالا",
            ];
            handleGenerateExcel(
              headerRow,
              bodyData,
              "NTSW_ExportCurrencyReques"
            );
          } else {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: "دیتایی برای دانلود وجود ندارد",
              })
            );
          }
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    const temp = atob(new URLSearchParams(search).get("key"));
    setPcoVCodeInt(Number(temp));
  }, []);

  useEffect(() => {
    if (pcoVCodeInt) {
      getPreCotageAllDetails();
    }
  }, [
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    pcoVCodeInt,
  ]);

  const backToPrevPage = () => {
    history.push({
      pathname: returnPathname,
      state,
    });
  };

  return (
    <>
      <Row>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={data?.pcoVCodeInt}
            title="کد یکتای منشا ارز"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={data?.pcoIDNoStr}
            title="شماره پرونده"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={data?.prfOrderNoStr || data?.prfOrderNo}
            title={`شماره ثبت ${
              prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
                ? "آماری"
                : "سفارش"
            }`}
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={data?.pcoCountryStr}
            title="کشور مبدا حمل"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={data?.pcoIranBorderStr}
            title="مرز ورودی"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={data?.pcoDestinationCustomStr}
            title="گمرک مقصد"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={StringHelpers.formatNumber(data?.pcoGoodsPriceMny)}
            title="مبلغ فوب"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={StringHelpers.formatNumber(data?.pcoFreightCostMny)}
            title="مبلغ حمل"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={StringHelpers.formatNumber(data?.pcoInspectionCostMny)}
            title="مبلغ بازرسی"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={StringHelpers.formatNumber(data?.pcoDiscountMny)}
            title="تخفیف"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={StringHelpers.formatNumber(data?.pcoOtherCostMny)}
            title="سایر هزینه‌ها"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input
            value={StringHelpers.formatNumber(data?.pcoTotalMny)}
            title="مبلغ کل"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Input value={data?.pcoDate} title="تاریخ منشا" readOnly={true} />
        </Col>
        {(prfIsBankOPTny !== currencyOperationTypes.StatisticalRegistration ||
          (prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration &&
            data?.pcoStatusTny === 3)) && (
          <Col sm={24} md={12} xl={8}>
            <Input value={data?.pcoSATAID} title="کد SATA" readOnly={true} />
          </Col>
        )}
        <Col sm={24} md={12} xl={8}>
          <Input
            value={data?.pcoStatusStr}
            title="وضعیت منشا"
            readOnly={true}
          />
        </Col>
        <Col sm={24} md={24} xl={24}>
          <Input
            value={data?.pcoBankAnswer}
            title="پاسخ بانک"
            readOnly={true}
            align="right"
            centerText={true}
          />
        </Col>
      </Row>
      {(prfIsBankOPTny === currencyOperationTypes.NonBank ||
        prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration) && (
        <>
          <VerticalSpace space="1rem" />
          <CurrencyOriginsTable
            mode={modes.Show}
            tabledataSource={tabledataSourceForCurrencyOrigins}
            currencyOperationType={prfIsBankOPTny}
          />
          <VerticalSpace space="1rem" />
        </>
      )}
      <BillOfLading
        isBarfarabaran={isBarfarabaran}
        dataSource={tabledataSourceForBillOfLading}
        currencyOperationType={prfIsBankOPTny}
      />
      <VerticalSpace space="2rem" />

      {tabledataSourceForGoods && (
        <div
          className={
            prfIsBankOPTny === currencyOperationTypes.NonBank ||
            prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
              ? "container-with-border"
              : ""
          }
        >
          <div
            className={
              prfIsBankOPTny === currencyOperationTypes.NonBank ||
              prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
                ? "container-with-border__title"
                : ""
            }
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            {prfIsBankOPTny === currencyOperationTypes.NonBank ||
            prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
              ? " جدول کالاهای منشا ارز"
              : ""}
          </div>

          <div
            className={
              prfIsBankOPTny === currencyOperationTypes.NonBank ||
              prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration
                ? "container-with-border__contain"
                : ""
            }
          >
            <Row>
              <Col sm={24} md={24} xl={24}>
                <ExcelExportButton getData={getPreCotageAllDetails} />
              </Col>
            </Row>
            <GoodsTable
              showIsIncludeTraceCodeColumn={
                data?.pcoStatusTny === 4 ||
                data?.pcoStatusTny === 5 ||
                data?.pcoStatusTny === 6
                  ? true
                  : false
              }
              tableParams={tableParams}
              setTableParams={setTableParams}
              tabledataSource={tabledataSourceForGoods}
              currencyOperationType={prfIsBankOPTny}
              counter={counter}
            />
          </div>
        </div>
      )}
      <div className="steps-action">
        {data?.pcoStatusTny != 9 &&
          prfIsBankOPTny !== currencyOperationTypes.StatisticalRegistration && (
            <Cancel
              pcoStatusTny={data?.pcoStatusTny}
              prfIsBankOPTny={prfIsBankOPTny}
              pcoVCodeInt={pcoVCodeInt}
              pcoIDNoStr={data?.prfOrderNo}
              isIncludeTraceCode={data?.isIncludeTraceCode}
            />
          )}
        {data?.isIncludeTraceCode == true && !!data?.trackingIDButtonName && (
          <ShowTrackingCode
            requestCode={data?.pcoIDNoStr}
            pcoVcodeInt={pcoVCodeInt}
            callBackUrl={prfIsBankOPTny}
            title={data?.trackingIDButtonName}
          />
        )}
        {(data?.pcoStatusTny == 3 ||
          data?.pcoStatusTny == 13 ||
          (prfIsBankOPTny !== currencyOperationTypes.StatisticalRegistration &&
            data?.pcoStatusTny == 14)) && (
          <DeclarationOfGoodsClearance
            getData={getPreCotageAllDetails}
            prfIsBankOPTny={prfIsBankOPTny}
            pcoVCodeInt={pcoVCodeInt}
            pcoIDNoStr={data?.pcoIDNoStr}
          />
        )}
        {((data?.pcoStatusTny == 11 &&
          data?.showSendToDomesticTradeButton &&
          prfIsBankOPTny !== currencyOperationTypes.StatisticalRegistration) ||
          ((prfIsBankOPTny === currencyOperationTypes.StatisticalRegistration ||
            prfIsBankOPTny === currencyOperationTypes.NonBank) &&
            data?.pcoStatusTny == 11)) && (
          <SendToDomesticTrade
            getData={getPreCotageAllDetails}
            prfIsBankOPTny={prfIsBankOPTny}
            pcoVCodeInt={pcoVCodeInt}
            pcoIDNoStr={data?.pcoIDNoStr}
          />
        )}
        <Button name="return" onClick={backToPrevPage}>
          <i class="fa fa-share" aria-hidden="true"></i>
          بازگشت
        </Button>
      </div>
    </>
  );
};

export default Details;

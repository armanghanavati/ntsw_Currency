// کامپوننت اینپوت ها جهت استفاده در ساخت و جزییات آگهی
import { Col, Radio, Row, theme } from "antd";
import React, { useEffect, useState } from "react";
import moment from "jalali-moment";
import {
  ComboBox,
  GuideBox,
  Input,
  VerticalSpace,
} from "../../../../components";

import { DatePickerWithTime } from "../../../../components/DatePickerWithTime";
import BankSelectInput from "../../../../common/create-new-announcement/BankSelectInput";
import Validation from "../../../../utils/Validation";
import { connect, useDispatch } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../../services/endpoints";
import {
  mapGUidStateToProps,
  mapRoleStateToProps,
  mapThemeStateToProps,
} from "../../../../state/mapStateToProps";
import themeColors from "../../../../configs/theme";

const AnnouncementInputs = ({
  role,
  GUid,
  theme,
  errors = {},
  inputsData,
  setErrors = () => {},
  setInputsData = () => {},
  setRemainPriceCurrencyType = () => {},
  readOnly = false,
}) => {
  const [options, setOptions] = useState({});

  const dispatch = useDispatch();
  const handleChangeInputs = (name, value, validationNameList = undefined) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1], item[2]));
        }
      });
    if (name === "advCurVCodeInt") {
      const selectedCurrencyObject = options.CurrencyType.find(
        (cur) => cur.curVCodeInt === value
      );
      if (!!selectedCurrencyObject) {
        setRemainPriceCurrencyType(selectedCurrencyObject);
      }
    }
    if (name === "name" && !isNaN(Number(value))) {
      return;
    }

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

  const handleChangeRadio = (e, id) => {
    setInputsData((prevState) => ({
      ...prevState,
      [e?.target?.name]: e?.target?.value,
    }));
  };

  const getCountryListByListNew = () => {
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.generalData.getCountryList.url,
      method: endpoints.RestAPIs.generalData.getCountryList.method,
    })
      .then((res) => {
        setOptions((options) => ({ ...options, countryList: res?.data }));
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  const getShowNameList = () => {
    axios({
      ...endpoints.RestAPIs.declaration.getADVShowName,
      data: {
        urlVCodeInt: role,
        ssdsshGUID: GUid,
      },
    }).then((res) => {
      if (res.data.ErrorCode === 0) {
        setOptions((options) => ({
          ...options,
          ShowName: res?.data.Result,
        }));
      } else {
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: res.data.ErrorDesc,
          })
        );
      }
    });
  };

  const getInrterNationalCurrencyListForNima = () => {
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getInrterNationalCurrencyListForNima
        .url,
      method:
        endpoints.RestAPIs.buyCurrency.getInrterNationalCurrencyListForNima
          .method,
    })
      .then((res) => {
        setOptions((options) => ({
          ...options,
          CurrencyType: res?.data,
        }));
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);

        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    if (!readOnly) {
      getInrterNationalCurrencyListForNima();
      getShowNameList();
      getCountryListByListNew();
    }
  }, []);

  const todayTemp = moment().format("jYYYY-jM-jD").split("-");

  const nextMonthTemp = moment()
    .add(35, "jDay")
    .format("jYYYY-jM-jD")
    .split("-");

  const today = {
    year: todayTemp[0],
    month: todayTemp[1],
    day: todayTemp[2],
  };

  const nextMonth = {
    year: nextMonthTemp[0],
    month: nextMonthTemp[1],
    day: nextMonthTemp[2],
  };
  return readOnly ? (
    <>
      <Row>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="ارز"
            maxWidth={150}
            value={inputsData?.curNameStr}
            readOnly={readOnly}
          />
        </Col>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="مبلغ"
            maxWidth={150}
            value={inputsData?.advAmount}
            readOnly={readOnly}
          />
        </Col>
        <Col sm={24} md={24} lg={8}>
          <Input
            value={inputsData.advUnitPriceMny}
            name="advUnitPriceMny"
            error={errors?.advUnitPriceMny}
            maxWidth={150}
            title={`نرخ فروش «${inputsData?.curNameStr}»`}
            readOnly={readOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="بانک"
            maxWidth={150}
            value={inputsData?.advBankName}
            readOnly={readOnly}
          />
        </Col>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="کشور"
            maxWidth={150}
            value={inputsData?.advCountryName}
            readOnly={readOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="شرایط انجام معامله و دریافت وجه ریالی (اختیاری )"
            maxWidth={250}
            value={inputsData?.advDealConditions}
            readOnly={readOnly}
            type="textarea"
          />
        </Col>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="نمایش نام در آگهی"
            maxWidth={150}
            value={inputsData?.advDisplayName}
            readOnly={readOnly}
          />
        </Col>
        <Col sm={24} md={24} lg={8}>
          <Radio.Group
            disabled={readOnly}
            defaultValue={2}
            value={inputsData?.advRialiConditions}
            style={{
              display: "flex",
              alignItems: "start",
            }}
            name={"advRialiConditions"}
            onChange={handleChangeRadio}
          >
            <Radio value={2}>
              <span style={{ color: themeColors[theme]?.text }}>
                حواله بعد از دریافت وجه ریالی صادر می شود.
              </span>
            </Radio>
            <Radio value={1}>
              <span style={{ color: themeColors[theme]?.text }}>
                حواله قبل از دریافت وجه ریالی صادر می شود.
              </span>
            </Radio>
          </Radio.Group>
          <VerticalSpace space="1rem" />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="تاریخ ثبت آگهی"
            maxWidth={150}
            value={moment
              .from(inputsData?.advInsertDate)
              .format("HH:mm - jYYYY/jMM/jDD")}
            readOnly={readOnly}
          />
        </Col>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="زمان پایان نمایش در تابلو"
            maxWidth={150}
            value={moment
              .from(inputsData?.advShowTime)
              .format("HH:mm - jYYYY/jMM/jDD")}
            readOnly={readOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="نام نماینده"
            maxWidth={150}
            value={inputsData?.advNameStr}
            readOnly={readOnly}
          />
        </Col>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="شماره تماس"
            maxWidth={150}
            value={inputsData?.advPhoneNumber}
            readOnly={readOnly}
          />
        </Col>
      </Row>
    </>
  ) : (
    <>
      <Row>
        <Col sm={24} md={12} lg={8}>
          <GuideBox
            error={errors?.advCurVCodeInt}
            tooltipTitle="نوع ارز مورد نظر را در این فیلد می توانید انتخاب کنید. نوع ارز انتخابی می تواند با نوع ارز ثبت شده در پروانه صادراتی شما متفاوت باشد. در صورت تفاوت ارز انتخابی با ارز پروانه، نرخ تبدیل بین ارز ها بر اساس نرخ تبدیل اعلام شده روزانه توسط بانک مرکزی محاسبه شده و در جدول فوق نمایش داده می شود."
            GuidedComponent={
              <ComboBox
                className={errors?.advCurVCodeInt?.length > 0 && "error"}
                defaultValue={inputsData?.advCurVCodeInt}
                options={options?.CurrencyType}
                name="advCurVCodeInt"
                onChange={handleChangeInputs}
                validations={[["required"]]}
                optionTitle="curNameStr"
                optionValue="curVCodeInt"
                maxWidth={120}
                width="100%"
                title="ارز"
                required
                disabled={readOnly}
              />
            }
          />
        </Col>
        <Col sm={24} md={12} lg={8}>
          <GuideBox
            error={errors?.advAmount}
            tooltipTitle="در این فیلد، مبلغی حداکثر تا 5 درصد بیشتر از «مجموع معادل مقدار مانده پروانه ها» می توانید وارد نمائید."
            GuidedComponent={
              <Input
                onChange={handleChangeInputs}
                value={inputsData.advAmount}
                name="advAmount"
                className={errors?.advAmount?.length > 0 && "error"}
                labelWidth="100%"
                validations={[["required"], ["newDecimal", 4]]}
                maxWidth={120}
                title="مبلغ"
                isCurrency
                type="number"
                required
                readOnly={readOnly}
              />
            }
          />
        </Col>
        <Col sm={24} md={12} lg={8}>
          <Input
            onChange={handleChangeInputs}
            value={inputsData.advUnitPriceMny}
            name="advUnitPriceMny"
            error={errors?.advUnitPriceMny}
            maxWidth={150}
            isCurrency
            title="نرخ پیشنهادی «به ریال»"
            readOnly={readOnly}
          />
        </Col>
        <Col sm={24} md={12} lg={8}>
          <BankSelectInput
            errors={errors}
            handleChangeInputs={handleChangeInputs}
            inputsData={inputsData}
            setErrors={setErrors}
            setInputsData={setInputsData}
            title="بانک"
          />
        </Col>
        <Col sm={24} md={12} lg={8}>
          <ComboBox
            defaultValue={inputsData.countryList}
            options={options.countryList}
            name="countryList"
            error={errors?.countryList}
            onChange={handleChangeInputs}
            optionTitle="CountryName"
            optionValue="CountryName"
            maxWidth={120}
            width="100%"
            title="کشور"
          />
        </Col>
        <Col sm={24} md={12} lg={8}>
          <DatePickerWithTime
            name="showInBoardTime"
            value={inputsData.showInBoardTime}
            onChange={handleChangeInputs}
            error={errors.showInBoardTime}
            validations={[
              ["required"],
              ["minimumDate", today],
              ["maximumDate", nextMonth],
            ]}
            showTime
            required
            minimumDate={moment().format("YYYY/MM/DD")}
            maximumDate={moment().add(31, "days").format("YYYY/MM/DD")}
            title="زمان پایان نمایش در تابلو"
          />
        </Col>

        <Col sm={24} md={24} lg={16}>
          <GuideBox
            tooltipTitle="دراین قسمت هر توضیحی که در خصوص شرایط انجام معامله دارید وتمایل دارید که به اطلاع متقاضیان برسد را درج نمایید."
            GuidedComponent={
              <Input
                maxWidth={120}
                name="description"
                value={inputsData.description}
                onChange={handleChangeInputs}
                title="توضیحات"
                type="textarea"
              />
            }
          />
        </Col>
        <Col sm={24} md={24} lg={8}>
          <Radio.Group
            disabled={readOnly}
            defaultValue={2}
            value={inputsData?.advRialiConditions}
            style={{
              display: "flex",
              alignItems: "start",
            }}
            name={"advRialiConditions"}
            onChange={handleChangeRadio}
          >
            <Radio value={2}>
              <span style={{ color: themeColors[theme]?.text }}>
                حواله بعد از دریافت وجه ریالی صادر می شود.
              </span>
            </Radio>
            <Radio value={1}>
              <span style={{ color: themeColors[theme]?.text }}>
                حواله قبل از دریافت وجه ریالی صادر می شود.
              </span>
            </Radio>
          </Radio.Group>
          <VerticalSpace space="1rem" />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={24} lg={12}>
          <GuideBox
            error={errors.ShowName}
            tooltipTitle="در این فیلد می توانید نظرتان را جهت نمایش نام خود در آگهی مشخص نمائید.
در صورت انتخاب گزینه آخر، نام مندرج در کارت بازرگانی شما (نام شرکت برای اشخاص حقوقی و نام بازرگان برای اشخاص حقیقی) در آگهی ثبت نشده و متقاضیان قادر به تشخیص مالک آگهی نخواهند بود.
"
            GuidedComponent={
              <ComboBox
                maxWidth={120}
                width="100%"
                name="ShowName"
                className={errors.ShowName?.length > 0 && "error"}
                options={options.ShowName}
                defaultValue={inputsData.ShowName}
                onChange={handleChangeInputs}
                optionTitle="descriptionPersian"
                validations={[["required"]]}
                optionValue="value"
                required
                title="نمایش نام در آگهی"
              />
            }
          />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} lg={8}>
          <GuideBox
            error={errors.name}
            tooltipTitle="در این فیلد می بایست نماینده ای را جهت تسهیل در فرآیند ارتباطی بین خودتان و متقاضیان معرفی نمایید."
            GuidedComponent={
              <Input
                labelWidth="100%"
                maxWidth={120}
                className={errors.name?.length > 0 && "error"}
                value={inputsData.name}
                validations={[["required"]]}
                type="text"
                onChange={handleChangeInputs}
                name="name"
                title="نام نماینده"
                required
              />
            }
          />
        </Col>
        <Col sm={24} md={12} lg={8}>
          <GuideBox
            error={errors.phoneNumber}
            tooltipTitle="دراین فیلد می بایست شماره تماس نماینده خود را وارد کنید. تلفنی که دراین قسمت وارد میشود به متقاضیان نمایش داده خواهد شد."
            GuidedComponent={
              <Input
                labelWidth="100%"
                maxWidth={120}
                value={inputsData.phoneNumber}
                type="number"
                className={errors.phoneNumber?.length > 0 && "error"}
                validations={[["required"], ["digits", 11]]}
                onChange={handleChangeInputs}
                name="phoneNumber"
                title="شماره تماس"
                required
              />
            }
          />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => {
  const states = {
    ...mapGUidStateToProps(state),
    ...mapRoleStateToProps(state),
    ...mapThemeStateToProps(state),
  };
  return states;
};

export default connect(mapStateToProps)(AnnouncementInputs);

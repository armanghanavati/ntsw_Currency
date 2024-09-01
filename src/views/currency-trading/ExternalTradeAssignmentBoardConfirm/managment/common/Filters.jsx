import { Col, Row } from "antd";
import React from "react";
import { Button, ComboBox, DatePicker, Input } from "../../../../../components";
import Validation from "../../../../../utils/Validation";

const ExternalTradeAssignmentBoardConfirmFilters = ({
  options,
  inputsData,
  setInputsData,
  errors,
  tableParams,
  setTableParams,
  getTable,
  setErrors,
}) => {
  const handleChangeInputs = (name, value, validationNameList, event) => {
    if (name === "DateF") {
      if (Validation.minimumDate(inputsData?.DateT, value) === true) {
        setErrors({
          ...errors,
          DateT: [],
        });
      } else {
        setErrors({
          ...errors,
          DateT: Validation.minimumDate(inputsData?.DateT, value),
        });
      }
    } else if (name === "DateT") {
      if (Validation.maximumDate(inputsData?.DateF, value) === true) {
        setErrors({
          ...errors,
          DateF: [],
        });
      } else {
        setErrors({
          ...errors,
          DateF: Validation.maximumDate(inputsData?.DateF, value),
        });
      }
    } else if (name === "payment") {
      setInputsData((prevstate) => {
        return {
          ...prevstate,
          [name]: value,
          price: undefined,
        };
      });
    }
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
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

  const search = (event) => {
    event.preventDefault();
    if (tableParams.pagination.current === 1) {
      getTable();
    } else {
      setTableParams({
        pagination: {
          current: 1,
          pageSize: 25,
        },
      });
    }
  };

  return (
    <>
      <Row>
        <Col sm={24} md={12} xl={6}>
          <ComboBox
            title="نوع ارز"
            name="currencyTypeTest"
            options={options?.CurrencyType}
            onChange={handleChangeInputs}
            optionTitle="curNameStr"
            optionValue="curVCodeInt"
            defaultValue={inputsData?.currencyTypeTest}
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <Input
            title="کد آگهی"
            name="advertisingCode"
            onChange={handleChangeInputs}
            value={inputsData?.advertisingCode}
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <DatePicker
            title="تاریخ ثبت آگهی از"
            name="DateF"
            onChange={handleChangeInputs}
            value={inputsData?.DateF}
            validations={[["maximumDate", inputsData?.DateT]]}
            error={errors?.DateF}
            type={"en"}
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <DatePicker
            title="تا تاریخ"
            name="DateT"
            onChange={handleChangeInputs}
            value={inputsData?.DateT}
            validations={[["minimumDate", inputsData?.DateF]]}
            error={errors?.DateT}
            type={"en"}
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <ComboBox
            title="نام کشور"
            name="countryName"
            onChange={handleChangeInputs}
            defaultValue={inputsData?.countryName}
            optionTitle="CountryName"
            optionValue="CountryCode"
            options={options?.countryList}
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <ComboBox
            title="وضعیت مبلغ"
            onChange={handleChangeInputs}
            name="payment"
            options={options?.paymentStatus}
            defaultValue={inputsData?.payment}
            optionTitle="descriptionPersian"
            optionValue="value"
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <Input
            title="مقدار مبلغ"
            onChange={handleChangeInputs}
            name="price"
            value={inputsData?.price}
            type="number"
            readOnly={!inputsData?.payment && "readOnly"}
          />
        </Col>
        <Col sm={24} md={12} xl={6}>
          <Button type="primary" onClick={(event) => search(event)}>
            <i class="fa fa-search" />
            جستجو
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ExternalTradeAssignmentBoardConfirmFilters;

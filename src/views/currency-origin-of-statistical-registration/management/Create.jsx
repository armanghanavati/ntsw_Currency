// باتن ایجاد منشا ارز ثبت آماری
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { Button, ComboBox } from "../../../components";
import { handleLoading } from "../../../state/action-creators";

import { Col, Row } from "antd";
import currencyOperationTypes from "../../../enums/currency-operation-types";
import canCreatePreCotageForStatisticsRegistration from "../../../common/currency-origin/can-create-pre-cotage-statistics-registration";

const Create = ({
  handleChangeInputs,
  orderRegistrationCode,
  orderRegistrationCodeOptions,
  setOrderRegistrationCodeOptions,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { role, GUid } = useSelector((state) => state);

  const getRegedOrderList = () => {
    dispatch(handleLoading(true));
    const postData = {
      prfVCodeInt: -1,
      prfIsBankOPTny: currencyOperationTypes.NoCurrencyTransfer,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotageSG.getRegedOrderList.url,
      method: endpoints.RestAPIs.preCotageSG.getRegedOrderList.method,
      data: postData,
    })
      .then((res) => {
        setOrderRegistrationCodeOptions(res.data.regredOrder);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    getRegedOrderList();
  }, []);

  const createNewCurrencyOrigin = (e) => {
    e?.preventDefault();
    const findePrfOrderNoStr = orderRegistrationCodeOptions.filter(
      (x) => x.prfVCodeInt === orderRegistrationCode
    );
    canCreatePreCotageForStatisticsRegistration(
      orderRegistrationCode,
      findePrfOrderNoStr[0]?.prfOrderNoStr,
      history
    );
  };

  return (
    <Row>
      <Col sm={24} md={12} xl={6}>
        <ComboBox
          title="کد ثبت سفارش"
          name="prfVCodeInt"
          onChange={handleChangeInputs}
          options={orderRegistrationCodeOptions}
          defaultValue={orderRegistrationCode}
          optionTitle="prfOrderNoStr"
          optionValue="prfVCodeInt"
          preventDefaultSelect={false}
        />
      </Col>
      <Col sm={24} md={12} xl={6}>
        <Button
          onClick={createNewCurrencyOrigin}
          disabled={!orderRegistrationCode}
        >
          <i class="fa fa-plus-square" aria-hidden="true"></i>
          ایجاد منشا ارز جدید
        </Button>
      </Col>
    </Row>
  );
};

export default Create;

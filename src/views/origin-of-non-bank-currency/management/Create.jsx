import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { Button, ComboBox } from "../../../components";
import { handleLoading } from "../../../state/action-creators";
import { Col, Row } from "antd";
import currencyOperationTypes from "../../../enums/currency-operation-types";
import { canSetPreCotageDisBank } from "../../../common";
import { v4 as uuidv4 } from "uuid";

const Create = ({ handleChangeInputs, orderRegistrationCode }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { role, GUid } = useSelector((state) => state);

  const [orderRegistrationCodeOptions, setOrderRegistrationCodeOptions] =
    useState([]);

  const getSabtSefareshDisBank = () => {
    dispatch(handleLoading(true));
    const postData = {
      prfVCodeInt: -1,
      prfIsBankOPTny: currencyOperationTypes.Bank,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.getSabtSefareshDisBank.url,
      method: endpoints.RestAPIs.preCotage.getSabtSefareshDisBank.method,
      data: postData,
    })
      .then((res) => {
        setOrderRegistrationCodeOptions(res.data.OrderList);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    getSabtSefareshDisBank();
  }, []);

  const createNewCurrencyOrigin = (e) => {
    e?.preventDefault();
    const findePrfOrderNoStr = orderRegistrationCodeOptions.filter(
      (x) => x.prfVCodeInt === orderRegistrationCode
    );
    const pgtGUID = uuidv4();
    canSetPreCotageDisBank(
      orderRegistrationCode,
      findePrfOrderNoStr[0]?.prfOrderNoStr,
      history,
      pgtGUID
    );
  };

  return (
    <>
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
    </>
  );
};

export default Create;

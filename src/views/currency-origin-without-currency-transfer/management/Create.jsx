import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { Button, ComboBox, Modal } from "../../../components";
import { handleLoading } from "../../../state/action-creators";

import { Col, Row } from "antd";
import currencyOperationTypes from "../../../enums/currency-operation-types";
import themeColors from "../../../configs/theme";
import { canSetPreCotageWithoutCurrencyTransfer } from "../../../common";
import { v4 as uuidv4 } from "uuid";

const Create = ({ handleChangeInputs, orderRegistrationCode }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { role, GUid } = useSelector((state) => state);

  const [orderRegistrationCodeOptions, setOrderRegistrationCodeOptions] =
    useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [errorDesc, setErrorDesc] = useState(false);

  const getBankiRegedOrderListWithoutCurrencyTransfer = () => {
    dispatch(handleLoading(true));
    const postData = {
      prfVCodeInt: -1,
      prfIsBankOPTny: currencyOperationTypes.NoCurrencyTransfer,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotage
        .getBankiRegedOrderListWithoutCurrencyTransfer.url,
      method:
        endpoints.RestAPIs.preCotage
          .getBankiRegedOrderListWithoutCurrencyTransfer.method,
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
    getBankiRegedOrderListWithoutCurrencyTransfer();
  }, []);

  const createNewCurrencyOrigin = (e) => {
    e?.preventDefault();
    const findePrfOrderNoStr = orderRegistrationCodeOptions.filter(
      (x) => x.prfVCodeInt === orderRegistrationCode
    );
    const pgtGUID = uuidv4();
    canSetPreCotageWithoutCurrencyTransfer(
      orderRegistrationCode,
      setErrorDesc,
      setIsShowModal,
      history,
      findePrfOrderNoStr[0]?.prfOrderNoStr,
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
      <Modal
        title="پیغام سیستم"
        open={isShowModal}
        setIsOpen={setIsShowModal}
        footer={[
          <Button
            backgroundColor={themeColors.btn.secondary}
            onClick={() => {
              const findePrfOrderNoStr = orderRegistrationCodeOptions.filter(
                (x) => x.prfVCodeInt === orderRegistrationCode
              );
              history.push(
                `/Users/AC/Currency/CreateCurrencyOriginWithoutCurrencyTransfer?key=${btoa(
                  findePrfOrderNoStr[0]?.prfOrderNoStr
                )}`
              );
            }}
          >
            ایجاد منشاء ارز
          </Button>,
          <Button
            backgroundColor={themeColors.btn.danger}
            onClick={() => setIsShowModal(false)}
          >
            بستن
          </Button>,
        ]}
        width={600}
      >
        <form style={{ padding: "0 20px" }}>
          <p className="text-medium">{errorDesc}</p>
        </form>
      </Modal>
    </>
  );
};

export default Create;

import Goods from "./goods/Goods";
import BillOfLading from ".//bill-of-lading/BillOfLading";
import MainInformation from ".//MainInformation";
import { Button, VerticalSpace } from "../../../components";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import themeColors from "../../../configs/theme";
import { AddingBillOfLadingByUser } from "../../../common";
import SendRequestButton from "./send-request/SendRequestButton";
import { Form } from "antd";
import currencyOperationTypes from "../../../enums/currency-operation-types";
import { handleMessageModal } from "../../../state/action-creators";
import { useDispatch } from "react-redux";
import useSendRequest from "./send-request/useSendRequest";

const Create = ({ currencyOperationType }) => {
  const { search, state } = useLocation();
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();

  const [prfOrderNoStr, setPrfOrderNoStr] = useState();
  const [prfVCodeInt, setPrfVCodeInt] = useState();
  const [inputsData, setInputsData] = useState({});
  const [tabledataSourceForBillOfLading, setTabledataSourceForBillOfLading] =
    useState([]);
  const [selectedRowKeysForGoods, setSelectedRowKeysForGoods] = useState([]);
  const [tabledataSourceForGoods, setTabledataSourceForGoods] = useState();
  const [backupTabledataSourceForGoods, setBackupTabledataSourceForGoods] =
    useState();
  const [errors, setErrors] = useState({});

  const [handleSendRequest] = useSendRequest({
    pgtGUID: state?.pgtGUID,
    currencyOperationType,
    prfOrderNoStr,
    prfVCodeInt,
    selectedRowKeysForGoods,
    tabledataSourceForGoods,
    backupTabledataSourceForGoods,
    tabledataSourceForBillOfLading,
    inputsData,
    form,
    errors,
    setErrors,
    hasShippingDocument: state?.hasShippingDocument,
  });

  useEffect(() => {
    if (!!state?.pgtGUID) {
      const splitSearch = search.split("=");
      const temp1 = splitSearch.indexOf("&key2");
      const temp2 = splitSearch.indexOf("?key");
      setPrfOrderNoStr(Number(atob(splitSearch[temp2 + 1])));
      setPrfVCodeInt(Number(atob(splitSearch[temp1 + 1])));
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:
            "شما به این صفحه دسترسی ندارید. لطفا از طریق دکمه ایجاد منشا ارز جدید وارد این صفحه شوید.",
        })
      );
      prev();
    }
  }, []);

  const prev = (event) => {
    switch (currencyOperationType) {
      case currencyOperationTypes.Bank:
        history.push("OriginOfBankCurrency");
        break;
      case currencyOperationTypes.NoCurrencyTransfer:
        history.push("CurrencyOriginWithoutCurrencyTransfer");
        break;
      case currencyOperationTypes.NonBank:
        history.push("OriginOfNonBankCurrency");
        break;
      default:
        event?.prreventDefault();
    }
  };

  const sendRequest = ({ setTableParams, tableParams }) => {
    handleSendRequest({
      setTableParams,
      tableParams,
    });
  };

  return (
    <>
      {currencyOperationType && (
        <>
          <MainInformation
            pgtGUID={state?.pgtGUID}
            currencyOperationType={currencyOperationType}
            prfOrderNoStr={prfOrderNoStr}
            prfVCodeInt={prfVCodeInt}
            inputsData={inputsData}
            setInputsData={setInputsData}
            errors={errors}
            setErrors={setErrors}
            hasShippingDocument={state?.hasShippingDocument}
          />
          <VerticalSpace space="1rem" />
          {inputsData?.isBarFarabaran ? (
            <BillOfLading
              pgtGUID={state?.pgtGUID}
              currencyOperationType={currencyOperationType}
              prfOrderNoStr={prfOrderNoStr}
              prfCustomInt={inputsData?.prfCustomInt}
              tabledataSource={tabledataSourceForBillOfLading}
              setTabledataSource={setTabledataSourceForBillOfLading}
            />
          ) : inputsData?.isBarFarabaran === false ? (
            <AddingBillOfLadingByUser
              pgtGUID={state?.pgtGUID}
              currencyOperationType={currencyOperationType}
              prfOrderNoStr={prfOrderNoStr}
              prfCustomInt={inputsData?.prfCustomInt}
              tabledataSource={tabledataSourceForBillOfLading}
              setTabledataSource={setTabledataSourceForBillOfLading}
            />
          ) : (
            <></>
          )}
          <VerticalSpace space="1rem" />
          {inputsData?.comboServiceHasCalled &&
            inputsData?.infoServiceHasCalled && (
              <Goods
                pgtGUID={state?.pgtGUID}
                currencyOperationType={currencyOperationType}
                prfVCodeInt={prfVCodeInt}
                setSelectedRowKeys={setSelectedRowKeysForGoods}
                selectedRowKeys={selectedRowKeysForGoods}
                tabledataSource={tabledataSourceForGoods}
                setTabledataSource={setTabledataSourceForGoods}
                setBackupTabledataSource={setBackupTabledataSourceForGoods}
                form={form}
                inputsData={inputsData}
                setInputsData={setInputsData}
                sendRequest={sendRequest}
              />
            )}
          <div className="steps-action">
            <Button onClick={prev} backgroundColor={themeColors.btn.danger}>
              <i class="fa fa-share" aria-hidden="true"></i>
              بازگشت
            </Button>
            <SendRequestButton sendRequest={sendRequest} />
          </div>
        </>
      )}
    </>
  );
};

export default Create;

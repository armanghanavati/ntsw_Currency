//TODO: تکمیل نشده
import { handleLoading, handleMessageModal } from "../../../../state/action-creators";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { Form } from "antd";
import {
  CurrencyOriginsTable,
  DataForAddItemToCurrencyOriginsTable,
  AddingBillOfLadingByUser,
  canSetPreCotageDisBank,
} from "../../../../common";
import { Button, VerticalSpace } from "../../../../components";
import Inquiry from "../../../currency-origin-of-statistical-registration/create/common/Inquiry";
import themeColors from "../../../../configs/theme";
// import SubmitData from "./common/SubmitData";
import currencyOperationTypes from "../../../../enums/currency-operation-types";

const Step1 = ({ prfVCodeInt, prfOrderNoStr, inputsData, setInputsData }) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const {
    role,
    GUid,
    stepsOfCreatePage: { ONBC },
  } = useSelector((state) => state);
  const [form] = Form.useForm();
  const history = useHistory();

  const [
    tableDataSourceForCurrencyOrigins,
    setTableDataSourceForCurrencyOrigins,
  ] = useState([]);
  const [tableDataSourceForBillOfLading, setTableDataSourceForBillOfLading] =
    useState([]);
  const [errors, setErrors] = useState({});

  const getProformaInfoForCreatePreCotage = () => {
    dispatch(handleLoading(true));
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      prfVCodeInt,
    };
    axios({
      url: endpoints.RestAPIs.preCotageSG.getProformaInfoForCreatePreCotage.url,
      method:
        endpoints.RestAPIs.preCotageSG.getProformaInfoForCreatePreCotage.method,
      data: postData,
    })
      .then((res) => {
        dispatch(handleLoading(false));
        if (res?.data?.ErrorCode === 0) {
          setInputsData({
            prfOrderNoStr: res?.data?.prfOrderNoStr,
            curNameStr: res?.data?.curNameStr,
            prfTotalPriceMny: res?.data?.prfTotalPriceMny,
            prfcurVCodeInt: res?.data?.prfcurVCodeInt,
          });
        }else{
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        (inputsData[item] === 0 ||
          inputsData[item] === undefined ||
          inputsData[item] === null ||
          JSON.stringify(inputsData[item])?.trim() === "") &&
        item !== undefined
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setErrors(err);
    return err;
  };

  const permitForSkip = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (var key in error) {
      if (error[key]?.length > 0) {
        if (inputsName?.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    setInputsData({
      ...inputsData,
      prfTotalPriceMny: inputsData?.bolTransitSettlementAmountLng,
    });
  }, [inputsData?.bolTransitSettlementAmountLng]);

  return (
    <>
      <DataForAddItemToCurrencyOriginsTable
        inputsData={inputsData}
        setInputsData={setInputsData}
        errors={errors}
        setErrors={setErrors}
        prfVCodeInt={prfVCodeInt}
        prfOrderNoStr={prfOrderNoStr}
        form={form}
        currencyOperationType={currencyOperationTypes.NonBank}
        showHTML={ONBC === 1}
      />
      {ONBC === 1 && (
        <>
          <VerticalSpace space="10px" />

          <Inquiry
            prfOrderNoStr={prfOrderNoStr}
            inputsData={inputsData}
            setInputsData={setInputsData}
            setErrors={setErrors}
            permitForSkip={permitForSkip}
            setTableDataSourceForCurrencyOrigins={
              setTableDataSourceForCurrencyOrigins
            }
            currencyOperationType={currencyOperationTypes.NonBank}
            form={form}
          />
          <VerticalSpace space="10px" />
          <CurrencyOriginsTable
            tabledataSource={tableDataSourceForCurrencyOrigins}
          />
          <VerticalSpace space="10px" />
        </>
      )}
    </>
  );
};

export default Step1;

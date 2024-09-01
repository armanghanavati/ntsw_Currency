//TODO:توسعه این صفحه متوقف شده است و کدها تکمیل نیست
import { Button } from "../../../components";
import { useEffect } from "react";
import { useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import themeColors from "../../../configs/theme";
import { Form } from "antd";
import { StepsNavigationBar } from "../../../common";
import Step0 from "./step0/Step0";
import Step1 from "./step1/Step1";
import {
  handleMessageModal,
  handleStepsOfCreatePage,
} from "../../../state/action-creators";
import { useDispatch, useSelector } from "react-redux";
import SubmitData from "./SubmitData";

const steps = [
  {
    title: "تعیین منشا ارز",
  },
  {
    title: "ثبت اطلاعات منشا ارز",
  },
];

const Create = () => {
  const {
    stepsOfCreatePage: { ONBC },
  } = useSelector((state) => state);
  const { search, state } = useLocation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();

  const [prfOrderNoStr, setPrfOrderNoStr] = useState();
  const [prfVCodeInt, setPrfVCodeInt] = useState();
  const [inputsData, setInputsData] = useState({});
  const [tabledataSourceForBillOfLading, setTabledataSourceForBillOfLading] =
    useState([]);
  const [selectedRowKeysForGoods, setSelectedRowKeysForGoods] = useState([]);
  const [tabledataSourceForGoods, setTabledataSourceForGoods] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!!state?.pgtGUID) {
      const splitSearch = search.split("=");
      const temp1 = splitSearch.indexOf("&key2");
      const temp2 = splitSearch.indexOf("?key");
      setPrfOrderNoStr(Number(atob(splitSearch[temp2 + 1])));
      setPrfVCodeInt(Number(atob(splitSearch[temp1 + 1])));
      dispatch(
        handleStepsOfCreatePage({
          ONBC: 0,
          hasAccessToStep: false,
          disabledStepsList: [],
        })
      );
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:
            "شما به این صفحه دسترسی ندارید. لطفا از طریق دکمه ایجاد منشا ارز جدید وارد این صفحه شوید.",
        })
      );
      history.push("OriginOfNonBankCurrency");
    }
  }, []);

  const prev = (event) => {
    event?.preventDefault();
    switch (ONBC) {
      case 0:
        history.push("OriginOfNonBankCurrency");
        break;
      case 1:
        dispatch(handleStepsOfCreatePage({ ONBC: 0 }));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <StepsNavigationBar steps={steps} declarationType={"ONBC"} />
      {!!state?.pgtGUID && (
        <>
          <Step0
            prfOrderNoStr={prfOrderNoStr}
            prfVCodeInt={prfVCodeInt}
            pgtGUID={state?.pgtGUID}
            form={form}
            inputsData={inputsData}
            setInputsData={setInputsData}
            errors={errors}
            setErrors={setErrors}
            tabledataSourceForBillOfLading={tabledataSourceForBillOfLading}
            setTabledataSourceForBillOfLading={
              setTabledataSourceForBillOfLading
            }
            tabledataSourceForGoods={tabledataSourceForGoods}
            setTabledataSourceForGoods={setTabledataSourceForGoods}
            selectedRowKeysForGoods={selectedRowKeysForGoods}
            setSelectedRowKeysForGoods={setSelectedRowKeysForGoods}
          />

          <Step1
            prfVCodeInt={prfVCodeInt}
            prfOrderNoStr={prfOrderNoStr}
            inputsData={inputsData}
            setInputsData={setInputsData}
          />
        </>
      )}
      <div className="steps-action">
        <Button onClick={prev} backgroundColor={themeColors.btn.danger}>
          <i class="fa fa-share" aria-hidden="true"></i>
          بازگشت
        </Button>
        <SubmitData
          pgtGUID={state?.pgtGUID}
          prfOrderNoStr={prfOrderNoStr}
          prfVCodeInt={prfVCodeInt}
          selectedRowKeysForGoods={selectedRowKeysForGoods}
          tableDataSourceForGoods={tabledataSourceForGoods}
          tableDataSourceForBillOfLading={tabledataSourceForBillOfLading}
          inputsData={inputsData}
          setInputsData={setInputsData}
          form={form}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
    </>
  );
};

export default Create;

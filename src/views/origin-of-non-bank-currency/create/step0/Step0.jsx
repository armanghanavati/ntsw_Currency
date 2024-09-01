import Goods from "../../../../common/currency-origin/create/goods/Goods";
import MainInformation from "../../../../common/currency-origin/create/MainInformation";
import { VerticalSpace } from "../../../../components";
import currencyOperationTypes from "../../../../enums/currency-operation-types";
import { useSelector } from "react-redux";
import { AddingBillOfLadingByUser } from "../../../../common";

const Step0 = ({
  prfOrderNoStr,
  prfVCodeInt,
  pgtGUID,
  form,
  inputsData,
  setInputsData,
  errors,
  setErrors,
  tabledataSourceForBillOfLading,
  setTabledataSourceForBillOfLading,
  tabledataSourceForGoods,
  setTabledataSourceForGoods,
  selectedRowKeysForGoods,
  setSelectedRowKeysForGoods,
}) => {
  const {
    stepsOfCreatePage: { ONBC },
  } = useSelector((state) => state);

  return (
    <>
      <MainInformation
        pgtGUID={pgtGUID}
        currencyOperationType={currencyOperationTypes.NonBank}
        prfOrderNoStr={prfOrderNoStr}
        prfVCodeInt={prfVCodeInt}
        inputsData={inputsData}
        setInputsData={setInputsData}
        errors={errors}
        setErrors={setErrors}
        hasShippingDocument={false}
        showHTML={ONBC === 0}
      />
      {ONBC === 0 && (
        <>
          <VerticalSpace space="1rem" />
          <AddingBillOfLadingByUser
            pgtGUID={pgtGUID}
            currencyOperationType={currencyOperationTypes.NonBank}
            prfOrderNoStr={prfOrderNoStr}
            prfCustomInt={inputsData?.prfCustomInt}
            tabledataSource={tabledataSourceForBillOfLading}
            setTabledataSource={setTabledataSourceForBillOfLading}
          />
          <VerticalSpace space="1rem" />
        </>
      )}

      <Goods
        pgtGUID={pgtGUID}
        currencyOperationType={currencyOperationTypes.NonBank}
        prfVCodeInt={prfVCodeInt}
        setSelectedRowKeys={setSelectedRowKeysForGoods}
        selectedRowKeys={selectedRowKeysForGoods}
        tabledataSource={tabledataSourceForGoods}
        setTabledataSource={setTabledataSourceForGoods}
        form={form}
        setInputsData={setInputsData}
        showHTML={ONBC === 0}
      />
    </>
  );
};

export default Step0;

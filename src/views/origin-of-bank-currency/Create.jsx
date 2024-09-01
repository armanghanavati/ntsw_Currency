import { CreateCurrencyOrigin } from "../../common";
import currencyOperationTypes from "../../enums/currency-operation-types";

const Create = () => {
  return (
    <CreateCurrencyOrigin currencyOperationType={currencyOperationTypes.Bank} />
  );
};

export default Create;

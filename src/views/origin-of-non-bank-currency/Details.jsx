import currencyOperationTypes from "../../enums/currency-operation-types";
import { CurrencyOriginDetails } from "../../common";
const Details = () => {
  return (
    <CurrencyOriginDetails
      returnPathname="/Users/AC/Currency/OriginOfNonBankCurrency"
      prfIsBankOPTny={currencyOperationTypes.NonBank}
    />
  );
};

export default Details;

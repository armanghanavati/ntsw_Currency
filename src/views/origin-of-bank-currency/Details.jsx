import currencyOperationTypes from "../../enums/currency-operation-types";
import { CurrencyOriginDetails } from "../../common";
const Details = () => {
  return (
    <CurrencyOriginDetails
      returnPathname="/Users/AC/Currency/OriginOfBankCurrency"
      prfIsBankOPTny={currencyOperationTypes.Bank}
    />
  );
};

export default Details;

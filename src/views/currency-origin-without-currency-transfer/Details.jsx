import currencyOperationTypes from "../../enums/currency-operation-types";
import { CurrencyOriginDetails } from "../../common";
const Details = () => {
  return (
    <CurrencyOriginDetails
      returnPathname="/Users/AC/Currency/CurrencyOriginWithoutCurrencyTransfer"
      prfIsBankOPTny={currencyOperationTypes.NoCurrencyTransfer}
    />
  );
};

export default Details;

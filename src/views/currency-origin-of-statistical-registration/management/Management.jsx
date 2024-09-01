import React, { useState } from "react";
import Validation from "../../../utils/Validation";
import { ManagementForCurrencyOrigin } from "../../../common";
import Create from "./Create";
import currencyOperationTypes from "../../../enums/currency-operation-types";

const Management = () => {
  const [filters, setFilters] = useState({});
  const [orderRegistrationCodeOptions, setOrderRegistrationCodeOptions] =
    useState([]);

  // این فانکشن فقط برای کد ثبت سفارش استفاده شده
  const handleChangeInputs = (_, value, validationNameList) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    setFilters((prevstate) => {
      return {
        ...prevstate,
        prfOrderNoStr: value
          ? orderRegistrationCodeOptions.find(
              (option) => option.prfVCodeInt === value
            )?.prfOrderNoStr
          : undefined,
        prfVCodeInt: value,
      };
    });
  };

  return (
    <ManagementForCurrencyOrigin
      filters={filters}
      setFilters={setFilters}
      currencyOperationType={currencyOperationTypes.StatisticalRegistration}
    >
      <Create
        handleChangeInputs={handleChangeInputs}
        orderRegistrationCode={filters?.prfVCodeInt}
        orderRegistrationCodeOptions={orderRegistrationCodeOptions}
        setOrderRegistrationCodeOptions={setOrderRegistrationCodeOptions}
      />
    </ManagementForCurrencyOrigin>
  );
};

export default Management;

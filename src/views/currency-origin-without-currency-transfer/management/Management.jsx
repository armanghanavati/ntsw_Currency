//------------> منوی منشا ارز > زیرمنوی منشا ارز بدون انتقال ارز  <------------

import React, { useState } from "react";
import Validation from "../../../utils/Validation";
import { ManagementForCurrencyOrigin } from "../../../common";
import Create from "./Create";
import currencyOperationTypes from "../../../enums/currency-operation-types";

const Management = () => {
  const [filters, setFilters] = useState({});

  const handleChangeInputs = (name, value, validationNameList) => {
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
        [name]: value,
      };
    });
  };

  return (
    <ManagementForCurrencyOrigin
      filters={filters}
      setFilters={setFilters}
      currencyOperationType={currencyOperationTypes.NoCurrencyTransfer}
    >
      <Create
        handleChangeInputs={handleChangeInputs}
        orderRegistrationCode={filters?.prfVCodeInt}
      />
    </ManagementForCurrencyOrigin>
  );
};

export default Management;

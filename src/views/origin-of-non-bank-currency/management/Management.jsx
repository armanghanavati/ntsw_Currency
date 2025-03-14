//------------> منوی منشا ارز > زیرمنوی منشا ارز غیر بانکی  <------------

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
      currencyOperationType={currencyOperationTypes.NonBank}
    >
      <Create
        handleChangeInputs={handleChangeInputs}
        orderRegistrationCode={filters?.prfVCodeInt}
      />
    </ManagementForCurrencyOrigin>
  );
};

export default Management;

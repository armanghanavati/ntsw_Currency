import { VerticalSpace } from "../../../components";
import { BillOfLadingTable } from "../../../common";
import currencyOperationTypes from "../../../enums/currency-operation-types";
import { useSelector } from "react-redux";
import themeColors from "../../../configs/theme";

const BillOfLadding = ({
  isBarfarabaran,
  loading,
  dataSource,
  currencyOperationType,
}) => {
  const { theme } = useSelector((state) => state);

  return (
    <div
      className={`${
        currencyOperationType === currencyOperationTypes.NonBank ||
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? "container-with-border"
          : "bill-of-lading"
      }`}
    >
      {(currencyOperationType === currencyOperationTypes.NonBank ||
        currencyOperationType ===
          currencyOperationTypes.StatisticalRegistration) && (
        <div
          className="container-with-border__title"
          style={{
            backgroundColor: themeColors[theme]?.bg,
          }}
        >
          جدول بارنامه های منشاهای ارز
        </div>
      )}
      {currencyOperationType === currencyOperationTypes.NonBank ||
        (currencyOperationType ===
          currencyOperationTypes.StatisticalRegistration && (
          <VerticalSpace space="0.5rem" />
        ))}
      <div
        className={`${
          currencyOperationType === currencyOperationTypes.NonBank ||
          currencyOperationType ===
            currencyOperationTypes.StatisticalRegistration
            ? "container-with-border__contain"
            : "bill-of-lading--table"
        }`}
      >
        <BillOfLadingTable
          loading={loading}
          dataSource={dataSource}
          isBarFarabaran={isBarfarabaran}
        />
      </div>
    </div>
  );
};

export default BillOfLadding;

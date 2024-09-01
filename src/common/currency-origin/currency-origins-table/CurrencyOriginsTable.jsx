import { Table } from "../../../components";
import modes from "../../../enums/modes";
import { Button } from "../../../components";
import themeColors from "../../../configs/theme";
import { useSelector } from "react-redux";
import currencyOperationTypes from "../../../enums/currency-operation-types";
import StringHelpers from "../../../configs/helpers/string-helpers";

const CurrencyOriginsTable = ({
  tabledataSource = [],
  setTableDataSource,
  loading,
  currencyOperationType = currencyOperationTypes.NonBank,
  mode = modes.Add,
}) => {
  const { theme } = useSelector((state) => state);
  const columns = [
    {
      title: "نوع قلم",
      dataIndex:
        currencyOperationType === currencyOperationTypes.StatisticalRegistration
          ? "pcsSourceTypeStr"
          : "manufactureCountry",
      align: "center",
    },
    {
      title: "مبلغ  ارزی",
      align: "center",
      render: (_, { pcsAmountLng }) => (
        <>{StringHelpers.formatNumber(pcsAmountLng)}</>
      ),
    },
    {
      title: "نوع ارز",
      align: "center",
      render: (_, { currencyTypeTitle, curNameStr }) => (
        <>
          {currencyOperationType ===
          currencyOperationTypes.StatisticalRegistration
            ? curNameStr
            : currencyTypeTitle?.curNameStr}
        </>
      ),
    },
    ...(currencyOperationType ===
      currencyOperationTypes.StatisticalRegistration && mode !== modes.Show
      ? [
          {
            title: "مبلغ معادل ثبت آماری",
            // dataIndex: "convertCurrencyAmount",
            align: "center",
            render: (_, { convertCurrencyAmount }) => (
              <>{StringHelpers.formatNumber(convertCurrencyAmount)}</>
            ),
          },
        ]
      : []),
    ...(currencyOperationType ===
      currencyOperationTypes.StatisticalRegistration && mode === modes.Show
      ? []
      : [
          {
            title: "شماره رسید سنا",
            dataIndex: "manufactureCountry",
            align: "center",
          },
        ]),
    {
      title: "شماره کوتاژ",
      dataIndex: "pcsExportCotageID",
      align: "center",
    },
    {
      title: "سال ترخیص",
      dataIndex: "pcsReleaseYearStr",
      align: "center",
    },
    {
      title:
        currencyOperationType ===
          currencyOperationTypes.StatisticalRegistration && mode === modes.Show
          ? "گمرک"
          : "کد گمرک",
      dataIndex: "ctmNameStr",
      align: "center",
    },
    ...(currencyOperationType ===
      currencyOperationTypes.StatisticalRegistration && mode === modes.Show
      ? [
          {
            title: "وضعیت",
            dataIndex: "pcsStatusStr",
            align: "center",
          },
        ]
      : [
          {
            title: "توضیحات بازرگان",
            dataIndex: "pcsMerchantDescStr",
            align: "center",
          },
          {
            title: "مهلت پرداخت",
            dataIndex: "manufactureCountry",
            align: "center",
          },
        ]),
    ...(currencyOperationType === currencyOperationTypes.NonBank &&
    mode === modes.Show
      ? [
          {
            title: "وضعیت",
            dataIndex: "pcsStatusStr",
            align: "center",
          },
          {
            title: "توضیحات",
            dataIndex: "pcsMerchantDescStr",
            align: "center",
          },
          {
            title: "",
            align: "center",
            render: (item, record, index) => (
              <span className="flex-order-row">
                <Button
                  name="getTable"
                  onClick={(event) => handleDelete(event, index)}
                  type="secondary"
                  backgroundColor={themeColors.btn.purple}
                >
                  <i class="fa fa-plus" />
                  ثبت پرداخت
                </Button>
              </span>
            ),
          },
        ]
      : []),
    ...(mode !== modes.Show
      ? [
          {
            title: "حذف",
            dataIndex: "manufactureCountry",
            align: "center",
            render: (_, {}, index) => (
              <span className="flex-order-row">
                <Button
                  name="getTable"
                  onClick={(event) => handleDelete(event, index)}
                  type="secondary"
                  backgroundColor={themeColors.btn.danger}
                >
                  <i class="fa fa-times" aria-hidden="true"></i>
                  حذف
                </Button>
              </span>
            ),
          },
        ]
      : []),
  ];

  const handleDelete = (event, index) => {
    event?.preventDefault();
    const newData = tabledataSource;
    newData.splice(index, 1);
    setTableDataSource([...newData]);
  };

  return (
    <div
      // className='contaner-with-border container-with-border__contain'
      className={`container-with-border ${
        mode !== modes.Show ? "container-with-border__contain" : ""
      }`}
    >
      {mode === modes.Show && (
        <div
          className="container-with-border__title"
          style={{
            backgroundColor: themeColors[theme]?.bg,
          }}
        >
          جدول منشاهای ارز
        </div>
      )}
      <div
        className={`${
          mode === modes.Show ? "container-with-border__contain" : ""
        }`}
      >
        <Table
          hasPageSizeCombo={false}
          dataSource={tabledataSource}
          columns={columns}
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default CurrencyOriginsTable;

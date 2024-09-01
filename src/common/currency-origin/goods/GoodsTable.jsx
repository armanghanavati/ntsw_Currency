import { Form } from "antd";
import { Table, InputNumberWithoutLabel } from "../../../components";
import StringHelpers from "../../../configs/helpers/string-helpers";
import modes from "../../../enums/modes";
import Guide from "./Guide";
import { useState } from "react";
import { useEffect } from "react";
import currencyOperationTypes from "../../../enums/currency-operation-types";

const GoodsTable = ({
  tableParams,
  setTableParams,
  tabledataSource = [],
  setTableDataSource = () => {},
  showId,
  loading,
  selectedRowKeys = [],
  setSelectedRowKeys,
  mode = modes.Show,
  rowKey = "id",
  form,
  setTotalOfPcgFOBPriceMny,
  counter,
  showIsIncludeTraceCodeColumn = false,
  sendRequest,
  currencyOperationType,
}) => {
  const [temporaryTabledataSource, setTemporaryTabledataSource] =
    useState(tabledataSource);

  useEffect(() => {
    setTemporaryTabledataSource(tabledataSource);
  }, [counter]);

  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (_, {}, index) => (
        <>
          {index +
            1 +
            (Number(tableParams?.pagination?.current || 1) - 1) *
              Number(tableParams.pagination.pageSize || 1)}
        </>
      ),
    },
    {
      title: () => {
        return (
          <Guide
            mode={mode}
            headerTitle="کد مجازی کالا"
            tooltipTitle="کد یکتای کالا را نشان می دهد. به کمک این کد کالا های پرونده از هم تفکیک می گردند."
          />
        );
      },
      align: "center",
      render: (_, { pcgpfgVCodeLng, pfgVCodeLng }) => (
        <div className="flex-order-row">
          {mode === modes.Show ? pcgpfgVCodeLng : pfgVCodeLng}
        </div>
      ),
    },
    ...(showIsIncludeTraceCodeColumn
      ? [
          {
            title: "مشمول شناسه رهگیری میشود؟",
            align: "center",
            render: (
              _,
              { gcdIsIncludeTraceCode, gcdIsIncludeTraceCodeBoolean }
            ) => (
              <>
                {currencyOperationType !==
                  currencyOperationTypes.StatisticalRegistration &&
                gcdIsIncludeTraceCode
                  ? "بله"
                  : currencyOperationType ===
                      currencyOperationTypes.StatisticalRegistration &&
                    gcdIsIncludeTraceCodeBoolean
                  ? "بله"
                  : "خیر"}
              </>
            ),
          },
        ]
      : []),
    {
      title: () => {
        return (
          <Guide
            mode={mode}
            headerTitle="کد تعرفه"
            tooltipTitle="بر اساس کد تعرفه درج شده در کالاهای پرونده تکمیل شده است."
          />
        );
      },
      align: "center",
      render: (_, { pfgHSCode, gdsHSCode }) => (
        <div className="flex-order-row">
          {mode === modes.Show ? pfgHSCode : gdsHSCode}
        </div>
      ),
    },
    {
      title: () => {
        return (
          <Guide
            mode={mode}
            headerTitle="شرح تجاری فارسی"
            tooltipTitle="بر اساس شرح تجاری فارسی درج شده در کالاهای پرونده تکمیل شده است."
          />
        );
      },
      align: "center",
      render: (_, { KalaName, gdsHSNameStr }) => (
        <div className="flex-order-row">
          {mode === modes.Show ? KalaName : gdsHSNameStr}
        </div>
      ),
    },
    {
      title: () => {
        return (
          <Guide
            mode={mode}
            headerTitle="قیمت واحد"
            tooltipTitle="  از تقسیم مبلغ فوب بر مقدار/تعداد درج شده در پرونده محاسبه شده است."
          />
        );
      },
      dataIndex: "pfgUnitPriceMny",
      align: "center",
    },
    {
      title: () => {
        return (
          <Guide
            mode={mode}
            headerTitle="وزن ناخالص "
            tooltipTitle="برای هر کالا بر اساس وزن ناخالص درج شده در اسناد این محموله بر حسب کیلوگرم تا سقف 5 درصد بیشتر از وزن ناخالص درج شده در پرونده در مجموع منشأ ارزهای آن وارد کنید."
            isRequired={true}
          />
        );
      },
      align: "center",
      render: (_, record, index) => {
        const {
          pcgGrossWeightInt,
          remainingGrossWeight,
          pfgGrossWeightAsKGDbl,
          pfgNetWeightAsKGDbl,
        } = record;
        const id = record[rowKey];
        return (
          <>
            <Form form={form}>
              <Form.Item
                name={`pfgGrossWeightAsKGDbl-${index}`}
                initialValue={pfgGrossWeightAsKGDbl}
                rules={[
                  {
                    required: selectedRowKeys.includes(id) ? true : false,
                    message: "پر کردن این فیلد اجباریست.",
                  },
                  () => ({
                    validator(_, value) {
                      if (
                        !selectedRowKeys.includes(id) ||
                        !pfgNetWeightAsKGDbl ||
                        !value ||
                        Number(
                          StringHelpers.unFormatMoney(pfgNetWeightAsKGDbl)
                        ) <= Number(StringHelpers.unFormatMoney(value))
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "مقدار مجاز وزن ناخالص بیشتر یا مساوی وزن خالص می‌باشد"
                        )
                      );
                    },
                  }),
                  () => ({
                    validator(_, value) {
                      const unformattedValue = +StringHelpers.unFormatMoney(
                        value || 0
                      );
                      if (
                        !selectedRowKeys.includes(id) ||
                        (unformattedValue > 0 &&
                          !unformattedValue?.toString().includes(".")) ||
                        (unformattedValue >= 0 &&
                          unformattedValue?.toString().includes(".") &&
                          unformattedValue?.toString()?.split(".")[1]?.length <
                            11)
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "عدد صحیح بزرگتر از صفر یا اعشاری(تا ده رقم اعشار) وارد نمایید."
                        )
                      );
                    },
                  }),
                ]}
              >
                <span className="flex-order-row">
                  <InputNumberWithoutLabel
                    isCurrency={true}
                    value={
                      mode === modes.Show
                        ? pcgGrossWeightInt
                        : pfgGrossWeightAsKGDbl
                    }
                    placeholder={remainingGrossWeight}
                    onChange={(value) =>
                      handleChangeInputsOfTable(
                        value,
                        index,
                        "pfgGrossWeightAsKGDbl"
                      )
                    }
                    disabled={
                      !!showId
                        ? true
                        : !selectedRowKeys.includes(id)
                        ? true
                        : false
                    }
                  />
                  <span className="table--samll-text">کیلوگرم</span>
                </span>
              </Form.Item>
            </Form>
          </>
        );
      },
    },
    {
      title: () => {
        return (
          <Guide
            mode={mode}
            headerTitle="وزن خالص "
            tooltipTitle="برای هر کالا بر اساس وزن خالص درج شده در اسناد این محموله بر حسب کیلوگرم تا سقف 5 درصد بیشتر از وزن خالص درج شده در پرونده در مجموع منشأ ارزهای آن وارد کنید."
            isRequired={true}
          />
        );
      },
      align: "center",
      render: (_, record, index) => {
        const {
          pcgNetWeight,
          remainingNetWeight,
          pfgNetWeightAsKGDbl,
          pfgGrossWeightAsKGDbl,
        } = record;
        const id = record[rowKey];
        return (
          <Form.Item
            name={`pfgNetWeightAsKGDbl-${index}`}
            initialValue={pfgNetWeightAsKGDbl}
            rules={[
              {
                required: selectedRowKeys.includes(id) ? true : false,
                message: "پر کردن این فیلد اجباریست.",
              },
              () => ({
                validator(_, value) {
                  if (
                    !selectedRowKeys.includes(id) ||
                    !pfgGrossWeightAsKGDbl ||
                    !value ||
                    Number(StringHelpers.unFormatMoney(value)) <=
                      Number(StringHelpers.unFormatMoney(pfgGrossWeightAsKGDbl))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "مقدار مجاز وزن خالص کمتر یا مساوی وزن ناخالص می‌باشد"
                    )
                  );
                },
              }),
              () => ({
                validator(_, value) {
                  const unformattedValue = +StringHelpers.unFormatMoney(
                    value || 0
                  );
                  if (
                    !selectedRowKeys.includes(id) ||
                    (unformattedValue > 0 &&
                      !unformattedValue?.toString().includes(".")) ||
                    (unformattedValue >= 0 &&
                      unformattedValue?.toString().includes(".") &&
                      unformattedValue?.toString()?.split(".")[1]?.length < 11)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "عدد صحیح بزرگتر از صفر یا اعشاری(تا ده رقم اعشار) وارد نمایید."
                    )
                  );
                },
              }),
            ]}
          >
            <span className="flex-order-row">
              <InputNumberWithoutLabel
                isCurrency={true}
                value={mode === modes.Show ? pcgNetWeight : pfgNetWeightAsKGDbl}
                placeholder={remainingNetWeight}
                onChange={(value) =>
                  handleChangeInputsOfTable(value, index, "pfgNetWeightAsKGDbl")
                }
                disabled={
                  !!showId ? true : !selectedRowKeys.includes(id) ? true : false
                }
              />
              <span className="table--samll-text">کیلوگرم</span>
            </span>
          </Form.Item>
        );
      },
    },
    {
      title: () => {
        return (
          <Guide
            mode={mode}
            headerTitle="تعداد/مقدار"
            tooltipTitle="برای هر کالا بر اساس مقدار/تعداد درج شده در اسناد این محموله بر حسب واحد اندازه‌گیری درج شده در پرونده تا سقف مقدار/تعداد درج شده در پرونده در مجموع منشأ ارزهای آن وارد کنید."
            isRequired={true}
          />
        );
      },
      align: "center",
      render: (_, record, index) => {
        const {
          pcgCountInt,
          remainingQuantity,
          pfgmsuStr,
          pfgCountInt,
          canChangeFOBPriceMny,
          msuNameStr,
        } = record;
        const id = record[rowKey];
        return (
          <Form.Item
            name={`pfgCountInt-${index}`}
            initialValue={pfgCountInt}
            rules={[
              {
                required: selectedRowKeys.includes(id) ? true : false,
                message: "پر کردن این فیلد اجباریست.",
              },
              () => ({
                validator(_, value) {
                  const unformattedValue = +StringHelpers.unFormatMoney(
                    value || 0
                  );
                  if (
                    !selectedRowKeys.includes(id) ||
                    (unformattedValue > 0 &&
                      !unformattedValue?.toString().includes(".")) ||
                    (unformattedValue >= 0 &&
                      unformattedValue?.toString().includes(".") &&
                      unformattedValue?.toString()?.split(".")[1]?.length < 11)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "عدد صحیح بزرگتر از صفر یا اعشاری(تا ده رقم اعشار) وارد نمایید."
                    )
                  );
                },
              }),
            ]}
          >
            <span className="flex-order-row">
              <InputNumberWithoutLabel
                isCurrency={true}
                placeholder={remainingQuantity}
                value={mode === modes.Show ? pcgCountInt : pfgCountInt}
                onChange={(value) =>
                  handleChangeInputsOfTable(
                    value,
                    index,
                    "pfgCountInt",
                    canChangeFOBPriceMny
                  )
                }
                disabled={
                  !!showId ? true : !selectedRowKeys.includes(id) ? true : false
                }
              />
              <span className="table--samll-text">
                {currencyOperationType ===
                  currencyOperationTypes.StatisticalRegistration &&
                mode === modes.Show
                  ? msuNameStr
                  : pfgmsuStr}
              </span>
            </span>
          </Form.Item>
        );
      },
    },

    {
      title: () => {
        return (
          <Guide
            mode={mode}
            headerTitle="تعداد بسته"
            tooltipTitle="بر اساس تعداد بسته این محموله وارد کنید. تعداد بسته هر ردیف کالا می‌تواند اعشاری باشد، اما مجموع تعداد بسته‌های هر محموله باید عدد صحیح باشد."
            isRequired={true}
          />
        );
      },
      align: "center",
      render: (_, record, index) => {
        const {
          pcgPackageNumber,
          PackageTypeStr,
          pfgpckCountInt,
          pfgPackageTypeStr,
          pfgmsuStr,
          pfgpckVCodeInt,
        } = record;
        const id = record[rowKey];
        const hasPackageType = pfgpckVCodeInt !== 14 && pfgpckVCodeInt !== 19;
        return (
          <Form.Item
            name={`pfgpckCountInt-${index}`}
            initialValue={pfgpckCountInt}
            rules={[
              {
                required:
                  hasPackageType && selectedRowKeys.includes(id) ? true : false,
                message: "پر کردن این فیلد اجباریست.",
              },
              () => ({
                validator(_, value) {
                  const unformattedValue = +StringHelpers.unFormatMoney(
                    value || 0
                  );
                  if (
                    !hasPackageType ||
                    !selectedRowKeys.includes(id) ||
                    (unformattedValue > 0 &&
                      !unformattedValue?.toString().includes(".")) ||
                    (unformattedValue >= 0 &&
                      unformattedValue?.toString().includes(".") &&
                      unformattedValue?.toString()?.split(".")[1]?.length < 11)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "عدد صحیح بزرگتر از صفر یا اعشاری(تا چهار رقم اعشار) وارد نمایید."
                    )
                  );
                },
              }),
            ]}
          >
            {
              <span className="flex-order-row">
                {hasPackageType && (
                  <InputNumberWithoutLabel
                    isCurrency={true}
                    value={
                      mode === modes.Show ? pcgPackageNumber : pfgpckCountInt
                    }
                    onChange={(value) =>
                      handleChangeInputsOfTable(value, index, "pfgpckCountInt")
                    }
                    disabled={
                      !!showId
                        ? true
                        : !selectedRowKeys.includes(id)
                        ? true
                        : false
                    }
                  />
                )}

                <span className="table--samll-text">
                  {currencyOperationType ===
                    currencyOperationTypes.StatisticalRegistration &&
                  mode === modes.Show
                    ? pfgmsuStr
                    : mode === modes.Show
                    ? PackageTypeStr
                    : pfgPackageTypeStr}
                </span>
              </span>
            }
          </Form.Item>
        );
      },
    },

    {
      title: () => {
        return (
          <Guide
            mode={mode}
            headerTitle="مبلغ فوب"
            tooltipTitle="در حالت عادی از حاصل‌ضرب مقدار/تعداد در قیمت واحد برای هر کالا محاسبه می‌شود. اما برای کالاهای با واحد اندازه‌گیری خط تولید یا دارای کد تعرفه‌های خاص، این مبلغ باید به صورت دستی و تا سقف مانده مبلغ فوب این کالا وارد شود. "
          />
        );
      },
      align: "center",
      render: (_, record, index) => {
        const { pcgFOBPriceMny, canChangeFOBPriceMny } = record;
        const id = record[rowKey];
        return (
          <Form.Item
            name={`pcgFOBPriceMny-${index}`}
            initialValue={pcgFOBPriceMny}
            rules={[
              {
                required:
                  selectedRowKeys.includes(id) && canChangeFOBPriceMny
                    ? true
                    : false,
                message: "پر کردن این فیلد اجباریست.",
              },
              () => ({
                validator(_, value) {
                  const unformattedValue = +StringHelpers.unFormatMoney(
                    value || 0
                  );
                  if (
                    !selectedRowKeys.includes(id) ||
                    !value ||
                    !canChangeFOBPriceMny ||
                    (unformattedValue > 0 &&
                      !unformattedValue?.toString().includes(".")) ||
                    (unformattedValue >= 0 &&
                      unformattedValue?.toString().includes(".") &&
                      unformattedValue?.toString()?.split(".")[1]?.length < 11)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "عدد صحیح بزرگتر از صفر یا اعشاری(تا ده رقم اعشار) وارد نمایید."
                    )
                  );
                },
              }),
            ]}
          >
            <InputNumberWithoutLabel
              isCurrency={true}
              value={pcgFOBPriceMny}
              disabled={!(selectedRowKeys.includes(id) && canChangeFOBPriceMny)}
              onChange={(value) =>
                handleChangeInputsOfTable(value, index, "pcgFOBPriceMny")
              }
            />
          </Form.Item>
        );
      },
    },
    {
      title: "شناسه کالا",
      align: "center",
      render: (_, { pfggcdNameStr }) => (
        <div className="flex-order-row">{pfggcdNameStr}</div>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    let totalOfPcgFOBPriceMny = 0;
    temporaryTabledataSource?.map((item) => {
      if (newSelectedRowKeys.includes(item[rowKey])) {
        const FOBPriceMny = item?.canChangeFOBPriceMny
          ? item?.pcgFOBPriceMny || 0
          : (Number(item?.pfgCountInt) || 0) * Number(item?.pfgUnitPriceMny);
        totalOfPcgFOBPriceMny = totalOfPcgFOBPriceMny + FOBPriceMny;
      }
    });
    setTotalOfPcgFOBPriceMny(totalOfPcgFOBPriceMny?.toFixed(3));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChangeInputsOfTable = (
    value,
    index,
    name,
    canChangeFOBPriceMny = false
  ) => {
    const temp = temporaryTabledataSource;
    if (name === "pfgCountInt" && !canChangeFOBPriceMny) {
      temp[index][name] = +value;
      temp[index].pcgFOBPriceMny = (
        value * Number(temp[index]?.pfgUnitPriceMny)
      ).toFixed(10);
      setTableDataSource([...temp]);
      setTemporaryTabledataSource([...temp]);
      setTimeout(() => {
        form.resetFields([`pcgFOBPriceMny-${index}`]);
      }, 300);
      let totalOfPcgFOBPriceMny = 0;
      temporaryTabledataSource.map((item, indexForCalculate) => {
        if (indexForCalculate === index) {
          totalOfPcgFOBPriceMny =
            totalOfPcgFOBPriceMny +
            Number(value) * Number(item?.pfgUnitPriceMny);
        } else {
          if (selectedRowKeys.includes(item[rowKey])) {
            totalOfPcgFOBPriceMny =
              totalOfPcgFOBPriceMny +
              (Number(item?.pfgCountInt) || 0) * Number(item?.pfgUnitPriceMny);
          }
        }
      });

      setTotalOfPcgFOBPriceMny(totalOfPcgFOBPriceMny?.toFixed(3));
    } else if (name === "pcgFOBPriceMny") {
      temp[index].pcgFOBPriceMny = +value;
      setTableDataSource([...temp]);
      setTemporaryTabledataSource([...temp]);
      let totalOfPcgFOBPriceMny = 0;
      temporaryTabledataSource.map((item, indexForCalculate) => {
        if (indexForCalculate === index) {
          totalOfPcgFOBPriceMny = Number(value) + totalOfPcgFOBPriceMny;
        } else {
          if (selectedRowKeys.includes(item[rowKey])) {
            totalOfPcgFOBPriceMny =
              Number(item?.pcgFOBPriceMny) + totalOfPcgFOBPriceMny;
          }
        }
      });
      setTotalOfPcgFOBPriceMny(totalOfPcgFOBPriceMny?.toFixed(3));
    } else {
      temp[index][name] = value;
      setTableDataSource([...temp]);
      setTemporaryTabledataSource([...temp]);
    }
    if (name === "pfgGrossWeightAsKGDbl") {
      form.validateFields([`pfgNetWeightAsKGDbl-${index}`]);
    } else if (name === "pfgNetWeightAsKGDbl") {
      form.validateFields([`pfgGrossWeightAsKGDbl-${index}`]);
    }
  };

  const handleChangePageSize = (event) => {
    event.preventDefault();
    if (!!sendRequest) {
      sendRequest({
        setTableParams,
        tableParams: {
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            pageSize: Number(event.target.value) || 0,
            current: 1,
          },
        },
      });
    } else {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          pageSize: Number(event.target.value) || 0,
          current: 1,
        },
      });
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (!!sendRequest) {
      sendRequest({
        setTableParams,
        tableParams: {
          pagination,
          filters,
          ...sorter,
        },
      });
    } else {
      setTableParams({
        pagination,
        filters,
        ...sorter,
      });
    }
  };

  return (
    <Form form={form}>
      <Table
        handleChangePageSize={handleChangePageSize}
        dataSource={temporaryTabledataSource}
        columns={columns}
        pagination={tableParams?.pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey={rowKey}
        rowSelection={mode === modes.Add ? rowSelection : false}
      />
    </Form>
  );
};

export default GoodsTable;

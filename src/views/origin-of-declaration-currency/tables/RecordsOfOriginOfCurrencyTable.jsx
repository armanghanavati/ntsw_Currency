// سوابق منشا ارز اظهارنامه
import React from "react";
import { Button, Table, TitleBox, VerticalSpace } from "../../../components";
import { Col, Row } from "antd";

const RecordsOfOriginOfCurrencyTable = ({
  tableParams,
  dataSource,
  setDataSource,
  inputsData,
}) => {
  const clickHandler = (id) => {
    const temp = dataSource?.map((item) => {
      if (item.id === id) {
        item.isSelected = true;
        return item;
      } else {
        return {
          ...item,
          isSelected: false,
        };
      }
    });
    setDataSource(temp);
  };

  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (item, record, index) => (
        <>
          {index +
            1 +
            (Number(tableParams?.pagination?.current || 1) - 1) *
              Number(tableParams.pagination.pageSize || 1)}
        </>
      ),
    },
    {
      title: "کد یکتای منشا ارز",
      dataIndex: "prfOrderNoStr",
      align: "center",
    },
    {
      title: "تاریخ منشا ارز",
      dataIndex: "preCotageDate",
      align: "center",
    },
    {
      title: "شماره SATA",
      dataIndex: "sataId",
      align: "center",
    },
    {
      title: "مبلغ منشا ارز",
      dataIndex: "amount",
      align: "center",
    },
    {
      title: "وضعیت",
      dataIndex: "preCotageStatus",
      align: "center",
    },
    {
      title: "مبلغ سند حمل ثبت شده در بانک",
      dataIndex: "billOfLaddingAmount",
      align: "center",
    },
    {
      title: "شماره ردیف سند ثبت شده در بانک",
      dataIndex: "billOfLaddingRowNumber",
      align: "center",
    },
    {
      title: "جزییات منشا ارز",
      dataIndex: "carVCodeLng",
      align: "center",
      render: (_, { id, isSelected }) => (
        <div className="flex-order-row">
          <Button
            disabled={isSelected}
            onClick={() => clickHandler(id)}
            type="secondary"
          >
            جزییات
            <i class="fa fa-search" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <Row>
        <Col sm={24} md={24} lg={24}>
          <TitleBox
            title={`سوابق منشا ارز اظهارنامه ${inputsData?.declarationCode}`}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowClassName={({ isSelected }) =>
              isSelected ? "ant-table-row-selected" : ""
            }
            hasPageSizeCombo={false}
          />
        </Col>
      </Row>
      <VerticalSpace space="2rem" />
    </>
  );
};
export default RecordsOfOriginOfCurrencyTable;

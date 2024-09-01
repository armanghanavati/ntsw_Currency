// اطلاعات کالاهای منشا ارز
import React from "react";
import { Table, TitleBox, VerticalSpace } from "../../../components";
import { Col, Row } from "antd";

const GoodsOfOriginOfCurrencyTable = ({ dataSource, tableParams }) => {
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
      title: "کد مجازی کالا",
      dataIndex: "idd",
      align: "center",
    },
    {
      title: "کد تعرفه",
      dataIndex: "proformaGoodsId",
      align: "center",
    },
    {
      title: "شرح تجاری فارسی",
      dataIndex: "carStatusStr",
      align: "center",
    },
    {
      title: "قیمت واحد",
      dataIndex: "carActiveStatusStr",
      align: "center",
    },
    {
      title: "وزن ناخالص",
      dataIndex: "grossWeight",
      align: "center",
    },
    {
      title: "وزن خالص",
      dataIndex: "netWeight",
      align: "center",
    },
    {
      title: "تعداد / مقدار",
      dataIndex: "count",
      align: "center",
    },
    {
      title: "تعداد بسته",
      dataIndex: "packageCount",
      align: "center",
    },
    {
      title: "مبلغ فوب",
      dataIndex: "fobAmount",
      align: "center",
    },
    {
      title: "شناسه کالا",
      dataIndex: "id",
      align: "center",
    },
  ];
  return (
    <>
      <Row>
        <Col sm={24} md={24} lg={24}>
          <TitleBox title={"اطلاعات کالاهای منشا ارز"} />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            hasPageSizeCombo={false}
          />
        </Col>
      </Row>
      <VerticalSpace space="2rem" />
    </>
  );
};
export default GoodsOfOriginOfCurrencyTable;

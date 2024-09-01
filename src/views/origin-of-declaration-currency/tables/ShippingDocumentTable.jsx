// اطلاعات سند حمل ثبت شده در بانک
import React from "react";
import { Button, Table, TitleBox } from "../../../components";
import { Col, Row } from "antd";
import themeColors from "../../../configs/theme";

function ShippingDocumentTable({ tableParams, dataSource }) {
  const clickHandler = (id) => {};

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
      title: "مبلغ کل",
      dataIndex: "prfOrderNoStr",
      align: "center",
    },
    {
      title: "مبلغ فوب",
      dataIndex: "goodsFOBAmount",
      align: "center",
    },
    {
      title: "مبلغ حمل",
      dataIndex: "freightAmount",
      align: "center",
    },
    {
      title: "مبلغ سایر هزینه ها",
      dataIndex: "otherAmount",
      align: "center",
    },
    {
      title: "مبلغ تخفیف",
      dataIndex: "discountAmount",
      align: "center",
    },
    {
      title: "انتخاب سند حمل",
      dataIndex: "carVCodeLng",
      align: "center",
      render: (id, { isShowBillOfLaddingSelectButon }) => (
        <div className="flex-order-row">
          {isShowBillOfLaddingSelectButon && (
            <Button
              onClick={() => clickHandler(id)}
              backgroundColor={themeColors.btn.secondary}
              type="secondary"
            >
              انتخاب
              <i class="fa fa-search" />
            </Button>
          )}
        </div>
      ),
    },
  ];
  return (
    <>
      <Row>
        <Col sm={24} md={24} lg={24}>
          <TitleBox title={"اطلاعات سند حمل ثبت شده در بانک"} />
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
    </>
  );
}
export default ShippingDocumentTable;

import React from "react";
import {
  Button,
  Modal,
  Table,
  VerticalSpace,
} from "../../../../../../components";
import themeColors from "../../../../../../configs/theme";
import { useSelector } from "react-redux";

const Contacts = ({
  view,
  setView,
  data,
  loading,
  dataSource,
  handleChangePageSize,
  handleTableChange,
}) => {
  const { theme } = useSelector((state) => state);
  const columnsContactInfo = [
    {
      title: "نام و نام خانوادگی",
      dataIndex: "advNameStr",
      align: "center",
    },
    {
      title: "شماره تماس",
      dataIndex: "advPhoneNumber",
      align: "center",
    },
  ];

  return (
    <>
      <Modal
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
        centered
        title="نمایش اطلاعات تماس آگهی"
        open={view}
        width={900}
        footer={[
          <Button
            type="success"
            onClick={(event) => {
              event.preventDefault();
              setView(false);
            }}
          >
            بازگشت
          </Button>,
        ]}
        onCancel={() => setView(false)}
      >
        <div
          style={{
            border: "1px solid #ffaa01",
            borderRadius: "50px",
            marginLeft: "20px",
            marginRight: "20px",
            fontSize: "20px",
            borderStyle: "dotted",
            // background: "floralwhite",
          }}
        >
          <p>کد آگهی</p>
          <p>{data?.[0]?.advVCodeInt}</p>
        </div>
        <VerticalSpace space="1rem" />
        <hr style={{ border: "1px solid #e5e5e5" }} />
        <div style={{ marginLeft: "20px", marginRight: "20px" }}>
          <Table
            handleChangePageSize={handleChangePageSize}
            dataSource={data}
            columns={columnsContactInfo}
            loading={loading}
            onChange={handleTableChange}
            hasPageSizeCombo={false}
          />
        </div>
      </Modal>
    </>
  );
};

export default Contacts;

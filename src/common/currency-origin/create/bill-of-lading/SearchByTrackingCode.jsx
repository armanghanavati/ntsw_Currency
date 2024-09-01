import { Col, Row } from "antd";
import { Button, Input, Table, VerticalSpace } from "../../../../components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleMessageModal } from "../../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../../services/endpoints";

const SearchByDate = ({
  columns,
  handleChangeInputs,
  filters,
  errors,
  setErrors,
  loading,
  setLoading,
}) => {
  const dispatch = useDispatch();
  const { role, GUid } = useSelector((state) => state);
  const [dataSource, setDataSource] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const handleSearch = (event) => {
    event?.preventDefault();
    if (
      filters?.bolTrackingCode &&
      (!errors?.bolTrackingCode || errors?.bolTrackingCode?.length === 0)
    ) {
      if (tableParams.pagination.current === 1) {
        getTable();
      } else {
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            current: 1,
          },
        });
      }
    } else {
      if (!filters?.bolTrackingCode) {
        setErrors({
          ...errors,
          bolTrackingCode: ["پرکردن این فیلد الزامی است"],
        });
      }
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "لطفا کد رهگیری معتبر وارد نمایید.",
        })
      );
    }
  };
  const getTable = () => {
    setLoading(true);
    const postData = {
      bolTrackingCode: filters?.bolTrackingCode,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.inquiryBillOfLaddingByBolVcode.url,
      method:
        endpoints.RestAPIs.preCotage.inquiryBillOfLaddingByBolVcode.method,
      data: postData,
    })
      .then((res) => {
        if(res?.data?.ErrorCode===0){
          setDataSource(res?.data?.BillOfLaddingList || []);
        }else{
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <Row>
        <Col sm={24} md={12} xl={8}>
          <Input
            onChange={handleChangeInputs}
            name="bolTrackingCode"
            value={filters?.bolTrackingCode}
            title="کد رهگیری"
            error={errors?.bolTrackingCode}
            validations={[["maxLength", 30]]}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Button name="getTable" onClick={handleSearch} loading={loading}>
            <i className="fa fa-search" aria-hidden="true"></i>
            جستجو
          </Button>
        </Col>
      </Row>
      <Table
        hasPageSizeCombo={false}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        loading={loading}
        rowKey="id"
      />
      <VerticalSpace space="0.5rem" />
    </>
  );
};

export default SearchByDate;

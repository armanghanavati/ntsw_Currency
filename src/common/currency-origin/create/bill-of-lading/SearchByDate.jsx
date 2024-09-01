import moment from "jalali-moment";
import { Col, Row } from "antd";
import {
  Button,
  DatePicker,
  Table,
  VerticalSpace,
} from "../../../../components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleMessageModal } from "../../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../../services/endpoints";
import { useEffect } from "react";
import convertJalaliDateToGregorian from "../../../../configs/helpers/convert-jalali-date-to-gregorian";

const SearchByDate = ({
  columns,
  prfCustomInt,
  handleChangeInputs,
  filters,
  setErrors,
  errors,
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

  const handleChangePageSize = (event) => {
    event.preventDefault();
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        pageSize: Number(event.target.value) || 0,
        current: 1,
      },
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const hasPermitForSearch = () => {
    const startDate = moment
      .from(
        `${filters?.startDate?.year}/${filters?.startDate?.month}/${filters?.startDate?.day}`,
        "fa",
        "YYYY/M/D "
      )
      .format("YYYY-MM-DD");
    const endDate = moment
      .from(
        `${filters?.endDate?.year}/${filters?.endDate?.month}/${filters?.endDate?.day}`,
        "fa",
        "YYYY/M/D "
      )
      .format("YYYY-MM-DD");
    const diff = moment(endDate).diff(moment(startDate), "days");
    if (
      (errors?.startDate?.length === 0||!errors?.startDate) &&
      (errors?.endDate?.length === 0||!errors?.endDate) &&
      diff < 91
    ) {
      return true;
    } else {
      if (!filters?.startDate || !filters?.endDate) {
        setErrors({
          ...errors,
          startDate: !filters?.startDate
            ? ["پرکردن این فیلد الزامی است"]
            : errors?.startDate,
          endDate: !filters?.endDate
            ? ["پرکردن این فیلد الزامی است"]
            : errors?.startDate,
        });
      }
      return false;
    }
  };

  const handleSearch = (event) => {
    event?.preventDefault();
    if (hasPermitForSearch()) {
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
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe:'لطفا فیلدهای بازه‌ی زمانی را با مقادیر مجاز پر نمایید',
        })
      );
    }
  };

  const getTable = () => {
    setLoading(true);
    const postData = {
      prfCustomInt,
      StartDate: convertJalaliDateToGregorian(filters.startDate),
      EndDate: convertJalaliDateToGregorian(filters.endDate),
      StartIndex:
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize,
      PageSize: tableParams.pagination.pageSize,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.inquiryBillOfLaddingPaging.url,
      method: endpoints.RestAPIs.preCotage.inquiryBillOfLaddingPaging.method,
      data: postData,
    })
      .then((res) => {
        setDataSource(res?.data?.BillOfLaddingList || []);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res?.data?.TotalCount || 0,
          },
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    !!filters.startDate && getTable();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  return (
    <>
      <Row>
        <Col sm={24} md={12} xl={8}>
          <DatePicker
            title="از تاریخ"
            name="startDate"
            defaultValue={filters?.startDate}
            onChange={handleChangeInputs}
            error={errors?.startDate}
            validations={[["maximumDate", filters?.endDate], ["required"]]}
            minimumDate={!!filters?.endDate ? filters?.minDate : undefined}
            maximumDate={filters?.todayDate}
             />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <DatePicker
            title="تا تاریخ"
            name="endDate"
            defaultValue={filters?.endDate}
            onChange={handleChangeInputs}
            error={errors?.endDate}
            validations={[["minimumDate", filters?.startDate], ["required"]]}
            maximumDate={!!filters?.startDate ? filters?.maxDate : filters?.todayDate}
          />
        </Col>
        <Col sm={24} md={12} xl={8}>
          <Button name="getTable" onClick={handleSearch} loading={loading}>
            <i className="fa fa-search" aria-hidden="true"></i>
            جستجو
          </Button>
        </Col>
      </Row>
      <VerticalSpace space="0.5rem" />
      <Table
        handleChangePageSize={handleChangePageSize}
        dataSource={dataSource}
        columns={columns}
        pagination={tableParams?.pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
      />
    </>
  );
};

export default SearchByDate;

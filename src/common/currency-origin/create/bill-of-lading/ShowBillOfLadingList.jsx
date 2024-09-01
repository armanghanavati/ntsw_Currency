import moment from "jalali-moment";
import { Col, Row } from "antd";
import { Button, GuideBox, Modal, VerticalSpace } from "../../../../components";
import Validation from "../../../../utils/Validation";
import { useEffect, useState } from "react";
import themeColors from "../../../../configs/theme";
import SearchByTrackingCode from "./SearchByTrackingCode";
import SearchByDate from "./SearchByDate";
import dayjs from "dayjs";

const ShowBillOfLadingList = ({ setInputsData, prfCustomInt }) => {
  const searchTypeEnum = {
    byDate: 1,
    byTrackingCode: 2,
  };
  const [errors, setErrors] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [today] = useState(moment().format("jYYYY/jMM/jDD"));
  const [threeMothAgo] = useState(
    moment()?.subtract(90, "days")?.format("jYYYY/jMM/jDD")
  );
  const [filters, setFilters] = useState({
    todayDate: moment()?.add(1, "days")?.format("YYYY/MM/DD"),
    endDate: {
      year: today?.split("/")[0],
      month: today?.split("/")[1],
      day: today?.split("/")[2],
    },
    startDate: {
      year: threeMothAgo?.split("/")[0],
      month: threeMothAgo?.split("/")[1],
      day: threeMothAgo?.split("/")[2],
    },
    maxDate: moment()?.add(1, "days")?.format("YYYY/MM/DD"),
    minDate: moment()?.subtract(91, "days")?.format("YYYY/MM/DD"),
  });

  useEffect(() => {
    setFilters({
      todayDate: moment()?.add(1, "days")?.format("YYYY/MM/DD"),
      endDate: {
        year: today?.split("/")[0],
        month: today?.split("/")[1],
        day: today?.split("/")[2],
      },
      startDate: {
        year: threeMothAgo?.split("/")[0],
        month: threeMothAgo?.split("/")[1],
        day: threeMothAgo?.split("/")[2],
      },
      maxDate: moment()?.add(1, "days")?.format("YYYY/MM/DD"),
      minDate: moment()?.subtract(91, "days")?.format("YYYY/MM/DD"),
    });
  }, [today, threeMothAgo]);

  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState();

  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (_, {}, index) => <>{index + 1}</>,
    },
    {
      title: "کدرهگیری بارنامه",
      dataIndex: "BillOfLaddingTrackingcode",
      align: "center",
    },
    {
      title: "شماره بارنامه",
      dataIndex: "BillOfLadingNumber",
      align: "center",
    },
    {
      title: "تاریخ صدور بارنامه",
      align: "center",
      render: (_, { pcbBOLDate }) => (
        <div className="flex-order-row">{pcbBOLDate.split("T")[0]}</div>
      ),
    },
    {
      title: "بندر تخلیه",
      dataIndex: "PortOfDischargeName",
      align: "center",
    },
    {
      title: "نوع بار",
      dataIndex: "IsBillOfLadingContainerStr",
      align: "center",
    },
    {
      title: "جزئیات",
      align: "center",
      render: (_, record) => (
        <div className="flex-order-row">
          <Button
            onClick={(event) => {
              onCancelModal(event);
              setInputsData((prevState) => {
                return {
                  ...prevState,
                  selectedBillOfLadingDataFromTable: record,
                };
              });
            }}
            type="secondary"
            backgroundColor={themeColors.btn.secondary}
          >
            انتخاب
            <i class="fa fa-check" aria-hidden="true"></i>
          </Button>
        </div>
      ),
    },
  ];

  const handleChangeInputs = (name, value, validationNameList = undefined) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });

    if (name === "startDate") {
      let maxDate;
      if (!!value) {
        const miladiDate = moment
          .from(
            `${value?.year}/${value?.month}/${value?.day}`,
            "fa",
            "YYYY/M/D "
          )
          .format("YYYY-MM-DD");
        maxDate = moment(miladiDate).add(91, "days");
        // اگر maxDate بیشتر از امروز باشه امروز رو به عنوان بیشترین زمان قابل انتخاب میذاره
        if (moment().diff(maxDate, "days") < 0) {
          maxDate = filters?.todayDate;
        }
      }

      setFilters((prevstate) => {
        return {
          ...prevstate,
          [name]: value,
          maxDate: maxDate ? moment(maxDate).format("YYYY/MM/DD") : undefined,
        };
      });
      if (Validation.minimumDate(filters?.endDate, value) === true) {
        setErrors({
          ...errors,
          endDate: filters?.endDate ? [] : errors?.endDate,
          startDate: temp,
        });
      } else {
        setErrors({
          ...errors,
          endDate: Validation.minimumDate(filters?.endDate, value),
          startDate: temp,
        });
      }
    } else if (name === "endDate") {
      let minDate;
      if (!!value) {
        const miladiDate = moment
          .from(
            `${value?.year}/${value?.month}/${value?.day}`,
            "fa",
            "YYYY/M/D "
          )
          .format("YYYY-MM-DD");
        minDate = moment(miladiDate).subtract(91, "days");
      }
      setFilters((prevstate) => {
        return {
          ...prevstate,
          [name]: value,
          minDate: !!minDate ? moment(minDate).format("YYYY/MM/DD") : undefined,
        };
      });
      if (Validation.maximumDate(filters?.startDate, value) === true) {
        setErrors({
          ...errors,
          startDate: !!filters?.startDate ? [] : errors?.startDate,
          endDate: temp,
        });
      } else {
        setErrors({
          ...errors,
          startDate: Validation.maximumDate(filters?.startDate, value),
          endDate: temp,
        });
      }
    } else {
      setErrors((prevstate) => {
        return {
          ...prevstate,
          [name]: [...temp],
        };
      });
      setFilters((prevstate) => {
        return {
          ...prevstate,
          [name]: value,
        };
      });
    }
  };

  const handleShowModal = (event) => {
    event?.preventDefault();
    setIsShowModal(true);
  };

  const onCancelModal = (event) => {
    event?.preventDefault();
    setSearchType();
    setIsShowModal(false);
    setFilters({
      todayDate: filters?.todayDate,
      endDate: {
        year: today?.split("/")[0],
        month: today?.split("/")[1],
        day: today?.split("/")[2],
      },
      startDate: {
        year: threeMothAgo?.split("/")[0],
        month: threeMothAgo?.split("/")[1],
        day: threeMothAgo?.split("/")[2],
      },
      maxDate: moment()?.add(1, "days")?.format("YYYY/MM/DD"),
      minDate: moment()?.subtract(91, "days")?.format("YYYY/MM/DD"),
    });
    setErrors({});
  };

  return (
    <>
      <GuideBox
        tooltipTitle="یکی از اسناد حملی که بانک عامل در پرتال ارزی درج کرده است را انتخاب کنید."
        GuidedComponent={
          <Button onClick={handleShowModal}>
            <i class="fa fa-plus-square" aria-hidden="true"></i>
            مشاهده فهرست بارنامه‌ها در سامانه بارفرابران
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </Button>
        }
      />
      <Modal
        centered
        title="انتخاب بارنامه از لیست بارفرابران"
        open={isShowModal}
        setIsOpen={setIsShowModal}
        footer={[
          <Button
            backgroundColor={themeColors.btn.danger}
            onClick={onCancelModal}
          >
            بازگشت
          </Button>,
        ]}
        width={1000}
        onCancel={onCancelModal}
      >
        <form className="form">
          <Row>
            {(searchType === searchTypeEnum.byTrackingCode || !searchType) && (
              <Col sm={24} md={6} xl={6}>
                <Button
                  onClick={(e) => {
                    e?.preventDefault();
                    setSearchType(searchTypeEnum.byDate);
                  }}
                >
                  جستجوی بازه‌ی زمانی
                </Button>
              </Col>
            )}
            {(searchType === searchTypeEnum.byDate || !searchType) && (
              <Col sm={24} md={6} xl={6}>
                <Button
                  onClick={(e) => {
                    e?.preventDefault();
                    setSearchType(searchTypeEnum.byTrackingCode);
                  }}
                >
                  جستجوی کدرهگیری
                </Button>
              </Col>
            )}
          </Row>
          <VerticalSpace space="1rem" />
          {searchType === searchTypeEnum.byTrackingCode && (
            <SearchByTrackingCode
              columns={columns}
              handleChangeInputs={handleChangeInputs}
              filters={filters}
              errors={errors}
              setErrors={setErrors}
              setLoading={setLoading}
              loading={loading}
            />
          )}
          {searchType === searchTypeEnum.byDate && (
            <SearchByDate
              columns={columns}
              handleChangeInputs={handleChangeInputs}
              filters={filters}
              errors={errors}
              setErrors={setErrors}
              setLoading={setLoading}
              loading={loading}
              prfCustomInt={prfCustomInt}
            />
          )}
        </form>
      </Modal>
    </>
  );
};

export default ShowBillOfLadingList;

import { useState } from "react";
import AnnouncementGuideFile from "../../../../assets/pdfFile/AnnouncementGuide.pdf";
import AnnouncementUserGuideFile from "../../../../assets/pdfFile/AnnouncementUserGuide.pdf";
import { Button, Table, VerticalSpace } from "../../../../components";
import StringHelpers from "../../../../configs/helpers/string-helpers";
import axios from "axios";
import { endpoints } from "../../../../services/endpoints";
import { useEffect } from "react";
import modes from "../../../../enums/modes";
import Guide from "../../../../common/currency-origin/goods/Guide";
import { connect, useDispatch } from "react-redux";
import {
  mapGUidStateToProps,
  mapRoleStateToProps,
  mapQuestionModalStateToProps,
} from "../../../../state/mapStateToProps";
import convertGregorianDateToJalali from "../../../../configs/helpers/convert-gregorian -date-to-jalali";
import DeleteAnnouncement from "../common/DeleteAnnouncement";
import { Col, Row } from "antd";
import { Link, useHistory } from "react-router-dom";
import { RecordComments } from "../../../../common";
import {
  handleMessageModal,
  handleQuestionModal,
} from "../../../../state/action-creators";
import themeColors from "../../../../configs/theme";

// ------------> تب آگهی های من صفحه واگذاری پروانه و تهاتر ارزی <------------

const Announcement = ({ role, GUid, questionModal }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const [inputsData, setInputsData] = useState([]);
  const [modalConfirmation, setModalConfirmation] = useState({
    remittance: false,
    survey: false,
  });
  const [reload, setReload] = useState({
    cancelSelected: false,
  });
  const [loadingParticipation, setLoadingParticipation] = useState(false);

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
      title: "کد آگهی",
      align: "center",
      dataIndex: "advVCodeInt",
    },
    {
      title: "تاریخ ثبت آگهی",
      align: "center",
      width: 120,
      render: (_, { advInsertDate }) => {
        const date = convertGregorianDateToJalali(advInsertDate);
        const time = advInsertDate.split("T")[1].split(":");
        return <>{`${time[0]}:${time[1]} - ${date} `}</>;
      },
    },
    {
      title: "سریال اظهارنامه",
      align: "center",
      render: (_, { SaderatCotageList }) => (
        <>{`${SaderatCotageList[0]?.cavctmVCodeInt}-${SaderatCotageList[0]?.cavCotageCodeStr}`}</>
      ),
    },
    {
      title: "مبلغ",
      align: "center",
      render: (_, { advAmount }) => (
        <div className="flex-order-row">
          {StringHelpers.formatNumber(advAmount)}
        </div>
      ),
    },
    {
      title: "ارز",
      dataIndex: "curNameStr",
      align: "center",
    },
    {
      title: "نرخ فروش (ریال)",
      align: "center",
      render: (_, { advUnitPriceMny }) => (
        <div className="flex-order-row">
          {StringHelpers.formatNumber(advUnitPriceMny)}
        </div>
      ),
    },
    {
      title: "زمان پایان نمایش در تابلو",
      align: "center",
      width: 120,
      render: (_, { advShowTime }) => {
        const date = convertGregorianDateToJalali(advShowTime);
        const time = advShowTime.split("T")[1].split(":");
        return <>{`${time[0]}:${time[1]} - ${date} `}</>;
      },
    },
    {
      title: () => {
        return (
          <Guide
            mode={modes.Add}
            headerTitle="وضعیت آگهی"
            iconPosition="down"
            tooltipTitle={() => {
              return (
                <>
                  در صورتی که وضعیت آگهی، <span class="text-red">«فعال»</span>
                  باشد در تابلوی واگذاری پروانه های صادراتی به متقاضیان نمایش
                  داده خواهد شد.
                  <br />
                  در صورتی که وضعیت آگهی، <span class="text-red">«منقضی»</span>
                  باشد به این معنی است که آگهی به «زمان پایان نمایش در تابلو»
                  رسیده و از تابلو حذف شده است.
                  <br />
                  وضعیت <span class="text-red">«حذف شده»</span> نیز به این معنی
                  است که آگهی پیش از رسیدن به «زمان پایان نمایش در تابلو» توسط
                  شما حذف شده و در تابلو نمایش داده نخواهد شد.
                </>
              );
            }}
          />
        );
      },
      dataIndex: "advStatusStr",
      align: "center",
    },

    {
      title: "جزئیات آگهی",
      dataIndex: "cdtStatusTny",
      align: "center",
      render: (_, { advVCodeInt }) => (
        <div className="flex-order-row">
          <Button
            type="secondary"
            onClick={() =>
              history.push(`AnnouncementDetails?key=${btoa(advVCodeInt)}`)
            }
          >
            <i class="fa fa-search" aria-hidden="true"></i>
            جزئیات
          </Button>
        </div>
      ),
    },
    {
      title: "حذف آگهی",
      dataIndex: "cdtStatusTny",
      align: "center",
      render: (_, { advStatusTny, advVCodeInt }) => (
        <div className="flex-order-row">
          <DeleteAnnouncement
            AdvVcodeLng={advVCodeInt}
            disabled={advStatusTny !== 1}
            getTable={getTable}
          />
        </div>
      ),
    },
  ];

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

  const getTable = () => {
    setLoading(true);
    const postData = {
      urlVCodeInt: role,
      startIndex:
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
        1,
      pageSize: tableParams.pagination.pageSize,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.declaration.adviseList.url,
      method: endpoints.RestAPIs.declaration.adviseList.method,
      data: postData,
    })
      .then((res) => {
        setDataSource(res?.data?.ListOfAdvise);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res?.data?.count || 0,
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
    getTable();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  const surveyOfCustomDeclaration = (event) => {
    event?.preventDefault();
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      // بکند طی اصلاحیه اعلام کرد که این ایتم همیشه صفر ارسال شه
      surveyCallStatus: 0,
      // surveyCallStatus: !!inputsData?.callRepite ? 1 : 0,
    };
    setLoadingParticipation(true);
    axios({
      url: endpoints.RestAPIs.declaration.surveyOfCustomDeclaration.url,
      method: endpoints.RestAPIs.declaration.surveyOfCustomDeclaration.method,
      data: postData,
    })
      .then((res) => {
        setInputsData({
          ...inputsData,
          surveyInfo: res?.data?.SurveyInfo,
          callRepite: true,
        });
        if (res.data?.ErrorCode === 0) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        } else if (res.data?.ErrorCode === 120) {
          setModalConfirmation((prvs) => ({
            ...prvs,
            survey: true,
            participation: true,
          }));
          setReload({ ...reload, cancelSelected: 0 });
        } else if (res.data?.ErrorCode === 121) {
          dispatch(
            handleQuestionModal({
              isModalOpen: true,
              title: "پیغام سیستم",
              describe: res.data?.ErrorDesc,
              name: "PARTICIPATION",
              onYes: handleOnYesQuestionModal,
            })
          );
          setReload({ ...reload, cancelSelected: 0 });
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
        setLoadingParticipation(false);
      })
      .catch((err) => {
        setLoadingParticipation(false);
      });
  };

  const handleOnYesQuestionModal = () => {
    setModalConfirmation((prvs) => ({
      ...prvs,
      survey: true,
      participation: true,
    }));
  };
  // useEffect(() => {
  //   if (questionModal?.name === "PARTICIPATION") {
  //     if (questionModal?.answer === "yes") {

  //       dispatch(
  //         handleQuestionModal({
  //           isModalOpen: false,
  //           title: "",
  //           describe: "",
  //           name: "",
  //         })
  //       );
  //     } else if (questionModal?.answer === "no") {
  //       dispatch(
  //         handleQuestionModal({
  //           isModalOpen: false,
  //           title: "",
  //           describe: "",
  //           name: "",
  //         })
  //       );
  //     }
  //   }

  //   // پیرو تعامل با بکند این قسمت کامنت شد
  //   // else if (
  //   //   questionModal?.answer === "no" &&
  //   //   questionModal?.name === "PARTICIPATION"
  //   // ) {
  //   //   surveyOfCustomDeclaration();
  //   // }
  // }, [questionModal.answer]);

  const canceld = (flag) => {
    setModalConfirmation({
      ...modalConfirmation,
      [flag]: false,
    });
  };

  return (
    <>
      <Row>
        <Col sm={24} md={12} lg={6}>
          <Link to="/Users/AC/Currency/CreateNewAnnouncement" class="link">
            <Button>
              <i className="fa fa-plus" aria-hidden="true"></i>
              ایجاد آگهی جدید
            </Button>
          </Link>
        </Col>
      </Row>
      <div className="transfer-of-license-and-currency-exchange--border">
        <Button
          loading={loadingParticipation}
          backgroundColor={themeColors.btn.secondary}
          onClick={surveyOfCustomDeclaration}
        >
          <i class="fa fa-comment btn-label" />
          مشارکت در بازطراحی و بهبود عملکرد سامانه نیما
        </Button>
        <a
          className="btn-download"
          href={AnnouncementGuideFile}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-file btn-label" aria-hidden="true"></i>
          راهنــمای فرایند
        </a>
        <a
          className="btn-download"
          href={AnnouncementUserGuideFile}
          download="AnnouncementUserGuide.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-file btn-label" aria-hidden="true"></i>
          راهنــمای کاربردی
        </a>
      </div>
      <VerticalSpace space="0.5rem" />
      <Table
        handleChangePageSize={handleChangePageSize}
        dataSource={dataSource}
        columns={columns}
        pagination={tableParams?.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {!!modalConfirmation?.participation && (
        <RecordComments
          inputsData={inputsData}
          setInputsData={setInputsData}
          canceld={canceld}
          modalConfirmation={modalConfirmation}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const states = {
    ...mapGUidStateToProps(state),
    ...mapRoleStateToProps(state),
    ...mapQuestionModalStateToProps(state),
  };
  return states;
};
export default connect(mapStateToProps)(Announcement);

import { Col, Form, Input, Row } from "antd";
import Card from "../../../components/Card";
import LicenseAttention from "../../../components/licenseAttention";
import SerialNumberInput from "../../../components/SerialNumberInput";
import { useEffect, useRef, useState } from "react";
import { Button, GuideBox, Modal, Table } from "../../../components";
import Validation from "../../../utils/Validation";
import themeColors from "../../../configs/theme";
import { endpoints } from "../../../services/endpoints";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
  handleQuestionModal,
} from "../../../state/action-creators";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ExternalTradeRialExportExpressNewOtherCountriesPage() {
  const customCodeRef = useRef();
  const [form] = Form.useForm();
  const [inquiryInputsData, setInquiryInputsData] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [inquiryErrors, setInquiryErrors] = useState({
    cottageCode: [],
    customCode: [],
  });
  const { role, GUid } = useSelector((state) => state);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [flag, setFlag] = useState(false);
  const history = useHistory();

  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState("");

  // handleChangeInput--------------------------
  const handleInquiryChangeInputs = (
    name,
    value,
    validationNameList = undefined
  ) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    setInquiryErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });
    setInquiryInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  // inquiry function for frist inquiry----------------------------

  function inquiry() {
    const permit = permitForConfirmation(["cottageCode", "customCode"]);
    if (permit === true) {
      const postData = {
        CotageList: [inquiryInputsData?.cottageCode],
        urlVCodeInt: role,
        ssdsshGUID: GUid,
        year: null,
        customCode: inquiryInputsData?.customCode,
        cotageCode: inquiryInputsData?.cottageCode,
        advcurVcodeInt: 0,
      };

      dispatch(handleLoading(true));
      axios({
        url: endpoints.RestAPIs.ObligationEliminate
          .NTSW_ManageInquiryExportLicenseOtherCountries.url,
        method:
          endpoints.RestAPIs.ObligationEliminate
            .NTSW_ManageInquiryExportLicenseOtherCountries.method,
        data: postData,
      })
        .then((res) => {
          // this is set data

          if (res.data?.ErrorCode === 0) {
            const hasExistingItem = data?.find(
              (item) =>
                item.exlCotageCodeStr ===
                res?.data?.cotageList[0]?.exlCotageCodeStr
            );

            // If 'exlCotageCodeStr' is found, log the message
            if (hasExistingItem) {
              dispatch(
                handleMessageModal({
                  isModalOpen: true,
                  describe: "سریال اظهارنامه تکراری نمی توانید وارد کنید",
                })
              );
            } else {
              // If 'exlCotageCodeStr' is not found, add new items from 'res?.data?.cotageList'
              setData((prevData) => [...prevData, ...res?.data?.cotageList]);
            }

            form.resetFields();
          } else {
            dispatch(
              handleMessageModal({
                isModalOpen: true,
                describe: res.data?.ErrorDesc,
              })
            );
          }
          dispatch(handleLoading(false));
        })
        .catch((err) => {
          dispatch(handleLoading(false));
        });
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "اطلاعات درست وارد کنید.",
        })
      );
    }
  }
  useEffect(() => {
    console.log(data, "data");
  }, [data]);
  // function finalInquiry for final inquury--------------------------------------
  function finalInquiry() {
    // const cotageList={
    //   ...data,
    //   description:description
    // }
    const postData = {
      cotageList: data,
      urlVCodeInt: role,
      sessionID: GUid,
    };
    console.log(postData);

    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.ObligationEliminate.FinalCreateExportLicense.url,
      method:
        endpoints.RestAPIs.ObligationEliminate.FinalCreateExportLicense.method,
      data: postData,
    })
      .then((res) => {
        if (res.data?.ErrorCode === 0) {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              type: "success",
              describe: res.data?.ErrorDesc,
            })
          );
          history.push("/Users/AC/Currency/ExternalTradeRialExportExpress");
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }
  // useefect for change bUTTON------------------------------
  useEffect(() => {
    if (data.length > 0) {
      setFlag(true);
    } else {
      setFlag(false);
    }
  }, [data]);
  // useefect for massage modal
  // useEffect(() => {
  //   if (questionModal.name === "inquiry") {
  //     if (questionModal.answer === "yes") {
  //       finalInquiry();
  //       dispatch(
  //         handleQuestionModal({
  //           isModalOpen: false,
  //           title: "",
  //           describe: "",
  //           name: "",
  //         })
  //       );
  //     } else if (questionModal.answer === "no") {
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
  // }, [questionModal.answer, questionModal.isModalOpen]);
  //   columns
  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: " گمرگ",
      dataIndex: "ctmNameStr",
      align: "center",
      key: "ctmNameStr",
    },
    {
      title: "کوتاژ",
      dataIndex: "exlCotageCodeStr",
      align: "center",
      key: "exlCotageCodeStr",
    },
    {
      title: " نوع ارز",
      dataIndex: "curNameStr",
      align: "center",
      key: "curNameStr",
    },

    {
      title: "مبلغ کل",
      dataIndex: "exlTotalPriceMny",
      align: "center",
      key: "exlTotalPriceMny",
      render: (text, record) => {
        return <span>{Number(text).toLocaleString()}</span>;
      },
    },
    {
      title: "افزودن توضیحات(اختیاری)",
      dataIndex: "description",
      align: "center",
      key: "descriotion",
      render: (_, record) => (
        <button
          style={{
            backgroundColor: themeColors.btn.primary,
            border: "none",
            borderRadius: "2px",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => {
            handleAddDesc(record);
          }}
        >
          توضیحات
        </button>
      ),
    },
    {
      title: "عملیات",
      dataIndex: "exlCotageCodeStr",
      align: "center",
      key: "exlCotageCodeStr",
      render: (exlCotageCodeStr, record) => (
        <div>
          <button
            onClick={() => {
              setData((prevData) =>
                prevData.filter(
                  (item) => item.exlCotageCodeStr !== exlCotageCodeStr
                )
              );
            }}
            style={{
              backgroundColor: themeColors.btn.danger, // Customize button styles
              border: "none",
              borderRadius: "2px",
              color: "white",
              cursor: "pointer",
            }}
          >
            حذف{" "}
          </button>
        </div>
      ),
    },
  ];

  const handleAddDesc = (record) => {
    setDescription(record?.description);
    setSelectedRow(record);
    setOpenModal(true);
  };

  console.log(selectedRow);
  const handelSubmitModal = () => {
    console.log(selectedRow);
    const temp = data?.map((item) => {
      if (item?.exlCotageCodeStr === selectedRow?.exlCotageCodeStr) {
        return {
          ...item,
          description,
        };
      } else {
        return item;
      }
    });
    setData(temp);
    setOpenModal(false);
  };

  const handleValidation = (inputsName = []) => {
    const err = { ...inquiryErrors };
    inputsName.map((item) => {
      if (
        inquiryInputsData[item] === undefined ||
        inquiryInputsData[item] === null ||
        JSON.stringify(inquiryInputsData[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });

    setInquiryErrors(err);
    return err;
  };

  const permitForConfirmation = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (let key in error) {
      if (error[key]?.length > 0) {
        if (inputsName.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };
  return (
    <div>
      <LicenseAttention
        title="ظوابط استعلام پروانه "
        attenstion1="1- تاریخ پروانه ها باید در بازه زمانی 97/01/22 تا 97/05/16 باشد. "
        attention2="2- کشور طرف معامله مندرج در این پروانه ها باید غیر از کشورهای عراق یا افغانستان باشد"
      />
      <Card title="درج اطلاعات پروانه های صادراتی">
        <Form form={form}>
          <Form.Item
            initialValue={inquiryInputsData?.cottageCode}
            name="cottageCode"
          >
            <Row>
              <Col xs={24} md={12}>
                <GuideBox
                  tooltipTitle="«شماره سریال اظهارنامه عبارت است از کد گمرک و شماره کوتاژ صادراتی. به عنوان مثال اگر کد گمرک 50100 و شماره کوتاژ 123456 باشد شماره سریال اظهارنامه برابر است با 123456-50100»"
                  GuidedComponent={
                    <SerialNumberInput
                      className={
                        (inquiryErrors?.cottageCode?.length > 0 ||
                          inquiryErrors?.customCode?.length > 0) &&
                        "error"
                      }
                      required
                      cottageCodeValue={inquiryInputsData.cottageCode}
                      customCodeValue={inquiryInputsData.customCode}
                      cottageCodeError={inquiryErrors.cottageCode}
                      customCodeError={inquiryErrors.customCode}
                      onChange={handleInquiryChangeInputs}
                      validations={[["required"]]}
                      title="سریال اظهارنامه"
                      customCodeRef={customCodeRef}
                      type="number"
                      firstValidations={[
                        ["required", "شماره سریال الزامی است"],
                        ["maxLength", 5],
                      ]}
                      secondValidations={[
                        ["required", "کد کوتاژ الزامی است"],
                        ["maxLength", 12],
                      ]}
                    />
                  }
                />
              </Col>
              <Col xs={24} md={8}>
                <Button
                  backgroundColor={themeColors.btn.darkGreen}
                  onClick={inquiry}
                >
                  {!flag ? "استعلام پروانه" : "افزودن پروانه دیگر"}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
      <Table columns={columns} dataSource={data} hasPageSizeCombo={false} />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.25rem",
        }}
      >
        <Button
          onClick={() =>
            history.push("/Users/AC/Currency/ExternalTradeRialExportExpress")
          }
        >
          <i class=" fa fa-reply icon-flipped"></i>
          <p>انصراف</p>
        </Button>
        <Button
          backgroundColor={themeColors.btn.darkGreen}
          onClick={() => {
            dispatch(
              handleQuestionModal({
                isModalOpen: true,
                title: "تائیدیه اظهار پروانه",
                describe:
                  "رفع تعهد از پروانه های اظهار شده منوط به «تائید» کمیته اقدام ارزی بوده و اظهار پروانه در سامانه جامع تجارت به خودی خود منجر به رفع تهعد ارزی نمی گردد. همچنین کلیه مسئولیت ها و عواقب ناشی از اظهار نادرست به عهده بازرگان بوده و سامانه جامع تجارت مسئولیتی در این خصوص به عهده نخواهد داشت.",
                name: `inquiry`,
                onYes: finalInquiry,
              })
            );
          }}
          disabled={!data.length > 0}
        >
          <i class=" fa fa-step-backward"></i>
          ثبت و تمام{" "}
        </Button>
        <Modal
          open={openModal}
          title="توضیحات پروانه"
          closable={false}
          footer={[
            <Button
              backgroundColor={themeColors.btn.darkGreen}
              onClick={handelSubmitModal}
            >
              ثبت{" "}
            </Button>,
            <Button
              backgroundColor={themeColors.btn.danger}
              onClick={() => {
                setDescription("");
                setOpenModal(false);
              }}
            >
              لغو{" "}
            </Button>,
          ]}
        >
          <div
            style={{
              width: "90%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <p>
              توضیحات مد نظرتان در خصوص این پروانه را می توانید در این قسمت وارد
              کنید
            </p>
            <Input
              type="textarea"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default ExternalTradeRialExportExpressNewOtherCountriesPage;

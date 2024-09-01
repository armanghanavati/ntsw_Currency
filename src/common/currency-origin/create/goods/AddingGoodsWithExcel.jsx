import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import themeColors from "../../../../configs/theme";
import Validation from "../../../../utils/Validation";
import { useSelector, useDispatch } from "react-redux";
import { Col, Form, Row } from "antd";
import { endpoints } from "../../../../services/endpoints";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import {
  Button,
  GuideBox,
  Modal,
  Upload,
  VerticalSpace,
} from "../../../../components";

const AddingGoodsWithExcel = ({ pgtGUID, prfVCodeInt, getTable }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { role, GUid } = useSelector((state) => state);
  const [hrefForPrevDoc, setHrefForPrevDoc] = useState();

  const [inputsData, setInputsData] = useState({});
  // const [doc_base64, setDoc_base64] = useState();
  const [isShowModal, setIsShowModal] = useState(false);
  const [errors, setErrors] = useState(false);

  const [isShowErrorModal, setIsShowErrorModal] = useState(false);
  const [dataForErrorModal, setDataForOfErrorModal] = useState({});

  const handleChangeInputs = (name, value, validationNameList = []) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1], item[2]) === true) {
        } else {
          temp.push(Validation[item[0]](value, item[1], item[2]));
        }
      });
    setErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
    if (!!!value) {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "ابتدا فایل موردنظر خود را بارگذاری نمایید",
        })
      );
    } else if (temp?.length === 0) {
      upload(value);
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: temp[0],
        })
      );
    }
  };

  const handleShowModal = (event) => {
    event?.preventDefault();
    setIsShowModal(true);
  };

  const createPreCotageGoodsExcel = (event) => {
    event?.preventDefault();
    dispatch(handleLoading(true));
    const postData = {
      prfVCodeInt: prfVCodeInt,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.createPreCotageGoodsExcel.url,
      method: endpoints.RestAPIs.preCotage.createPreCotageGoodsExcel.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.ErrorCode === 0) {
            saveAsXlsxFile(res?.data?.Result?.Result);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    if (!!hrefForPrevDoc && !!inputRef?.current?.href) {
      inputRef?.current?.click();
    }
  }, [hrefForPrevDoc]);

  const saveAsXlsxFile = (file) => {
    const raw = window.atob(file);
    const rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    var data = new Blob([array], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    setHrefForPrevDoc(window.URL.createObjectURL(data));
  };

  const upload = (selectedFile) => {
    let file = null;
    if (!!selectedFile) {
      let fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        file = fileLoadedEvent.target.result;
        getPreCotageGoodsExcel({ base64: fileLoadedEvent.target.result });
      };
      fileReader.readAsDataURL(selectedFile);
    }
    return file;
  };

  const getPreCotageGoodsExcel = ({ base64 }) => {
    dispatch(handleLoading(true));
    const postData = {
      prfVCodeInt: prfVCodeInt,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      ExcelByBase64String: base64.split(";base64,")[1],
      pgtGUID,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.getPreCotageGoodsExcel.url,
      method: endpoints.RestAPIs.preCotage.getPreCotageGoodsExcel.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.Result?.Error === 0) {
          dispatch(
            handleMessageModal({
              type: "success",
              isModalOpen: true,
              describe: res?.data?.Result?.ErrorDesc,
            })
          );
          // setDoc_base64();
          getTable({ isSavedGoodsWithExcel: true });
          setInputsData({});
          setIsShowModal(false);
          setHrefForPrevDoc();
          setErrors({});
        } else if(res?.data?.Result?.Error === -1000){
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe:
                "مشکلی در سیستم به وجود آمده است. لطفا مراتب را به مدیر سیستم اطلاع دهید.",
            })
          );
        }else{
          setIsShowErrorModal(true);
          setDataForOfErrorModal({
            base64: res?.data?.Result?.Result,
            message: res?.data?.Result?.ErrorDesc,
          });
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  const handleCancelModal = (event) => {
    event.preventDefault();
    setIsShowModal(false);
    setInputsData({
      ...inputsData,
      inputsData: undefined,
      doc: undefined,
      hsCode: undefined,
    });
    setErrors({});
    setHrefForPrevDoc();
  };

  const handleCancelErrorModal = () => {
    setIsShowErrorModal(false);
    setDataForOfErrorModal({});
  };

  const handleDownloadExcelForErrorModal = () => {
    handleCancelErrorModal();
    saveAsXlsxFile(dataForErrorModal.base64);
  };

  return (
    <>
      <Row>
        <Col sm={24} md={12} xl={12}>
          <GuideBox
            style={{ justifyContent: "start" }}
            tooltipTitle="در صورتی که ترجیح می‌دهید اطلاعات کالاها را با استفاده از فایل اکسل درج کنید، از این دکمه استفاده کنید. صفحه راهنمای فایل اکسل نمونه در این بخش را حتماً مطالعه کنید."
            GuidedComponent={
              <Button onClick={handleShowModal} width="207px">
                <i class="fa fa-download" aria-hidden="true"></i>
                افزودن کالا از طریق فایل اکسل
              </Button>
            }
          />
        </Col>
      </Row>
      {isShowModal && (
        <Modal
          centered
          title="انتخاب فایل اکسل کالاها"
          open={isShowModal}
          onCancel={handleCancelModal}
          width={700}
          footer={[
            <Button
              backgroundColor={themeColors.btn.danger}
              onClick={handleCancelModal}
            >
              انصراف
            </Button>,
          ]}
        >
          {
            <form style={{ padding: "0 20px" }}>
              <Row>
                <Col sm={24} md={16} xl={16}>
                  <p className="text-small text-small--bold">
                    فایل نمونه برای افزودن کالاها را دانلود کرده و کالاهای خود
                    را درآن درج نمایید.
                  </p>
                </Col>
                <Col sm={24} md={8} xl={8}>
                  <span className="flex-order-row-justify-end">
                    <Button onClick={createPreCotageGoodsExcel}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      دانلود فایل اکسل نمونه
                    </Button>

                    <a
                      ref={inputRef}
                      href={hrefForPrevDoc}
                      download={`Ntsw_Mansha${prfVCodeInt}`}
                    ></a>
                  </span>
                </Col>
              </Row>
              <VerticalSpace space="1rem" />
              <Row>
                <Col sm={24} md={24} xl={24}>
                  <p className="text-small text-small--bold">
                    سپس از اینجا آپلود نمایید.
                  </p>
                </Col>
                <VerticalSpace space="1.5rem" />

                <Col sm={24} md={24} xl={24}>
                  <Form.Item name="doc" style={{ margin: "0" }}>
                    <Upload
                      width="190px"
                      error={errors?.doc}
                      accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      validations={[
                        [
                          "fileFormat",
                          [
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "application/vnd.ms-excel",
                          ],
                          "xlsx,xls",
                        ],
                        ["fileSize", 2000],
                      ]}
                      title="مستند"
                      buttonTittle="انتخاب و ثبت فایل اکسل..."
                      buttonWidth="160px"
                      name="doc"
                      onChange={handleChangeInputs}
                      placeholder="فایل موردنظر را انتخاب کنید..."
                      file={inputsData?.doc}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </form>
          }
        </Modal>
      )}
      {isShowErrorModal && (
        <Modal
          centered
          title="خطای ثبت فایل اکسل"
          open={isShowErrorModal}
          onCancel={handleCancelErrorModal}
          width={300}
          footer={[
            <Button
              onClick={handleDownloadExcelForErrorModal}
              backgroundColor={themeColors.btn.secondary}
            >
              <i class="fa fa-download" aria-hidden="true"></i>
              دانلود
            </Button>,
          ]}
        >
          {
            <form style={{ padding: "0 20px" }}>
              <VerticalSpace space="1rem" />
              <Row>
                <Col sm={24} md={24} xl={24}>
                  <p className="text-red text-small text-small--bold ">
                    {dataForErrorModal?.message}
                  </p>
                </Col>
              </Row>
              <VerticalSpace space="1rem" />
            </form>
          }
        </Modal>
      )}
    </>
  );
};

export default AddingGoodsWithExcel;

import React, { useEffect, useState } from "react";
import { Checkbox, Col, Form, Modal, Radio, Rate, Row } from "antd";
import { Button, Input, Upload, VerticalSpace } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { handleLoading, handleMessageModal } from "../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../services/endpoints";
import themeColors from "../../configs/theme";
import Validation from "../../utils/Validation";
import ButtonsImage from "./btns-image/btns-image";

const RecordComments = ({
  inputsData,
  setInputsData,
  canceld,
  modalConfirmation,
}) => {
  const { role, GUid, theme, loading } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState({});
  const getQuestions = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      SurveyID: inputsData?.surveyInfo?.SurveyID,
      TargetInstance: inputsData?.surveyInfo?.TargetInstance,
      EventInstance: inputsData?.surveyInfo?.EventInstance,
    };

    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getQuestions.url,
      method: endpoints.RestAPIs.buyCurrency.getQuestions.method,
      data: postData,
    })
      .then((res) => {
        const prevData = {};
        res?.data?.QuestionList?.map((item) => {
          prevData[item?.qtnVCodeInt] =
            item?.qtnqkdVCodeInt === 8 && !!item?.Answer?.AnswerDocument
              ? {
                  ...item?.Answer?.AnswerDocument,
                  name: item?.Answer?.AnswerDocument?.FileName,
                }
              : !!item?.Answer?.ansTextStr
              ? item?.Answer?.ansTextStr
              : Array.isArray(item?.Answer?.AnswerOptionList)
              ? item?.Answer?.AnswerOptionList[0]?.anoqopVCodeInt
              : undefined;
        });
        setInputsData({
          ...inputsData,
          questionList: res?.data?.QuestionList,
          SurveyName: res?.data?.SurveyName,
          ...prevData,
        });
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    if (!!modalConfirmation?.survey) {
      form.resetFields();
      getQuestions();
    }
  }, [modalConfirmation]);

  const insertAnswers = () => {
    const dataList = inputsData?.questionList?.map((item) => {
      if (!!inputsData[item?.qtnVCodeInt] || item?.qtnqkdVCodeInt === 8) {
        return {
          ansVCodeInt: 0,
          ansTextStr:
            item?.qtnqkdVCodeInt === 8 && !!inputsData[item?.qtnVCodeInt]?.name
              ? inputsData[item?.qtnVCodeInt]?.name
              : item?.qtnqkdVCodeInt === 8
              ? 0
              : item.qtnqkdVCodeInt === 2
              ? null
              : inputsData[item?.qtnVCodeInt],
          anssuqVCodeInt: item?.suqVCodeInt,
          ansKind: item?.qtnqkdVCodeInt,
          AnswerOptionList:
            item.qtnqkdVCodeInt === 2
              ? [
                  {
                    anoqopVCodeInt: inputsData[item?.qtnVCodeInt],
                  },
                ]
              : [],
          AnswerDocument: !!inputsData[item?.qtnVCodeInt]?.File
            ? {
                File: inputsData[item?.qtnVCodeInt]?.File,
                FileName: inputsData[item?.qtnVCodeInt]?.name,
                Extention: inputsData[item?.qtnVCodeInt]?.Extention,
              }
            : null,
        };
      } else return undefined;
    });

    const filterDataList =
      dataList && dataList?.filter((item) => item !== undefined);
    const postData = {
      AnswerStatus: 1,
      SurveyID: inputsData?.surveyInfo?.SurveyID,
      TargetInstance: inputsData?.surveyInfo?.TargetInstance,
      EventInstance: inputsData?.surveyInfo?.EventInstance,
      UserRoleID: role,
      AnswerList: filterDataList,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.insertAnswers.url,
      method: endpoints.RestAPIs.buyCurrency.insertAnswers.method,
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
          setInputsData({ ...inputsData, success: true });
          canceld("survey");
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
  };

  const handleChangeUpload = (name, value, validationNameList = undefined) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1], item[2]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1], item[2]));
        }
      });
    setErrors((prevstate) => {
      return {
        ...prevstate,
        [name]:
          (value === undefined || value === null) && temp.length === 0
            ? undefined
            : [...temp],
      };
    });

    let formatSplit = value?.name?.slice(-4);
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    async function Main() {
      const file = value;
      let basenew = await toBase64(file);
      const words = basenew?.split(",");
      return words[1];
    }
    Main()
      .then((data) => {
        setInputsData((prvs) => ({
          ...prvs,
          [name]: { File: data, name: value.name, Extention: formatSplit },
        }));
        form.resetFields();
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    setErrors((prevstate) => {
      return {
        ...prevstate,
        [name]:
          (value === undefined || value === null) && temp.length === 0
            ? undefined
            : [...temp],
      };
    });
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  const handleChangeIRadio = (e, id, validationNameList) => {
    const { value } = e.target;
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    setErrors((prevstate) => {
      return {
        ...prevstate,
        [id]:
          (value === undefined || value === null) && temp.length === 0
            ? undefined
            : [...temp],
      };
    });
    setInputsData({ ...inputsData, [id]: value });
  };

  const checkedValidation = (event) => {
    event?.preventDefault();
    const requiredItems = inputsData?.questionList.map((item) => {
      if (item?.suqIsMandatoryTny === 1) {
        return JSON.stringify(item?.qtnVCodeInt);
      }
    });
    const inputsError = Object.keys(errors).filter((item) => {
      if (
        !!item &&
        item !== "undefined" &&
        Array.isArray(errors[item]) &&
        errors[item]?.length > 0
      ) {
        return item;
      }
    });

    if (
      permitForNextStep([
        ...new Set([...requiredItems, ...(inputsError || [])]),
      ]) === true
    ) {
      insertAnswers();
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "به تمامی سوالات پاسخ داده نشده است.",
        })
      );
      return;
    }
  };

  const permitForNextStep = (inputsName = []) => {
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

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        inputsData[item] === undefined ||
        inputsData[item] === null ||
        JSON.stringify(inputsData[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setErrors(err);
    return err;
  };

  const handelRate = (e, item) => {
    setInputsData({ ...inputsData, [item?.qtnVCodeInt]: e });
  };

  const handelCheckBox = (e, item) => {
    setInputsData({ ...inputsData, [item?.qtnVCodeInt]: e.target.value });
  };

  const onCancelModal = () => {
    form.resetFields();
    const uploadFile = inputsData?.questionList.find(
      (item) => item?.qtnqkdVCodeInt === 8
    );
    setInputsData((prev) => ({
      ...prev,
      questionList: inputsData?.questionList,
      SurveyName: inputsData?.SurveyName,
      callRepite: inputsData?.callRepite,
      surveyInfo: inputsData?.surveyInfo,
      [uploadFile?.qtnVCodeInt]: undefined,
    }));
    setErrors({});
    canceld("survey");
  };

  return (
    <>
      {!!inputsData?.questionList && !loading && (
        <Modal
          className="modalQuestion"
          width={1300}
          zIndex={999}
          style={{
            backgroundColor: themeColors[theme]?.menueBg,
            color: themeColors[theme]?.text,
          }}
          onCancel={onCancelModal}
          footer={[
            <div style={{ display: "flex" }}>
              <Button
                backgroundColor={themeColors.btn?.secondary}
                onClick={checkedValidation}
              >
                ثبت نظرات
              </Button>
              <Button
                onClick={onCancelModal}
                backgroundColor={themeColors.btn?.danger}
              >
                بستن
              </Button>
            </div>,
          ]}
          open={modalConfirmation?.survey}
          title={inputsData?.SurveyName}
        >
          <Row style={{ padding: "10px 25px" }}>
            <Col sm={24} md={24} xl={24} style={{ marginBottom: "20px" }}>
              <p className="text-small text-small--bold">
                این نظرسنجی با هدف دریافت نظرات و پیشنهادات بازرگانان در جهت
                بازطراحی، بهبود عملکرد و رفع نواقص سامانه نیما تهیه شده است.
              </p>
              <VerticalSpace space="0.5rem" />
              <p className="text-small text-small--bold">
                از کلیه بازرگانان محترم دعوت می شود که با ارسال نظرات خود، ما را
                در پیشبرد این هدف یاری نمایند.
              </p>
            </Col>
            {inputsData?.questionList?.map((item) =>
              item?.qtnqkdVCodeInt === 1 ? (
                <Col sm={24} md={12} xl={24} style={{ marginBottom: "20px" }}>
                  <Input
                    title={item?.qtnTextStr}
                    value={inputsData[item?.qtnVCodeInt]}
                    name={item?.qtnVCodeInt}
                    onChange={handleChangeInputs}
                    validations={
                      item?.suqIsMandatoryTny === 1 ? [["required"]] : []
                    }
                    error={errors?.[item?.qtnVCodeInt]}
                    type="textarea"
                    labelWidth="235px"
                    required={item?.suqIsMandatoryTny === 1}
                  />
                </Col>
              ) : item?.qtnqkdVCodeInt === 2 ? (
                <Col
                  sm={24}
                  md={12}
                  xl={24}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label style={{ marginLeft: "3px" }}>
                      {item.qtnTextStr}
                    </label>
                    {item?.suqIsMandatoryTny === 1 && (
                      <span className="input--main--label__required-sign">
                        *
                      </span>
                    )}
                  </div>
                  {item?.QuestionOption?.map((itm) => (
                    <Radio.Group
                      value={inputsData[item?.qtnVCodeInt]}
                      style={{ display: "flex", alignItems: "start" }}
                      name={"qopVCodeInt"}
                      onChange={(e) => handleChangeIRadio(e, item?.qtnVCodeInt)}
                    >
                      <Radio value={itm.qopVCodeInt}>{itm.qopNameStr}</Radio>
                    </Radio.Group>
                  ))}
                </Col>
              ) : item?.qtnqkdVCodeInt === 3 ? (
                <Col sm={24} md={12} xl={24} style={{ marginBottom: "20px" }}>
                  <span>
                    {item?.suqIsMandatoryTny === 1 && (
                      <span className="input--main--label__required-sign">
                        *
                      </span>
                    )}
                    {item.qtnTextStr}
                    <Rate
                      value={inputsData[item?.qtnVCodeInt] || 0}
                      onChange={(e) => handelRate(e, item)}
                    />
                  </span>
                  {!!inputsData[item?.qtnVCodeInt] && (
                    <div>
                      <i
                        className="fa fa-check-circle "
                        style={{ color: themeColors.btn?.secondary }}
                      />{" "}
                      باتشکر، شما به این پرسش نظرسنجی{" "}
                      {inputsData[item?.qtnVCodeInt]} امتیاز دادید
                    </div>
                  )}
                </Col>
              ) : item?.qtnqkdVCodeInt === 4 ? (
                <Col sm={24} md={12} xl={24} style={{ marginBottom: "20px" }}>
                  <div>
                    <label style={{ marginLeft: "3px" }}>
                      {item.qtnTextStr}
                    </label>
                    {item?.suqIsMandatoryTny === 1 && (
                      <span className="input--main--label__required-sign">
                        *
                      </span>
                    )}
                  </div>
                  <Checkbox
                    onChange={(e) => handelCheckBox(e, item)}
                    value={inputsData[item?.qtnVCodeInt]}
                    name={item?.qtnTextStr}
                  ></Checkbox>
                </Col>
              ) : item?.qtnqkdVCodeInt === 5 ? (
                <>
                  <Col sm={24} md={12} xl={12} style={{ marginBottom: "20px" }}>
                    <Input
                      title={item?.qtnTextStr}
                      value={inputsData[item?.qtnVCodeInt]}
                      name={item?.qtnVCodeInt}
                      onChange={handleChangeInputs}
                      error={errors?.[item?.qtnVCodeInt]}
                      validations={
                        item?.suqIsMandatoryTny === 1 ? [["required"]] : []
                      }
                      required={item?.suqIsMandatoryTny === 1}
                      type="text"
                    />
                  </Col>
                </>
              ) : item?.qtnqkdVCodeInt === 6 ? (
                <Col sm={24} md={12} xl={12} style={{ marginBottom: "20px" }}>
                  <Input
                    title={item?.qtnTextStr}
                    value={inputsData[item?.qtnVCodeInt]}
                    name={item?.qtnVCodeInt}
                    onChange={handleChangeInputs}
                    validations={
                      item?.suqIsMandatoryTny === 1
                        ? [["required"], ["email"]]
                        : [["email"]]
                    }
                    error={errors?.[item?.qtnVCodeInt]}
                    required={item?.suqIsMandatoryTny === 1}
                    type="email"
                  />
                </Col>
              ) : item?.qtnqkdVCodeInt === 7 ? (
                <Col sm={24} md={12} xl={12} style={{ marginBottom: "20px" }}>
                  <Input
                    title={item?.qtnTextStr}
                    value={inputsData[item?.qtnVCodeInt]}
                    name={item?.qtnVCodeInt}
                    onChange={handleChangeInputs}
                    validations={
                      item?.suqIsMandatoryTny === 1 ? [["required"]] : []
                    }
                    error={errors?.[item?.qtnVCodeInt]}
                    required={item?.suqIsMandatoryTny === 1}
                    type="number"
                  />
                </Col>
              ) : item?.qtnqkdVCodeInt === 8 ? (
                <Col sm={24} md={24} xl={24} className="upload--container">
                  <Form form={form} style={{ width: "100%" }}>
                    <Form.Item name={item?.qtnVCodeInt}>
                      <Upload
                        title={item?.qtnTextStr}
                        name={item?.qtnVCodeInt}
                        onChange={handleChangeUpload}
                        required={item?.suqIsMandatoryTny === 1}
                        accept=".zip,.rar,.7zip,.yz,.pdf,.jpg,.jpeg,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.gif,.bmp,.tif"
                        validations={[
                          ...(item?.suqIsMandatoryTny === 1
                            ? [["required"]]
                            : []),
                          [
                            "fileFormat",
                            [
                              "application/pdf",
                              "application/zip",
                              "application/vnd.rar",
                              "application/x-7z-compressed",
                              "pdf",
                              "zip",
                              "yz",
                              "rar",
                              "7zip",
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                              "application/msword",
                              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                              "application/vnd.ms-excel",
                              "image/jpg",
                              "image/gif",
                              "image/bmp",
                              "image/tiff",
                              "image/jpeg",
                            ],
                            "jpg,jpeg,rar,zip,7z,yz,pdf,doc,gif,bmp,tif,xls,xlsx",
                          ],
                          ["fileSize", 3000],
                        ]}
                        error={errors?.[item?.qtnVCodeInt]}
                        file={inputsData[item?.qtnVCodeInt]}
                        LabelWidth="195px"
                      />
                    </Form.Item>
                  </Form>
                  <ButtonsImage
                    data={item}
                    inputsData={inputsData}
                    setInputsData={setInputsData}
                    form={form}
                    setErrors={setErrors}
                  />
                </Col>
              ) : null
            )}
          </Row>
        </Modal>
      )}
    </>
  );
};

export default RecordComments;

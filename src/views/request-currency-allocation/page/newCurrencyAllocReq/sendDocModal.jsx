import React, { useState } from "react";
import { Button, Modal, Upload, VerticalSpace } from "../../../../components";
import Validation from "../../../../utils/Validation";
import { useDispatch, useSelector } from "react-redux";
import themeColors from "../../../../configs/theme";
import { Col, Row, Form } from "antd";
import { handleMessageModal } from "../../../../state/action-creators";

const SendDocModal = ({
  docsData,
  setDocsData,
  setInputsData,
  open,
  setOpen,
  docs,
  setDocs,
  setErrors,
  errors,
  restImageDoc,
}) => {
  const [showUploadInputs, setShowUploadInputs] = useState(true);
  const [dataName, setDataName] = useState(["DOCS-1"]);
  const [formValues, setFormValues] = useState([]);
  const { theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const convertBase64Image = (value) => {
    let formatSplit = value?.name?.slice(-4);
    async function Main() {
      const file = value;
      let basenew = await toBase64(file);
      const words = basenew?.split(",");
      return words[1];
    }
    Main()
      .then((data) => {
        console.log(data, value);
        setDocs((prvs) => [
          ...prvs,
          { DocumentName: value?.name, DocumentFormat: formatSplit, data },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeInputs = async (
    name,
    value,
    validationNameList = undefined,
    index
  ) => {
    if (name === dataName[dataName.length - 1]) {
      const temporary = Number(dataName[dataName?.length - 1].split("-")[1]);
      setDataName([...dataName, `DOCS-${temporary + 1}`]);
      setFormValues((prevstate) => {
        return {
          ...prevstate,
          [name]: value,
        };
      });
    }
    const temp = [];
    validationNameList &&
      validationNameList?.map((item) => {
        if (Validation[item[0]](value, item[1], item[2]) === true) {
        } else {
          temp?.push(Validation[item[0]](value, item[1], item[2]));
          // dispatch(
          //   handleMessageModal({
          //     isModalOpen: true,
          //     describe: Validation[item[0]](value, item[1], item[2]),
          //   })
          // );
        }
      });
    setErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });

    if (dataName?.includes(name)) {
      const data = await toBase64(value);
      const words = data?.split(",");
      const DocumentByteByBase64String = words[1];
      let formatSplit = value?.name?.slice(-4);
      const temp = !!docs ? [...docs] : [];
      const fixName = value?.name?.split(".")[0]
      temp[index] = { DocumentName: fixName, DocumentFormat: formatSplit, DocumentByteByBase64String };
      console.log(temp);
      // setDocs([...temp]);
      setDocs([...temp]);
      return;
    }

    // convertBase64Image(value);
    setFormValues((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  console.log("formValues", formValues);

  const removeUpload = (event, name) => {
    event?.preventDefault();
    const index = dataName.indexOf(name);

    if (index >= 0) {
      if (index == dataName.length - 1) {
        setFormValues({
          ...formValues,
          [name]: undefined,
        });
      } else {
        dataName.splice(index, 1);
        setErrors({
          ...errors,
          [name]: [],
        });
      }
    }

    setShowUploadInputs(false);
    setTimeout(() => {
      setShowUploadInputs(true);
    }, 200);

    let temp = docs?.filter((item, indx) => indx !== index);
    setDocs(temp);
  };

  // const resetForm = () => {
  //   // form.resetFields()
  //   setDocs([]);
  //   setFormValues([]);
  //   setDataName(["DOCS-1"]);
  //   dataName.forEach((itm) => {
  //     delete errors?.[itm];
  //   });
  //   setInputsData((prvs) => ({
  //     ...prvs,
  //     cmpOfficialNewspaperTrackingCodeStr: "",
  //   }));
  //   delete errors.cmpOfficialNewspaperTrackingCodeStr;
  //   setOpen(false);
  // };

  const permit = () => {
    for (var key in errors) {
      if (errors[key]?.length > 0) {
        return false;
      }
    }
  };

  const insertPermitDocuments = () => {
    if (permit() !== false) {
      setDocsData((prev) => {
        console.log(prev)
        return !!prev ? [...prev, ...docs] : [...docs]
      });
      setOpen(false);
    }
  };

  const canceled = () => {
    setOpen(false);
    setDocs([]);
  };

  const validType = [
    "jpg",
    "jpeg",
    ".jpg",
    ".jpeg",
    "pdf",
    ".pdf",
    "txt",
    ".txt",
    "doc",
    ".doc",
    "docx",
    ".docx",
  ];

  return (
    <>
      {/* <Button
        type="primary"
        onClick={() => setOpen(true)}
        hasVerticalSpace={false}
        id="AddDocuments"
      >
        <i class="fa fa-plus-square" aria-hidden="true"></i>
        انتخاب تصاویر مدرک
      </Button> */}
      <Modal
        className="questionModal"
        onCancel={canceled}
        footer={[
          <Button
            backgroundColor={themeColors.btn.secondary}
            onClick={insertPermitDocuments}
          >
            <i className="fa fa-check" />
            ثبت مستندات
          </Button>,
          <Button backgroundColor={themeColors.btn.danger} onClick={canceled}>
            <i className="fa fa-close" />
            انصراف
          </Button>,
        ]}
        open={open}
        title={"انتخاب مستند پرونده"}
      >
        {/* <form className="form"> */}
        <Form form={form} className="form">
          <div className={`${theme === "dark" ? "dark_Container_docs" : "container-docs" }  "container_shadow document-modal--text"`}>
            <p>
              <span className={"font-bold-in-block"}>توجه</span>
              <span className="d-in-block">
                اندازه هریک از مستندات انتخابی بایستی کمتر از 400 کیلوبایت باشد.
              </span>
            </p>
            <p >
              فرمت های قابل قبول : .jpg , .jpeg , .pdf, .txt, .doc, .docx, .png
            </p>
          </div>
          <VerticalSpace space="1rem" />
          {showUploadInputs &&
            dataName?.map((item, index) => {
              console.log(item);
              return (
                <Row key={`documents${index}`} justify="center">
                  <Col sm={20} md={20} xl={20}>
                    <Form.Item name={`DOCS-${index}`}>
                      <Upload
                        name={item}
                        onChange={(name, value, validationNameList) => {
                          handleChangeInputs(
                            name,
                            value,
                            validationNameList,
                            index
                          );
                        }}
                        error={errors?.[item]}
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.pdf,.jpg,.svg,.png,.jpeg,.doc,.docx,.xml,application/msword"
                        // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.zip,.rar,.7zip,.pdf,.jpg,.svg,.png,.jpeg,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        // accept=".jpg,.jpeg,.docx,.doc,.txt,.pdf"
                        validations={[
                          [
                            "fileFormat",
                            [
                              "application/pdf",
                              "pdf",
                              "txt",
                              "doc",
                              "docx",
                              // "zip",
                              // "rar",
                              // "7zip",
                              // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                              // "application/vnd.ms-excel",
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                              "application/msword",
                              "image/png",
                              "image/jpg",
                              // "image/svg",
                              "image/jpeg",
                            ],
                            "jpg,jpeg,pdf,txt,doc,docx",
                          ],
                          ["fileSize", 400],
                        ]}
                        title="مستند"
                        defaultFile={formValues[item]}
                      />
                    </Form.Item>
                  </Col>
                  {/*  <Row>
                    <div className="image-box">
                      {docs?.[index]?.data &&
                        validType.includes(
                          docs?.[index]?.DocumentFormat?.toLowerCase()
                        ) && (
                          <img
                            src={
                              "data:image/png;base64," +
                              docs?.[index]?.data
                            }
                            width={"100%"}
                            height={"100%"}
                            alt="preview img"
                          />
                        )}
                    </div>
                    <Button
                      style={{
                        border: "none",
                        borderTopRightRadius: "0",
                        borderBottomRightRadius: "0",
                        borderBottomLeftRadius: "4px",
                        borderTopLeftRadius: "4px",
                        backgroundColor: "rgb(237, 78, 42)",
                        minWidth: "40px",
                        marginRight: "-20px",
                      }}
                      backgroundColor={themeColors.btn.danger}
                      onClick={(e) => removeUpload(e, item)}
                    >
                      <i
                        class="fa fa-times"
                        style={{ fontSize: "18px", color: "#fff" }}
                        title="حذف"
                      />
                    </Button> 
                  </Row>*/}
                </Row>
              );
            })}
        </Form>
        {/* </form> */}
      </Modal >
    </>
  );
};

export default SendDocModal;

import { Button, Input, Modal, VerticalSpace } from "../../../../components";
import themeColors from "../../../../configs/theme";
import { useState } from "react";
import Validation from "../../../../utils/Validation";

const GetPrecotageCode = ({
  isShowModal,
  setIsShowModal,
  children,
  handleSubmitModal,
  modalTitle,
  buttonBackgroundColor,
  hasMessageOnTop,
}) => {
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSend = (e) => {
    e.preventDefault();
    if (!!inputsData?.PrecotageCode && errors?.PrecotageCode?.length === 0) {
      handleSubmitModal(inputsData?.PrecotageCode);
    } else {
      handleChangeInputs("PrecotageCode", inputsData?.PrecotageCode, [
        ["required"],
        ["serialNumber"],
      ]);
    }
  };

  const onCancelModal = (event) => {
    event?.preventDefault();
    setInputsData();
    setIsShowModal(false);
    setErrors({});
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
        [name]: [...temp],
      };
    });
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsShowModal(true)}
        backgroundColor={buttonBackgroundColor}
      >
        {children}
      </Button>
      <Modal
        title={modalTitle}
        open={isShowModal}
        setIsOpen={setIsShowModal}
        footer={[
          <Button onClick={handleSend}>ارسال</Button>,
          <Button
            backgroundColor={themeColors.btn.danger}
            onClick={onCancelModal}
          >
            بازگشت
          </Button>,
        ]}
        width={600}
        onCancel={onCancelModal}
      >
        <form className="form">
          {hasMessageOnTop && (
            <span className="text-medium">
              لطفا شماره سریال اظهارنامه خود را وارد کنید.
            </span>
          )}
          <VerticalSpace space="1rem" />
          <Input
            title="شماره کوتاژ"
            name="PrecotageCode"
            onChange={handleChangeInputs}
            value={inputsData?.PrecotageCode}
            error={errors?.PrecotageCode}
            maxLength={16}
            validations={[["required"], ["serialNumber"]]}
            placeholder={hasMessageOnTop ? "نمونه: 1234567-99000" : ""}
          />
        </form>
      </Modal>
    </>
  );
};

export default GetPrecotageCode;

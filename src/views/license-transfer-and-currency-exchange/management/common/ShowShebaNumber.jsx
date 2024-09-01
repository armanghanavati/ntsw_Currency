import { Button, Modal } from "../../../../components";
import { useState } from "react";
import themeColors from "../../../../configs/theme";

// ------------> دکمه مشاهده ستون شماره شبا در تب کارتابل واگذاری <------------

const ShowShebaNumber = ({ cdtRialAccountNumber }) => {
  const [isShowModal, setIsShowModal] = useState(false);

  const handleOnClick = (event) => {
    event?.preventDefault();
    setIsShowModal(true);
  };

  const handleCancelModal = (event) => {
    event?.preventDefault();
    setIsShowModal(false);
  };

  return (
    <>
      <Button onClick={handleOnClick} type="secondary">
        مشاهده
      </Button>
      <Modal
        title="مشاهده اطلاعات"
        open={isShowModal}
        onCancel={handleCancelModal}
        width={300}
        footer={[
          <Button
            backgroundColor={themeColors.btn.danger}
            onClick={handleCancelModal}
          >
            بستن
          </Button>,
        ]}
      >
        <form className="form">{cdtRialAccountNumber}</form>
      </Modal>
    </>
  );
};
export default ShowShebaNumber;

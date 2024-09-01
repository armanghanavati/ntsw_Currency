import React from "react";
import { Button, Modal } from "../../../../../../components";
import themeColors from "../../../../../../configs/theme";
import { useSelector } from "react-redux";

const Desciption = ({ showDescription, setShowDescription, data }) => {
  const { theme } = useSelector((state) => state);

  return (
    <>
      <Modal
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
        centered
        title="شرایط انجام معامله و دریافت وجه ریالی"
        open={showDescription}
        width={900}
        footer={[
          <Button
            type="success"
            onClick={(event) => {
              event.preventDefault();
              setShowDescription(false);
            }}
          >
            بستن
          </Button>,
        ]}
        onCancel={() => setShowDescription(false)}
      >
        <p>{data?.advDealConditions}</p>
      </Modal>
    </>
  );
};

export default Desciption;

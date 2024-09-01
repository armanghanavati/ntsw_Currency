import { Button, Modal } from "../../../components";
import themeColors from "../../../configs/theme";

export default function RialExportsModal({ title, openModal, setOpenModal }) {
  return (
    <Modal
      open={openModal}
      footer={   <Button
        onClick={() => {
          setOpenModal(false);
        }}
        backgroundColor={themeColors.btn.darkGreen}
       
      >
     بستن
      </Button>}
      width="350px"
      title="توضیحات"
   
      className="custom-modal"

    >
      <div className="modalMain">
        <p>{title}</p>
     
      </div>
    </Modal>
  );
}

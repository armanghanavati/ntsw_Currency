import { useSelector } from "react-redux";
import { Modal as AntdModal } from "antd";
import themeColors from "../configs/theme";

const Modal = ({
  open,
  setIsOpen = () => {},
  children,
  onCancel,
  footer,
  width,
  title,
  centered,
  closeIcon,
  className,
  closable="true",
  zIndex
}) => {
  const { theme } = useSelector((state) => state);

  return (
    <AntdModal
      style={{
        backgroundColor: themeColors[theme]?.menueBg,
        color: themeColors[theme]?.text,
      }}
      centered={centered}
      title={title}
      open={open}
      onCancel={!!onCancel ? onCancel : () => setIsOpen(false)}
      footer={footer}
      width={width}
      closeIcon={closeIcon}
      className={className}
      closable={closable}
      zIndex={zIndex}
    >
      {children}
    </AntdModal>
  );
};

export default Modal;

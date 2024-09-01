import { useSelector } from "react-redux";
import { Modal as AntdModal } from "antd";
import themeColors from "../configs/theme";
import pdfFileRout from "../../src/assets/pdfFile/ExchangeGuide.pdf";
import Button from "./Button";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
const MultyPdf = ({
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
  backgroundColor = "#0C8BB0",
  arrayPdf,
  arrayVideo
}) => {
  const { theme } = useSelector((state) => state);
  //   const arrayPdf = [
  //     { rout: pdfFileRout, name: "1", title:"1" },
  //     { rout: pdfFileRout, name: "2", title:"2" },
  //   ];

  const handleDownloadPDF = (name, rout) => {
    // Create a link to the PDF file
    const pdfFile = rout; // Assuming 'pdfFile' contains the path to your PDF

    // Create a hidden link element
    const link = document.createElement("a");
    link.href = pdfFile;
    link.target = "_blank";
    link.download = name; // Set the desired file name

    // Trigger a click event on the link to download the PDF
    link.click();
  };
  return (
    <AntdModal
      style={{
        backgroundColor: themeColors[theme]?.menueBg,
        color: themeColors[theme]?.text,
      }}
      bodyStyle={{ backgroundColor: backgroundColor }}
      centered={centered}
      title={title}
      open={open}
      onCancel={!!onCancel ? onCancel : () => setIsOpen(false)}
      footer={footer}
      width={width}
      closeIcon={closeIcon}
      className={className}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "10px",
          color: "white",
          padding:"20px"
        }}
      >
        {arrayPdf?.map((item) => {
          return (
            <Link onClick={() => handleDownloadPDF(item.name, item.rout)} style ={{display:"flex" , gap:"10px", alignItems:"center"}}>
              <i className="fa fa-download"></i>
            <p >  {item.title}</p>
            </Link>
          );
        })}
      </div>
    </AntdModal>
  );
};

export default MultyPdf;

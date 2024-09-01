import { Button, GuideBox, VerticalSpace } from "../../../components";
import themeColors from "../../../configs/theme";
import Validation from "../../../utils/Validation";

const ButtonsImage = ({ data, inputsData, setInputsData, form, setErrors }) => {
  const downloadImage = (e, File) => {
    e.preventDefault();
    let a = document.createElement("a");
    a.href = `data:image/${File?.FileName?.split(".")[1]};base64,` + File?.File;
    a.download = File?.FileName;
    a.click();
  };

  const removeUpload = (e, data) => {
    e.preventDefault();
    setInputsData({ ...inputsData, [data?.qtnVCodeInt]: undefined });
    form.resetFields();
    setErrors((prev) => {
      return {
        ...prev,
        [data?.qtnVCodeInt]:
          data?.suqIsMandatoryTny === 1 ? [Validation.required()] : undefined,
      };
    });
  };

  return (
    <div>
      <div className="flex-order-row" style={{ alignItems: "start" }}>
        {!!data?.Answer?.AnswerDocument && (
          <Button
            onClick={(e) => downloadImage(e, data?.Answer?.AnswerDocument)}
            hasVerticalSpace={false}
          >
            <i className="fa fa-download" />
          </Button>
        )}
        <GuideBox
          style={{ height: "33px", paddingBottom: "0px" }}
          tooltipTitle={
            "توجه امکان بارگذاری فایل تا 3 مگابایت و با فرمت های (zip, pdf, rar, 7z, doc, docx, jpeg, jpg, gif, bmp, tif, xls, xlsx)"
          }
        />
        <Button
          className="btn-remove-upload"
          backgroundColor={themeColors.btn.danger}
          onClick={(e) => removeUpload(e, data)}
        >
          <i
            className="fa fa-times"
            style={{ fontSize: "18px", color: "#fff" }}
          />
        </Button>
      </div>
      <VerticalSpace space="10px" />
    </div>
  );
};

export default ButtonsImage;

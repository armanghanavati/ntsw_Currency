import { Button } from "../components";
import themeColors from "../configs/theme";
import * as XLSX from "xlsx-js-style";

const ExcelExportButton = ({
  getData = () => {},
  loading,
  icon = "fa fa-table",
  title,
  itemForDownload,
  backgroundColor = themeColors.btn.purple,
}) => {
  const getDataforExcel = (e) => {
    e?.preventDefault();
    getData(handleGenerateExcel, itemForDownload);
  };

  const handleGenerateExcel = (headerRow, bodyData, fileName) => {
    const workbook = XLSX.utils.book_new();

    const tempHeader = headerRow?.map((item) => {
      return {
        v: item,
        t: "s",
        s: {
          fill: { fgColor: { theme: 4 }, bgColor: { theme: 4 } },
          font: { bold: true, sz: 12 },
          alignment: {
            wrapText: true,
            horizontal: "center",
            vertical: "center",
          },
        },
      };
    });

    const tempBody = bodyData?.map((row) => {
      const temp = [];
      row.map((item) => {
        temp.push({
          v: !!item || item === 0 ? item : "",
          t: "s",
          s: {
            alignment: {
              wrapText: true,
              horizontal: "center",
              vertical: "center",
            },
          },
        });
      });
      return temp;
    });

    const worksheet = XLSX.utils.aoa_to_sheet([[...tempHeader], ...tempBody]);

    let objectMaxLength = [];
    bodyData.map((arr) => {
      Object.keys(arr).map((key) => {
        let value = !arr[key] && arr[key]!==0 ? "" : arr[key];
        if (typeof value === "number") {
          return (objectMaxLength[key] = 10);
        }
        objectMaxLength[key] =
          objectMaxLength[key] >= value?.length
            ? objectMaxLength[key]
            : value?.length;
      });
    });

    let worksheetCols = objectMaxLength.map((width) => {
      return {
        width: width + 10,
      };
    });
    worksheet["!cols"] = worksheetCols;
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Button
      loading={loading}
      backgroundColor={backgroundColor}
      onClick={(e) => getDataforExcel(e)}
    >
      <i class={icon} aria-hidden="true"></i>
      خروجی اکسل
      {title}
    </Button>
  );
};
export default ExcelExportButton;

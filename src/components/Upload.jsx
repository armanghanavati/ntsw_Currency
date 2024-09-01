// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { VerticalSpace } from ".";
// import themeColors from "../configs/theme";
// import { Upload as AntdUpload } from "antd";
// import Button from "./Button";
// import { useEffect } from "react";
// const Upload = ({
//   title,
//   name = "",
//   onChange = () => {},
//   type = "primary",
//   error,
//   placeholder,
//   validations,
//   accept,
//   defaultFile,
//   buttonTittle = "انتخاب...",
//   width,
// }) => {
//   const { theme } = useSelector((state) => state);
//   const [fileList, setFileList] = useState([]);
//   const [mounted, setMounted] = useState(false);

//   console.log(fileList, mounted);

//   const props = {
//     beforeUpload: (file) => {
//       setFileList([file]);
//       return false;
//     },
//     fileList,
//   };

//   useEffect(() => {
//     if (mounted) {
//       onChange(name, fileList[0], validations);
//     }
//   }, [fileList]);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return (
//     <>
//       {type === "primary" ? (
//         <>
//           <span
//             style={{
//               color: themeColors[theme]?.inputText,
//               height: "34px",
//             }}
//             className="input"
//           >
//             <span
//               className={
//                 error?.length === 0
//                   ? "input--main--valid"
//                   : error?.length > 0
//                   ? "input--main--error"
//                   : "input--main"
//               }
//             >
//               <label
//                 className={
//                   error?.length === 0
//                     ? "input--main--label--valid"
//                     : error?.length > 0
//                     ? "input--main--label--error"
//                     : "input--main--label"
//                 }
//                 style={{
//                   backgroundColor: themeColors[theme]?.bg,
//                   height: "32px",
//                   minWidth: "195px",
//                   width: "195px",
//                 }}
//               >
//                 {title}
//                 {/* //{required ? <span className="input--main--label__required-sign">*</span> : ""}  */}
//               </label>
//               <span className="upload">
//                 <input
//                   className="upload--box"
//                   placeholder={placeholder}
//                   defaultValue={defaultFile?.name}
//                   style={{
//                     color: themeColors[theme]?.inputText,
//                     backgroundColor: themeColors[theme]?.inputBg,
//                     borderRadius: 0,
//                   }}
//                   readOnly={true}
//                 />
//                 {!!defaultFile?.name && (
//                   <span
//                     className="upload--remove-icon"
//                     onClick={() => {
//                       onChange(name, undefined, validations);
//                       // setFileList([]);
//                     }}
//                   >
//                     <i className="fa fa-times-circle " aria-hidden="true"></i>
//                   </span>
//                 )}
//               </span>
//             </span>
//             <AntdUpload {...props} accept={accept} showUploadList={false}>
//               <Button
//                 width={width}
//                 onClick={(event) => event.preventDefault()}
//                 hasVerticalSpace={false}
//                 margin="0"
//               >
//                 <i className="fa fa-folder-open" aria-hidden="true"></i>
//                 {buttonTittle}
//               </Button>
//             </AntdUpload>
//           </span>
//           <span className="flex-order-column">
//             {mounted &&
//               error &&
//               error.map((err, index) => (
//                 <span
//                   key={`${name}-errors-${index}`}
//                   className="input--error-message"
//                 >
//                   {err}
//                 </span>
//               ))}
//           </span>
//           <VerticalSpace space="10px" />
//         </>
//       ) : (
//         <AntdUpload {...props} accept={accept} showUploadList={false}>
//           <Button
//             width={width}
//             onClick={(event) => event.preventDefault()}
//             hasVerticalSpace={false}
//             margin="0"
//           >
//             <i className="fa fa-folder-open" aria-hidden="true"></i>
//             {buttonTittle}
//           </Button>
//         </AntdUpload>
//       )}
//     </>
//   );
// };
// export default Upload;
import { useState } from "react";
import { connect } from "react-redux";
import { VerticalSpace } from ".";
import themeColors from "../configs/theme";
import { Upload as AntdUpload } from "antd";
import Button from "./Button";
import { useEffect } from "react";
import { mapThemeStateToProps } from "../state/mapStateToProps";
const Upload = ({
  theme,
  title,
  name = "",
  file,
  onChange = () => {},
  type = "primary",
  error,
  placeholder,
  validations,
  accept,
  LabelWidth = "195px",
}) => {
  const [fileList, setFileList] = useState([]);
  const [value, setValue] = useState();
  const [mounted, setMounted] = useState(false);

  console.log(file, "file");
  const props = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  useEffect(() => {
    if (mounted) {
      // setValue(fileList[0]?.name || undefined);
      onChange(name, fileList[0], validations);
    }
  }, [fileList]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {type === "primary" ? (
        <>
          <span
            style={{
              color: themeColors[theme]?.inputText,
              height: "34px",
            }}
            className="input"
          >
            <span
              style={{ marginLeft: "2px" }}
              className={
                error?.length === 0
                  ? "input--main--valid"
                  : error?.length > 0
                  ? "input--main--error"
                  : "input--main"
              }
            >
              <label
                className={
                  error?.length === 0
                    ? "input--main--label--valid"
                    : error?.length > 0
                    ? "input--main--label--error"
                    : "input--main--label"
                }
                style={{
                  backgroundColor: themeColors[theme]?.bg,
                  height: "32px",
                  minWidth: "auto",
                  width: "inherit",
                  maxWidth: LabelWidth,
                }}
              >
                {title}
                {/* //{required ? <span className="input--main--label__required-sign">*</span> : ""}  */}
              </label>
              <span className="upload">
                <input
                  className="upload--box"
                  placeholder={placeholder}
                  defaultValue={value || file?.name}
                  style={{
                    color: themeColors[theme]?.inputText,
                    backgroundColor: themeColors[theme]?.inputBg,
                    borderRadius: 0,
                  }}
                  readOnly={true}
                />
                {/* {!!value && (
                  <i
                    onClick={() => setFileList([])}
                    className="fa fa-times-circle upload--remove-icon"
                    aria-hidden="true"
                  ></i>
                )} */}
              </span>
            </span>
            <AntdUpload
              {...props}
              accept={accept}
              showUploadList={false}
              id="upload-button"
            >
              <Button
                name="upload"
                onClick={(event) => event.preventDefault()}
                hasVerticalSpace={false}
                margin="0"
              >
                <i className="fa fa-folder-open" aria-hidden="true"></i>
                انتخاب...
              </Button>
            </AntdUpload>
          </span>
          <span className="flex-order-column">
            {mounted &&
              error &&
              error.map((err, index) => (
                <span
                  key={`${name}-errors-${index}`}
                  className="input--error-message"
                >
                  {err}
                </span>
              ))}
          </span>
          <VerticalSpace space="10px" />
        </>
      ) : (
        <AntdUpload {...props} accept={accept} showUploadList={false}>
          <Button
            name="select"
            onClick={(event) => event.preventDefault()}
            margin="0"
            hasVerticalSpace={false}
          >
            <i className="fa fa-folder-open" aria-hidden="true"></i>
            انتخاب...
          </Button>
        </AntdUpload>
      )}
    </>
  );
};
export default connect(mapThemeStateToProps)(Upload);

import { Col, Row } from "antd";
import { Button, GuideBox, Input, VerticalSpace } from "../../../../components";
import Validation from "../../../../utils/Validation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import themeColors from "../../../../configs/theme";
import { BillOfLadingTable } from "../../../../common";
import modes from "../../../../enums/modes";
import ShowBillOfLadingList from "./ShowBillOfLadingList";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import Delete from "./Delete";
import { handleMessageModal } from "../../../../state/action-creators";

const BillOfLading = ({
  prfCustomInt,
  tabledataSource,
  setTabledataSource,
}) => {
  const { theme } = useSelector((state) => state);
  const { role, GUid } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [inputsData, setInputsData] = useState({});
  const [loading, setLoading] = useState(false);

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
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  const addToBillOfLadingList = (event) => {
    event?.preventDefault();
    if (!!inputsData?.selectedBillOfLadingDataFromTable) {
      const hasDuplicate = tabledataSource?.filter(
        (x) =>
          x?.BillOfLaddingTrackingcode ===
          inputsData?.selectedBillOfLadingDataFromTable
            ?.BillOfLaddingTrackingcode
      );
      if (hasDuplicate.length > 0) {
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: "مجاز به وارد کردن بارنامه تکراری نیستید.",
          })
        );
      } else {
        checkBillOfladingEndorsement();
      }
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "بارنامه خود را از لیست انتخاب نمایید.",
        })
      );
    }
  };

  const checkBillOfladingEndorsement = () => {
    setLoading(true);
    const postData = {
      BillOfLadingID:
        inputsData?.selectedBillOfLadingDataFromTable?.BillOfLadingID,
      BillOfLadingNumber:
        inputsData?.selectedBillOfLadingDataFromTable?.BillOfLadingNumber,
      TravellingDate:
        inputsData?.selectedBillOfLadingDataFromTable?.TravellingDate,
      PortOfDischargeName:
        inputsData?.selectedBillOfLadingDataFromTable?.PortOfDischargeName,
      IsBillOfLadingContainer:
        inputsData?.selectedBillOfLadingDataFromTable?.IsBillOfLadingContainer,
      IsBillOfLadingContainerStr:
        inputsData?.selectedBillOfLadingDataFromTable
          ?.IsBillOfLadingContainerStr,
      NationalCode: inputsData?.selectedBillOfLadingDataFromTable?.NationalCode,
      pcbBOLDate: inputsData?.selectedBillOfLadingDataFromTable?.pcbBOLDate,
      BillOfLaddingTrackingcode:
        inputsData?.selectedBillOfLadingDataFromTable
          ?.BillOfLaddingTrackingcode,
      endorsementStatus:
        inputsData?.selectedBillOfLadingDataFromTable?.endorsementStatus,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.checkBillOfladingEndorsement.url,
      method: endpoints.RestAPIs.preCotage.checkBillOfladingEndorsement.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data?.ErrorCode === 0) {
          setTabledataSource([
            ...tabledataSource,
            inputsData?.selectedBillOfLadingDataFromTable,
          ]);
          setInputsData({
            inputsData,
            selectedBillOfLadingDataFromTable: undefined,
          });
        }else{
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.ErrorDesc,
            })
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };


  return (
    <div className="container-with-border">
      <div
        className="container-with-border__title"
        style={{
          backgroundColor: themeColors[theme]?.bg,
        }}
      >
        افزودن بارنامه
      </div>
      <div className="bill-of-lading-contaner__data">
        <div className="bill-of-lading-contaner__data--inputs">
          <Row>
            <Col sm={24} md={24} xl={24}>
              <ShowBillOfLadingList
                setInputsData={setInputsData}
                prfCustomInt={prfCustomInt}
              />
            </Col>
          </Row>
          <VerticalSpace space="1rem" />
          <Row>
            <Col sm={24} md={24} xl={24}>
              <Input
                onChange={handleChangeInputs}
                value={
                  inputsData?.selectedBillOfLadingDataFromTable
                    ?.BillOfLaddingTrackingcode
                }
                title="کد رهگیری بارنامه"
                readOnly={true}
              />
            </Col>
            <Col sm={24} md={24} xl={24}>
              <Input
                onChange={handleChangeInputs}
                value={
                  inputsData?.selectedBillOfLadingDataFromTable
                    ?.BillOfLadingNumber
                }
                title="شماره بارنامه"
                readOnly={true}
              />
            </Col>
            <Col sm={24} md={24} xl={24}>
              <Input
                title="تاریخ صدور بارنامه"
                value={
                  inputsData?.selectedBillOfLadingDataFromTable?.pcbBOLDate?.split(
                    "T"
                  )[0]
                }
                onChange={handleChangeInputs}
                readOnly={true}
              />
            </Col>
            <Col sm={24} md={24} xl={24}>
              <GuideBox
                tooltipTitle="پس از وارد کردن هر شماره و تاریخ بارنامه، یک بار این دکمه را بزنید."
                GuidedComponent={
                  <Button
                    borderRadius="0px 4px 4px 0px"
                    onClick={addToBillOfLadingList}
                    loading={loading}
                  >
                    <i class="fa fa-plus-square" aria-hidden="true"></i>
                    افزودن به لیست
                    <i class="fa fa-chevron-left" aria-hidden="true"></i>
                  </Button>
                }
              />
            </Col>
          </Row>
        </div>
        <div className="bill-of-lading-contaner__data--table">
          <BillOfLadingTable
            mode={modes.Add}
            loading={loading}
            dataSource={tabledataSource}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            isBarFarabaran={true}
          />
          {tabledataSource.length > 0 && <VerticalSpace space="1rem" />}
          <Row>
            <Col sm={24} md={24} xl={24}>
              <Delete
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                setTabledataSource={setTabledataSource}
                tabledataSource={tabledataSource}
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default BillOfLading;

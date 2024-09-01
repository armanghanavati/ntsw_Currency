import { Col, Form, Row } from "antd";
import { Button, GuideBox, Input, VerticalSpace } from "../../../components";
import Validation from "../../../utils/Validation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BillOfLadingTable, DeleteBillOfLading } from "../../../common";
import modes from "../../../enums/modes";
import { handleMessageModal } from "../../../state/action-creators";
import { Datepicker } from "../../../components/DatePicker";
import moment from "jalali-moment";
import { useEffect } from "react";
import themeColors from "../../../configs/theme";

const AddingBillOfLadingByUser = ({ tabledataSource, setTabledataSource }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { theme } = useSelector((state) => state);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [tomorrow, setTomorrow] = useState();

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
    setErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });
  };

  const addToBillOfLadingList = (event) => {
    event?.preventDefault();
    if (!!inputsData?.BillOfLadingNumber && !!inputsData?.date) {
      const hasDuplicate = tabledataSource?.filter(
        (x) => x?.BillOfLadingNumber === inputsData?.BillOfLadingNumber
      );
      if (hasDuplicate.length > 0) {
        dispatch(
          handleMessageModal({
            isModalOpen: true,
            describe: "مجاز به وارد کردن بارنامه تکراری نیستید.",
          })
        );
      } else {
        setTabledataSource([
          ...tabledataSource,
          {
            ...inputsData,
            date: `${inputsData?.date?.year}/${inputsData?.date?.month}/${inputsData?.date?.day}`,
          },
        ]);
        setInputsData({});
        form.resetFields();
      }
    } else {
      dispatch(
        handleMessageModal({
          isModalOpen: true,
          describe: "لطفا بارنامه خود را وارد نمایید.",
        })
      );
    }
  };

  useEffect(() => {
    const today = moment().add(1, "days");
    setTomorrow(moment(today).format("YYYY/MM/DD"));
  }, []);

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
              <GuideBox
                tooltipTitle="شماره بارنامه‌های این محموله را وارد کنید."
                GuidedComponent={
                  <Input
                    onChange={handleChangeInputs}
                    value={inputsData?.BillOfLadingNumber}
                    title="شماره بارنامه"
                    name="BillOfLadingNumber"
                    className={
                      errors?.BillOfLadingNumber?.length > 0 && "error"
                    }
                    validations={[["required"]]}
                  />
                }
                error={errors?.BillOfLadingNumber}
              />
            </Col>
            <Col sm={24} md={24} xl={24}>
              <Form form={form}>
                <Form.Item initialValue={inputsData?.date} name="date">
                  <GuideBox
                    tooltipTitle="تاریخ بارنامه‌های این محموله را وارد کنید."
                    GuidedComponent={
                      <Datepicker
                        name="date"
                        title="تاریخ بارنامه"
                        defaultValue={inputsData?.date}
                        onChange={handleChangeInputs}
                        className={errors?.date?.length > 0 && "error"}
                        validations={[["required"]]}
                        locale="en"
                        maximumDate={tomorrow}
                        hasVerticalSpace={false}
                      />
                    }
                    error={errors?.date}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col sm={24} md={24} xl={24}>
              <GuideBox
                tooltipTitle="پس از وارد کردن هر شماره و تاریخ بارنامه، یک بار این دکمه را بزنید."
                GuidedComponent={
                  <Button
                    borderRadius="0px 4px 4px 0px"
                    onClick={addToBillOfLadingList}
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
            mode={modes.StatisticalRegistration}
            dataSource={tabledataSource}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            isBarFarabaran={false}
            rowKey="BillOfLadingNumber"
          />
          {tabledataSource.length > 0 && <VerticalSpace space="1rem" />}
          <Row>
            <Col sm={24} md={24} xl={24}>
              <DeleteBillOfLading
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                setTabledataSource={setTabledataSource}
                tabledataSource={tabledataSource}
                billOfLadingKeyForDelete="BillOfLadingNumber"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AddingBillOfLadingByUser;

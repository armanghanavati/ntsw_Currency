import { Col, Row, Form } from "antd";
import { Button, Input, Table, Tooltip } from "../../../components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import themeColors from "../../../configs/theme";
import Validation from "../../../utils/Validation";
import QuickGuide from "../../../components/QuickGuide";
import TooltipButton from "../../../components/TooltipButton";
import Card from "../../../components/Card";

function CurrencyAllocationRequestDivide() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [inputsData, setInputsData] = useState({});
  const [errors, setErrors] = useState({});
  const [NewRequestAmount, setNewRequestAmount] = useState(null);
  const [CurrenyRrequestAmount, setCurrenyRrequestAmount] = useState(null);
  const [dataTabel, setDataTabel] = useState([]);
  const [modalType, setModalType] = useState("");
  const { theme, colorMode, role, GUid, questionModal, messageModal } =
    useSelector((state) => state);
  const [data, setData] = useState([]);
  const history = useHistory();
  const [arrayDivide, setArrayDivide] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [form] = Form.useForm();

  // usefet for get data-------------------------------
  useEffect(() => {
    const postData = {
      carVCodeLng: location.search.substring(1),
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .GetCurrencyAllocationRequestDetailForDividing.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .GetCurrencyAllocationRequestDetailForDividing.method,
      data: postData,
      // Important for binary data
    })
      .then((res) => {
        setData(res.data);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
        history.goBack();
      });
  }, []);
  // handel change input for two input divide it ------------------------------------
  const handleChangeInputs = (name, value, validationNameList = undefined) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1], item[2]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1], item[2]));
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
  // columns for data grid--------------------------------------
  const columns = [
    {
      title: "مبلغ درخواست ",
      dataIndex: "value",
      align: "center",
    },
    {
      title: "عملیات",
      dataIndex: "id",
      align: "center",
      render: (id, index) => (
        <div className="flex-order-row">
          <Button
            backgroundColor={themeColors.btn.danger}
            onClick={() => {
              setDataTabel(dataTabel.filter((item) => item.id !== id));
            }}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];
  function DivideFeasibility() {
    const postData = {
      carVCodeLng: location.search.substring(1),
      CurrentCarAmountMny: inputsData.CurrenyRrequestAmount,
      DividedCarAmountMnyList: arrayDivide,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    dispatch(handleLoading(true));

    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.DivideCurrencyAllocationRequest
        .url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.DivideCurrencyAllocationRequest
          .method,
      data: postData,
      // Important for binary data
    })
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          setModalType("NAVIGATE");
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              title: "موفقیت امیز",
              describe: res?.data?.ErrorDesc,
              type: "success",
            })
          );

        }
        else if (res.data?.ErrorCode === 1 || res.data.ErrorCode === 5) {
          setModalType("NAVIGATE");
          dispatch(
            handleMessageModal({
              isModalOpen: true,
            
              describe: res?.data?.ErrorDesc,
         
            })
          );
          
        }
         else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data.ErrorDesc,
            })
          );
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }

  useEffect(() => {
    if (messageModal?.isModalOpen == false && modalType === "NAVIGATE") {
      history.push({
        pathname: "/Users/AC/Currency/RequestCurrencyAllocation",
        state: {
          orderRegistrationNumber:
            data?.CurrencyAllocationRequest.prfOrderNoStr,
        },
      });
    }
  }, [messageModal.isModalOpen]);
  // useefect  for get array of divide valu ebase on inputdaat change

  useEffect(() => {
    setArrayDivide(dataTabel.map((obj) => obj.value));
  }, [dataTabel]);
  const ItemModalHandler = (event) => {
    event.preventDefault();
    setEnabled(!enabled);
  };
  // steps for quick guid
  const steps = [
    {
      element: "#one",
      intro: `1)
      در این بخش اطلاعات فعلی درخواست تخصیص ارز شما نمایش داده می شود.`,
      position: "left",
    },
    {
      element: "#two",
      intro: `2)
     شما باید در این فیلد مبلغ جدید درخواست تخصیص ارز را وارد نمایید.`,
      position: "left",
    },
    {
      element: "#three",
      intro: `3)
شما باید در این فیلد مبلغ شکسته شده از درخواست تخصیص ارز را وارد کرده و سپس دکمه افزودن را بزنید.`,

      position: "left",
    },
    {
      element: "#four",
      intro: `4)
      در این جدول مبالغ شکسته شده درخواست تخصیص ارز نمایش داده می شود. با زدن دکمه"حذف" در ستون عملیات می توانید مبلغ مد نظر را پاک نمایید.

`,
      position: "left",
    },
    {
      element: "#five",
      intro: `5)
      با زدن دکمه "انصراف" صفحه تجزیه درخواست تخصیص بسته می شود و به منوی اصلی باز خواهید گشت.`,
      position: "left",
    },
    {
      element: "#six",
      intro: `6)
      در صورتیکه از صحت اطلاعات وارد شده مطمئن هستید با زدن دکمه "تجزیه" تغییرات را اعمال نمایید و منتظر مشاهده نتیجه باشید.`,
      position: "left",
    },
  ];
  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        inputsData[item] === undefined ||
        inputsData[item] === null ||
        String(inputsData[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });

    setErrors(err);
    return err;
  };

  const permitForConfirmation = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (let key in error) {
      if (error[key]?.length > 0) {
        if (inputsName.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };
  return (
    <QuickGuide enabled={enabled} setEnabled={setEnabled} steps={steps} don>
      <Card
        title="اطلاعات تجزیه ی درخواست"
        headStyle={{ background: "#ddd" }}
        style={{
          textAlign: "center",
          marginBottom: "20px",
          boxShadow: "0 0 3px rgba(0,0,0,.2)",
          marginTop: "20px",
        }}
      >
        {data?.CurrencyAllocationRequest ? (
          <Form hand>
            <div id="one">
              <Row>
                <Col xs={24} lg={12} xl={8}>
                  {" "}
                  <Input
                    title="  شماره پرونده"
                    value={data?.CurrencyAllocationRequest.prfVCodeInt}
                    readOnly
                  />
                </Col>
                <Col xs={24} lg={12} xl={8}>
                  {" "}
                  <Input
                    title="  شماره ی ثبت سفارش"
                    value={data?.CurrencyAllocationRequest.prfOrderNoStr}
                    readOnly
                  />
                </Col>
                <Col xs={24} lg={12} xl={8}>
                  {" "}
                  <Input
                    title=" شماره ردیف"
                    value={data?.CurrencyAllocationRequest.carRowNoInt}
                    readOnly
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} lg={12} xl={8}>
                  {" "}
                  <Input
                    title=" مبلغ به ارز ثبت سفارش"
                    value={
                      data?.CurrencyAllocationRequest
                        .carAmountInProformaCurrencyMny
                    }
                    readOnly
                  />
                </Col>
                <Col xs={24} lg={12} xl={8}>
                  {" "}
                  <Input
                    title="  نوع ارز ثبت سفارش"
                    value={data?.CurrencyAllocationRequest.prfcurNameStr}
                    readOnly
                  />
                </Col>
                <Col xs={24} lg={12} xl={8}>
                  {" "}
                  <Input
                    title=" مبلغ تامین به ارز ثبت سفارش"
                    value={data?.AllocatedAmountInProformaCurrency}
                    readOnly
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} lg={12} xl={8}>
                  {" "}
                  <Input
                    title="  مبلغ درخواست "
                    value={data?.CurrencyAllocationRequest.carAmountMny}
                    readOnly
                  />
                </Col>
                <Col xs={24} lg={12} xl={8}>
                  {" "}
                  <Input
                    title=" نوع ارز درخواست "
                    value={data?.CurrencyAllocationRequest.carcurNameStr}
                    readOnly
                  />
                </Col>
                <Col xs={24} lg={12} xl={8}>
                  {" "}
                  <Input
                    title=" مبلغ تامین به ارز درخواست"
                    value={data?.AllocatedAmountInRequestCurrency}
                    readOnly
                  />
                </Col>
              </Row>
            </div>
            <Row justify="center" style={{ marginTop: "50px" }} id="two">
              <Col xs={24} lg={12}>
                <Input
                  isCurrency={true}
                  title="مبلغ درخواست فعلی"
                  TooltipTitle="مبلغ درخواست تخصیص ارز که در فیش اصلی باقی خواهد ماند.این مبلغ نباید از مبلغ تامین ارز درخواست کمتر باشد"
                  value={inputsData.CurrenyRrequestAmount}
                  onChange={handleChangeInputs}
                  error={errors.CurrenyRrequestAmount}
                  name="CurrenyRrequestAmount"
                  type="number"
                  validations={[
                    [
                      "minValue",
                      0,
                      "مقدار مجازمبلغ درخواست فعلی باید بزگتر از صفر باشد",
                    ],
                  ]}
                />
              </Col>
            </Row>
            <div id="three">
              <Row justify="center">
                <Col xs={24} lg={12}>
                  <Form.Item initialValue={inputsData.NewRequestAmount}>
                    <Input
                      isCurrency={true}
                      title="مبلغ درخواست جدید"
                      TooltipTitle="مبلغ درخواست تخصیص جدید که از شکست درخواست اصلی ایجاد میشود باید دقت شود که مجموع مبلغ درخواست فعلی و درخواست های جدید ایجاد شده باید دقیقا برابر مبلغ درخواست تخصیص ارز قبل تجزیه باشد"
                      value={inputsData.NewRequestAmount}
                      onChange={handleChangeInputs}
                      error={errors.NewRequestAmount}
                      name="NewRequestAmount"
                      type="number"
                      required
                      validations={[
                        [
                          "minValue",
                          0,
                          "مقدار مجازمبلغ درخواست جدید باید بزگتر از صفر باشد",
                        ],
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="center">
                <div className="currencyAddButton">
                  <Button
                    onClick={(e) => {
                      const permit = permitForConfirmation([
                        "NewRequestAmount",
                        "CurrenyRrequestAmount",
                      ]);
                      if (permit === true) {
                        const newId = Math.floor(Math.random() * 1000000); // Generate a random id
                        setDataTabel((current) => [
                          ...current,
                          { id: newId, value: inputsData.NewRequestAmount },
                        ]);
                        form.resetFields(["NewRequestAmount"]);
                        setInputsData((prevstate) => ({
                          ...prevstate,
                          NewRequestAmount: null, // Set the NewRequestAmount state to null or any default value
                        }));
                      } else {
                      }
                    }}
                  >
                    افزودن
                  </Button>
                  <Tooltip
                    title="بعد از وارد کردن مبلغ هریک از درخواست تخصیص ارز جدید با زدن این دکمه مبلغ هریک از فیش های شکسته شده از فیش اصلی تعیین می گردد."
                    color={themeColors.btn.secondary}
                  />
                </div>
              </Row>
            </div>
            <Row justify="center" id="four">
              <Col xs={24} lg={12}>
                <Table
                  columns={columns}
                  dataSource={dataTabel}
                  hasPageSizeCombo={false}
                  pagination={false}
                />
              </Col>
            </Row>
          </Form>
        ) : (
          ""
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.25rem",
          }}
        >
          <TooltipButton
            onClick={ItemModalHandler}
            iconClass={"fa-info"}
            backgroundColor={themeColors.comments.green}
            tooltipText={"راهنمای سریع"}
          />
          <Button
            onClick={() =>
              history.push({
                pathname: "/Users/AC/Currency/RequestCurrencyAllocation",
                state: {
                  orderRegistrationNumber:
                    data?.CurrencyAllocationRequest.prfOrderNoStr,
                },
              })
            }
            name="five"
          >
            <p>انصراف</p>
          </Button>
          <Button
            backgroundColor={themeColors.btn.darkGreen}
            onClick={DivideFeasibility}
            name="six"
          >
            <p>تجزیه</p>
          </Button>
        </div>
      </Card>
    </QuickGuide>
  );
}
export default CurrencyAllocationRequestDivide;

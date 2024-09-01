import { useEffect, useState } from "react";
import { Button, GuideBox, Input, Modal, Table } from "../../components";
import themeColors from "../../configs/theme";
import { Col, Row } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  mapGUidStateToProps,
  mapRoleStateToProps,
  mapThemeStateToProps,
  mapColorModeStateToProps,
} from "../../state/mapStateToProps";
import { handleLoading } from "../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../services/endpoints";
import Validation from "../../utils/Validation";

const BankSelectInput = ({
  inputsData,
  errors,
  handleChangeInputs,
  setErrors,
  setInputsData,
  title = "بانک",
  required,
  role,
  GUid,
  theme,
  colorMode,
  readonly = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [bankList, setBankList] = useState([]);

  const dispatch = useDispatch();

  const handleChangePageSize = (event) => {
    event.preventDefault();
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        pageSize: Number(event.target.value) || 0,
        current: 1,
      },
    });
  };

  const handleBankChangeInput = (
    name,
    value,
    validationNameList = undefined
  ) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1], item[2]));
        }
      });

    setErrors((prevstate) => {
      return {
        ...prevstate,
        [name]: [...temp],
      };
    });
    setInputsData((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  const getDestinationBankList = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      bnkNameEnStr: inputsData?.bnkNameEnStrr?.trim() || null,
      bnkSwiftCodeStr: inputsData?.bnkSwiftCodeStrr?.trim() || null,
      startIndex:
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
        1,
      pageSize: tableParams?.pagination?.pageSize,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getDestinationBankList.url,
      method: endpoints.RestAPIs.buyCurrency.getDestinationBankList.method,
      data: postData,
    })
      .then((res) => {
        setBankList(res?.data?.sarrafiCompanyList);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res?.data?.count || 0,
          },
        });

        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  };

  useEffect(() => {
    getDestinationBankList();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  const select = (e, record) => {
    e.preventDefault();
    setInputsData((prvs) => ({
      ...prvs,
      bnkNameEnStr: record?.bnkNameEnStr,
      bnkSwiftCodeStr: record?.bnkSwiftCodeStr,
      countryList: String(record?.cnyNameStr),
    }));
    setErrors((prevstate) => {
      return {
        ...prevstate,
        bnkNameEnStr: [],
        bnkSwiftCodeStr: [],
      };
    });

    setShowModal(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (item, { RowNumber }, index) => <>{RowNumber}</>,
    },
    {
      title: "کد",
      dataIndex: "bnkSwiftCodeStr",
      align: "center",
    },
    {
      title: "عنوان",
      dataIndex: "bnkNameEnStr",
      align: "center",
    },
    {
      title: "کشور مقصد",
      dataIndex: "cnyNameStr",
      align: "center",
    },
    {
      title: "انتخاب",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={(e) => select(e, record)}
            backgroundColor={themeColors.btn.secondary}
          >
            <i class="fa fa-check" />
            انتخاب
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <GuideBox
        style={{ width: "100%" }}
        error={errors?.bnkNameEnStr}
        tooltipTitle="        با کلیک بر روی علامت ذره بین، می توانید بانک مقصد را انتخاب کنید. در صورتی که نام بانک مورد نظر در لیست موجود نبود می توانید در همین فیلد به صورت دستی آن را تایپ نمایید."
        GuidedComponent={
          <>
            <Input
              title={title}
              maxWidth={150}
              name="bnkNameEnStr"
              onChange={handleBankChangeInput}
              labelWidth="150px"
              validations={required ? [["required"]] : []}
              value={inputsData?.bnkNameEnStr}
            />
            <Button
              className="btn-destination-bank"
              backgroundColor={
                theme === "light"
                  ? themeColors.btn.content
                  : themeColors[theme]?.menueBg
              }
              onClick={() => setShowModal(true)}
              disabled={readonly}
            >
              <i class="fa fa-search" />
            </Button>
          </>
        }
      />
      {showModal && (
        <Modal
          className="questionModal"
          style={{
            backgroundColor: themeColors[theme]?.menueBg,
            color: themeColors[theme]?.text,
          }}
          onCancel={() => setShowModal(false)}
          footer={[<div></div>]}
          open={showModal}
          title={"انتخاب بانک"}
        >
          <div style={{ padding: "10px" }}>
            <Row>
              <Col sm={24} md={12} xl={10}>
                <Input
                  title="کد سوئیفت"
                  value={inputsData?.bnkSwiftCodeStrr}
                  name="bnkSwiftCodeStrr"
                  onChange={handleChangeInputs}
                  // validations={[["required"]]}
                  // error={errors?.bnkSwiftCodeStrr}
                />
              </Col>
              <Col sm={24} md={12} xl={10}>
                <Input
                  title="نام بانک"
                  value={inputsData?.bnkNameEnStrr}
                  name="bnkNameEnStrr"
                  onChange={handleChangeInputs}
                  // validations={[["required"]]}
                  // error={errors?.bnkNameEnStrr}
                />
              </Col>
              <Col sm={24} md={12} xl={4}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button onClick={getDestinationBankList}>جستجو</Button>
                </div>
              </Col>
            </Row>
            <span className="page-size-combo">
              <label className="page-size-combo--label" htmlFor="page-size">
                نمایش محتویات
              </label>
              <select
                className="page-size-combo--selector"
                id="page-size"
                value={tableParams.pagination.pageSize}
                onChange={handleChangePageSize}
              >
                <option
                  value="10"
                  style={{
                    backgroundColor: themeColors[theme]?.bg,
                  }}
                >
                  10
                </option>
                <option
                  value="25"
                  style={{
                    backgroundColor: themeColors[theme]?.bg,
                  }}
                >
                  25
                </option>
                <option
                  value="50"
                  style={{
                    backgroundColor: themeColors[theme]?.bg,
                  }}
                >
                  50
                </option>
                <option
                  value="100"
                  style={{
                    backgroundColor: themeColors[theme]?.bg,
                  }}
                >
                  100
                </option>
              </select>
            </span>
            <Table
              dataSource={bankList}
              handleChangePageSize={handleChangePageSize}
              columns={columns}
              hasPageSizeCombo={false}
              pagination={tableParams.pagination}
              // loading={loading}
              onChange={handleTableChange}
              onHeaderRow={() => {
                return {
                  style: { backgroundColor: colorMode },
                };
              }}
              locale={{
                emptyText: (
                  <p style={{ color: "#000" }}>بانکی با این مشخصات یافت نشد</p>
                ),
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const states = {
    ...mapGUidStateToProps(state),
    ...mapRoleStateToProps(state),
    ...mapThemeStateToProps(state),
    ...mapColorModeStateToProps(state),
  };
  return states;
};

export default connect(mapStateToProps)(BankSelectInput);

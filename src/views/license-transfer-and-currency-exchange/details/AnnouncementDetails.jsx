// صفحه جزییات آگهی ها
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  mapGUidStateToProps,
  mapRoleStateToProps,
  mapThemeStateToProps,
} from "../../../state/mapStateToProps";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import { Card, Col, Row } from "antd";
import { Button, Input, Table, VerticalSpace } from "../../../components";
import AnnouncementInputs from "../new-announcement/common/AnnouncementInputs";
import themeColors from "../../../configs/theme";

const AnnouncementDetails = ({ role, GUid, theme }) => {
  const [advVCodeInt, setAdvVCodeInt] = useState();
  const [inputsData, setInputsData] = useState({});

  const { search } = useLocation();
  const history = useHistory();

  const columns = [
    {
      title: "سال",
      dataIndex: "cavYearStr",
      align: "center",
    },
    {
      title: "گمرک",
      dataIndex: "ctmNameStr",
      align: "center",
    },
    {
      title: "کوتاژ",
      dataIndex: "cavCotageCodeStr",
      align: "center",
    },
    {
      title: "ارز",
      dataIndex: "curNameStr",
      align: "center",
    },
    {
      title: "نوع نرخ ارز",
      dataIndex: "cavCurrencyRateTypeStr",
      align: "center",
    },
    {
      title: "مبلغ کل",
      dataIndex: "cavTotalPriceMny",
      align: "center",
    },
  ];

  const getAnnouncementDetails = () => {
    const postData = {
      AdvVcodeLng: advVCodeInt,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };

    axios({
      ...endpoints.RestAPIs.declaration.advitiseDetail,
      data: postData,
    }).then((res) => {
      if (res?.data?.ErrorCode === 0) {
        setInputsData(res?.data);
      }
    });
  };

  useEffect(() => {
    const temp = atob(search.split("=")[1]);
    setAdvVCodeInt(Number(temp));
  }, []);

  useEffect(() => {
    if (advVCodeInt) {
      getAnnouncementDetails();
    }
  }, [advVCodeInt]);

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      <Card
        headStyle={{ display: "none" }}
        style={{
          backgroundColor: themeColors[theme]?.menueBg,
          color: themeColors[theme]?.text,
        }}
      >
        <Table
          columns={columns}
          dataSource={inputsData?.SaderatCotageList}
          pagination={false}
          hasPageSizeCombo={false}
        />
      </Card>
      <VerticalSpace space="1rem" />
      <Row>
        <Col sm={24} md={24} lg={8}>
          <Input
            title="کد آگهی"
            maxWidth={150}
            readOnly
            value={inputsData?.advVCodeInt}
          />
        </Col>
      </Row>

      <AnnouncementInputs inputsData={inputsData} readOnly={true} />
      <div className="steps-action">
        <Button onClick={goBack}>بازگشت</Button>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const states = {
    ...mapGUidStateToProps(state),
    ...mapRoleStateToProps(state),
    ...mapThemeStateToProps(state),
  };
  return states;
};

export default connect(mapStateToProps)(AnnouncementDetails);

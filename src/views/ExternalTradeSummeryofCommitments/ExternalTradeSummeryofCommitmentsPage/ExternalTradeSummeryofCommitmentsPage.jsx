import axios from "axios";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { handleLoading, handleMessageModal } from "../../../state/action-creators";
import { endpoints } from "../../../services/endpoints";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Input, Modal } from "../../../components";
import ExternalTradeSummeryofCommitmentsTabel from "../table-ExternalTradeSummeryofCommitments/ExternalTradeSummeryofCommitmentsTabel";
import GuideBox from "../../../components/GuideBox";
import { Card, Col, Row, Tooltip } from "antd";
import themeColors from "../../../configs/theme";


function ExternalTradeSummeryofCommitments() {
    const [data, setData] = useState([])
    const { theme, colorMode, role, GUid, nationalCode } = useSelector((state) => state);
    const [flag, setFlag] = useState(false)
    const [showDetail, setShowDetail] = useState(false)
    const [nastionalCode1, setNationalCode] = useState(null)
    const [openModal, setOpenModal] = useState(true)
    const dispatch = useDispatch();
    const [buttonFlag,setButtonFlag]=useState(false)
    // const [flag,setFlag]=useState(false)

    // to getdata ti choose if legal to inquiry or not----------------------------------------
    function isLegalFunction() {
        const postData = {
            nationalCodeStr: nationalCode,
            year: null,
            urlVCodeInt: role,
            ssdsshGUID: GUid,
        };
        dispatch(handleLoading(true));
        axios({
            url: endpoints.RestAPIs.ObligationEliminate.GetImportObligationsSummery.url,
            method: endpoints.RestAPIs.ObligationEliminate.GetImportObligationsSummery.method,
            data: postData,
        })
            .then((res) => {

                if (res.data?.ErrorCode === 0) {
                    setData(res?.data?.obligation_VM)
                   
                    if(res?.data?.obligation_VM.isLegal===true){
                        setFlag(true)
                    }

                } else {
                    dispatch(
                        handleMessageModal({
                            isModalOpen: true,
                            describe: res.data?.ErrorDesc,
                        })
                    );
                }
                dispatch(handleLoading(false));
            })
            .catch((err) => {
                dispatch(handleLoading(false));
            });

    }



    // handelInquiry button to inquiry data------------------------- 
    function handelInquiry() {
      setButtonFlag(!buttonFlag)
          
            setShowDetail(true)
       

    }
    // return function---------------------------------------------
    return <div>
        <div className="ExternalTradeSummeryofCommitmentsMain">
            <Modal open={openModal} footer={<Button onClick={() => {
                isLegalFunction()
                setOpenModal(false)
            }} backgroundColor={themeColors.btn.darkGreen}>متوجه شدم</Button>} width='350px' title='تذکر' closeIcon={null} className='custom-modal' >

                <div className="modalMain">
                    <p>در این بخش صرفا اطلاعات استعلام‌شده از سامانه رفع تعهد ارزی بانک مرکزی نمایش داده می شود. در صورت وجود ابهام در اطلاعات به بانک عامل خود مراجعه نمایید.</p>

                </div>
            </Modal>
            <div className="ExternalTradeSummeryofCommitmentsinput">
                <Input title='شناسه وارد کننده' value={nationalCode} readOnly />
                <div style={{ marginTop: "1px" }}>
                    <Button type="primary"  onClick={handelInquiry}>
                        استعلام
                    </Button>
                </div>


            </div>
            {
                showDetail ? <>
                    <Row style={{ marginTop: "20px", marginBottom: '20px' }} >
                        <Col xs={24} lg={8} >
                            <div className="ExternalTradeSummeryofCommitmentsGuidBox">
                                <Input title=' معادل یورویی تعهدات رفع نشده ' value={data.undoneCurrencyObligationEuroAmount} isCurrency={true} readOnly="readOnly" labelWidth="350px" space={0}  TooltipTitle="مجموع معادل یورویی تعهدات رفع نشده ای که مهلت رفع تعهد آنها گذشته است" />



                            </div>
                        </Col>
                        <Col xs={24} lg={8}>
                            <div className="ExternalTradeSummeryofCommitmentsGuidBox">
                                <Input title='درصد تعهدات رفع نشده' value={data.undoneCurrencyObligationPercentage} isCurrency={true} readOnly="readOnly" labelWidth="350px" space={0} TooltipTitle="درصد تعهدات رفع نشده ای که مهلت رفع تعهد آن ها گذشته است به کل تعهدات" />

                            </div>
                        </Col>
                        <Col xs={24} lg={8}>
                            <div className="ExternalTradeSummeryofCommitmentsGuidBox">
                                <Input title='در محدوده مجاز  ' value={flag ? "بله" : "خیر"} readOnly labelWidth="355px" space={0} TooltipTitle="چنانچه درصد تعهدات رفع نشده کمتر از سقف مجاز تعیین شده توسط بانک مرکزی باشد در محدوده مجاز قرار میگیرد.به منظور اطلاع از سقف مجاز از بانک عامل استعلام نمایید " />

                            </div>
                        </Col>
                    </Row>






                    <ExternalTradeSummeryofCommitmentsTabel isLegal={flag} nationalCode={nationalCode} buttonFlag={buttonFlag} />
                </> : ""
            }
        </div>
    </div>
}
export default ExternalTradeSummeryofCommitments
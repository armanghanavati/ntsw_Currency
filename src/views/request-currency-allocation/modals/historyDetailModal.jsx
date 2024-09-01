import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Table } from "../../../components";
import themeColors from "../../../configs/theme";
import { useEffect } from "react";
import { handleLoading, handleMessageModal } from "../../../state/action-creators";
import { endpoints } from "../../../services/endpoints";
import axios from "axios";
import { useState } from "react";

function HistoryDetailModal({ openModal,
    setOpenModal,
    version,
    carVCodeLng,
    changeType
 }) {
    const { theme, colorMode, role, GUid } = useSelector((state) => state);
const [data,setData]=useState([])
const [selectedColumns, seSelectedColumns]=useState(null)

const dispatch=useDispatch()
    useEffect(() => {
        const postData = {
            carVCodeLng: carVCodeLng,
            Version: version?.Version,

          urlVCodeInt: role,
          ssdsshGUID: GUid,
        };
        dispatch(handleLoading(true));
        axios({
          url: endpoints.RestAPIs.CurrencyAllocation.GetCurrencyAllocationRequestDetailsOfChangesHistory.url,
          method:
            endpoints.RestAPIs.CurrencyAllocation.GetCurrencyAllocationRequestDetailsOfChangesHistory.method,
          data: postData,
        })
          .then((res) => {
           
           
    
            if (res?.data?.ErrorCode === 0) {
                if(changeType === 1){
                    setData(res?.data?.DetailsOfChangesInEditing)
                }
                if(changeType === 2){
                    setData(res?.data?.DetailsOfChangesInDividing)
                }
                if(changeType === 3){
                    setData([res?.data?.DetailsOfChangesInUpgrading])
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
      }, [changeType]);


      const columns1 = [
        {
            title: "ردیف",
            dataIndex:"RowNo",
            align: "center",
           
          },
        {
          title: " عنوان فیلد",
          dataIndex: "EditedField",
          align: "center",
        },
        {
          title: "مقدار قبل از تغییر",
          dataIndex: "ValueBeforEdit",
          align: "center",
        },
        {
          title: "مقدار اصلاحی",
          dataIndex: "ValueAtferEdit",
          align: "center",
        },
    
       
      ];
      const columns2 = [
        {
            title: "ردیف",
            dataIndex:"RowNo",
            align: "center",
           
          },
        {
          title: " عنوان درخواست",
          dataIndex: "RequestTitle",
          align: "center",
        },
        {
          title: "مبلغ",
          dataIndex: "Amount",
          align: "center",
        },
        
    
       
      ];
    
      const columns3 = [
      
        {
          title: "شماره نسخه ثبت سفارش درخواست",
          dataIndex: "RegedOrderVersionAfterUpgrad",
          align: "center",
        },
        {
          title: "شماره نسخه ثبت سفارش فعلی",
          dataIndex: "RegedOrderVersionBeforUpgrad",
          align: "center",
        },
        
    
        
      ];
      useEffect(()=>{
        switch(changeType) {
            case 1:
               seSelectedColumns(columns1);
               break;
            case 2:
                seSelectedColumns(columns2);
               break;
            case 3:
                seSelectedColumns(columns3);
               break;
            default:
               // handle default case here
           }
      },[changeType])
     
      
    return <Modal

        style={{ width: "1000px" }}
        open={openModal}
        closeIcon={() => { setOpenModal(false); }}
        footer={
            <Button
                onClick={() => {
                    setOpenModal(false);
                }}
                backgroundColor={themeColors.btn.darkGreen}
            >
                بستن
            </Button>
        }
        title={`مشاهده سوابق جزئیات تغییرات ${version.MainActionName
        } `}

        width="70%"
    >
        <div style={{ width: "95%", margin: "0 auto" }}>
   
            <Table
                hasPageSizeCombo={false}
                dataSource={data}
                columns={selectedColumns}
                onHeaderRow={() => {
                    return {
                        style: { backgroundColor: colorMode },
                    };
                }}
                pagination={false}
            />
        </div>

    </Modal>
}
export default HistoryDetailModal
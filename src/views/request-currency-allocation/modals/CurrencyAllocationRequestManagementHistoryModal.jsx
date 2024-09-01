import { useEffect } from "react";
import { Button, Modal, Table } from "../../../components";
import themeColors from "../../../configs/theme";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import { useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";


function CurrencyAllocationRequestManagementHistoryModal({
  openModal,
  setOpenModal,
  version,
  carVCodeLng,
}) {
  const location = useLocation();
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });
  const dispatch = useDispatch();
 
  // useefect to get data--------------------------------------
  useEffect(() => {
    const postData = {
      carVCodeLng: carVCodeLng,
      Version: version.Version,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation.GetCurrencyAllocationRequestChangeStatusActionHistory.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation.GetCurrencyAllocationRequestChangeStatusActionHistory.method,
      data: postData,
    })
      .then((res) => {
       
        

        if (res.data?.ErrorCode === 0) {

        
          setData(
            res.data.currencyAllocationRequestChangeStatusActionHistoryList
          );
        } else {

          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data?.ErrorDesc,
            })
          );
          setOpenModal(false);
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(handleLoading(false));
      });
  }, [version.version]);
// columns data-----------------------------------------------
  const columns = [
    {
      title: "ردیف",
      align: "center",
      render: (item, record, index) => (
        <>
          {index +
            1 +
            (Number(tableParams?.pagination?.current || 1) - 1) *
              Number(tableParams.pagination.pageSize || 1)}
        </>
      ),
    },
    {
      title: "وضعیت ",
      dataIndex: "Status",
      align: "center",
    },
    {
      title: "وضعیت فعالیت ",
      dataIndex: "ActiveStatus",
      align: "center",
    },
    {
      title: "تاریخ",
      dataIndex: "ActionDatePersian",
      align: "center",
    },

    {
      title: "پاسخ بانک",
      dataIndex: "BankResult",
      align: "center",
    },
    {
      title: " رخداد",
      dataIndex: "ActionName",
      align: "center",
    },
  ];


  return (
 
data.length > 0 && 
      <Modal

       style={{width:"1000px"}}
        open={openModal}
        closeIcon={()=>{ setOpenModal(false);}}
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
        title="مشاهده سوابق تغییر وضعیت"
      
        width="70%"
      >
   <div style={{width:"95%", margin:"0 auto"}}>
          <Table
          hasPageSizeCombo={false}
            dataSource={data}
            columns={columns}
            onHeaderRow={() => {
              return {
                style: { backgroundColor: colorMode },
              };
            }}
            pagination={false}
          />
   </div>
  
      </Modal>

    )
  ;
}
export default CurrencyAllocationRequestManagementHistoryModal;

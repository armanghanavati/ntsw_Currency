import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  handleLoading,
  handleMessageModal,
} from "../../../state/action-creators";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Table } from "../../../components";
import CurrencyAllocationRequestManagementHistoryModal from "../modals/CurrencyAllocationRequestManagementHistoryModal";
import HistoryDetailModal from "../modals/historyDetailModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import EmergingProblem from "../../currency-trading/emerging-problem/emerging-problem";
export default function CurrencyAllocationRequestManagementHistory() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history=useHistory()
  const { theme, colorMode, role, GUid } = useSelector((state) => state);
  const [openModal, setOpenModal] = useState(false);
  const [openDetail,setOpenDetail] = useState(false)
  const [data, setData] = useState([]);
  const [version, setVersion] = useState(null)
  const [totalCount, setTotalCount] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const [carVCodeLng, setCarVCodeLng] = useState(null)
  const [changeType,setChangeType]=useState(null)
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };
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
  //   useeffect for get data for datagrid
  useEffect(() => {
    const postData = {
      carVCodeLng: location.search.substring(1),
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.CurrencyAllocation
        .GetCurrencyAllocationRequestMainActionHistory.url,
      method:
        endpoints.RestAPIs.CurrencyAllocation
          .GetCurrencyAllocationRequestMainActionHistory.method,
      data: postData,
    })
      .then((res) => {

        setData(res.data.currencyAllocationRequestMainActionHistoryList);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.data?.totalCount || 0,
          },
        });
        if (res.data?.ErrorCode === 0) {
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
  }, []);

  useEffect(() => {
    setCarVCodeLng(location.search.substring(1))
  }, [])

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
      title: " رخداد ",
      dataIndex: "MainActionName",
      align: "center",
    },
    {
      title: "نسخه ",
      dataIndex: "Version",
      align: "center",
    },
    {
      title: "تاریخ",
      dataIndex: "ActionDatePersian",
      align: "center",
    },

    {
      title: "سوابق تغییر وضعیت",
      dataIndex: "carVCodeLng",
      align: "center",
      render: (id, record, index) => (
        <div className="flex-order-row">
          
            <Button  type="secondary" onClick={() => {
             
              setVersion(record)
              setOpenModal(true)
            }}>
              مشاهده
              <i class="fa fa-edit" />
            </Button>
      
        </div>
      ),
    },
    {
      title: "جزئیات تغییرات",
      dataIndex: "DetailsOfChangesType",
      align: "center",
      render: (id,record) => {

        if (record.DetailsOfChangesType !== 0) {
          return <div className="flex-order-row">
            <Button type="secondary" onClick={() => {
      
              setOpenDetail(true)
              setChangeType(record?.DetailsOfChangesType)
              setVersion(record)
            }}>
              مشاهده
              <i class="fa fa-edit" />
            </Button>
          </div>
        }
        else {
          return <p>-</p>
        }
      }
    },
  ];

  return (
    <div>
      <Table
     onChange={handleTableChange}
        dataSource={data}
        columns={columns}

        onHeaderRow={() => {
          return {
            style: { backgroundColor: colorMode },
          };
        }}
        pagination={{
          ...tableParams.pagination,
          total: totalCount, // Set the total count from the state
        }}
        handleChangePageSize={handleChangePageSize}
      />
      <div style={{display:"flex", justifyContent:"flex-end", marginTop:"50px"}}> 
      <Button onClick={()=>{history.push("/Users/AC/Currency/RequestCurrencyAllocation")}}> <i class="fa fa-share"></i>  بازگشت</Button>
      </div>
   
      {openModal ? <CurrencyAllocationRequestManagementHistoryModal openModal={openModal} setOpenModal={setOpenModal} version={version} carVCodeLng={carVCodeLng} /> : ""}
     {openDetail? <HistoryDetailModal openModal={openDetail} setOpenModal={setOpenDetail} carVCodeLng={carVCodeLng} version={version} changeType={changeType}/>:""}
     <EmergingProblem/>
    </div>
  );
}

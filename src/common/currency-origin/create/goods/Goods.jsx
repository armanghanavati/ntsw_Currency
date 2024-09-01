import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import themeColors from "../../../../configs/theme";
import GoodsTable from "../../../../common/currency-origin/goods/GoodsTable";
import modes from "../../../../enums/modes";
import { endpoints } from "../../../../services/endpoints";
import axios from "axios";
import { useEffect } from "react";
import AddingGoodsWithExcel from "./AddingGoodsWithExcel";
import { Col, Row } from "antd";
import { handleMessageModal } from "../../../../state/action-creators";

const Goods = ({
  prfVCodeInt,
  form,
  tabledataSource,
  setTabledataSource,
  setBackupTabledataSource = () => {},
  selectedRowKeys,
  setSelectedRowKeys,
  pgtGUID,
  setInputsData,
  showHTML = true,
  sendRequest,
}) => {
  const { role, GUid, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [counter, setCounter] = useState(0);
  const [FOBSUMOtherPages, setFOBSUMOtherPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });
  // موافقت شد که از فلگ isselected سرویس استفاده شود به همین دلیل این کد ها کامنت شده اند
  // با توجه به تعامل با بکند در هر رفرش باید دیتای اصلی کالا به کاربر نمایش داده شود منتهی برای هندل کردن مشاهده تغییرات قبلی کاربر در مثلا تغییر پیجینیشن یا اضافه کردن کالا با اکسل این فلگ اضافه شده
  // const [toThisIndexShowPrevData, setToThisIndexShowPrevData] = useState(0);

  const getTable = ({ isSavedGoodsWithExcel = false }) => {
    setLoading(true);
    const postData = {
      prfVCodeInt,
      startIndex:
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
        1,
      pageSize: tableParams.pagination.pageSize,
      urlVCodeInt: role,
      ssdsshGUID: GUid,
      pgtGUID,
    };
    axios({
      url: endpoints.RestAPIs.preCotage.getPreCotageGoods4CreatePreCotage.url,
      method:
        endpoints.RestAPIs.preCotage.getPreCotageGoods4CreatePreCotage.method,
      data: postData,
    })
      .then((res) => {
        if (res.data.Error === 0) {
          // let temporaryToThisIndexShowPrevData;
          // if (!!isSavedGoodsWithExcel) {
          //   temporaryToThisIndexShowPrevData = res?.data?.totalCount;
          // } else {
          //   let nowToThisIndexIsShow =
          //     tableParams?.pagination?.current *
          //     tableParams.pagination.pageSize;
          //   nowToThisIndexIsShow > toThisIndexShowPrevData
          //     ? (temporaryToThisIndexShowPrevData = nowToThisIndexIsShow)
          //     : (temporaryToThisIndexShowPrevData = toThisIndexShowPrevData);
          // }
          // setToThisIndexShowPrevData(temporaryToThisIndexShowPrevData);

          let totalOfPcgFOBPriceMny = 0;
          const isSelected = [];

          const temp = res?.data?.GoodElement?.map((item, index) => {
            const getNewData = item?.isSelected;
            // index < toThisIndexShowPrevData || isSavedGoodsWithExcel;

            // کدها تکراریست todo:
            if (item.isSelected) {
              isSelected.push(item.pfgVCodeLng);
            }

            if (item.isSelected) {
              totalOfPcgFOBPriceMny =
                totalOfPcgFOBPriceMny +
                (Number(getNewData ? item.pcgCountInt : item.pfgCountInt) ||
                  0) *
                  Number(item?.pfgUnitPriceMny);
            }
            const canChangeFOBPriceMny =
              item?.pfgmsuVCodeInt === 21 ||
              item?.gdsHSCode === "84198990" ||
              item?.gdsHSCode === "84194090";
            return {
              ...item,
              canChangeFOBPriceMny,
              pcgFOBPriceMny: canChangeFOBPriceMny
                ? item?.pcgFOBPriceMny
                : (
                    (Number(getNewData ? item.pcgCountInt : item.pfgCountInt) ||
                      0) * Number(item?.pfgUnitPriceMny)
                  ).toFixed(10),
              pfgGrossWeightAsKGDbl: item?.isSelected
                ? item.pcgGrossWeightInt
                : item.pfgGrossWeightAsKGDbl,
              pfgCountInt: item?.isSelected
                ? item.pcgCountInt
                : item.pfgCountInt,
              pfgNetWeightAsKGDbl: item?.isSelected
                ? item.pcgNetWeightAsKGDbl
                : item.pfgNetWeightAsKGDbl,
              pfgpckCountInt: item?.isSelected
                ? item.pcgPackagesCountInt
                : item.pfgpckCountInt,
              // pfgpckCountInt: item?.pcgPackagesCountInt,
            };
          });
          setTotalOfPcgFOBPriceMny(
            Number(totalOfPcgFOBPriceMny?.toFixed(3)),
            Number(+res?.data?.FOBSumAllGoods - +res?.data?.FOBSumThisPageGoods)
          );
          setTabledataSource(temp || []);
          setBackupTabledataSource(
            JSON.stringify(res?.data?.GoodElement || [])
          );
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: res?.data?.goodsCount || 0,
            },
          });

          setSelectedRowKeys(isSelected);
          setCounter(counter + 1);
          setTimeout(() => {
            form.resetFields();
          }, 200);
          setFOBSUMOtherPages(
            +res?.data?.FOBSumAllGoods - +res?.data?.FOBSumThisPageGoods
          );
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res.data.ErrorDesc,
            })
          );
          setTabledataSource([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    !!prfVCodeInt && getTable({});
  }, [
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    prfVCodeInt,
  ]);

  const setTotalOfPcgFOBPriceMny = (
    totalOfPcgFOBPriceMny = 0,
    newFOBSUMOtherPages = undefined
  ) => {
    // const total =
    //   inputsData?.bolTransitSettlementFreightAmountLng ||
    //   0 + inputsData?.bolTransitSettlementInspectionAmountLng ||
    //   0 - inputsData?.bolTransitSettlementDiscountLng ||
    //   0 + inputsData?.bolTransitSettlelementOtherAmountLng ||
    //   0 + totalOfPcgFOBPriceMny;
    setInputsData((prev) => {
      return {
        ...prev,
        totalOfPcgFOBPriceMny:
          Number(totalOfPcgFOBPriceMny) +
          Number(
            newFOBSUMOtherPages === undefined
              ? FOBSUMOtherPages
              : newFOBSUMOtherPages
          ),
        // prfTotalPriceMny: total,
        // bolTransitSettlementAmountLng: total,
      };
    });
  };

  return (
    <>
      {showHTML && (
        <div className="container-with-border">
          <div
            className="container-with-border__title"
            style={{
              backgroundColor: themeColors[theme]?.bg,
            }}
          >
            جدول کالاهای منشا
          </div>
          <div className="container-with-border__contain">
            <Row>
              <Col sm={24} md={24} xl={24}>
                {prfVCodeInt && (
                  <AddingGoodsWithExcel
                    prfVCodeInt={prfVCodeInt}
                    getTable={getTable}
                    pgtGUID={pgtGUID}
                  />
                )}
              </Col>
            </Row>
            {tabledataSource && (
              <GoodsTable
                tableParams={tableParams}
                setTableParams={setTableParams}
                tabledataSource={tabledataSource}
                loading={loading}
                mode={modes.Add}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                rowKey="pfgVCodeLng"
                form={form}
                setTotalOfPcgFOBPriceMny={setTotalOfPcgFOBPriceMny}
                counter={counter}
                sendRequest={sendRequest}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Goods;

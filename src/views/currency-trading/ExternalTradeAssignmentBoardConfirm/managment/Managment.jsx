import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  handleLoading,
  handleMessageModal,
} from "../../../../state/action-creators";
import { endpoints } from "../../../../services/endpoints";
import { useSelector, useDispatch } from "react-redux";
import ExternalTradeAssignmentBoardConfirmFilters from "./common/Filters";
import Desciption from "./common/operation-buttons/Desciption";
import Contacts from "./common/operation-buttons/Contacts";
import Table_Managment from "./common/Table-managment";
import Notice from "./common/Notice";
import convertJalaliDateToGregorian from "../../../../configs/helpers/convert-jalali-date-to-gregorian";

const Managment = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(undefined);
  const [view, setView] = useState(false);
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [inputsData, setInputsData] = useState({});
  const [appHasMounted, setAppHaMounted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const { role, GUid } = useSelector((state) => state);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  // سرویس جدول
  const getTable = () => {
    const findCountry = options?.countryList?.filter((item) => {
      if (item?.CountryCode === inputsData?.countryName) {
        return item;
      }
    });
    dispatch(handleLoading(true));
    setLoading(true);
    const postData = {
      urlVCodeInt: role,
      sshGUID: GUid,
      curVCodeInt: inputsData?.currencyTypeTest,
      advInsertDateFrom: convertJalaliDateToGregorian(inputsData?.DateF),
      advInsertDateTo: convertJalaliDateToGregorian(inputsData?.DateT),
      advVCodeint: inputsData?.advertisingCode,
      advAmount: inputsData?.price,
      advCountryName: findCountry?.[0]?.CountryName,
      comparisonOperator: inputsData?.payment,
      startIndex: Number(
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
          1
      ),
      pageSize: tableParams.pagination.pageSize,
      // pageSize: tableParams?.pagination?.pageSize,
    };

    dispatch(handleLoading(true));
    setLoading(true);
    axios({
      url: endpoints.RestAPIs.declaration.GetListOfAdviseForOrderNo.url,
      method: endpoints.RestAPIs.declaration.GetListOfAdviseForOrderNo.method,
      data: postData,
    })
      .then((res) => {
        if (res?.data.error === 0) {
          setDataSource(res?.data?.ListOfAdvise);
        } else {
          dispatch(
            handleMessageModal({
              isModalOpen: true,
              describe: res?.data?.errorDesc,
            })
          );
        }
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res?.data?.count || 0,
          },
        });
        setLoading(false);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
        setLoading(false);
      });
  };

  // سرویس دیتاهای کمبوباکس نوع ارز
  const getInrterNationalCurrencyListForNima = () => {
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getInrterNationalCurrencyListForNima
        .url,
      method:
        endpoints.RestAPIs.buyCurrency.getInrterNationalCurrencyListForNima
          .method,
    })
      .then((res) => {
        setOptions((options) => ({
          ...options,
          CurrencyType: res?.data,
        }));
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);

        dispatch(handleLoading(false));
      });
  };

  // سرویس دیتاهای کمبوباکس کشور
  const getCountryListByListNew = () => {
    const postData = {
      urlVCodelogin: role,
    };
    dispatch(handleLoading(true));
    axios({
      url: endpoints.RestAPIs.buyCurrency.getCountryListByListNew.url + role,
      method: endpoints.RestAPIs.buyCurrency.getCountryListByListNew.method,
      data: postData,
    })
      .then((res) => {
        setOptions((options) => ({ ...options, countryList: res?.data }));
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
      });
  };

  // سرویس دیتاهای کمبوباکس وضعیت مبلغ
  const GetAmountSortList = () => {
    dispatch(handleLoading(true));
    setLoading(true);
    const postData = {
      urlVCodeInt: role,
      sshGUID: GUid,
    };
    dispatch(handleLoading(true));
    setLoading(true);
    axios({
      url: endpoints.RestAPIs.declaration.GetAmountSortList.url,
      method: endpoints.RestAPIs.declaration.GetAmountSortList.method,
      data: postData,
    })
      .then((res) => {
        setOptions((options) => ({
          ...options,
          paymentStatus: res?.data?.Result,
        }));
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(handleLoading(false));
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

  const handleTableChange = (pagination, inputsData, sorter) => {
    setTableParams({
      pagination,
      inputsData,
      ...sorter,
    });
  };

  useEffect(() => {
    setAppHaMounted(true);
    setDataSource([]);
    getTable();
    GetAmountSortList();
    getInrterNationalCurrencyListForNima();
    getCountryListByListNew();
  }, []);

  useEffect(() => {
    if (appHasMounted) {
      setDataSource([]);
      getTable();
    }
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  return (
    <>
      <Notice />
      {/* ... فیلتر ها بر اساس  */}
      <ExternalTradeAssignmentBoardConfirmFilters
        errors={errors}
        options={options}
        inputsData={inputsData}
        setInputsData={setInputsData}
        tableParams={tableParams}
        setTableParams={setTableParams}
        getTable={getTable}
        setErrors={setErrors}
      />
      {/* جدول */}
      <Table_Managment
        dataSource={dataSource}
        loading={loading}
        setView={setView}
        handleChangePageSize={handleChangePageSize}
        handleTableChange={handleTableChange}
        tableParams={tableParams}
        setShowDescription={setShowDescription}
        setData={setData}
      />
      {/* دکمه مدال توضیحات */}
      {showDescription && (
        <Desciption
          showDescription={showDescription}
          setShowDescription={setShowDescription}
          data={data}
        />
      )}
      {/* دکمه مدال اطلاعات تماس */}
      {view && (
        <Contacts
          view={view}
          dataSource={dataSource}
          loading={loading}
          data={data}
          setView={setView}
          handleChangePageSize={handleChangePageSize}
          handleTableChange={handleTableChange}
        />
      )}
    </>
  );
};

export default Managment;

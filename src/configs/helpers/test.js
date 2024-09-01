const getTable = () => {
    const postData = {
      urlVCodeInt: role,
      ssdsshGUID: GUid,
    };
    setLoading(true);
    axios({
      url: endpoints.RestAPIs.LoadVerifications.getAllCommercialCardRequest.url,
      method:
        endpoints.RestAPIs.LoadVerifications.getAllCommercialCardRequest.method,
      data: postData,
    })
      .then((res) => {
        setDataSource(res.data?.allCommercialCardRequest || []);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.data?.Count || 0,
          },
        });

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
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

  useEffect(() => {
    getTable();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);
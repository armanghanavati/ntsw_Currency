import { useHistory } from "react-router-dom";
import { Button, Result } from "antd";

const NotFoundPage = () => {
  let history = useHistory();
  return (
    <Result
      status="404"
      title="404"
      subTitle="صفحه مورد نظر شما یافت نشد."
      extra={
        <Button
          onClick={() =>
            !!history.location?.state?.from
              ? history.push(
                  `/Users/AC/Currency/${history.location.state.from}`
                )
              : history.goBack()
          }
          type="primary"
        >
          بازگشت
        </Button>
      }
    />
  );
};

export default NotFoundPage;

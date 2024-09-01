import React from "react";
import { Steps } from "antd";
import { useSelector } from "react-redux";

const DetailsSteps = ({ prfStatusTny }) => {
  const Step = Steps.Step;
  const { theme } = useSelector((state) => state);

  const data = [
    {
      id: "1",
      name: "پیش  نویس",
    },
    {
      id: "2",
      name: "ثبت درخواست",
    },
    {
      id: "3",
      name: "انتخاب پیشنهاد",
    },
    {
      id: "4",
      name: "تأیید پیشنهاد",
    },
    {
      id: "5",
      name: "پرداخت ریال",
    },
    {
      id: "6",
      name: "صدور حواله",
    },
    {
      id: "7",
      name: "تأیید نهایی",
    },
  ];

  const currentStepHandler = () => {
    switch (prfStatusTny) {
      case 0:
        if (prfStatusTny === 0) return [0];
        break;
      case 1:
        if (prfStatusTny === 1) return [1];
        break;
      case 2:
        if (prfStatusTny === 2) return [2];
        break;
      case 3:
        if (prfStatusTny === 3) return [3];
        break;
      case 4:
        if (prfStatusTny === 4) return [4];
        break;
      case 5:
        if (prfStatusTny === 5) return [5];
        break;
      case 6:
        if (prfStatusTny === 6) return [6];
        break;
      default:
        return [0];
    }
  };

  return (
    <>
      <div className={`${theme === "dark" && "bgDark"} `}>
        <Steps current={currentStepHandler()[0]}>
          {data.map((item, index) => (
            <Step key={index} description={item.name} />
          ))}
        </Steps>
      </div>
    </>
  );
};

export default DetailsSteps;

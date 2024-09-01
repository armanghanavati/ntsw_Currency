import React from "react";
import themeColors from "../configs/theme";
import { useSelector } from "react-redux";

const EmergencyProblem = ({ title }) => {
  const { theme } = useSelector((state) => state);

  return (
    <div
      className="parentEmerging"
      style={{
        borderColor: themeColors[theme]?.text,
      }}
    >
      <span class="bold">
        در صورت بروز مشکل در این صفحه با مرکز تماس سامانه {title} به شماره
        <b className="text-red"> 27471010-021 </b> تماس حاصل فرمایید.
      </span>
    </div>
  );
};

export default EmergencyProblem;

import React from "react";

const EmergingProblem = ({ style }) => {
  return (
    <div style={style} className="parentEmerging">
      <span class="bold">
        در صورت بروز مشکل در این صفحه با مرکز تماس سامانه تخصیص ارز به شماره{" "}
        <b style={{ color: "red", fontWeight: "bold" }}>27471010-021</b> تماس
        حاصل فرمایید.
      </span>
    </div>
  );
};

export default EmergingProblem;

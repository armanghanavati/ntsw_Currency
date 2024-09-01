import { Card } from "antd";
import React from "react";
import themeColors from "../../../../../configs/theme";
import { changeColorMode } from "../../../../../state/action-creators";
import { useSelector } from "react-redux";

const Notice = () => {
  const { theme, colorMode } = useSelector((state) => state);

  return (
    <>
      <Card
        style={{
          marginBottom: "20px",
          boxShadow: "0 0 3px rgba(0,0,0,.2)",
          marginTop: "20px",
          backgroundColor: themeColors[theme]?.bg,
          color: themeColors[theme]?.text,
        }}
      >
        <p
          style={{
            marginBottom: "20px",
            fontSize: "20px",
            color: themeColors.comments.red,
          }}
        >
          تذکر
        </p>
        <p style={{ marginBottom: "10px" }}>
          1 _ هدف از ایجاد بخش تابلوی واگذاری پروانه های صادراتی و نمایش آگهی
          های واگذاری صادرکنندگان صرفا تسهیل در ارتباطات بازرگانان بوده و سامانه
          جامع تجارت مسئولیتی در قبال تعهدات طرفین معامله نسبت به یکدیگر به عهده
          ندارد.
        </p>
        <p style={{ marginBottom: "10px" }}>
          2 _ در جدول زیر، سلول هایی که به صورت ***** نمایش داده شده اند مواردی
          هستند که صادرکننده تمایلی به نمایش آن ها در آگهی خود نداشته است.
        </p>
      </Card>
    </>
  );
};

export default Notice;

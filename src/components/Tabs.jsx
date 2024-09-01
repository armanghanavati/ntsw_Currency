import { Tabs as AntdTabs } from "antd";
import themeColors from "../configs/theme";
import { useSelector } from "react-redux";

const Tabs = ({ items, type = "card", className, defaultActiveKey }) => {
  const { theme } = useSelector((state) => state);
  return (
    <AntdTabs
      defaultActiveKey={defaultActiveKey}
      className={className}
      style={{
        backgroundColor: themeColors[theme]?.submenuBg,
        color: themeColors[theme]?.text,
      }}
      type={type}
      items={items}
    />
  );
};
export default Tabs;

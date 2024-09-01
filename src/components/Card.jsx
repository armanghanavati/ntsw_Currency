import { Children } from "react"
import themeColors from "../configs/theme"
import { useSelector } from "react-redux";
import { Card as AntCard } from "antd";

function Card({ children, title }) {
    const { theme } = useSelector((state) => state);
    return <AntCard
        title={title}
        headStyle={{
            background: themeColors[theme]?.submenuBg, color: themeColors[theme]?.text, alignItems: "center", display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
        style={{
            backgroundColor: themeColors[theme]?.submenuBg,
            color: themeColors[theme]?.text,

        }}
    >
        {children}
    </AntCard>

}
export default Card
//------------> منوی معامله ارز > زیرمنوی واگذاری پروانه و تهاتر ارزی <------------

import { Tabs, EmergencyProblem } from "../../../components";
import ExchangeCartable from "./exchange-cartable/ExchangeCartable.jsx";
import TransferCartable from "./transfer-cartable/TransferCartable.jsx";
import Announcement from "./announcement/Announcement.jsx";

const Management = () => {
  const items = [
    {
      label: "کارتابل واگذاری",
      key: "trasfer",
      children: <TransferCartable />,
    },
    {
      label: "کارتابل تهاتر",
      key: "exchange",
      children: <ExchangeCartable />,
    },
    {
      label: "آگهی‌های من",
      key: "announcement",
      children: <Announcement />,
    },
  ];
  return (
    <>
      <Tabs items={items} /> <EmergencyProblem title="نیما" />
    </>
  );
};
export default Management;

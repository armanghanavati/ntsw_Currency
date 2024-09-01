import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const ManageDetails = ({ children }) => {
  const history = useHistory();
  const { search, pathname } = useLocation();
  const [hasAccess, setHasAccess] = useState(true);
  const validateQueryparamsType = () => {
    const lastPartOfPathname = pathname.toLowerCase().split("/")[4];
    // اگر صفحه ای نیاز به کوئری پارامتر دارد ولی در روت ان کوئری وجود ندارد کاربر را به 404 منتقل میکند
    if (search.toLowerCase().includes("key")) {
      const splitSearch = search.split("=");
      let countKeyCharachter = search.match(/key/g);
      let key = 0,
        key2 = 0;
      if (countKeyCharachter.length > 1) {
        key = splitSearch.indexOf("&key2");
        key2 = splitSearch.indexOf("?key");
      }
      try {
        // تایپ کوئری پارامس چک میشود و درصورت نامبر نبودن کاربر به صفحه 404 منتقل میشود
        if (
          (countKeyCharachter.length === 1 &&
            !!atob(splitSearch[1]) &&
            isNaN(Number(atob(splitSearch[1])))) ||
          (!!atob(splitSearch[key2 + 1]) &&
            isNaN(Number(atob(splitSearch[key2 + 1]))) &&
            !!atob(splitSearch[key + 1]) &&
            isNaN(Number(atob(splitSearch[key + 1]))))
        ) {
          history.push({
            pathname: "/Users/AC/404",
            state: {
              from: lastPartOfPathname.includes("edit")
                ? lastPartOfPathname[1]
                : lastPartOfPathname.includes("details")
                ? lastPartOfPathname.split("details")[0]
                : lastPartOfPathname.split("create")[1],
            },
          });
        } else {
          setHasAccess(true);
        }
      } catch (error) {
        history.push({
          pathname: "/Users/AC/404",
          state: {
            from: lastPartOfPathname.includes("edit")
              ? lastPartOfPathname[1]
              : lastPartOfPathname.includes("details")
              ? lastPartOfPathname.split("details")[0]
              : lastPartOfPathname.split("create")[1],
          },
        });
      }
    } else {
      history.push({
        pathname: "/Users/AC/404",
        state: {
          from: lastPartOfPathname.includes("edit")
            ? lastPartOfPathname[1]
            : lastPartOfPathname.includes("details")
            ? lastPartOfPathname.split("details")[0]
            : lastPartOfPathname.split("create")[1],
        },
      });
    }
  };

  useEffect(() => {
    validateQueryparamsType();
  }, [pathname]);

  return <>{hasAccess && children}</>;
};

export default ManageDetails;

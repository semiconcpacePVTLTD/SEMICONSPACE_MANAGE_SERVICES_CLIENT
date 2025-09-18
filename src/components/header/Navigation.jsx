import menus from "@/data/navigation";
import { isActiveNavigation } from "@/utils/isActiveNavigation";
import { Link, useLocation } from "react-router-dom";

export default function Navigation({ services = [] }) {
  const { pathname } = useLocation();

  // Build dynamic children from services API
  const dynamicServices = services.map((srv, index) => {
    const id = srv?.id ?? srv?._id ?? index + 1; // support typical Mongo _id fallback
    const name = srv?.name ?? srv?.title ?? `Service ${index + 1}`;
    return {
      id,
      name, // 👈 label in menu
      path: `/service-single/${id}`, // go to service single page with id
      state: { service: srv }, // pass full service via route state (RRv6)
    };
  });

  // Merge into menus (clone to avoid mutating)
  const mergedMenus = menus.map((menu) =>
    menu.id === 2
      ? { ...menu, children: dynamicServices } // replace children
      : menu
  );

  return (
    <ul
      className={`ace-responsive-menu ui-navigation ${
        ["/home-3", "/home-4", "/home-10"].includes(pathname)
          ? "menu-without-paddingy"
          : ""
      }`}
    >
      {mergedMenus.map((item, i) => (
        <li
  key={i}
  className={`visible_list ${
    item.id === 1 ? "home-menu-parent" : ""
  }`}
>
  {item.children ? (
    item.path ? (
      <Link
        to={item.path}
        className={`list-item ${
          isActiveNavigation(pathname, item) ? "ui-active" : ""
        }`}
      >
        <span className="title">{item.name}</span>
        {item.children && <span className="arrow "></span>}
      </Link>
    ) : (
      <a
        className={`list-item ${
          isActiveNavigation(pathname, item) ? "ui-active" : ""
        }`}
      >
        <span className="title">{item.name}</span>
        {item.children && <span className="arrow "></span>}
      </a>
    )
  ) : (
    <Link
      to={item.path}
      className={`list-item ${
        item.path === pathname ? "ui-active" : ""
      }`}
    >
      <span className="title">{item.name}</span>
    </Link>
  )}

  {item.children && (
    <ul className={`sub-menu ${item.id === 1 ? "home-menu" : ""}`}>
      {item.children.map((item2, i2) => (
        <li
          key={i2}
          className={`${
            isActiveNavigation(pathname, item2) ||
            item2.path === pathname
              ? "ui-child-active"
              : ""
          }`}
        >
          <Link to={item2.path} state={item2.state}>
            <span className="title">{item2.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )}
</li>

      ))}
    </ul>
  );
}

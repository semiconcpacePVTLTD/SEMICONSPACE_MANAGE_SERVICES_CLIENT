import Header1 from "@/components/header/Header1";

import "./globals.css";
import Footer from "@/components/footer/Footer";
import { useEffect } from "react";
import BottomToTop from "@/components/button/BottomToTop";
import SearchModal1 from "@/components/modal/SearchModal1";
import { useLocation } from "react-router-dom";

import Header2 from "@/components/header/Header2";
import Header3 from "@/components/header/Header3";
import {
  header1,
  header10,
  header11,
  header2,
  header3,
  header4,
  header5,
  header6,
  header7,
  header8,
  header9,
  sidebarEnable,
} from "@/data/header";
import Header4 from "@/components/header/Header4";
import Header5 from "@/components/header/Header5";
import Footer2 from "@/components/footer/Footer2";
import Header6 from "@/components/header/Header6";
import Footer3 from "@/components/footer/Footer3";
import Header7 from "@/components/header/Header7";
import Header8 from "@/components/header/Header8";
import Header9 from "@/components/header/Header9";
import Footer4 from "@/components/footer/Footer4";
import Header10 from "@/components/header/Header10";
import Footer5 from "@/components/footer/Footer5";
import Header11 from "@/components/header/Header11";
import toggleStore from "@/store/toggleStore";
import { footer } from "@/data/footer";
import "react-tooltip/dist/react-tooltip.css";
import NavSidebar from "@/components/sidebar/NavSidebar";
import Footer12 from "@/components/footer/Footer12";
import Footer14 from "@/components/footer/Footer14";
import Footer15 from "@/components/footer/Footer15";
import Footer18 from "@/components/footer/Footer18";
import Footer18WithServices from "@/components/footer/Footer18WithServices";
import Footer20 from "@/components/footer/Footer20";
import WOW from "wow.js";
import { ServicesProvider } from "@/contexts/ServicesContext";

import Routes from "./Routes";
import ScrollTopBehaviour from "./components/common/ScrollTopBehaviour";
if (typeof window !== "undefined") {
  import("bootstrap");
}

function App() {
  const isListingActive = toggleStore((state) => state.isListingActive);

  const { pathname } = useLocation();

  useEffect(() => {
    new WOW({
      live: false,
    }).init();
  }, [pathname]);

  return (
    <div
      className={` ${pathname === "/register" || pathname === "/login"
        ? "bgc-thm4 mm-wrapper mm-wrapper--position-left-front"
        : sidebarEnable.includes(pathname)
          ? isListingActive
            ? "menu-hidden-sidebar-content"
            : ""
          : ""
        }`}
    >
      {!footer.includes(pathname) ? (
        <div className="wrapper ovh mm-page mm-slideout">
          {header1.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header1 />}
          {header2.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header2 />}
          {header3.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header3 />}
          {header4.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header4 />}
          {header5.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header5 />}
          {header6.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header6 />}
          {header7.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header7 />}
          {header8.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header8 />}
          {header9.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header9 />}
          {header10.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header10 />}
          {header11.find(
            (elm) => elm?.split("/")[1] == pathname?.split("/")[1]
          ) && <Header11 />}

          <SearchModal1 />

          <div className="body_content">
            {/* {children} */}
            <Routes />
            {/* footer */}
            {pathname === "/home-4" ||
              pathname === "/home-7" ||
              pathname === "/home-13" ? (
              <Footer2 />
            ) : pathname === "/home-5" ? (
              <Footer3 />
            ) : pathname === "/home-8" ? (
              <Footer4 />
            ) : pathname === "/home-9" ? (
              <Footer5 />
            ) : pathname === "/home-12" ? (
              <Footer12 />
            ) : pathname === "/home-14" ? (
              <Footer14 />
            ) : pathname === "/home-15" ? (
              <Footer15 />
            ) : pathname === "/home-18" ? (
              <Footer18 />
            ) : pathname === "/home-20" ? (
              <Footer20 />
            ) : (
              !pathname.startsWith("/dashboard") &&
              pathname !== "/service-7" &&
              pathname !== "/invoices" &&
              pathname !== "/wallet" &&
              pathname !== "/working-projects" && <Footer18 />
            )}

            {/* bottom to top */}
            <BottomToTop />
          </div>
        </div>
      ) : (
        <div className="wrapper mm-page mm-slideout">
          <Routes />
          {/* {children} */}
          {/* bottom to top */}
          <BottomToTop />
        </div>
      )}

      {/* sidebar mobile navigation */}
      {/* <NavSidebar /> */}
      <ScrollTopBehaviour />
    </div>
  );
}

export default App;

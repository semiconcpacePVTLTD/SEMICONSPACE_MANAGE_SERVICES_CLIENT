import { Link } from "react-router-dom";
import FooterHeader from "./FooterHeader";
import { useLocation } from "react-router-dom";

import FooterSelect2 from "./FooterSelect2";
import { about, category, support } from "@/data/footer";

export default function Footer() {
  const { pathname } = useLocation();

  return (
    <>
      <section
        className={`footer-style1 pt25 pb-0 
                ${
                  pathname === "/home-2"
                    ? "at-home6 home2-footer-radius"
                    : pathname === "/home-4"
                    ? "at-home7"
                    : pathname === "/home-6"
                    ? "at-home6"
                    : pathname === "/home-10"
                    ? "at-home10"
                    : pathname === "/home-11"
                    ? "at-home11"
                    : ""
                }
                 `}
      >
        <div className="container">
          {/* Top part of footer */}
          <FooterHeader />

          {/* Bottom part with copyright */}
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="text-center text-lg-start">
                  <p
                    className={`copyright-text mb-2 mb-md-0  ${
                      pathname === "/home-11"
                        ? "text-white"
                        : "text-white-light"
                    } ff-heading`}
                  >
                    © support@semiconspace.com. {new Date().getFullYear()}{" "}
                    <a
                      href="https://themeforest.net/user/ib-themes/portfolio"
                      target="_blank"
                      style={{ color: "inherit" }}
                      rel="noreferrer"
                    >
                      ib-themes
                    </a>
                    . All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

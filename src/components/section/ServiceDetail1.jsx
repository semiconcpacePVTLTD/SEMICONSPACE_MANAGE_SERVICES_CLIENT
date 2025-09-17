import ServiceDetailComment1 from "../element/ServiceDetailComment1";
import ServiceDetailExtra1 from "../element/ServiceDetailExtra1";
import ServiceDetailFaq1 from "../element/ServiceDetailFaq1";
import ServiceDetailPrice1 from "../element/ServiceDetailPrice1";
import ServiceDetailReviewInfo1 from "../element/ServiceDetailReviewInfo1";
import ServiceDetailSlider1 from "../element/ServiceDetailSlider1";
import { Sticky, StickyContainer } from "react-sticky";
import useScreen from "@/hook/useScreen";
import ServiceContactWidget1 from "../element/ServiceContactWidget1";

export default function ServiceDetail1({ service, loading }) {
  const isMatchedScreen = useScreen(1216);

  // Dynamic fields from backend
  const about = service?.longDescription || service?.description || "";
  const capabilities = service?.capabilities || "";
  const tools = service?.tools || "";
  const other1 = service?.other1 || "";
  const other2 = service?.other2 || "";
  const images = Array.isArray(service?.imgURLs) ? service?.imgURLs : undefined;

  return (
    <>
      <StickyContainer>
        <section className="pt10 pb90 pb30-md">
          <div className="container">
            <div className="row wrap">
              <div className="col-lg-8">
                <div className="column">
                  <ServiceDetailSlider1 images={images} />
                  <div className="service-about">
                    <h4>About</h4>

                    <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                      {loading ? "Loading..." : about || ""}
                    </p>

                    {capabilities && (
                      <>
                        <p className="text mb-0">Capabilities</p>
                        <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                          {capabilities}
                        </p>
                      </>
                    )}

                    {tools && (
                      <>
                        <p className="text mb-0">Tools</p>
                        <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                          {tools}
                        </p>
                      </>
                    )}

                    {other1 && (
                      <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                        {other1}
                      </p>
                    )}
                    {other2 && (
                      <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                        {other2}
                      </p>
                    )}

                    {/* Keep existing static sections below to preserve design */}
                    <div className="d-flex align-items-start mb50">
                      <div className="list1">
                        <h6>App type</h6>
                        <p className="text mb-0">Business, Food &amp; drink,</p>
                        <p className="text">Graphics &amp; design</p>
                      </div>
                      <div className="list1 ml80">
                        <h6>Design tool</h6>
                        <p className="text mb-0">Adobe XD, Figma,</p>
                        <p className="text">Adobe Photoshop</p>
                      </div>
                      <div className="list1 ml80">
                        <h6>Device</h6>
                        <p className="text">Mobile, Desktop</p>
                      </div>
                    </div>

                    <ServiceDetailComment1 />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="column">
                  {isMatchedScreen ? (
                    <Sticky>
                      {({ style }) => (
                        <div className="scrollbalance-inner" style={style}>
                          <div className="blog-sidebar ms-lg-auto">
                            <ServiceDetailPrice1 />
                            <ServiceContactWidget1 />
                          </div>
                        </div>
                      )}
                    </Sticky>
                  ) : (
                    <div className="scrollbalance-inner">
                      <div className="blog-sidebar ms-lg-auto">
                        <ServiceDetailPrice1 />
                        <ServiceContactWidget1 />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </StickyContainer>
    </>
  );
}
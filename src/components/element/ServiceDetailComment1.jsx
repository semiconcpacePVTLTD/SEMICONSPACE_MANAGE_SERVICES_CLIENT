export default function ServiceDetailComment1() {
  return (
    <>
      <div className="bsp_reveiw_wrt mb20">


        <form className="comments_form mt30 mb30-md">
          <div className="row">

            <div className="col-md-6">
              <div className="mb20">
                <label className="fw500 ff-heading dark-color mb-2">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ali Tufan"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb20">
                <label className="fw500 ff-heading dark-color mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="creativelayers088"
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb20">
                <label className="custom_checkbox fz15 ff-heading">
                  Save my name, email, and website in this browser for the next
                  time I comment.
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </div>
              <a className="ud-btn btn-thm">
                Send
                <i className="fal fa-arrow-right-long" />
              </a>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

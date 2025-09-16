import React, { useState, useEffect } from "react";

export default function ContactInfo1() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // lightweight toast state (no external deps)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    return () => clearTimeout(t);
  }, [toast.show]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // validate fields
  const validate = () => {
    let tempErrors = {};

    // Name validation: required, only letters, max 15
    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
    } else if (!/^[A-Za-z]{1,15}$/.test(formData.name.trim())) {
      tempErrors.name = "Name must contain only letters and max 15 characters";
    }

    // Email validation: required, valid email format
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email.trim())
    ) {
      tempErrors.email = "Enter a valid email (e.g., user@gmail.com)";
    }

    // Message validation
    if (!formData.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // opens default email app with prefilled data
    window.location.href = `mailto:support@semiconspace.com?subject=Contact Form Submission&body=Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;

    // show success toast instead of inline text
    setToast({ show: true, message: "Message prepared in your mail client!", type: "success" });
    setSuccess("");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* Toast (top-right) */}
      {toast.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div className={`alert alert-${toast.type} shadow mb-0`} role="alert">
            {toast.message}
          </div>
        </div>
      )}

      <section className="pt-0">
        <div className="container">
          <div className="row wow fadeInUp" data-wow-delay="300ms">
            {/* LEFT SIDE INFO */}
            <div className="col-lg-6">
              <div className="position-relative mt40">
                <div className="main-title">
                  <h4 className="form-title mb25">Keep In Touch With Us.</h4>
                  <p className="text">
                    Neque convallis a cras semper auctor. Libero id faucibus
                    nisl tincidunt egetnvallis.
                  </p>
                </div>
                <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                  <div className="icon flex-shrink-0">
                    <span className="flaticon-tracking" />
                  </div>
                  <div className="details">
                    <h5 className="title">Address</h5>
                    <p className="mb-0 text">
                      565, 9th Cross Road, 7th Main Road, Sarakki, 3rd Phase JP Nagar, Bengaluru - 560078, Karnataka.
                    </p>
                  </div>
                </div>
                <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                  <div className="icon flex-shrink-0">
                    <span className="flaticon-call" />
                  </div>
                  <div className="details">
                    <h5 className="title">Phone</h5>
                    <p className="mb-0 text">(+91) 98456 -19692</p>
                  </div>
                </div>
                <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                  <div className="icon flex-shrink-0">
                    <span className="flaticon-mail" />
                  </div>
                  <div className="details">
                    <h5 className="title">Email</h5>
                    <p className="mb-0 text">support@semiconspace.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="col-lg-6">
              <div className="contact-page-form default-box-shadow1 bdrs8 bdr1 p50 mb30-md bgc-white">
                <h4 className="form-title mb25">Tell us about yourself</h4>
                <p className="text mb30">
                  Whether you have questions or you would just like to say hello, contact us.
                </p>
                <form className="form-style1" onSubmit={handleSubmit} noValidate>
                  <div className="row">
                    {/* Name */}
                    <div className="col-md-6">
                      <div className="mb20">
                        <label className="heading-color ff-heading fw500 mb10">
                          Name
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? "is-invalid" : ""}`}
                          placeholder="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                          <div className="invalid-feedback d-block">{errors.name}</div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <div className="mb20">
                        <label className="heading-color ff-heading fw500 mb10">
                          Email
                        </label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          placeholder="Enter Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <div className="invalid-feedback d-block">{errors.email}</div>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="col-md-12">
                      <div className="mb20">
                        <label className="heading-color ff-heading fw500 mb10">
                          Message
                        </label>
                        <textarea
                          cols={30}
                          rows={6}
                          className={`form-control ${errors.message ? "is-invalid" : ""}`}
                          placeholder="Description"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          aria-invalid={!!errors.message}
                        />
                        {errors.message && (
                          <div className="invalid-feedback d-block">{errors.message}</div>
                        )}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="col-md-12">
                      <div>
                        <button type="submit" className="ud-btn btn-thm">
                          Send Message
                          <i className="fal fa-arrow-right-long" />
                        </button>
                        {/* Removed inline success text in favor of toast */}
                        {success && <span className="visually-hidden">{success}</span>}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
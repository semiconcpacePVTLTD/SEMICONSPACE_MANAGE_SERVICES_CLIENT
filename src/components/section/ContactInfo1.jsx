import React, { useState } from "react";
import Swal from 'sweetalert2';
import ContactManager, { validateEmail, validateName, validateMessage } from '../utils/contactManager';

export default function ContactInfo1() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    // Basic field validation
    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Name Required',
        text: 'Please enter your name',
        confirmButtonColor: '#007bff',
        background: '#fff',
        color: '#333'
      });
      return;
    }

    if (!email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address',
        confirmButtonColor: '#007bff',
        background: '#fff',
        color: '#333'
      });
      return;
    }

    if (!message.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Message Required',
        text: 'Please enter your message',
        confirmButtonColor: '#007bff',
        background: '#fff',
        color: '#333'
      });
      return;
    }

    // Advanced validation
    if (!validateName(name)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Name',
        text: 'Name must contain only letters and spaces (2-50 characters)',
        confirmButtonColor: '#007bff',
        background: '#fff',
        color: '#333'
      });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        confirmButtonColor: '#007bff',
        background: '#fff',
        color: '#333'
      });
      return;
    }

    if (!validateMessage(message)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Message',
        text: 'Message must be between 10-1000 characters',
        confirmButtonColor: '#007bff',
        background: '#fff',
        color: '#333'
      });
      return;
    }

    // Check for recent message from same email
    if (ContactManager.hasRecentMessage(email)) {
      Swal.fire({
        icon: 'info',
        title: 'Recent Message Found',
        text: 'You have already sent a message recently. Please wait 24 hours before sending another message.',
        confirmButtonColor: '#007bff',
        background: '#fff',
        color: '#333'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save the contact message
      const saved = await new Promise(resolve => {
        setTimeout(() => {
          resolve(ContactManager.saveContactMessage(name, email, message));
        }, 1000); // Simulate API delay
      });

      if (saved) {
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Message Sent Successfully!',
          html: `
            <p><strong>Thank you, ${name.split(' ')[0]}!</strong></p>
            <p>Your message has been received and we'll get back to you shortly.</p>
            <small>We typically respond within 24-48 hours.</small>
          `,
          confirmButtonColor: '#007bff',
          timer: 5000,
          timerProgressBar: true,
          background: '#fff',
          color: '#333',
          showClass: {
            popup: 'animate__animated animate__fadeInUp'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutDown'
          }
        });

        // Clear the form
        setFormData({ name: "", email: "", message: "" });
      } else {
        // Error saving message
        Swal.fire({
          icon: 'error',
          title: 'Failed to Send Message',
          text: 'There was an error sending your message. Please try again later.',
          confirmButtonColor: '#007bff',
          background: '#fff',
          color: '#333'
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: 'An unexpected error occurred. Please try again later.',
        confirmButtonColor: '#007bff',
        background: '#fff',
        color: '#333'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                        className="form-control"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid="false"
                      />
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
                        className="form-control"
                        placeholder="Enter Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid="false"
                      />
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
                        className="form-control"
                        placeholder="Description"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid="false"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="col-md-12">
                    <div>
                      <button
                        type="submit"
                        className="ud-btn btn-thm"
                        disabled={isLoading}
                        style={{
                          opacity: isLoading ? 0.7 : 1,
                          cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isLoading ? 'Sending...' : 'Send Message'}
                        <i className="fal fa-arrow-right-long" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
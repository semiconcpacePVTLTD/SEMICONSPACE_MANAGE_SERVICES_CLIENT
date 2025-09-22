import { about, category, support } from "@/data/footer";
import React, { useState, useEffect, useMemo } from "react";
import FooterSocial5 from "./FooterSocial5";
import FooterSelect2 from "./FooterSelect2";
import { Link } from "react-router-dom";
import FooterSocial6 from "./FooterSocial6";
import Swal from 'sweetalert2';
import SubscriptionManager, { validateEmail } from '../../utils/subscriptionManager';

export default function Footer18({ services = [] }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  // Extract unique categories from services and create dynamic category links
  const categoriesToDisplay = useMemo(() => {
    try {
      // Handle different service data structures
      const serviceList = Array.isArray(services)
        ? services
        : services?.data && Array.isArray(services.data)
          ? services.data
          : [];

      if (serviceList.length === 0) {
        // Fallback to static categories if no services available
        return category;
      }

      // Extract unique categories from services
      const uniqueCategories = new Set();
      serviceList.forEach(service => {
        if (service.category && service.category.trim()) {
          uniqueCategories.add(service.category.trim());
        }
      });

      // Convert to the format expected by the footer (with id and path)
      const dynamicCategoryList = Array.from(uniqueCategories)
        .slice(0, 9) // Limit to 9 categories to match original design
        .map((categoryName, index) => ({
          id: index + 1,
          name: categoryName,
          path: `/service-2?category=${encodeURIComponent(categoryName)}`
        }));

      // If we have dynamic categories, use them; otherwise fallback to static
      return dynamicCategoryList.length > 0 ? dynamicCategoryList : category;
    } catch (error) {
      console.error('Error processing categories:', error);
      return category; // Fallback to static categories on error
    }
  }, [services]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValue = email.trim();

    if (!emailValue) {
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

    if (!validateEmail(emailValue)) {
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

    setIsLoading(true);

    try {
      const saved = await SubscriptionManager.saveSubscription(emailValue);

      if (saved) {
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Thank You!',
          html: `
            <p><strong>Thanks for connecting with us!</strong></p>
            <p>We will keep you updated with our latest news and offers.</p>
            <small>Your subscription has been saved successfully!</small>
          `,
          confirmButtonColor: '#007bff',
          timer: 4000,
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

        // Clear the input
        setEmail('');
      } else {
        // Email already exists
        Swal.fire({
          icon: 'info',
          title: 'Already Subscribed!',
          text: 'This email is already subscribed to our newsletter.',
          confirmButtonColor: '#007bff',
          background: '#fff',
          color: '#333'
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Subscription Failed',
        text: 'There was an error processing your subscription. Please try again later.',
        confirmButtonColor: '#007bff',
        background: '#fff',
        color: '#333'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="footer-style1 at-home18 m30 pb-0 pt150">
      <div className="container">
        <div className="row bb-white-light pb10 mb60">
          <div className="col-md-7">
            <div className="d-block text-center text-md-start justify-content-center justify-content-md-start d-md-flex align-items-center mb-3 mb-md-0">
              <a className="fz17 fw500 text-white mr15-md mr30" href="#">
                Terms of Service
              </a>
              <a className="fz17 fw500 text-white mr15-md mr30" href="#">
                Privacy Policy
              </a>

            </div>
          </div>
          <div className="col-md-5">
            <FooterSocial6 />
          </div>
        </div>
        <div className="row">

          <div className="col-sm-6 col-lg-3">
            <div className="link-style1 mb-4 mb-sm-5">
              <h5 className="text-white mb15">Support</h5>
              <ul className="ps-0">
                {support.map((item, i) => (
                  <li key={i}>
                    <Link to={item.path}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="footer-widget">
              <div className="footer-widget mb-4 mb-sm-5">
                <div className="mailchimp-widget">
                  <h5 className="title text-white mb20">Subscribe</h5>
                  <form className="mailchimp-style1" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      className="form-control bdrs4"
                      placeholder="Your email address"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        opacity: isLoading ? 0.7 : 1,
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isLoading ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container white-bdrt1 py-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="text-center text-lg-start">
              <p className="copyright-text mb-2 mb-md-0 text-white-light ff-heading">
                © Semiconspace.com 2025. All rights reserved.
              </p>
            </div>
          </div>
          {/* <div className="col-md-6">
            <div className="footer_bottom_right_btns text-center text-lg-end">
              <FooterSelect2 />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

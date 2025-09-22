import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MetaComponent from "@/components/common/MetaComponent";
import {
  validateUsername,
  validateEmail,
  validatePhone,
  validatePassword,
} from "@/utils/validation";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Register",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    roleId: "", // 1,2,3
    companyName: "",
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [rolesError, setRolesError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Fetch roles on mount (guarded to avoid double fetch in React 18 StrictMode)
  const fetchedRolesRef = useRef(false);
  useEffect(() => {
    if (fetchedRolesRef.current) return;
    fetchedRolesRef.current = true;

    const host = import.meta.env.VITE_BACKEND_HOST;
    // Prefer existing .env keys; profile service first, then user service
    const profilePort =
      import.meta.env.VITE_BACKEND_PROFILE_PORT ||
      import.meta.env.VITE_BACKEND_USER_PORT;
    if (!host || !profilePort) {
      setRolesError("Backend host/port missing in .env");
      return;
    }
    const url = `http://${host}:${profilePort}/profile-service/getrole`;
    setLoadingRoles(true);
    setRolesError("");
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.data)) {
          setRoles(json.data);
        } else {
          setRolesError("Failed to load roles");
        }
      })
      .catch(() => setRolesError("Failed to load roles"))
      .finally(() => setLoadingRoles(false));
  }, []);

  const handleSubmit = () => {
    const newErrors = {
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
    };

    // Require selecting a role first
    if (!form.roleId) {
      newErrors.roleId = "User type is required";
    }

    // Role-based validation
    if (form.roleId === "3") {
      if (!form.companyName?.trim()) {
        newErrors.companyName = "Company name is required for this role";
      }
    }

    setErrors(newErrors);

    if (!Object.values(newErrors).some((err) => err)) {
      const host = import.meta.env.VITE_BACKEND_HOST;
      const userPort = import.meta.env.VITE_BACKEND_USER_PORT;
      if (!host || !userPort) {
        setErrors((prev) => ({
          ...prev,
          submit: "Backend host/port missing in .env",
        }));
        return;
      }

      const payload = {
        name: form.username,
        company_name: form.roleId === "3" ? form.companyName : "",
        email: form.email,
        phone: form.phone,
        password: form.password,
        role_id: form.roleId,
      };

      fetch(`http://${host}:${userPort}/auth-service/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data?.message || "Registration failed");
          }
          return data;
        })
        .then((data) => {
          // If API indicates failure, show error alert
          if (!data?.success) {
            throw new Error(data?.message || "Registration failed");
          }

          // Persist response in localStorage and access token
          try {
            localStorage.setItem("auth", JSON.stringify(data));

            if (data?.data?.access_token) {
              localStorage.setItem("access_token", data.data.access_token);
              localStorage.setItem("isLoggedIn", "true"); // 🔥 set login flag
            } else {
              localStorage.setItem("isLoggedIn", "false"); // fallback
            }
          } catch (_) {}

          // Show success and navigate home
          Swal.fire({
            icon: "success",
            title: "Registration successful",
            text: data?.message || "User registered successfully",
            confirmButtonColor: "#10b981",
          }).then(() => {
            navigate("/");
          });
        })
        .catch((err) => {
          // Show error alert on failure
          Swal.fire({
            icon: "error",
            title: "Registration failed",
            text: err?.message || "Registration failed",
            confirmButtonColor: "#ef4444",
          });

          setErrors((prev) => ({
            ...prev,
            submit: err.message || "Registration failed",
          }));
        });
    }
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <section className="our-register">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 m-auto wow fadeInUp"
              data-wow-delay="300ms"
            >
              <div className="main-title text-center">
                <h2 className="title">Register</h2>
                <p className="paragraph">
                  Give your visitor a smooth online experience with a solid UX
                  design
                </p>
              </div>
            </div>
          </div>
          <div className="row wow fadeInRight" data-wow-delay="300ms">
            <div className="col-xl-6 mx-auto">
              <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
                <div className="mb30">
                  <h4>Let's create your account!</h4>
                  <p className="text mt20">
                    Already have an account?{" "}
                    <Link to="/login" className="text-thm">
                      Log In!
                    </Link>
                  </p>
                </div>

                {/* Username */}
                {/* Username */}
                <div className="mb25">
                  <label className="form-label fw500 dark-color">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={form.username}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Allow only letters & numbers, limit 15 chars
                      value = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 15);
                      setForm({ ...form, username: value });
                    }}
                    placeholder="Enter your username (letters & numbers only, max 15)"
                  />
                  {errors.username && (
                    <p className="text-danger">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div className="mb25">
                  <label className="form-label fw500 dark-color">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter a valid email (example@gmail.com)"
                  />
                  {errors.email && (
                    <p className="text-danger">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                {/* Phone */}
                <div className="mb25">
                  <label className="form-label fw500 dark-color">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Allow only digits, max 10
                      value = value.replace(/[^0-9]/g, "").slice(0, 10);
                      setForm({ ...form, phone: value });
                    }}
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.phone && (
                    <p className="text-danger">{errors.phone}</p>
                  )}
                </div>

              {/* Password */}
<div className="mb25">
  <label className="form-label fw500 dark-color">Password</label>
  <div style={{ position: "relative" }}>
    <input
      type={showPassword ? "text" : "password"}
      className="form-control"
      name="password"
      value={form.password}
      onChange={(e) => {
        let value = e.target.value;
        // Limit password length to 15
        if (value.length <= 15) {
          setForm({ ...form, password: value });
        }
      }}
      placeholder="Min 8, Max 15 chars (1 uppercase, 1 lowercase, 1 number, 1 special)"
    />
    {/* Eye toggle button */}
    <span
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#666",
      }}
    >
      <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"} />
    </span>
  </div>
  {errors.password && (
    <p className="text-danger">{errors.password}</p>
  )}
</div>

                {/* Role Dropdown */}
                <div className="mb25">
                  <label className="form-label fw500 dark-color">
                    User Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-control ${
                      errors.roleId ? "is-invalid" : ""
                    }`}
                    name="roleId"
                    value={form.roleId}
                    onChange={handleChange}
                    disabled={loadingRoles}
                    required
                  >
                    <option value="">
                      {loadingRoles
                        ? "Loading roles..."
                        : "Select user type (required)"}
                    </option>
                    {roles.map((r) => (
                      <option key={r.role_id} value={String(r.role_id)}>
                        {r.role_name}
                      </option>
                    ))}
                  </select>
                  {errors.roleId && (
                    <p className="text-danger">{errors.roleId}</p>
                  )}
                </div>

                {form.roleId === "3" && (
                  <>
                    <div className="mb25">
                      <label className="form-label fw500 dark-color">
                        Company Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Enter your company name"
                      />
                      {errors.companyName && (
                        <p className="text-danger">{errors.companyName}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Submit Button */}
                {errors.submit && (
                  <p className="text-danger mb10">{errors.submit}</p>
                )}
                <div className="d-grid mb20">
                  <button
                    className="ud-btn btn-thm default-box-shadow2"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Create Account <i className="fal fa-arrow-right-long" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

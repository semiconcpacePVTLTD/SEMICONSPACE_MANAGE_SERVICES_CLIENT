import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { validateEmail, validatePassword } from "@/utils/validation";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const newErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(newErrors);

    // Stop if any errors
    if (Object.values(newErrors).some((err) => err)) return;

    const host = import.meta.env.VITE_BACKEND_HOST;
    const userPort = import.meta.env.VITE_BACKEND_USER_PORT;
    if (!host || !userPort) {
      Swal.fire({
        icon: "error",
        title: "Configuration error",
        text: "Backend host/port missing in .env",
      });
      return;
    }

    const payload = {
      identifier: form.email,
      password: form.password,
    };

    setLoading(true);
    fetch(`http://${host}:${userPort}/auth-service/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message || "Login failed");
        }
        return data;
      })
      .then((data) => {
        if (!data?.success) throw new Error(data?.message || "Login failed");

        // Persist in localStorage (normalize avatar field)
        try {
          const profileImage =
            data?.data?.profile_image ||
            null;
          console.log("profileImage", profileImage);
          const normalized = {
            ...data,
            data: {
              ...data.data,
              // Ensure a consistent avatarUrl key for headers
              avatarUrl: profileImage || undefined,
            },
          };

          localStorage.setItem("auth", JSON.stringify(normalized));
          // Mirror identifiers for downstream modules (tickets expect userId, etc.)
          try {
            const userId =
              normalized?.data?.user?.userId ||
              normalized?.data?.user?.id ||
              normalized?.data?.userId ||
              normalized?.data?.id ||
              normalized?.user?.userId ||
              normalized?.user?.id;
            if (userId) localStorage.setItem("userId", String(userId));

            const name =
              normalized?.data?.user?.name ||
              normalized?.data?.name ||
              normalized?.user?.name;
            if (name) localStorage.setItem("name", String(name));

            const roleId =
              normalized?.data?.user?.role_id ||
              normalized?.data?.role_id ||
              normalized?.user?.role_id;
            if (roleId != null) localStorage.setItem("role_id", String(roleId));
          } catch (_) {}

          if (data?.data?.access_token) {
            localStorage.setItem("access_token", data.data.access_token);
            localStorage.setItem("isLoggedIn", "true");
          }
        } catch (_) { }

        Swal.fire({
          icon: "success",
          title: "Login successful",
          text: data?.message || "Welcome back!",
          confirmButtonColor: "#10b981",
        }).then(() => {
          navigate("/");
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: err?.message || "Invalid credentials",
          confirmButtonColor: "#ef4444",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="our-login">
      <div className="container">
        <div className="row">
          <div
            className="col-lg-6 m-auto wow fadeInUp"
            data-wow-delay="300ms"
          >
            <div className="main-title text-center">
              <h2 className="title">Log In</h2>
              <p className="paragraph">
                Give your visitor a smooth online experience with a solid UX design
              </p>
            </div>
          </div>
        </div>
        <div className="row wow fadeInRight" data-wow-delay="300ms">
          <div className="col-xl-6 mx-auto">
            <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
              <div className="mb30">
                <h4>We're glad to see you again!</h4>
                <p className="text">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-thm">
                    Sign Up!
                  </Link>
                </p>
              </div>

              {/* Email */}
              <div className="mb20">
                <label className="form-label fw600 dark-color">Email Address</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
              </div>

              {/* Password with toggle eye */}
              <div className="mb15 position-relative">
                <label className="form-label fw600 dark-color">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "38px",
                    right: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </span>
                {errors.password && <p className="text-danger">{errors.password}</p>}
              </div>

              {/* Remember + forgot */}
              {/* <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb20">
                <label className="custom_checkbox fz14 ff-heading">
                  Remember me
                  <input type="checkbox" defaultChecked="checked" />
                  <span className="checkmark" />
                </label>
                <a className="fz14 ff-heading">Lost your password?</a>
              </div> */}

              {/* Submit */}
              <div className="d-grid mb20">
                <button
                  className="ud-btn btn-thm"
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}{" "}
                  <i className="fal fa-arrow-right-long" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

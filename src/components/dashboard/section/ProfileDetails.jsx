import React, { useEffect, useMemo, useRef, useState } from "react";
import SelectInput from "../option/SelectInput";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


export default function ProfileDetails({ profile, details, isCustomer, canEditDetails }) {

  console.log("[ProfileDetails] profile prop:", profile, "isCustomer:", isCustomer ,"details:", details);
  // Local editable copy of details (sourced only from props)
  const [profile_details, setProfileDetails] = useState(details || {});
  useEffect(() => { setProfileDetails(details || {}); }, [details]);
  // Non-customer select states
  const [getHourly, setHourly] = useState({ option: "Select", value: null });
  const [getGender, setGender] = useState({ option: "Select", value: null });
  const [getSpecialization, setSpecialization] = useState({ option: "Select", value: null });
  const [getType, setType] = useState({ option: "Select", value: null });
  const [getCountry, setCountry] = useState({ option: "Select", value: null });
  const [getCity, setCity] = useState({ option: "Select", value: null });
  const [getLanguage, setLanguage] = useState({ option: "Select", value: null });
  const [getLanLevel, setLanLevel] = useState({ option: "Select", value: null });


  // Image handling
  const [selectedImage, setSelectedImage] = useState(null); // preview URL
  const [selectedImageFile, setSelectedImageFile] = useState(null); // actual file

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  // handlers for non-customer
  const hourlyHandler = (option, value) => setHourly({ option, value });
  const genderHandler = (option, value) => setGender({ option, value });
  const specializationHandler = (option, value) => setSpecialization({ option, value });
  const typeHandler = (option, value) => setType({ option, value });
  const countryHandler = (option, value) => setCountry({ option, value });
  const cityHandler = (option, value) => setCity({ option, value });
  const languageHandler = (option, value) => setLanguage({ option, value });
  const lanLevelHandler = (option, value) => setLanLevel({ option, value });

  // Customer editable form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    password: "",
    status: false,
    authenticator: false,
    profile_image: "",
    user_id: "",
    role: [],
    role_id: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const initialRef = useRef(null);

  // Seed state from fetched profile
  useEffect(() => {
    if (!profile) return;
    const next = {
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      password: profile?.password || "",
      status: !!profile?.status,
      authenticator: !!profile?.authenticator,
      profile_image: profile?.profile_image || "",
      user_id: profile?.user_id || "",
      role: Array.isArray(profile?.role) ? profile.role : (profile?.role ? [profile.role] : []),
      role_id: Array.isArray(profile?.role_id) ? profile.role_id : (profile?.role_id != null ? [profile.role_id] : []),
    };
    setForm(next);
    // Only set initial once per profile load
    if (!initialRef.current) initialRef.current = next;
    // Initialize image preview from server value
    setSelectedImage(profile?.profile_image || null);
    setSelectedImageFile(null);
  }, [profile]);

  // Track changes compared to initial
  const hasChanges = useMemo(() => {
    const initial = initialRef.current;
    if (!initial) return false;
    const currentImage = selectedImage || ""; // preview URL or empty
    const initialImage = initial.profile_image || "";
    return (
      form.name !== initial.name ||
      form.email !== initial.email ||
      form.phone !== initial.phone ||
      form.bio !== initial.bio ||
      form.location !== initial.location ||
      form.password !== initial.password ||
      currentImage !== initialImage
    );
  }, [form.name, form.email, form.phone, form.bio, form.location, form.password, selectedImage]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const BASE_URL = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PROFILE_PORT}`;

      // Build payload exactly like backend expects (profile object)
      const payload = {
        profile: {
          name: form.name,
          company_name: null, // not in form yet
          location: form.location || null,
          email: form.email,
          phone: form.phone,
          role: form.role,
          role_id: form.role_id,
          bio: form.bio || null,
          profile_image: form.profile_image || null,
          user_id: form.user_id,
          created_at: profile?.created_at ?? null,
          modified_at: null,
          created_by: profile?.created_by ?? form.email,
          modified_by: null,
          status: !!form.status,
          authenticator: !!form.authenticator,
          ...(form.password ? { password: form.password } : {}),
        },
      };

      // Build request. If an image file is selected, send multipart/form-data
      let config = {};
      let body = payload;

      if (selectedImageFile) {
        const fd = new FormData();
        fd.append("profile", new Blob([JSON.stringify(payload.profile)], { type: "application/json" }));
        fd.append("profile_image", selectedImageFile);
        body = fd;
        config.headers = { "Content-Type": "multipart/form-data" };
      }

      const url = `${BASE_URL}/profile-service/updateuser`;
      const res = await axios.put(url, body, config);
      const ok = res?.data?.success ?? true; // assume success=true if backend uses that flag; default true if not provided
      if (ok) {
        Swal.fire({ icon: "success", title: "Profile updated", text: res?.data?.message || "Your changes were saved." })
          .then(() => window.location.reload());
        // reset initial snapshot to disable button again (will be moot after reload)
        initialRef.current = {
          ...initialRef.current,
          name: form.name,
          email: form.email,
          phone: form.phone,
          bio: form.bio,
          location: form.location,
          password: form.password,
          profile_image: selectedImage || "",
        };
      } else {
        Swal.fire({ icon: "error", title: "Update failed", text: res?.data?.message || "Please try again." })
          .then(() => window.location.reload());
      }
    } catch (err) {
      console.error("[ProfileDetails] update error", err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || err.message || "Something went wrong." })
        .then(() => window.location.reload());
    }
  };

  return (
    <>
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Profile Details</h5>
        </div>

        {/* Profile image */}
        <div className="col-xl-7">
          <div className="profile-box d-sm-flex align-items-center mb30">
            <div className="profile-img mb20-sm">
              <img
                className="rounded-circle wa-xs"
                src={selectedImage || profile?.profile_image || "/images/team/fl-1.png"}
                style={{ height: "71px", width: "71px", objectFit: "cover" }}
                alt="profile"
              />
            </div>
            <div className="profile-content ml20 ml0-xs">
              <div className="d-flex align-items-center my-3">
                <a className="tag-delt text-thm2" onClick={() => { setSelectedImage(null); setSelectedImageFile(null); }}>
                  <span className="flaticon-delete text-thm2" />
                </a>
                <label>
                  <input type="file" accept=".png, .jpg, .jpeg" className="d-none" onChange={handleImageChange} />
                  <a className="upload-btn ml10">Upload Image</a>
                </label>
              </div>
              <p className="text mb-0">
                Max file size is 1MB, Minimum dimension: 330x300. Allowed: .jpg, .png
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <form className="form-style1" onSubmit={handleSave}>
            <div className="row">
              {isCustomer ? (
                <>
                  {/* Name */}
              <div className="col-sm-6">
  <div className="mb20">
    <label className="heading-color ff-heading fw500 mb10">Username</label>
    <input
      type="text"
      className="form-control"
      placeholder="Username"
      value={form.name}
      maxLength={15} // ✅ Limit length
      onChange={(e) => {
        const value = e.target.value;
        // ✅ Allow only letters & numbers
        const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");
        setForm((s) => ({ ...s, name: cleanedValue }));
      }}
    />
  </div>
</div>

                  {/* Email */}
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Email Address</label>
                      <input
                        type="email"                        className="form-control"
                        placeholder="Email"
                        value={form.email}
                        readOnly 
                        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                      />
                    </div>
                  </div>
             {/* Phone */}
<div className="col-sm-6">
  <div className="mb20">
    <label className="heading-color ff-heading fw500 mb10">Phone Number</label>
    <input
      type="text"
      className="form-control"
      placeholder="Phone Number"
      value={form.phone}
      maxLength={10} // ✅ restricts to 10 characters
      onChange={(e) => {
        const value = e.target.value;
        // ✅ allow only digits
        const cleanedValue = value.replace(/[^0-9]/g, "");
        setForm((s) => ({ ...s, phone: cleanedValue }));
      }}
    />
  </div>
</div>

                  {/* Bio */}
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Bio</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Bio"
                        value={form.bio}
                        onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))}
                      />
                    </div>
                  </div>
                  {/* Status (read-only) */}
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Status</label>
                      <input type="text" className="form-control" value={form.status ? "Active" : "Inactive"} readOnly />
                    </div>
                  </div>
                  {/* Authenticator (read-only) */}
                  {/* <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Authenticator</label>
                      <input type="text" className="form-control" value={form.authenticator ? "Enabled" : "Disabled"} readOnly />
                    </div>
                  </div> */}

                  {/* Password */}
<div className="col-sm-6">
  <div className="mb20">
    <label className="heading-color ff-heading fw500 mb10">Password</label>
    <div className="input-group">
      <input
        type={showPassword ? "text" : "password"}
        className="form-control"
        placeholder="Password"
        value={form.password}
        maxLength={15}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= 15) {
            setForm((s) => ({ ...s, password: value }));
          }
        }}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => setShowPassword((v) => !v)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <span className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"} />
      </button>
    </div>
    {/* Validation message */}
    {form.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,15}$/.test(form.password) && (
      <p className="text-danger mt-1" style={{ fontSize: "0.9rem" }}>
        Password must be 8–15 chars, include 1 uppercase, 1 lowercase, and 1 special character.
      </p>
    )}
  </div>
</div>
{/* Save button */}
<div className="col-md-12">
  <div className="text-start">
    <button
      type="submit"
      disabled={!hasChanges}
      className={`ud-btn ${hasChanges ? "btn-thm" : "btn-secondary"} `}
      style={{
        cursor: hasChanges ? "pointer" : "not-allowed",
        opacity: hasChanges ? 1 : 0.6, // greyed-out effect
      }}
    >
      Save Changes
      <i className="fal fa-arrow-right-long" />
    </button>
  </div>
</div>

                </>
              ) : (
            <>
  {/* Basic Profile Info */}
  <div className="col-sm-6">
    <div className="mb20">
      <label className="heading-color ff-heading fw500 mb10">Username</label>
      <input
        type="text"
        className="form-control"
        placeholder="Username"
        value={form.name}
        maxLength={15}
        onChange={(e) => {
          const value = e.target.value;
          const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");
          setForm((s) => ({ ...s, name: cleanedValue }));
        }}
      />
    </div>
  </div>
  <div className="col-sm-6">
    <div className="mb20">
      <label className="heading-color ff-heading fw500 mb10">Email Address</label>
      <input type="email" className="form-control" value={form.email} readOnly />
    </div>
  </div>
  <div className="col-sm-6">
    <div className="mb20">
      <label className="heading-color ff-heading fw500 mb10">Phone Number</label>
      <input
        type="text"
        className="form-control"
        placeholder="Phone Number"
        value={form.phone}
        maxLength={10}
        onChange={(e) => {
          const value = e.target.value;
          const cleanedValue = value.replace(/[^0-9]/g, "");
          setForm((s) => ({ ...s, phone: cleanedValue }));
        }}
      />
    </div>
  </div>
  <div className="col-sm-6">
    <div className="mb20">
      <label className="heading-color ff-heading fw500 mb10">Role</label>
      <input type="text" className="form-control" value={profile?.role?.join(", ") || ""} readOnly />
    </div>
  </div>
  <div className="col-sm-6">
    <div className="mb20">
      <label className="heading-color ff-heading fw500 mb10">Role ID</label>
      <input type="text" className="form-control" value={Array.isArray(form.role_id) ? form.role_id.join(", ") : (form.role_id ?? "")} readOnly />
    </div>
  </div>

  {/* Location (editable for all roles) */}
  <div className="col-sm-6">
    <div className="mb20">
      <label className="heading-color ff-heading fw500 mb10">Location</label>
      <input
        type="text"
        className="form-control"
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
      />
    </div>
  </div>

  {/* Password (editable) */}
  <div className="col-sm-6">
    <div className="mb20">
      <label className="heading-color ff-heading fw500 mb10">Password</label>
      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          placeholder="Password"
          value={form.password}
          maxLength={15}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 15) {
              setForm((s) => ({ ...s, password: value }));
            }
          }}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <span className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"} />
        </button>
      </div>
      {form.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,15}$/.test(form.password) && (
        <p className="text-danger mt-1" style={{ fontSize: "0.9rem" }}>
          Password must be 8–15 chars, include 1 uppercase, 1 lowercase, and 1 special character.
        </p>
      )}
    </div>
  </div>

  {/* Profile Details (from profile_details) */}
  {profile_details && (
    <>

      {/* Hourly Rate (editable, decimal only) */}
      <div className="col-sm-6">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Hourly Rate</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 25.5"
            value={profile_details?.hourly_rate ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              const cleaned = value
                .replace(/[^0-9.]/g, "") // keep digits and dot
                .replace(/(\..*)\./g, "$1"); // single dot
              setProfileDetails((s) => ({ ...s, hourly_rate: cleaned }));
            }}
          />
        </div>
      </div>

      {/* Skills with Add button to the right */}
      <div className="col-md-12">
        <div className="mb20">
          <div className="d-flex justify-content-between align-items-center mb10">
            <label className="heading-color ff-heading fw500 mb0">Skills</label>
            <button
              type="button"
              className="ud-btn btn-thm"
              onClick={() => {
                const next = Array.isArray(profile_details?.skills) ? [...profile_details.skills] : [];
                next.push("");
                setProfileDetails((s) => ({ ...s, skills: next }));
              }}
            >
              + Add Skill
            </button>
          </div>
          {(profile_details?.skills ?? [""]).map((skill, idx) => (
            <div key={idx} className="d-flex align-items-center mb10">
              <input
                type="text"
                className="form-control"
                placeholder="Skill"
                value={skill}
                onChange={(e) => {
                  const next = [...(profile_details?.skills ?? [])];
                  next[idx] = e.target.value;
                  setProfileDetails((s) => ({ ...s, skills: next }));
                }}
              />
              <a
                className="tag-delt text-thm2 ml10"
                onClick={() => {
                  const next = [...(profile_details?.skills ?? [])];
                  next.splice(idx, 1);
                  setProfileDetails((s) => ({ ...s, skills: next }));
                }}
                title="Remove skill"
                role="button"
              >
                <span className="flaticon-delete text-thm2" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Services (editable lists per category, add-only) */}
      <div className="col-md-12">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Services</label>
          {Object.keys(profile_details?.services || {}).map((cat) => (
            <div key={cat} className="mb10">
              <div className="d-flex justify-content-between align-items-center mb10">
                <strong className="me-2 text-capitalize">{cat}</strong>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={() => {
                    const list = Array.isArray(profile_details?.services?.[cat]) ? [...profile_details.services[cat]] : [];
                    list.push("");
                    setProfileDetails((s) => ({ ...s, services: { ...(s.services || {}), [cat]: list } }));
                  }}
                >
                  + Add Item
                </button>
              </div>
              {(profile_details?.services?.[cat] ?? []).map((svc, idx) => (
                <div key={`${cat}-${idx}`} className="d-flex align-items-center mb10">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Add ${cat} service`}
                    value={svc}
                    onChange={(e) => {
                      const list = [...(profile_details?.services?.[cat] ?? [])];
                      list[idx] = e.target.value;
                      setProfileDetails((s) => ({ ...s, services: { ...(s.services || {}), [cat]: list } }));
                    }}
                  />
                  <a
                    className="tag-delt text-thm2 ml10"
                    onClick={() => {
                      const list = [...(profile_details?.services?.[cat] ?? [])];
                      list.splice(idx, 1);
                      setProfileDetails((s) => ({ ...s, services: { ...(s.services || {}), [cat]: list } }));
                    }}
                    title="Remove service"
                    role="button"
                  >
                    <span className="flaticon-delete text-thm2" />
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Price Projects (editable known fields) */}
      <div className="col-md-12">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Fixed Price Projects</label>
          <div className="row">
            <div className="col-sm-6 mb10">
              <label className="small mb5">Website</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 500"
                value={profile_details?.fixed_price_projects?.website ?? ""}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                  setProfileDetails((s) => ({
                    ...s,
                    fixed_price_projects: { ...(s.fixed_price_projects || {}), website: v }
                  }));
                }}
              />
            </div>
            <div className="col-sm-6 mb10">
              <label className="small mb5">API Integration</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 300"
                value={profile_details?.fixed_price_projects?.api_integration ?? ""}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                  setProfileDetails((s) => ({
                    ...s,
                    fixed_price_projects: { ...(s.fixed_price_projects || {}), api_integration: v }
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="col-md-12">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Availability</label>
          <div className="row">
            <div className="col-sm-4 mb10">
              <label className="small mb5">Monday</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 9am-6pm"
                value={profile_details?.availability?.monday ?? ""}
                onChange={(e) => setProfileDetails((s) => ({
                  ...s,
                  availability: { ...(s.availability || {}), monday: e.target.value }
                }))}
              />
            </div>
            <div className="col-sm-4 mb10">
              <label className="small mb5">Tuesday</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 9am-6pm"
                value={profile_details?.availability?.tuesday ?? ""}
                onChange={(e) => setProfileDetails((s) => ({
                  ...s,
                  availability: { ...(s.availability || {}), tuesday: e.target.value }
                }))}
              />
            </div>
            <div className="col-sm-4 d-flex align-items-end mb10">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="availabilityRemote"
                  checked={!!profile_details?.availability?.remote}
                  onChange={(e) => setProfileDetails((s) => ({
                    ...s,
                    availability: { ...(s.availability || {}), remote: e.target.checked }
                  }))}
                />
                <label className="form-check-label" htmlFor="availabilityRemote">
                  Remote
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Wallet (read-only) */}
      <div className="col-sm-6">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Status</label>
          <input type="text" className="form-control" value={profile_details?.status ?? ""} readOnly />
        </div>
      </div>
      <div className="col-sm-6">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Wallet Balance</label>
          <input type="text" className="form-control" value={profile_details?.wallet_balance ?? ""} readOnly />
        </div>
      </div>

      {/* Verification (read-only) */}
      <div className="col-sm-6">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Verified</label>
          <input type="text" className="form-control" value={profile_details?.verified ? "true" : "false"} readOnly />
        </div>
      </div>
      <div className="col-md-12">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Remarks</label>
          <input type="text" className="form-control" value={profile_details?.remarks ?? ""} readOnly />
        </div>
      </div>

     {/* Certifications table */}
<div className="col-md-12">
  <div className="mb20">
    <div className="d-flex justify-content-between align-items-center mb10">
      <label className="heading-color ff-heading fw500 mb0">Certifications</label>
      <button
        type="button"
        className="ud-btn btn-thm"
        onClick={() => {
          const next = Array.isArray(profile_details?.certifications)
            ? [...profile_details.certifications]
            : [];
          next.push({ name: "", url: "" });
          setProfileDetails((s) => ({ ...s, certifications: next }));
        }}
      >
        + Add Certification
      </button>
    </div>

    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Certification Name</th>
          <th>Certification URL</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {(profile_details?.certifications ?? []).map((c, idx) => (
          <tr key={idx}>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Certification name"
                value={c?.name || ""}
                onChange={(e) => {
                  const next = [...(profile_details?.certifications ?? [])];
                  next[idx] = { ...(next[idx] || {}), name: e.target.value };
                  setProfileDetails((s) => ({ ...s, certifications: next }));
                }}
              />
            </td>
            <td>
              <input
                type="url"
                className="form-control"
                placeholder="Certification URL (optional)"
                value={c?.url || ""}
                onChange={(e) => {
                  const next = [...(profile_details?.certifications ?? [])];
                  next[idx] = { ...(next[idx] || {}), url: e.target.value };
                  setProfileDetails((s) => ({ ...s, certifications: next }));
                }}
              />
            </td>
            <td className="text-center">
              <span
                className="flaticon-delete text-thm2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const next = [...(profile_details?.certifications ?? [])];
                  next.splice(idx, 1);
                  setProfileDetails((s) => ({ ...s, certifications: next }));
                }}
              ></span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

{/* Portfolio table */}
<div className="col-md-12">
  <div className="mb20">
    <div className="d-flex justify-content-between align-items-center mb10">
      <label className="heading-color ff-heading fw500 mb0">Portfolio</label>
      <button
        type="button"
        className="ud-btn btn-thm"
        onClick={() => {
          const next = Array.isArray(profile_details?.portfolio_projects)
            ? [...profile_details.portfolio_projects]
            : [];
          next.push({ title: "", year: "", description: "", files: [] });
          setProfileDetails((s) => ({ ...s, portfolio_projects: next }));
        }}
      >
        + Add Project
      </button>
    </div>

    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Title</th>
          <th>Year</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {(profile_details?.portfolio_projects ?? []).map((p, idx) => (
          <tr key={idx}>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={p?.title || ""}
                onChange={(e) => {
                  const next = [...(profile_details?.portfolio_projects ?? [])];
                  next[idx] = { ...(next[idx] || {}), title: e.target.value };
                  setProfileDetails((s) => ({ ...s, portfolio_projects: next }));
                }}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Year"
                value={p?.year || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  const next = [...(profile_details?.portfolio_projects ?? [])];
                  next[idx] = { ...(next[idx] || {}), year: val };
                  setProfileDetails((s) => ({ ...s, portfolio_projects: next }));
                }}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={p?.description || ""}
                onChange={(e) => {
                  const next = [...(profile_details?.portfolio_projects ?? [])];
                  next[idx] = { ...(next[idx] || {}), description: e.target.value };
                  setProfileDetails((s) => ({ ...s, portfolio_projects: next }));
                }}
              />
            </td>
            <td className="text-center">
              <span
                className="flaticon-delete text-thm2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const next = [...(profile_details?.portfolio_projects ?? [])];
                  next.splice(idx, 1);
                  setProfileDetails((s) => ({ ...s, portfolio_projects: next }));
                }}
              ></span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      {/* Bio in textfield */}
      <div className="col-md-12">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Bio</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Bio"
            value={form.bio}
            onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))}
          />
        </div>
      </div>

    {/* Education table */}
<div className="col-md-12">
  <div className="mb20">
    <div className="d-flex justify-content-between align-items-center mb10">
      <label className="heading-color ff-heading fw500 mb0">Education</label>
      <button
        type="button"
        className="ud-btn btn-thm"
        onClick={() => {
          const next = Array.isArray(profile_details?.education)
            ? [...profile_details.education]
            : [];
          next.push({ degree: "", institution: "", start_year: "", end_year: "" });
          setProfileDetails((s) => ({ ...s, education: next }));
        }}
      >
        + Add Education
      </button>
    </div>

    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Degree</th>
          <th>Institution</th>
          <th>Start Year</th>
          <th>End Year</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {(profile_details?.education ?? []).map((edu, idx) => (
          <tr key={idx}>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Degree"
                value={edu?.degree || ""}
                onChange={(e) => {
                  const next = [...(profile_details?.education ?? [])];
                  next[idx] = { ...(next[idx] || {}), degree: e.target.value };
                  setProfileDetails((s) => ({ ...s, education: next }));
                }}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Institution"
                value={edu?.institution || ""}
                onChange={(e) => {
                  const next = [...(profile_details?.education ?? [])];
                  next[idx] = { ...(next[idx] || {}), institution: e.target.value };
                  setProfileDetails((s) => ({ ...s, education: next }));
                }}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Start Year"
                value={edu?.start_year || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  const next = [...(profile_details?.education ?? [])];
                  next[idx] = { ...(next[idx] || {}), start_year: val };
                  setProfileDetails((s) => ({ ...s, education: next }));
                }}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="End Year"
                value={edu?.end_year || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  const next = [...(profile_details?.education ?? [])];
                  next[idx] = { ...(next[idx] || {}), end_year: val };
                  setProfileDetails((s) => ({ ...s, education: next }));
                }}
              />
            </td>
            <td className="text-center">
              <span
                className="flaticon-delete text-thm2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const next = [...(profile_details?.education ?? [])];
                  next.splice(idx, 1);
                  setProfileDetails((s) => ({ ...s, education: next }));
                }}
              ></span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      {/* Languages editable list */}
      <div className="col-md-12">
        <div className="mb20">
          <div className="d-flex justify-content-between align-items-center mb10">
            <label className="heading-color ff-heading fw500 mb0">Languages</label>
            <button
              type="button"
              className="ud-btn btn-thm"
              onClick={() => {
                const next = Array.isArray(profile_details?.languages) ? [...profile_details.languages] : [];
                next.push("");
                setProfileDetails((s) => ({ ...s, languages: next }));
              }}
            >
              + Add Language
            </button>
          </div>
          {(profile_details?.languages ?? [""]).map((lan, idx) => (
            <div key={idx} className="d-flex align-items-center mb10">
              <input
                type="text"
                className="form-control"
                placeholder="Language"
                value={lan}
                onChange={(e) => {
                  const next = [...(profile_details?.languages ?? [])];
                  next[idx] = e.target.value;
                  setProfileDetails((s) => ({ ...s, languages: next }));
                }}
              />
              <a
                className="tag-delt text-thm2 ml10"
                onClick={() => {
                  const next = [...(profile_details?.languages ?? [])];
                  next.splice(idx, 1);
                  setProfileDetails((s) => ({ ...s, languages: next }));
                }}
                title="Remove language"
                role="button"
              >
                <span className="flaticon-delete text-thm2" />
              </a>
            </div>
          ))}
        </div>
      </div>

{/* PAN (read-only) */}
<div className="col-sm-6">
  <div className="mb20 position-relative">
    <label className="heading-color ff-heading fw500 mb10">PAN</label>
    <input
      type="text"
      className="form-control pe-5"
      value={profile_details?.pan_number || ""}
      readOnly
      style={{
        paddingRight: "2.2rem", // 👈 ensures space for icon
      }}
    />
    {profile_details?.pan_verified && (
      <span
        style={{
          position: "absolute",
          right: "15px",       // 👈 push inside input border
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          backgroundColor: "white", // 👈 hides input border behind icon
          borderRadius: "50%",
        }}
      >
        <i className="fa fa-check-circle" style={{ color: "#28a745", fontSize: "1.2rem" }} />
      </span>
    )}
  </div>
</div>


    </>
  )}

  {/* Save Button placeholder: currently UI-only */}
  <div className="col-md-12">
    <div className="text-start">
      <button type="button" className="ud-btn btn-secondary" onClick={() => console.log("Updated details (UI only):", { profile: form, details: profile_details })}>
        Save (UI only)
        <i className="fal fa-arrow-right-long" />
      </button>
    </div>
  </div>
</>

              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
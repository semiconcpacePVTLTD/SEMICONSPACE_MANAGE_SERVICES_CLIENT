import React, { useEffect, useMemo, useRef, useState } from "react";
import SelectInput from "../option/SelectInput";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


export default function ProfileDetails({ profile, details, isCustomer, canEditDetails }) {

  console.log("[ProfileDetails] profile prop:", profile, "isCustomer:", isCustomer, "details:", details);
  // Local editable copy of details (sourced only from props)
  const [profile_details, setProfileDetails] = useState(details || {});
  const detailsInitialRef = useRef(null);
  useEffect(() => {
    // Seed editable profile details. Mirror backend 'services' into 'services_list' for UI editing.
    const nextDetails = (() => {
      const d = details ? { ...details } : {};
      if (!Array.isArray(d.services_list)) {
        d.services_list = Array.isArray(d.services) ? [...d.services] : [];
      }
      return d;
    })();
    setProfileDetails(nextDetails);
    if (details && !detailsInitialRef.current) detailsInitialRef.current = nextDetails;
  }, [details]);
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
    // Validate image size (<= 5 MB) and type (PNG/JPG)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "File too large", text: "Max image size is 5 MB." });
      return;
    }
    if (!/^image\/(png|jpe?g)$/i.test(file.type)) {
      Swal.fire({ icon: "error", title: "Invalid file", text: "Only PNG or JPG images are allowed." });
      return;
    }
    setSelectedImageFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  // MCA document handling
  const [mcsDocFile, setMcsDocFile] = useState(null);
  const [mcsDocPreview, setMcsDocPreview] = useState(null);
  const handleMcsDocChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMcsDocFile(file);
    setMcsDocPreview(url);
    // Reflect temp URL in the read-only input for user feedback
    setProfileDetails((d) => ({ ...d, mcs_incorporation_image: url }));
  };

  // Common uploader for profile-service
  const uploadToProfileService = async (file, dirtry, user_id) => {
    const BASE_URL = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PROFILE_PORT}`;
    const url = `${BASE_URL}/profile-service/upload?dirtry=${encodeURIComponent(dirtry)}&user_id=${encodeURIComponent(user_id)}`;
    const formData = new FormData();
    // Backend expects generic file field; adjust if server uses a specific key
    formData.append("file", file);
    const res = await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
    const data = res?.data;
    // Accept common fields: cdn_url, url, location, profile_image
    const uploadedUrl =
      data?.cdn_url ||
      data?.data?.cdn_url ||
      data?.url ||
      data?.data?.url ||
      data?.location ||
      data?.data?.location ||
      data?.profile_image ||
      data?.data?.profile_image ||
      null;

    if (!uploadedUrl) {
      const serverMsg = typeof data === "object" ? (data?.message || data?.error || JSON.stringify(data)) : String(data);
      throw new Error(serverMsg || "Upload did not return a file URL.");
    }
    return uploadedUrl;
  };

  // Separate API call to upload and persist profile image only
  const handleProfileImageUpload = async () => {
    try {
      if (!selectedImageFile) {
        return Swal.fire({ icon: "info", title: "No image selected", text: "Choose an image first." });
      }
      setPageLoading(true);
      // Upload only. Do not call updateuser; success is determined by upload response
      const uploadedUrl = await uploadToProfileService(selectedImageFile, "Manage_Service_Profile_IMG", form.user_id);

      // Reflect uploaded URL locally and notify user
      setForm((s) => ({ ...s, profile_image: uploadedUrl }));
      initialRef.current = { ...(initialRef.current || {}), profile_image: uploadedUrl };
      setSelectedImage(uploadedUrl);
      setSelectedImageFile(null);
      Swal.fire({ icon: "success", title: "Image uploaded" });
    } catch (err) {
      console.error("[ProfileDetails] profile image upload error", err);
      const status = err?.response?.status;
      const isNetwork = err?.message?.includes("Network Error") || err?.code === "ECONNABORTED" || (err?.request && !err?.response);
      if (status === 500) {
        Swal.fire({ icon: "error", title: "Internal server error", text: "Please try again later." });
      } else if (isNetwork) {
        Swal.fire({ icon: "error", title: "Couldn't reach server", text: "Please check your connection or try again later." });
      } else {
        Swal.fire({ icon: "error", title: "Image upload failed", text: err?.response?.data?.message || err.message || "Please try again." });
      }
    } finally {
      setPageLoading(false);
    }
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
    company_name: "",
    password: "",
    status: false,
    authenticator: false,
    profile_image: "",
    user_id: "",
    role: [],
    role_id: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
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
      company_name: profile?.company_name || "",
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

  // Track changes compared to initial (both top-level form and fetched profile_details)
  const hasChanges = useMemo(() => {
    const initialForm = initialRef.current;
    const initialDetails = detailsInitialRef.current;
    if (!initialForm) return false;

    // Form-level diffs (exclude image because it has its own upload flow)
    const formChanged = (
      form.name !== initialForm.name ||
      form.email !== initialForm.email ||
      form.phone !== initialForm.phone ||
      form.bio !== initialForm.bio ||
      form.location !== initialForm.location ||
      form.company_name !== initialForm.company_name ||
      form.password !== initialForm.password
    );

    // Details-level shallow diff excluding enterprise verification keys
    const stripVerification = (obj) => {
      const {
        pan_number, pan_verified, mcs_incorporation_no, mcs_incorporation_image,
        mcs_verified, gstin_number, gstin_verified, verified, remarks,
        ...rest
      } = obj || {};
      return rest;
    };
    const detailsChanged = initialDetails
      ? JSON.stringify(stripVerification(profile_details)) !== JSON.stringify(stripVerification(initialDetails))
      : false;

    return formChanged || detailsChanged;
  }, [form.name, form.email, form.phone, form.bio, form.location, form.company_name, form.password, profile_details]);

  // Track changes for enterprise verification section only
  const hasVerificationChanges = useMemo(() => {
    const initialDetails = detailsInitialRef.current || {};
    const curr = profile_details || {};
    const keys = [
      "pan_number", "pan_verified", "mcs_incorporation_no", "mcs_incorporation_image",
      "mcs_verified", "gstin_number", "gstin_verified", "verified", "remarks"
    ];
    const changed = keys.some((k) => JSON.stringify(curr?.[k] ?? null) !== JSON.stringify(initialDetails?.[k] ?? null));
    return changed || !!mcsDocFile;
  }, [profile_details, mcsDocFile]);

  // Helper flags based on verification state
  const isPanReadOnly = !!profile_details?.pan_verified;
  const isMcaReadOnly = !!profile_details?.mcs_verified;
  const isGstinReadOnly = !!profile_details?.gstin_verified;

  const handleCompanyVerificationSubmit = async () => {
    try {
      setPageLoading(true);
      const BASE_URL = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PROFILE_PORT}`;

      const verificationDetails = {
        user_id: form.user_id, // 👈 directly pass user_id here
        pan_number: profile_details?.pan_number || "",
        mcs_incorporation_no: profile_details?.mcs_incorporation_no || "",
        gstin_number: profile_details?.gstin_number || "",
      };

      const config = { headers: { "Content-Type": "application/json" } };
      const url = `${BASE_URL}/profile-service/verification/request`;
      const res = await axios.post(url, verificationDetails, config); // 👈 send flat object

      const ok = res?.data?.success ?? true;
      if (ok) {
        Swal.fire({
          icon: "success",
          title: "Company verification updated",
          text: res?.data?.message || "Details saved."
        });

        detailsInitialRef.current = {
          ...(detailsInitialRef.current || {}),
          ...verificationDetails,
        };
        setMcsDocFile(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Update failed",
          text: res?.data?.message || "Please try again."
        });
      }
    } catch (err) {
      console.error("[ProfileDetails] company verification update error", err);
      const status = err?.response?.status;
      const isNetwork =
        err?.message?.includes("Network Error") ||
        err?.code === "ECONNABORTED" ||
        (err?.request && !err?.response);

      if (status === 500) {
        Swal.fire({ icon: "error", title: "Internal server error", text: "Please try again later." });
      } else if (isNetwork) {
        Swal.fire({ icon: "error", title: "Couldn't reach server", text: "Please check your connection or try again later." });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || err.message || "Something went wrong." });
      }
    } finally {
      setPageLoading(false);
    }
  };


  const handleSave = async (e) => {
    e.preventDefault();

    // Determine role IDs (array of numbers)
    const roleIds = Array.isArray(form.role_id)
      ? form.role_id.map((x) => Number(x))
      : (form.role_id != null ? [Number(form.role_id)] : []);
    // Note: Non-freelancers can save profile only; freelancers (role_id 2) also send profile_details.

    try {
      setPageLoading(true);
      const BASE_URL = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PROFILE_PORT}`;

      // Build cleaned details so deletions (e.g., languages) persist
      const cleanedDetails = (() => {
        const d = profile_details ?? {};

        // Exclude enterprise verification keys from the general save payload
        const {
          pan_number, pan_verified, mcs_incorporation_no, mcs_incorporation_image,
          mcs_verified, gstin_number, gstin_verified, verified, remarks,
          services_list, services,
          ...rest
        } = d;

        const filterArr = (arr) =>
          Array.isArray(arr)
            ? arr
                .map((s) => (typeof s === "string" ? s.trim() : s))
                .filter((v) => (typeof v === "string" ? v.length > 0 : Boolean(v)))
            : [];

        // Normalize hourly_rate to a 2-decimal string or null
        const toPriceString = (v) => {
          if (v == null || v === "") return "";
          const num = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.+-]/g, ""));
          if (Number.isFinite(num)) return num.toFixed(2);
          return String(v).trim();
        };
        const hourly_rate =
          rest.hourly_rate == null || rest.hourly_rate === ""
            ? null
            : toPriceString(rest.hourly_rate);

        // Convert fixed_price_projects array [{domain, price}] -> object map { [domain]: "price" }
        const projectsMap = Array.isArray(rest.fixed_price_projects)
          ? rest.fixed_price_projects.reduce((acc, p) => {
              const domain = typeof p?.domain === "string" ? p.domain.trim() : "";
              const priceStr = toPriceString(p?.price);
              if (domain && priceStr) acc[domain] = priceStr;
              return acc;
            }, {})
          : (rest.fixed_price_projects && typeof rest.fixed_price_projects === "object"
              ? rest.fixed_price_projects
              : {});

        // Services: map editable services_list (UI) -> payload 'services' array
        const servicesArray = filterArr(Array.isArray(services_list) ? services_list : (Array.isArray(services) ? services : []));

        // Education: ensure numeric fields are numbers, not strings; include month/day if present
        const toIntOrNull = (v) => {
          if (v === "" || v == null) return null;
          const n = Number(String(v).replace(/[^0-9-]/g, ""));
          return Number.isFinite(n) ? n : null;
        };
        const educationArray = Array.isArray(rest.education)
          ? rest.education.map((edu) => {
              const normalized = {
                degree: typeof edu?.degree === "string" ? edu.degree.trim() : (edu?.degree ?? ""),
                institution: typeof edu?.institution === "string" ? edu.institution.trim() : (edu?.institution ?? ""),
              };
              const sy = toIntOrNull(edu?.start_year);
              const sm = toIntOrNull(edu?.start_month);
              const sd = toIntOrNull(edu?.start_day);
              const ey = toIntOrNull(edu?.end_year);
              const em = toIntOrNull(edu?.end_month);
              const ed = toIntOrNull(edu?.end_day);
              if (sy != null) normalized.start_year = sy;
              if (sm != null) normalized.start_month = sm;
              if (sd != null) normalized.start_day = sd;
              if (ey != null) normalized.end_year = ey;
              if (em != null) normalized.end_month = em;
              if (ed != null) normalized.end_day = ed;
              return normalized;
            }).filter((e) =>
              (e.degree && e.degree.length) ||
              (e.institution && e.institution.length) ||
              e.start_year != null || e.end_year != null || e.start_month != null || e.end_month != null || e.start_day != null || e.end_day != null
            )
          : [];

        const result = {
          ...rest,
          languages: filterArr(rest.languages),
          skills: filterArr(rest.skills),
          hourly_rate,
          fixed_price_projects: projectsMap,
        };
        if (servicesArray.length > 0) result.services = servicesArray;
        if (educationArray.length > 0) result.education = educationArray;

        return result;
      })();

      // If a new image file is selected, upload it first to obtain a URL
      let uploadedImageUrl = null;
      try {
        if (selectedImageFile) {
          const uploadUrl = `${BASE_URL}/profile-service/upload-image`;
          const formData = new FormData();
          // Field name may vary server-side; using 'profile_image' to match current backend expectation
          formData.append("profile_image", selectedImageFile);
          const uploadRes = await axios.post(uploadUrl, formData /* let browser set boundary */);
          const data = uploadRes?.data;
          // Try common response shapes for URLs
          uploadedImageUrl = data?.url || data?.data?.url || data?.profile_image || data?.data?.profile_image || data?.location || data?.data?.location || null;
          if (!uploadedImageUrl) {
            throw new Error("Upload did not return an image URL.");
          }
        }
      } catch (uploadErr) {
        console.error("[ProfileDetails] image upload error", uploadErr);
        return Swal.fire({ icon: "error", title: "Image upload failed", text: uploadErr?.response?.data?.message || uploadErr.message || "Please try again." });
      }

      // Verification document upload is handled in handleCompanyVerificationSubmit only.

      // Build profile object
      const profileObj = {
        name: form.name,
        company_name: form.company_name || null,
        location: form.location || null,
        email: form.email,
        phone: form.phone,
        role: form.role,
        role_id: form.role_id,
        bio: form.bio || null,
        // Prefer freshly uploaded URL; otherwise keep existing string; never send preview blob URLs
        profile_image: uploadedImageUrl ?? ((typeof form.profile_image === "string" && form.profile_image.trim().length > 0) ? form.profile_image : null),
        user_id: form.user_id,
        created_at: profile?.created_at ?? null,
        modified_at: null,
        created_by: profile?.created_by ?? form.email,
        modified_by: null,
        status: !!form.status,
        authenticator: !!form.authenticator,
        ...(form.password ? { password: form.password } : {}),
      };

      // Include profile_details for freelancers (role_id 2) and enterprises (role_id 3)
      const payload = (roleIds.includes(2) || roleIds.includes(3))
        ? { profile: profileObj, profile_details: cleanedDetails }
        : { profile: profileObj };

      // Build request: send pure JSON so arrays stay as arrays and backend gets correct shapes
      const config = { headers: { "Content-Type": "application/json" } };

      const url = `${BASE_URL}/profile-service/updateuser`;
      const res = await axios.put(url, payload, config);
      const ok = res?.data?.success ?? true; // assume success=true if backend uses that flag; default true if not provided
      if (ok) {
        Swal.fire({ icon: "success", title: "Profile updated", text: res?.data?.message || "Your changes were saved." }).then(() => {
          // Full page refresh after user acknowledges success
          window.location.reload();
        });
        // reset initial snapshot (mostly moot since we reload)
        initialRef.current = {
          ...initialRef.current,
          name: form.name,
          email: form.email,
          phone: form.phone,
          bio: form.bio,
          location: form.location,
          password: form.password,
          profile_image: (uploadedImageUrl ?? (typeof form.profile_image === "string" ? form.profile_image : null)) ?? "",
        };
      } else {
        Swal.fire({ icon: "error", title: "Update failed", text: res?.data?.message || "Please try again." });
      }
    } catch (err) {
      console.error("[ProfileDetails] update error", err);
      const status = err?.response?.status;
      const isNetwork = err?.message?.includes("Network Error") || err?.code === "ECONNABORTED" || (err?.request && !err?.response);
      if (status === 500) {
        Swal.fire({ icon: "error", title: "Internal server error", text: "Please try again later." });
      } else if (isNetwork) {
        Swal.fire({ icon: "error", title: "Couldn't reach server", text: "Please check your connection or try again later." });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || err.message || "Something went wrong." });
      }
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <>
      {/* Full-page loading overlay */}
      {pageLoading && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(255,255,255,0.7)",
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

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
                  <a className="upload-btn ml10">Choose Image</a>
                </label>
                <button
                  type="button"
                  className="ud-btn btn-thm ml10"
                  onClick={handleProfileImageUpload}
                  disabled={!selectedImageFile}
                  style={{ cursor: selectedImageFile ? "pointer" : "not-allowed", opacity: selectedImageFile ? 1 : 0.6 }}
                >
                  Upload Image
                </button>
              </div>

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
                        type="email" className="form-control"
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
                  {/* <div className="col-sm-6">
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
  </div> */}

                  {/* Company Name (for enterprise) */}
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Company Name"
                        value={form.company_name}
                        onChange={(e) => setForm((s) => ({ ...s, company_name: e.target.value }))}
                      />
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

                      {/* Skills table */}
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

                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Skill</th>
                                <th style={{ width: 80 }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(profile_details?.skills ?? []).map((skill, idx) => (
                                <tr key={idx}>
                                  <td>
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
                                  </td>
                                  <td className="text-center">
                                    <span
                                      className="flaticon-delete text-thm2"
                                      style={{ cursor: "pointer" }}
                                      title="Remove skill"
                                      onClick={() => {
                                        const next = [...(profile_details?.skills ?? [])];
                                        next.splice(idx, 1);
                                        setProfileDetails((s) => ({ ...s, skills: next }));
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                              {(!profile_details?.skills || profile_details.skills.length === 0) && (
                                <tr>
                                  <td colSpan={2} className="text-center text-muted">No skills added</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Services table */}
                      <div className="col-md-12">
                        <div className="mb20">
                          <div className="d-flex justify-content-between align-items-center mb10">
                            <label className="heading-color ff-heading fw500 mb0">Services</label>
                            <button
                              type="button"
                              className="ud-btn btn-thm"
                              onClick={() => {
                                const next = Array.isArray(profile_details?.services_list)
                                  ? [...profile_details.services_list]
                                  : [];
                                next.push("");
                                setProfileDetails((s) => ({ ...s, services_list: next }));
                              }}
                            >
                              + Add Service
                            </button>
                          </div>

                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Service</th>
                                <th style={{ width: 80 }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(profile_details?.services_list ?? []).map((service, idx) => (
                                <tr key={idx}>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Service"
                                      value={service}
                                      onChange={(e) => {
                                        const next = [...(profile_details?.services_list ?? [])];
                                        next[idx] = e.target.value;
                                        setProfileDetails((s) => ({ ...s, services_list: next }));
                                      }}
                                    />
                                  </td>
                                  <td className="text-center">
                                    <span
                                      className="flaticon-delete text-thm2"
                                      style={{ cursor: "pointer" }}
                                      title="Remove service"
                                      onClick={() => {
                                        const next = [...(profile_details?.services_list ?? [])];
                                        next.splice(idx, 1);
                                        setProfileDetails((s) => ({ ...s, services_list: next }));
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                              {(!profile_details?.services_list || profile_details.services_list.length === 0) && (
                                <tr>
                                  <td colSpan={2} className="text-center text-muted">No services added</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>




                      {/* Fixed Price Projects (table like Services) */}
                      {(() => {
                        // Normalize to an editable array even if backend returns an object map
                        const raw = profile_details?.fixed_price_projects;
                        const projectsArray = Array.isArray(raw)
                          ? raw
                          : raw && typeof raw === 'object'
                            ? Object.entries(raw).map(([domain, price]) => ({ domain, price }))
                            : [];

                        const setFromArray = (arr) => setProfileDetails((s) => ({ ...s, fixed_price_projects: arr }));

                        return (
                          <div className="col-md-12">
                            <div className="mb20">
                              <div className="d-flex justify-content-between align-items-center mb10">
                                <label className="heading-color ff-heading fw500 mb0">Fixed Price Projects</label>
                                <button
                                  type="button"
                                  className="ud-btn btn-thm"
                                  onClick={() => {
                                    const next = [...projectsArray];
                                    next.push({ domain: "", price: "" });
                                    setFromArray(next);
                                  }}
                                >
                                  + Add Fixed Price Project
                                </button>
                              </div>

                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Domain</th>
                                    <th>Price</th>
                                    <th style={{ width: 80 }}>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {projectsArray.map((p, idx) => (
                                    <tr key={idx}>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="e.g. Website"
                                          value={p?.domain || ""}
                                          onChange={(e) => {
                                            const next = [...projectsArray];
                                            next[idx] = { ...(next[idx] || {}), domain: e.target.value };
                                            setFromArray(next);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="e.g. 500"
                                          value={p?.price || ""}
                                          onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            const next = [...projectsArray];
                                            next[idx] = { ...(next[idx] || {}), price: val };
                                            setFromArray(next);
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <span
                                          className="flaticon-delete text-thm2"
                                          style={{ cursor: "pointer" }}
                                          title="Remove project"
                                          onClick={() => {
                                            const next = [...projectsArray];
                                            next.splice(idx, 1);
                                            setFromArray(next);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                  {projectsArray.length === 0 && (
                                    <tr>
                                      <td colSpan={3} className="text-center text-muted">No projects added</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()}


                      {/* Availability
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
      </div> */}

                      {/* Status and Wallet (read-only) */}
                      <div className="col-sm-6">
                        <div className="mb20">
                          <label className="heading-color ff-heading fw500 mb10">Status</label>
                          <input type="text" className="form-control" value={profile_details?.status ?? ""} readOnly />
                        </div>
                      </div>
                      {/* <div className="col-sm-6">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Wallet Balance</label>
          <input type="text" className="form-control" value={profile_details?.wallet_balance ?? ""} readOnly />
        </div>
      </div> */}

                      {/* Verification (read-only) */}
                      <div className="col-sm-6">
                        <div className="mb20">
                          <label className="heading-color ff-heading fw500 mb10">Verified</label>
                          <input type="text" className="form-control" value={profile_details?.verified ? "true" : "false"} readOnly />
                        </div>
                      </div>
                      {/* <div className="col-md-12">
        <div className="mb20">
          <label className="heading-color ff-heading fw500 mb10">Remarks</label>
          <input type="text" className="form-control" value={profile_details?.remarks ?? ""} readOnly />
        </div>
      </div> */}

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
                              {(profile_details?.certifications ?? []).length === 0 ? (
                                <tr>
                                  <td colSpan={3} className="text-center text-muted">
                                    No certifications found
                                  </td>
                                </tr>
                              ) : (
                                profile_details.certifications.map((c, idx) => (
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
                                ))
                              )}
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
                              {(profile_details?.portfolio_projects ?? []).length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="text-center text-muted">
                                    No portfolio found
                                  </td>
                                </tr>
                              ) : (
                                profile_details.portfolio_projects.map((p, idx) => (
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
                                ))
                              )}
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
                              {(profile_details?.education ?? []).length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="text-center text-muted">
                                    No education found
                                  </td>
                                </tr>
                              ) : (
                                profile_details.education.map((edu, idx) => (
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
                                ))
                              )}
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

                      {/* Save Button: enabled only when data has changed; green when enabled */}
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

                        {/* Divider */}
                        <hr className="my30" style={{ borderTop: "1px solid #ddd" }} />
                      </div>

                      {/* Verification Sections */}
                      {/* Freelancer (role_id 2): PAN only */}
                      {Array.isArray(form.role_id) && form.role_id.includes(2) && (
                        <div className="form-style1">
                          <div className="row">
                            <div className="bdrb1 pb15 mb25">
                              <h6 className="list-title">PAN Verification</h6>
                            </div>
                            <div className="col-sm-6">
                              <div className="mb20">
                                <label className="heading-color ff-heading fw500 mb10 d-flex align-items-center">
                                  PAN Number
                                  {profile_details?.pan_verified && (
                                    <i className="fas fa-check-circle text-success ml10" title="Verified" />
                                  )}
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="ABCDE1234F"
                                  value={profile_details?.pan_number || ""}
                                  readOnly={isPanReadOnly}
                                  maxLength={10}
                                  style={{ textTransform: "uppercase" }}
                                  onChange={(e) => {
                                    const value = e.target.value.toUpperCase();
                                    setProfileDetails((d) => ({ ...d, pan_number: value }));
                                  }}
                                />
                                {/* Error message */}
                                {profile_details?.pan_number &&
                                  !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(profile_details.pan_number) && (
                                    <p className="text-danger mt5">Invalid PAN format (e.g., ABCDE1234F)</p>
                                  )}
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="text-start">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(profile_details?.pan_number || "")) {
                                      alert("Invalid PAN number. Format: AAAAA9999A");
                                      return;
                                    }
                                    handleCompanyVerificationSubmit();
                                  }}
                                  disabled={
                                    !hasVerificationChanges ||
                                    !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(profile_details?.pan_number || "")
                                  }
                                  className={`ud-btn ${hasVerificationChanges &&
                                    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(profile_details?.pan_number || "")
                                    ? "btn-thm"
                                    : "btn-secondary"
                                    }`}
                                  style={{
                                    cursor:
                                      hasVerificationChanges &&
                                        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(profile_details?.pan_number || "")
                                        ? "pointer"
                                        : "not-allowed",
                                    opacity:
                                      hasVerificationChanges &&
                                        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(profile_details?.pan_number || "")
                                        ? 1
                                        : 0.6,
                                  }}
                                >
                                  Request Verification
                                  <i className="fal fa-upload" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}



                      {/* Enterprise-specific fields */}
                      {Array.isArray(form.role_id) && form.role_id.includes(3) && (
                        <>
                          <div className="bdrb1 pb15 mb25">
                            <h6 className="list-title">Company Verification</h6>
                          </div>

                          {/* PAN */}
                          <div className="col-sm-6">
                            <div className="mb20">
                              <label className="heading-color ff-heading fw500 mb10 d-flex align-items-center">
                                PAN Number
                                {profile_details?.pan_verified && (
                                  <i className="fas fa-check-circle text-success ml10" title="Verified" />
                                )}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="ABCDE1234F"
                                value={profile_details?.pan_number || ""}
                                readOnly={!!profile_details?.pan_verified} // editable if not verified
                                onChange={(e) =>
                                  setProfileDetails((d) => ({ ...d, pan_number: e.target.value }))
                                }
                              />
                            </div>
                          </div>

                          {/* MCA No */}
                          <div className="col-sm-6">
                            <div className="mb20">
                              <label className="heading-color ff-heading fw500 mb10 d-flex align-items-center">
                                MCA Incorporation No
                                {profile_details?.mcs_verified && (
                                  <i className="fas fa-check-circle text-success ml10" title="Verified" />
                                )}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="CIN / Incorporation No"
                                value={profile_details?.mcs_incorporation_no || ""}
                                readOnly={!!profile_details?.mcs_verified}
                                onChange={(e) =>
                                  setProfileDetails((d) => ({ ...d, mcs_incorporation_no: e.target.value }))
                                }
                              />
                            </div>
                          </div>

                          {/* MCA Doc Upload */}
                          <div className="col-sm-6">
                            <div className="mb20">
                              <label className="heading-color ff-heading fw500 mb10">
                                MCA Incorporation Doc
                              </label>

                              {/* Input field */}
                              <input
                                type="text"
                                className="form-control mb10"
                                placeholder="Insert document URL"
                                value={profile_details?.mcs_incorporation_image || ""}
                                readOnly
                              />

                              {/* Upload + View + Remove */}
                              {!profile_details?.mcs_verified && (
                                <div className="d-flex align-items-center mt10">
                                  {/* Hidden file input */}
                                  <input
                                    id="mcaDocInsert"
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    className="d-none"
                                    onChange={(e) => {
                                      if (e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        // Validate size (<= 5 MB) and allow png/jpg/jpeg/pdf
                                        const isImage = /^image\/(png|jpe?g)$/i.test(file.type);
                                        const isPdf = /application\/pdf/i.test(file.type);
                                        if (file.size > 5 * 1024 * 1024) {
                                          Swal.fire({ icon: "error", title: "File too large", text: "Max file size is 5 MB." });
                                          return;
                                        }
                                        if (!isImage && !isPdf) {
                                          Swal.fire({ icon: "error", title: "Invalid file", text: "Allowed types: PNG, JPG, PDF." });
                                          return;
                                        }

                                        // Save file to state so Upload Doc button can hit API
                                        setMcsDocFile(file);

                                        const url = URL.createObjectURL(file);
                                        // Put selected file URL in input
                                        setMcsDocPreview(url);
                                        setProfileDetails((d) => ({
                                          ...d,
                                          mcs_incorporation_image: url,
                                        }));
                                      }
                                    }}
                                  />

                                  {/* Button changes dynamically */}
                                  <button
                                    type="button"
                                    className="ud-btn btn-thm px20 py10 mr10"
                                    onClick={async () => {
                                      try {
                                        if (!mcsDocFile) {
                                          // First click → open file chooser
                                          document.getElementById("mcaDocInsert").click();
                                          return;
                                        }
                                        setPageLoading(true);
                                        // Upload MCA doc via common uploader using dirtry=MCA_License
                                        const uploadedUrl = await uploadToProfileService(mcsDocFile, "MCA_License", form.user_id);

                                        // Persist the uploaded URL into profile_details and clear file state
                                        setProfileDetails((d) => ({ ...d, mcs_incorporation_image: uploadedUrl }));
                                        setMcsDocPreview(null);
                                        setMcsDocFile(null);

                                        Swal.fire({
                                          icon: "success",
                                          title: "Uploaded!",
                                          text: "Document uploaded successfully",
                                          timer: 2000,
                                          showConfirmButton: false,
                                        });
                                      } catch (err) {
                                        console.error("[ProfileDetails] MCA upload error", err);
                                        const msg = err?.response?.data?.message || err?.message || "Upload failed";
                                        Swal.fire({ icon: "error", title: "Upload failed", text: msg });
                                      } finally {
                                        setPageLoading(false);
                                      }
                                    }}
                                  >
                                    <i className="fal fa-upload mr5" />
                                    {mcsDocPreview || profile_details?.mcs_incorporation_image
                                      ? "Upload Doc"
                                      : "Insert Doc"}
                                  </button>

                                  {/* Eye + Remove icons (only if doc available) */}
                                  {(mcsDocPreview || profile_details?.mcs_incorporation_image) && (
                                    <>
                                      {/* View */}
                                      <a
                                        href={mcsDocPreview || profile_details?.mcs_incorporation_image}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-dark px10 py8 mr5"
                                        style={{ borderRadius: "50%" }}
                                      >
                                        <i className="fal fa-eye"></i>
                                      </a>

                                      {/* Remove */}
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger px10 py8"
                                        style={{ borderRadius: "50%" }}
                                        onClick={() => {
                                          setMcsDocPreview(null);
                                          setProfileDetails((d) => ({
                                            ...d,
                                            mcs_incorporation_image: "",
                                          }));
                                        }}
                                      >
                                        <i className="fal fa-times"></i>
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>




                          {/* GSTIN */}
                          <div className="col-sm-6">
                            <div className="mb20">
                              <label className="heading-color ff-heading fw500 mb10 d-flex align-items-center">
                                GSTIN Number
                                {profile_details?.gstin_verified && (
                                  <i className="fas fa-check-circle text-success ml10" title="Verified" />
                                )}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="22AAAAA0000A1Z5"
                                value={profile_details?.gstin_number || ""}
                                readOnly={!!profile_details?.gstin_verified}
                                onChange={(e) =>
                                  setProfileDetails((d) => ({ ...d, gstin_number: e.target.value }))
                                }
                              />
                            </div>
                          </div>

                          {/* Company status
    <div className="col-sm-3">
      <div className="form-check mb20">
        <input
          type="checkbox"
          className="form-check-input"
          id="companyVerified"
          checked={!!profile_details?.verified}
          onChange={(e) =>
            setProfileDetails((d) => ({ ...d, verified: e.target.checked }))
          }
        />
        <label htmlFor="companyVerified" className="form-check-label">
          Verified
        </label>
      </div>
    </div>
    <div className="col-sm-9">
      <div className="mb20">
        <label className="heading-color ff-heading fw500 mb10">Remarks</label>
        <input
          type="text"
          className="form-control"
          placeholder="verification_pending / notes"
          value={profile_details?.remarks || ""}
          onChange={(e) =>
            setProfileDetails((d) => ({ ...d, remarks: e.target.value }))
          }
        />
      </div>
    </div> */}

                          {/* Send for Verification */}
                          <div className="col-md-12">
                            <div className="text-start">
                              <button
                                type="button"
                                disabled={!hasVerificationChanges}
                                onClick={handleCompanyVerificationSubmit}
                                className={`ud-btn ${hasVerificationChanges ? "btn-thm" : "btn-secondary"}`}
                                style={{
                                  cursor: hasVerificationChanges ? "pointer" : "not-allowed",
                                  opacity: hasVerificationChanges ? 1 : 0.6,
                                }}
                              >
                                Send for Verification <i className="fal fa-upload" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}


                    </>
                  )}


                </>

              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
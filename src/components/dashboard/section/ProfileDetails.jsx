import React, { useEffect, useMemo, useRef, useState } from "react";
import SelectInput from "../option/SelectInput";
import { Link } from "react-router-dom";

export default function ProfileDetails({ profile, isCustomer }) {

  console.log("[ProfileDetails] profile prop:", profile, "isCustomer:", isCustomer);
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
    status: false,
    authenticator: false,
    profile_image: "",
  });
  const initialRef = useRef(null);

  // Seed state from fetched profile
  useEffect(() => {
    if (!profile) return;
    const next = {
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      status: !!profile?.status,
      authenticator: !!profile?.authenticator,
      profile_image: profile?.profile_image || "",
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
      currentImage !== initialImage
    );
  }, [form.name, form.email, form.phone, form.bio, selectedImage]);

  const handleSave = (e) => {
    e.preventDefault();
    // Construct payload (example). Wire to your update endpoint.
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
      // status/authenticator are shown but not edited here
    };
    const files = selectedImageFile ? { profile_image: selectedImageFile } : {};
    // TODO: replace with your API call. Example using FormData if file is included.
    // const fd = new FormData();
    // Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ""));
    // if (selectedImageFile) fd.append("profile_image", selectedImageFile);
    // await axios.post("<UPDATE-ENDPOINT>", fd)
    console.log("[ProfileDetails] Save payload:", payload, files);
    // After successful save, reset initial to current to disable button again
    initialRef.current = {
      ...initialRef.current,
      name: form.name,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
      profile_image: selectedImage || "",
    };
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
                      <label className="heading-color ff-heading fw500 mb10">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                      />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={form.email}
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
                        onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
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
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Authenticator</label>
                      <input type="text" className="form-control" value={form.authenticator ? "Enabled" : "Disabled"} readOnly />
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="col-md-12">
                    <div className="text-start">
                      <button type="submit" className="ud-btn btn-thm" disabled={!hasChanges}>
                        Save Changes
                        <i className="fal fa-arrow-right-long" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Original non-customer form (unchanged) */}
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Name</label>
                      <input type="text" className="form-control" placeholder="Name" value={profile?.name || ""} readOnly />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Email Address</label>
                      <input type="email" className="form-control" placeholder="Email" value={profile?.email || ""} readOnly />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Phone Number</label>
                      <input type="text" className="form-control" placeholder="Phone Number" value={profile?.phone || ""} readOnly />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw500 mb10">Bio</label>
                      <input type="text" className="form-control" placeholder="Bio" value={profile?.bio || ""} readOnly />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <SelectInput
                        label="Hourly Rate"
                        defaultSelect={getHourly}
                        data={[
                          { option: "$50", value: "50" },
                          { option: "$60", value: "60" },
                          { option: "$70", value: "70" },
                          { option: "$80", value: "80" },
                          { option: "$90", value: "90" },
                          { option: "$100", value: "100" },
                        ]}
                        handler={hourlyHandler}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <SelectInput
                        label="Gender"
                        defaultSelect={getGender}
                        data={[
                          { option: "Male", value: "male" },
                          { option: "Female", value: "female" },
                          { option: "Other", value: "other" },
                        ]}
                        handler={genderHandler}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <SelectInput
                        label="Specialization"
                        defaultSelect={getSpecialization}
                        data={[
                          { option: "Male", value: "male" },
                          { option: "Female", value: "female" },
                          { option: "Other", value: "other" },
                        ]}
                        handler={specializationHandler}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <SelectInput
                        label="Type"
                        defaultSelect={getType}
                        data={[
                          { option: "Type 1", value: "type-1" },
                          { option: "Type 2", value: "type-2" },
                          { option: "Type 3", value: "type-3" },
                        ]}
                        handler={typeHandler}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <SelectInput
                        label="Country"
                        defaultSelect={getCountry}
                        data={[
                          { option: "United States", value: "usa" },
                          { option: "Canada", value: "canada" },
                          { option: "United Kingdom", value: "uk" },
                          { option: "Australia", value: "australia" },
                          { option: "Germany", value: "germany" },
                          { option: "Japan", value: "japan" },
                        ]}
                        handler={countryHandler}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <SelectInput
                        label="City"
                        defaultSelect={getCity}
                        data={[
                          { option: "New York", value: "new-york" },
                          { option: "Toronto", value: "toronto" },
                          { option: "London", value: "london" },
                          { option: "Sydney", value: "sydney" },
                          { option: "Berlin", value: "berlin" },
                          { option: "Tokyo", value: "tokyo" },
                        ]}
                        handler={cityHandler}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <SelectInput
                        label="Language"
                        defaultSelect={getLanguage}
                        data={[
                          { option: "English", value: "english" },
                          { option: "French", value: "french" },
                          { option: "German", value: "german" },
                          { option: "Japanese", value: "japanese" },
                        ]}
                        handler={languageHandler}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb20">
                      <SelectInput
                        label="Languages Level"
                        defaultSelect={getLanLevel}
                        data={[
                          { option: "Beginner", value: "beginner" },
                          { option: "Intermediate", value: "intermediate" },
                          { option: "Advanced", value: "advanced" },
                          { option: "Fluent", value: "fluent" },
                        ]}
                        handler={lanLevelHandler}
                      />
                    </div>
                  </div>

                  {/* Keep original read-only description and link */}
                  <div className="col-md-12">
                    <div className="mb10">
                      <label className="heading-color ff-heading fw500 mb10">Introduce Yourself</label>
                      <textarea cols={30} rows={6} placeholder="Description" readOnly value={profile?.bio || ""} />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="text-start">
                      <Link className="ud-btn btn-thm" to="/contact">
                        Save
                        <i className="fal fa-arrow-right-long" />
                      </Link>
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
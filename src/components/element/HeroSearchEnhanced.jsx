import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSearchEnhanced({ services = [], freelancers = [] }) {
    const [isSearchDropdownOpen, setSearchDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({
        services: [],
        freelancers: [],
        popularSearches: []
    });
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    // Popular searches fallback
    const fallbackSearches = [
        "mobile app development",
        "web design",
        "logo design",
        "content writing",
        "digital marketing",
        "video editing"
    ];

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const query = searchQuery.toLowerCase().trim();

            // Search in services
            const matchedServices = services.filter(service =>
                (service.name && service.name.toLowerCase().includes(query)) ||
                (service.title && service.title.toLowerCase().includes(query)) ||
                (service.description && service.description.toLowerCase().includes(query)) ||
                (service.category && service.category.toLowerCase().includes(query))
            ).slice(0, 5);

            // Search in freelancers
            const matchedFreelancers = freelancers.filter(freelancer =>
                (freelancer.name && freelancer.name.toLowerCase().includes(query)) ||
                (freelancer.role && freelancer.role.toLowerCase().includes(query)) ||
                (freelancer.profession && freelancer.profession.toLowerCase().includes(query)) ||
                (freelancer.company_name && freelancer.company_name.toLowerCase().includes(query))
            ).slice(0, 5);

            setSearchResults({
                services: matchedServices,
                freelancers: matchedFreelancers,
                popularSearches: []
            });
        } else {
            // Show popular searches when no query
            const popularServices = services.slice(0, 4).map(service => ({
                ...service,
                type: 'service'
            }));

            setSearchResults({
                services: [],
                freelancers: [],
                popularSearches: popularServices.length > 0 ? popularServices :
                    fallbackSearches.map((search, index) => ({
                        id: `fallback-${index}`,
                        name: search,
                        type: 'search'
                    }))
            });
        }
    }, [searchQuery, services, freelancers]);

    const focusDropdown = () => {
        setSearchDropdownOpen(true);
    };

    const blurDropdown = (e) => {
        // Delay hiding to allow clicks on dropdown items
        setTimeout(() => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
                setSearchDropdownOpen(false);
            }
        }, 150);
    };

    const selectResult = (item, type) => {
        if (type === 'service') {
            navigate(`/service-single/${item.uuid || item.id}`);
        } else if (type === 'freelancer') {
            navigate(`/freelancer-single/${item.uuid || item.id}`);
        } else if (type === 'search') {
            setSearchQuery(item.name);
            setSearchDropdownOpen(false);
            // Navigate to search results page
            navigate(`/service-2?search=${encodeURIComponent(item.name)}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/service-2?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchDropdownOpen(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        if (!isSearchDropdownOpen && e.target.value.trim()) {
            setSearchDropdownOpen(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        } else if (e.key === 'Escape') {
            setSearchDropdownOpen(false);
            searchRef.current?.blur();
        }
    };

    return (
        <form className="form-search position-relative" onSubmit={handleSearch}>
            <div className="box-search">
                <span className="icon far fa-magnifying-glass" />
                <input
                    ref={searchRef}
                    className="form-control"
                    type="text"
                    name="search"
                    placeholder="What are you looking for?"
                    onFocus={focusDropdown}
                    onBlur={blurDropdown}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />

                <div
                    ref={dropdownRef}
                    className="search-suggestions"
                    style={{
                        visibility: isSearchDropdownOpen ? "visible" : "hidden",
                        opacity: isSearchDropdownOpen ? "1" : "0",
                        top: isSearchDropdownOpen ? "70px" : "100px",
                        transition: "all 0.3s ease",
                        maxHeight: "400px",
                        overflowY: "auto",
                        zIndex: 1000,
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                    }}
                >
                    {/* Services Results */}
                    {searchResults.services.length > 0 && (
                        <div className="suggestion-section">
                            <h6 className="fz14 ml30 mt25 mb-3 text-primary">
                                <i className="fas fa-briefcase me-2"></i>
                                Services ({searchResults.services.length})
                            </h6>
                            <div className="box-suggestions">
                                <ul className="px-0 m-0">
                                    {searchResults.services.map((service) => (
                                        <li
                                            key={`service-${service.uuid || service.id}`}
                                            className="suggestion-item"
                                            style={{
                                                borderBottom: "1px solid #f0f0f0",
                                                transition: "background-color 0.2s ease"
                                            }}
                                        >
                                            <div
                                                onClick={() => selectResult(service, 'service')}
                                                className="info-product cursor-pointer p-3"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                            >
                                                <div className="service-icon">
                                                    <i className="fas fa-cog text-primary"></i>
                                                </div>
                                                <div className="service-info flex-grow-1">
                                                    <div className="item_title fw-medium">
                                                        {service.name || service.title || "Service"}
                                                    </div>
                                                    {service.category && (
                                                        <small className="text-muted">
                                                            {service.category}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="service-price">
                                                    {service.price && (
                                                        <small className="text-success fw-bold">
                                                            ${service.price}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Freelancers Results */}
                    {searchResults.freelancers.length > 0 && (
                        <div className="suggestion-section">
                            <h6 className="fz14 ml30 mt20 mb-3 text-success">
                                <i className="fas fa-user me-2"></i>
                                Freelancers ({searchResults.freelancers.length})
                            </h6>
                            <div className="box-suggestions">
                                <ul className="px-0 m-0">
                                    {searchResults.freelancers.map((freelancer) => (
                                        <li
                                            key={`freelancer-${freelancer.uuid || freelancer.id}`}
                                            className="suggestion-item"
                                            style={{
                                                borderBottom: "1px solid #f0f0f0",
                                                transition: "background-color 0.2s ease"
                                            }}
                                        >
                                            <div
                                                onClick={() => selectResult(freelancer, 'freelancer')}
                                                className="info-product cursor-pointer p-3"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                            >
                                                <div className="freelancer-avatar">
                                                    <img
                                                        src={freelancer.profile_image || "/images/team/fl-1.png"}
                                                        alt={freelancer.name}
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                </div>
                                                <div className="freelancer-info flex-grow-1">
                                                    <div className="item_title fw-medium">
                                                        {freelancer.name || "Freelancer"}
                                                    </div>
                                                    <small className="text-muted">
                                                        {freelancer.role || freelancer.profession || freelancer.company_name || "Professional"}
                                                    </small>
                                                </div>
                                                <div className="freelancer-rating">
                                                    {freelancer.rating && (
                                                        <small className="text-warning">
                                                            <i className="fas fa-star"></i> {freelancer.rating}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Popular Searches */}
                    {searchResults.popularSearches.length > 0 && searchQuery.trim() === "" && (
                        <div className="suggestion-section">
                            <h6 className="fz14 ml30 mt20 mb-3">
                                <i className="fas fa-fire me-2 text-danger"></i>
                                Popular Searches
                            </h6>
                            <div className="box-suggestions">
                                <ul className="px-0 m-0 pb-4">
                                    {searchResults.popularSearches.map((item, index) => (
                                        <li
                                            key={`popular-${item.id || index}`}
                                            className="suggestion-item"
                                            style={{
                                                borderBottom: "1px solid #f0f0f0",
                                                transition: "background-color 0.2s ease"
                                            }}
                                        >
                                            <div
                                                onClick={() => selectResult(item, item.type || 'search')}
                                                className="info-product cursor-pointer p-3"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                            >
                                                <div className="search-icon">
                                                    <i className="fas fa-search text-muted"></i>
                                                </div>
                                                <div className="item_title">
                                                    {item.name || item.title}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {searchQuery.trim() &&
                        searchResults.services.length === 0 &&
                        searchResults.freelancers.length === 0 && (
                            <div className="no-results text-center py-4">
                                <i className="fas fa-search text-muted mb-2" style={{ fontSize: "24px" }}></i>
                                <p className="text-muted mb-2">No results found for "{searchQuery}"</p>
                                <small className="text-muted">Try different keywords or browse our categories</small>
                            </div>
                        )}
                </div>
            </div>
        </form>
    );
}
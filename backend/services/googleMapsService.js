// ============================================================
// services/googleMapsService.js - Google Maps Integration
// ============================================================

const axios = require("axios");

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const PLACE_DETAILS_API_URL = "https://maps.googleapis.com/maps/api/place/details/json";

// ============================================================
// Validate Address using Geocoding API
// ============================================================
exports.validateAddress = async (address) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key not configured");
    }

    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status === "ZERO_RESULTS") {
      return {
        success: false,
        isValid: false,
        message: "Address not found. Please check and try again.",
      };
    }

    if (response.data.status !== "OK") {
      throw new Error(`Geocoding API error: ${response.data.status}`);
    }

    const result = response.data.results[0];

    return {
      success: true,
      isValid: true,
      formattedAddress: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      placeId: result.place_id,
      addressComponents: result.address_components,
      geometry: {
        location: result.geometry.location,
        locationType: result.geometry.location_type,
        bounds: result.geometry.bounds,
        viewport: result.geometry.viewport,
      },
    };
  } catch (error) {
    console.error("Address validation error:", error);
    return {
      success: false,
      isValid: false,
      message: error.message || "Error validating address",
    };
  }
};

// ============================================================
// Get Address Suggestions using Places Autocomplete API
// ============================================================
exports.getAddressSuggestions = async (input, sessionToken = null) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key not configured");
    }

    const params = {
      input: input,
      key: GOOGLE_MAPS_API_KEY,
      components: "country:pk", // Restrict to Pakistan
      language: "en",
    };

    // Add session token for billing optimization
    if (sessionToken) {
      params.sessionToken = sessionToken;
    }

    const response = await axios.get(PLACES_API_URL, { params });

    if (response.data.status !== "OK" && response.data.status !== "ZERO_RESULTS") {
      throw new Error(`Places API error: ${response.data.status}`);
    }

    const suggestions = response.data.predictions.map((prediction) => ({
      placeId: prediction.place_id,
      description: prediction.description,
      mainText: prediction.main_text,
      secondaryText: prediction.secondary_text,
      types: prediction.types,
    }));

    return {
      success: true,
      suggestions: suggestions,
      sessionToken: sessionToken,
    };
  } catch (error) {
    console.error("Address suggestions error:", error);
    return {
      success: false,
      suggestions: [],
      message: error.message || "Error fetching address suggestions",
    };
  }
};

// ============================================================
// Get Place Details using Place Details API
// ============================================================
exports.getPlaceDetails = async (placeId, sessionToken = null) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key not configured");
    }

    const params = {
      place_id: placeId,
      key: GOOGLE_MAPS_API_KEY,
      fields: [
        "formatted_address",
        "geometry",
        "address_components",
        "place_id",
        "types",
      ].join(","),
    };

    // Add session token for billing optimization
    if (sessionToken) {
      params.sessionToken = sessionToken;
    }

    const response = await axios.get(PLACE_DETAILS_API_URL, { params });

    if (response.data.status !== "OK") {
      throw new Error(`Place Details API error: ${response.data.status}`);
    }

    const result = response.data.result;

    return {
      success: true,
      formattedAddress: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      placeId: result.place_id,
      addressComponents: result.address_components,
      geometry: {
        location: result.geometry.location,
        locationType: result.geometry.location_type,
        bounds: result.geometry.bounds,
        viewport: result.geometry.viewport,
      },
      types: result.types,
    };
  } catch (error) {
    console.error("Place details error:", error);
    return {
      success: false,
      message: error.message || "Error fetching place details",
    };
  }
};

// ============================================================
// Extract Address Components
// ============================================================
exports.extractAddressComponents = (addressComponents) => {
  const components = {
    streetNumber: "",
    streetName: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  };

  addressComponents.forEach((component) => {
    const types = component.types;

    if (types.includes("street_number")) {
      components.streetNumber = component.long_name;
    }
    if (types.includes("route")) {
      components.streetName = component.long_name;
    }
    if (types.includes("locality")) {
      components.city = component.long_name;
    }
    if (types.includes("administrative_area_level_1")) {
      components.province = component.long_name;
    }
    if (types.includes("postal_code")) {
      components.postalCode = component.long_name;
    }
    if (types.includes("country")) {
      components.country = component.long_name;
    }
  });

  return components;
};

// ============================================================
// Calculate Distance Between Two Coordinates
// ============================================================
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// ============================================================
// Verify Address is in Pakistan
// ============================================================
exports.verifyAddressInPakistan = (addressComponents) => {
  const countryComponent = addressComponents.find((component) =>
    component.types.includes("country")
  );

  if (!countryComponent) {
    return false;
  }

  const countryCode = countryComponent.short_name;
  const countryName = countryComponent.long_name;

  return countryCode === "PK" || countryName === "Pakistan";
};

// ============================================================
// Generate Session Token for Billing Optimization
// ============================================================
exports.generateSessionToken = () => {
  // Generate a UUID-like session token
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

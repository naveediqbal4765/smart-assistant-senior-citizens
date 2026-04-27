# Google Maps Integration - API Documentation

## Overview
This document describes the Google Maps integration for address validation, suggestions, and place details in the Smart Assistant for Senior Citizens application.

---

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Geocoding API** - For address validation
   - **Places API** - For address suggestions
   - **Maps JavaScript API** - For frontend maps

4. Create an API key:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Restrict the key to your application

5. Add the API key to your `.env` file:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
GOOGLE_MAPS_GEOCODING_API_KEY=your_api_key_here
```

### 2. Install Dependencies
```bash
npm install axios
```

---

## API Endpoints

### 1. Validate Address
**Endpoint:** `POST /api/profile/validate-address`

**Authentication:** Required (JWT Token)

**Description:** Validates an address using Google Maps Geocoding API and verifies it's in Pakistan.

**Request Body:**
```json
{
  "address": "123 Main Street, Karachi, Pakistan"
}
```

**Response (Success):**
```json
{
  "success": true,
  "isValid": true,
  "formattedAddress": "123 Main St, Karachi, Sindh, Pakistan",
  "latitude": 24.8607,
  "longitude": 67.0011,
  "placeId": "ChIJ...",
  "addressComponents": {
    "streetNumber": "123",
    "streetName": "Main Street",
    "city": "Karachi",
    "province": "Sindh",
    "postalCode": "75000",
    "country": "Pakistan"
  },
  "geometry": {
    "location": {
      "lat": 24.8607,
      "lng": 67.0011
    },
    "locationType": "ROOFTOP",
    "bounds": {...},
    "viewport": {...}
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Address not found. Please check and try again."
}
```

**Status Codes:**
- `200` - Address validated successfully
- `400` - Invalid address or not in Pakistan
- `500` - Server error

---

### 2. Get Address Suggestions
**Endpoint:** `POST /api/profile/address-suggestions`

**Authentication:** Required (JWT Token)

**Description:** Gets address suggestions as user types using Google Places Autocomplete API.

**Request Body:**
```json
{
  "input": "123 Main",
  "sessionToken": "optional-session-token"
}
```

**Response (Success):**
```json
{
  "success": true,
  "suggestions": [
    {
      "placeId": "ChIJ...",
      "description": "123 Main Street, Karachi, Sindh, Pakistan",
      "mainText": "123 Main Street",
      "secondaryText": "Karachi, Sindh, Pakistan",
      "types": ["route", "geocode"]
    },
    {
      "placeId": "ChIJ...",
      "description": "123 Main Road, Lahore, Punjab, Pakistan",
      "mainText": "123 Main Road",
      "secondaryText": "Lahore, Punjab, Pakistan",
      "types": ["route", "geocode"]
    }
  ],
  "sessionToken": "new-session-token"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error fetching address suggestions",
  "suggestions": []
}
```

**Status Codes:**
- `200` - Suggestions retrieved successfully
- `400` - Invalid input
- `500` - Server error

---

### 3. Get Place Details
**Endpoint:** `POST /api/profile/place-details`

**Authentication:** Required (JWT Token)

**Description:** Gets detailed information about a place using its Place ID.

**Request Body:**
```json
{
  "placeId": "ChIJ...",
  "sessionToken": "optional-session-token"
}
```

**Response (Success):**
```json
{
  "success": true,
  "formattedAddress": "123 Main Street, Karachi, Sindh 75000, Pakistan",
  "latitude": 24.8607,
  "longitude": 67.0011,
  "placeId": "ChIJ...",
  "addressComponents": {
    "streetNumber": "123",
    "streetName": "Main Street",
    "city": "Karachi",
    "province": "Sindh",
    "postalCode": "75000",
    "country": "Pakistan"
  },
  "geometry": {
    "location": {
      "lat": 24.8607,
      "lng": 67.0011
    },
    "locationType": "ROOFTOP",
    "bounds": {...},
    "viewport": {...}
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Address must be in Pakistan"
}
```

**Status Codes:**
- `200` - Place details retrieved successfully
- `400` - Invalid place ID or not in Pakistan
- `500` - Server error

---

## Frontend Integration Example

### Using Address Suggestions with Autocomplete

```javascript
import { useState } from 'react';

const AddressInput = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sessionToken, setSessionToken] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Generate session token on component mount
  useEffect(() => {
    const token = generateSessionToken();
    setSessionToken(token);
  }, []);

  // Fetch suggestions as user types
  const handleInputChange = async (value) => {
    setInput(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch('/api/profile/address-suggestions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: value,
          sessionToken: sessionToken
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
        setSessionToken(data.sessionToken);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Get place details when user selects a suggestion
  const handleSelectSuggestion = async (suggestion) => {
    try {
      const response = await fetch('/api/profile/place-details', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          placeId: suggestion.placeId,
          sessionToken: sessionToken
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedAddress({
          formattedAddress: data.formattedAddress,
          latitude: data.latitude,
          longitude: data.longitude,
          components: data.addressComponents
        });
        setInput(data.formattedAddress);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Enter address"
      />
      
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.placeId}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}

      {selectedAddress && (
        <div>
          <p>Selected: {selectedAddress.formattedAddress}</p>
          <p>Coordinates: {selectedAddress.latitude}, {selectedAddress.longitude}</p>
        </div>
      )}
    </div>
  );
};

// Generate session token for billing optimization
function generateSessionToken() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default AddressInput;
```

---

## Service Functions

### googleMapsService.validateAddress(address)
Validates an address using Geocoding API.

**Parameters:**
- `address` (string) - Address to validate

**Returns:**
```javascript
{
  success: boolean,
  isValid: boolean,
  formattedAddress: string,
  latitude: number,
  longitude: number,
  placeId: string,
  addressComponents: array,
  geometry: object,
  message?: string
}
```

---

### googleMapsService.getAddressSuggestions(input, sessionToken)
Gets address suggestions as user types.

**Parameters:**
- `input` (string) - User input
- `sessionToken` (string, optional) - Session token for billing optimization

**Returns:**
```javascript
{
  success: boolean,
  suggestions: array,
  sessionToken: string,
  message?: string
}
```

---

### googleMapsService.getPlaceDetails(placeId, sessionToken)
Gets detailed information about a place.

**Parameters:**
- `placeId` (string) - Google Place ID
- `sessionToken` (string, optional) - Session token for billing optimization

**Returns:**
```javascript
{
  success: boolean,
  formattedAddress: string,
  latitude: number,
  longitude: number,
  placeId: string,
  addressComponents: array,
  geometry: object,
  types: array,
  message?: string
}
```

---

### googleMapsService.extractAddressComponents(addressComponents)
Extracts structured address components from Google response.

**Parameters:**
- `addressComponents` (array) - Address components from Google API

**Returns:**
```javascript
{
  streetNumber: string,
  streetName: string,
  city: string,
  province: string,
  postalCode: string,
  country: string
}
```

---

### googleMapsService.calculateDistance(lat1, lon1, lat2, lon2)
Calculates distance between two coordinates using Haversine formula.

**Parameters:**
- `lat1` (number) - Latitude of first point
- `lon1` (number) - Longitude of first point
- `lat2` (number) - Latitude of second point
- `lon2` (number) - Longitude of second point

**Returns:**
- `distance` (number) - Distance in kilometers

---

### googleMapsService.verifyAddressInPakistan(addressComponents)
Verifies if address is in Pakistan.

**Parameters:**
- `addressComponents` (array) - Address components from Google API

**Returns:**
- `boolean` - True if address is in Pakistan

---

### googleMapsService.generateSessionToken()
Generates a session token for billing optimization.

**Returns:**
- `sessionToken` (string) - UUID-like session token

---

## Error Handling

### Common Errors

**1. API Key Not Configured**
```json
{
  "success": false,
  "message": "Google Maps API key not configured"
}
```

**2. Address Not Found**
```json
{
  "success": false,
  "isValid": false,
  "message": "Address not found. Please check and try again."
}
```

**3. Address Not in Pakistan**
```json
{
  "success": false,
  "message": "Address must be in Pakistan"
}
```

**4. Invalid Input**
```json
{
  "success": false,
  "message": "Please provide an address input"
}
```

---

## Billing Optimization

### Session Tokens
Session tokens are used to group autocomplete queries and place details requests into sessions for billing purposes. This reduces costs by grouping related requests.

**Usage:**
1. Generate a session token when user starts typing
2. Include the token in all requests for that address selection
3. Use the returned session token for subsequent requests
4. Generate a new token for the next address selection

---

## Testing with Postman

### 1. Validate Address
```
POST http://localhost:5000/api/profile/validate-address
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json

Body:
{
  "address": "123 Main Street, Karachi, Pakistan"
}
```

### 2. Get Suggestions
```
POST http://localhost:5000/api/profile/address-suggestions
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json

Body:
{
  "input": "123 Main",
  "sessionToken": "optional-token"
}
```

### 3. Get Place Details
```
POST http://localhost:5000/api/profile/place-details
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json

Body:
{
  "placeId": "ChIJ...",
  "sessionToken": "optional-token"
}
```

---

## Troubleshooting

### Issue: "Google Maps API key not configured"
**Solution:** Add `GOOGLE_MAPS_API_KEY` to your `.env` file

### Issue: "Address not found"
**Solution:** Check the address spelling and format. Try a more specific address.

### Issue: "Address must be in Pakistan"
**Solution:** The address validation only accepts addresses in Pakistan. Ensure the address is in Pakistan.

### Issue: Rate limiting errors
**Solution:** Implement exponential backoff retry logic or increase your API quota in Google Cloud Console.

---

## References

- [Google Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places)
- [Google Cloud Console](https://console.cloud.google.com/)

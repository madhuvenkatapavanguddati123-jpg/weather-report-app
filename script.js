// Select the element where the temperature will be displayed
const showTemperature = document.querySelector(".show-temperature");

// Select the search input field
const userText = document.querySelector(".search-bar");
//Loading animation
const loader = document.getElementById("loader");
const loadingText = document.getElementById("loadingText");

// Object containing Indian cities as keys
// Each city has its latitude and longitude
const indianCities = {
  // Telangana
  hyderabad: {
    latitude: 17.385,
    longitude: 78.4867,
  },
  vijayawada: {
    latitude: 16.5062,
    longitude: 80.648,
  },
  warangal: {
    latitude: 17.9689,
    longitude: 79.5941,
  },
  nizamabad: {
    latitude: 18.6725,
    longitude: 78.0941,
  },
  karimnagar: {
    latitude: 18.4386,
    longitude: 79.1288,
  },
  khammam: {
    latitude: 17.2473,
    longitude: 80.1514,
  },

  // Andhra Pradesh
  visakhapatnam: {
    latitude: 17.6868,
    longitude: 83.2185,
  },
  tirupati: {
    latitude: 13.6288,
    longitude: 79.4192,
  },
  guntur: {
    latitude: 16.3067,
    longitude: 80.4365,
  },
  nellore: {
    latitude: 14.4426,
    longitude: 79.9865,
  },
  kurnool: {
    latitude: 15.8281,
    longitude: 78.0373,
  },
  rajahmundry: {
    latitude: 17.0005,
    longitude: 81.8040,
  },

  // Major Indian cities
  chennai: {
    latitude: 13.0827,
    longitude: 80.2707,
  },
  bengaluru: {
    latitude: 12.9716,
    longitude: 77.5946,
  },
  mumbai: {
    latitude: 19.076,
    longitude: 72.8777,
  },
  pune: {
    latitude: 18.5204,
    longitude: 73.8567,
  },
  delhi: {
    latitude: 28.6139,
    longitude: 77.209,
  },
  kolkata: {
    latitude: 22.5726,
    longitude: 88.3639,
  },
  ahmedabad: {
    latitude: 23.0225,
    longitude: 72.5714,
  },
  jaipur: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
  lucknow: {
    latitude: 26.8467,
    longitude: 80.9462,
  },
  bhopal: {
    latitude: 23.2599,
    longitude: 77.4126,
  },
  indore: {
    latitude: 22.7196,
    longitude: 75.8577,
  },
  nagpur: {
    latitude: 21.1458,
    longitude: 79.0882,
  },
  surat: {
    latitude: 21.1702,
    longitude: 72.8311,
  },
  vadodara: {
    latitude: 22.3072,
    longitude: 73.1812,
  },
  patna: {
    latitude: 25.5941,
    longitude: 85.1376,
  },
  ranchi: {
    latitude: 23.3441,
    longitude: 85.3096,
  },
  bhubaneswar: {
    latitude: 20.2961,
    longitude: 85.8245,
  },
  guwahati: {
    latitude: 26.1445,
    longitude: 91.7362,
  },
  kochi: {
    latitude: 9.9312,
    longitude: 76.2673,
  },
  thiruvananthapuram: {
    latitude: 8.5241,
    longitude: 76.9366,
  },
  coimbatore: {
    latitude: 11.0168,
    longitude: 76.9558,
  },
  madurai: {
    latitude: 9.9252,
    longitude: 78.1198,
  },
  mysuru: {
    latitude: 12.2958,
    longitude: 76.6394,
  },
  mangaluru: {
    latitude: 12.9148,
    longitude: 74.8560,
  },
  goa: {
    latitude: 15.2993,
    longitude: 74.1240,
  },
  chandigarh: {
    latitude: 30.7333,
    longitude: 76.7794,
  },
  dehradun: {
    latitude: 30.3165,
    longitude: 78.0322,
  },
  shimla: {
    latitude: 31.1048,
    longitude: 77.1734,
  },
  srinagar: {
    latitude: 34.0837,
    longitude: 74.7973,
  },
  jammu: {
    latitude: 32.7266,
    longitude: 74.8570,
  },
  amritsar: {
    latitude: 31.6340,
    longitude: 74.8723,
  },
  ludhiana: {
    latitude: 30.9010,
    longitude: 75.8573,
  },
  varanasi: {
    latitude: 25.3176,
    longitude: 82.9739,
  },
  agra: {
    latitude: 27.1767,
    longitude: 78.0081,
  },
  kanpur: {
    latitude: 26.4499,
    longitude: 80.3319,
  },
  prayagraj: {
    latitude: 25.4358,
    longitude: 81.8463,
  },
  noida: {
    latitude: 28.5355,
    longitude: 77.3910,
  },
  gurugram: {
    latitude: 28.4595,
    longitude: 77.0266,
  },
  faridabad: {
    latitude: 28.4089,
    longitude: 77.3178,
  },
  ghaziabad: {
    latitude: 28.6692,
    longitude: 77.4538,
  },
};
// Get the city name entered by the user,
// find its coordinates, and request weather data
function getUserInput() {
  // Read the text typed in the search bar and remove extra spaces
  let userInput = userText.value.trim().toLowerCase();

  // Find the selected city object using bracket notation
  const city = indianCities[userInput];

  // Clear any previous temperature message
  showTemperature.textContent = "";

  // If the entered city does not exist in the object,
  // show an error message and stop
  if (!city) {
    showTemperature.textContent = "invalid city";
  } else {
    // Build the Open-Meteo API URL using the selected city's coordinates
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

    // Request the weather data
    getWeather(url);
  }
}

// Fetch weather data from the Open-Meteo API
async function getWeather(url) {
  showLoading();
  try {
    
    // Send the request and wait for the response
    let response = await fetch(url);

    // If the request was not successful, throw an error
    if (!response.ok) {
      throw new Error("failed");
    }

    // Convert the JSON response into a JavaScript object
    let data = await response.json();

    // Get the current weather report
    const report = data.current;

    // Display the temperature on the page
    displayWeather(report);
  } catch (Error) {
    // Handle any error that occurs during the request
    console.log(Error);
    showTemperature.textContent = "Unable to load weather";
  } finally {
    hideLoading();
  }
}

// Display the temperature in the selected HTML element
function displayWeather(report) {
  showTemperature.textContent = `Temperature ${report.temperature_2m}`;
}

//Loading animation while featching data
function showLoading() {
  loader.style.display = "block";
  loadingText.style.display = "block";
  showTemperature.textContent = "";
}

function hideLoading() {
  loader.style.display = "none";
  loadingText.style.display = "none";
}

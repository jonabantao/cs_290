/*
  CODE FOR OPEN WEATHER FORM
*/

// Open Weather defaults to USA, because requirement doesn't specify for country
// isValidZipCode only checks for valid 5-digit US codes
// Invalid zipcodes will be passed over to cityName query
function isValidZipCode(str) {
  return /^\d{5}$/g.test(str);
}

function displayWeatherInfo(weatherInfo) {
  const { name, main: { temp, humidity } } = weatherInfo;

  document.getElementById('cityName').textContent = name;
  document.getElementById('cityTemperature').textContent = `${temp} F`;
  document.getElementById('cityHumidity').textContent = `${humidity}%`;
}

function handleWeatherResponse(res) {
  if (res.status === 200) {
    return res.json().then(displayWeatherInfo);
  }


  return console.error('Not found');
}

function sendWeatherRequest(query) {
  return fetch(`http://api.openweathermap.org/data/2.5/weather?${query}&apikey=REMOVED&units=imperial`)
    .then(handleWeatherResponse);
}

function formatQuery(userQuery) {
  return isValidZipCode(userQuery) ? `zip=${userQuery}` : `q=${userQuery}`;
}

function queryWeather(event) {
  event.preventDefault();

  const cityQuery = document.getElementById('cityQuery').value;
  const query = formatQuery(cityQuery);

  sendWeatherRequest(query);
}

/*
  CODE FOR HTTPBIN FORM
*/
function sendDataToHTTPBin(requestObj) {
  return fetch('http://httpbin.org/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestObj),
  });
}

function displayHTTPBinResponse(response) {
  document.getElementById('httpbinResponse').innerText = response;
}

function handleHTTPBinSubmit(event) {
  event.preventDefault();

  const body = document.getElementById('httpbinText').value;

  sendDataToHTTPBin({ body })
    .then(res => res.json())
    .then(jsonRes => jsonRes.data)
    .then(displayHTTPBinResponse);
}

function attachFormActions() {
  document.getElementById('openWeatherForm').addEventListener('submit', queryWeather);
  document.getElementById('httpbinForm').addEventListener('submit', handleHTTPBinSubmit);
}

document.addEventListener('DOMContentLoaded', attachFormActions);

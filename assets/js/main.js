$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let cityName = $('#cityName').val();
        getTime(cityName);
        e.preventDefault();
    });    
});

const apiKey = '7d780f1f4327bb82e2e03efc37e177e3';
let time = '';
let date = '';
let newDate = '';

function getTime(place) {
    const timeZoneApi = 'a55bf11d071c4c32b5dfd559020b2b0d';
    var url = `https://timezone.abstractapi.com/v1/current_time/?api_key=${timeZoneApi}&location=${place}`;
    axios.get(`${url}`)
    .then((response) => {
        time = ((response.data.datetime).split(' ')[1]).split(':')[0] + ':' + ((response.data.datetime).split(' ')[1]).split(':')[1];
        date = response.data.datetime.split(' ')[0];
        newDate = new Date(date);
        newDate = newDate.toString().split(' ');
        newDate = `${newDate[0]} - ${newDate[1]} ${newDate[2]}`
        console.log(newDate);
        getCity(place);
    })
    .catch((err) => {
        console.log((err));
    })
}


function getCity(city) {
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    axios.get(`${url}`)
    .then((response) => {
        renderWeather(response.data);
    })
    .catch((err) => {
        console.log((err));
    })
}

function renderWeather(city) {
    let output = '';
    let temperature = parseInt(city.main.temp - 273.15);
    let wind = parseInt(city.wind.speed * 3.6);
    
    output += `
        <div class="jumbotron">
            <div id="weather" class="row">
                <div class="col-lg-5 d-flex align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="https://ssl.gstatic.com/onebox/weather/64/sunny_s_cloudy.png" alt="sunny_s_cloudy">
                        <h1 class="pl-3">${temperature}<span>°</span></h1>
                    </div>
                    <div class="pl-5">
                        <span>Humidity: ${city.main.humidity}%</span><br>
                        <span>Wind: ${wind}km/h</span>
                    </div>
                </div>
                <div class="col-lg-5 text-right">
                    <h2>${city.name}</h2>
                    <span>${newDate}, ${time}</span><br>
                    <span>${capitalize(city.weather[0].description)}</span>
                </div>
            </div>
        </div>
    `;

    $('#weatherOutput').html(output)
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}  


/* VUE JS */

var vm = new Vue({
    el: '#app',
    data: {
        searchCity: ''
    }
})
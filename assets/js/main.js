$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        var cityName = $('#cityName').val();
        getTime(cityName);
        e.preventDefault();
    });    
});

const apiKey = '7d780f1f4327bb82e2e03efc37e177e3';
let time = '';
let date = '';
let newDate = '';
let temperature = '';
let output = '';

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
        getCity(place);
    })
    .catch((err) => {
        console.log((err));
    })
}


function getCity(city) {
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(`${url}`)
    .then((response) => {
        renderWeather(response.data);
    })
    .catch((err) => {
        console.log((err));
    })
}

function renderWeather(city) {
    output = '';
    temperature = parseInt(city.main.temp);
    let wind = parseInt(city.wind.speed * 3.6);
    let iconLink = `http://openweathermap.org/img/wn/${city.weather[0].icon}@4x.png`
    console.log(city);
    output = `
        <div class="jumbotron">
            <div id="weather" class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 col-12 d-flex align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="${iconLink}" alt="sunny_s_cloudy" style="width: 100px;">
                        <h1 class="pl-3" id="temperatureValue">{{degrees}}</h1>
                    </div>
                    <div class="d-flex align-items-center position-relative pl-1" style="top:-10px">
                        <span id="temp" v-if="(unit == 'F')" class="pr-2" v-on:click="changeUnit" >°F</span>
                        <span id="temp" v-if="(unit == 'C')" class="pr-2" v-on:click="changeUnit" >°C</span>
                    </div>
                    <div class="pl-2">
                        <span>Humidity: ${city.main.humidity}%</span><br>
                        <span>Wind: ${wind}km/h</span>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-12 text-right">
                    <h2>${city.name}</h2>
                    <span>${newDate}, ${time}</span><br>
                    <span>${capitalize(city.weather[0].description)}</span>
                </div>
            </div>
        </div>
    `;

    $('#weatherOutput').html(output);
    var vm = new Vue({
        el: '#app',
        data: {
            degrees: temperature,
            unit: 'C'
        },
        methods: {
            changeUnit: function() {
                if (this.unit === "C") {
                    this.unit = "F";
                } else {
                    this.unit = "C";
                }
                return this.convert();
            },
            convert: function () {
                var f = this.degrees;
                if (this.unit === "F") {
                    f = Math.round(f * 9 / 5 + 32);
                } else {
                    f = Math.round((f - 32) * 5 / 9);
                }
                return this.degrees = f;
            }
        }
    })
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}
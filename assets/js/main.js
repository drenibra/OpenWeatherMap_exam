$(document).ready(() => {
    $.holdReady(true)
    $('#button').click((e) => {
        var cityName = $('#cityName').val();
        var forecastType = $('#forecastType').val();
        getTime(cityName, forecastType);
        e.preventDefault();
    });
});

const apiKey = '7d780f1f4327bb82e2e03efc37e177e3';
let time = '';
let date = '';
let newDate = '';
let temperature = '';
let output = '';
let weatherDate = '';

function getTime(place, forecastType) {
    const timeZoneApi = 'a55bf11d071c4c32b5dfd559020b2b0d';
    var url = `https://timezone.abstractapi.com/v1/current_time/?api_key=${timeZoneApi}&location=${place}`;
    axios.get(`${url}`)
    .then((response) => {
        time = ((response.data.datetime).split(' ')[1]).split(':')[0] + ':' + ((response.data.datetime).split(' ')[1]).split(':')[1];
        date = response.data.datetime.split(' ')[0];
        newDate = new Date(date);
        newDate = newDate.toString().split(' ');
        newDate = `${newDate[0]} - ${newDate[1]} ${newDate[2]}`
        getCity(place, forecastType);
    })
    .catch((err) => {
        console.log((err));
    })
}


function getCity(city, forecastType) {
    let fiveDaysForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    if (forecastType === 'current') {
        axios.get(`${url}`)
        .then((response) => {
            renderCurrentWeather(response.data);
        })
        .catch((err) => {
            console.log((err));
        })
    } else {
        axios.get(`${fiveDaysForecast}`)
        .then((response) => {
            renderFiveDayWeather(response.data);
        })
        .catch((err) => {
            console.log((err));
        })
    }
}

function renderCurrentWeather(city) {
    stopCarousel();
    $('.owl-navigation').addClass('display-none');
    temperature = parseInt(city.main.temp);
    let iconLink = `https://openweathermap.org/img/wn/${city.weather[0].icon}@4x.png`
    output = `
        <div class="jumbotron">
            <div id="weather" class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 col-12 d-flex align-items-center justify-content-center">
                    <div class="d-flex align-items-center">
                        <img src="${iconLink}" alt="sunny_s_cloudy" style="width: 100px;">
                        <h1 id="temperatureValue">${temperature}</h1>
                    </div>
                    <div class="d-flex align-items-center position-relative pl-1" style="top:-10px">
                        <span class="pr-2">°C</span>
                    </div>
                    <div class="pl-2">
                        <span>Humidity: ${city.main.humidity}%</span><br>
                        <span>Wind: ${city.wind.speed}km/h</span><br>
                        <span>${capitalize(city.weather[0].description)}</span>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-12 text-right">
                    <h2>${city.name}</h2>
                    <h5>${time}</h5>
                    <span>${newDate}</span></br>
                </div>
            </div>
        </div>
    `;

    $('#weatherOutput').html(output);
}

let renderFiveCount = 0;

function renderFiveDayWeather(data) {
    console.log('test');
    output = '';
    $('#weatherOutput').html(output);
    stopCarousel();
    data.list.forEach(function (item) {
        let iconLink = `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`;
        let time = (item.dt_txt.split(':')[0] + ':' + item.dt_txt.split(':')[1]).split(' ')[1];
        weatherDate = (item.dt_txt.split(':')[0] + ':' + item.dt_txt.split(':')[1]).split(' ')[0];
        output += `
        <div class="jumbotron item">
            <div id="weather" class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 col-12 d-flex align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="${iconLink}" alt="sunny_s_cloudy" style="width: 100px;">
                        <h1 class="pl-3" id="temperatureValue">${parseInt(item.main.temp)}</h1>
                    </div>
                    <div class="d-flex align-items-center position-relative pl-1" style="top:-10px">
                        <span class="pr-2">°C</span>
                    </div>
                    <div class="pl-2">
                        <span>Humidity: ${item.main.humidity}%</span><br>
                        <span>Wind: ${item.wind.speed}km/h</span><br>
                        <span>${capitalize(item.weather[0].description)}</span>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-12 text-right">
                    <h2>${data.city.name}</h2>
                    <h5>${time}</h5>
                    <span>${getWeatherDate(weatherDate)}</span></br>
                </div>
            </div>
        </div>
        `;
        $('#weatherOutputCarousel').html(output);

        function getWeatherDate(weatherDate) {
            weatherDate = weatherDate.split(' ')[0];
            let dateYear = weatherDate.split('-')[0]
            let dateMonth = weatherDate.split('-')[1]
            let dateDay = weatherDate.split('-')[2]
            let fullDate = dateMonth + '/' + dateDay + '/' + dateYear;
            let dt = new Date(fullDate)
            return dt.toString().split(' ')[0] + ' - ' + dt.toString().split(' ')[1] + ' ' +  dt.toString().split(' ')[2];
        }
    })
    startCarousel();
    $('.owl-navigation').removeClass('display-none');
    $('.customNextBtn').click(function () {
        $('.owl-carousel').trigger('next.owl.carousel');
    }); 
    $('.customPreviousBtn').click(function () {
    $('.owl-carousel').trigger('prev.owl.carousel', [300]);
    });
    renderFiveCount++;
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function stopCarousel() {
    var owl = $('.owl-carousel');
    owl.trigger('destroy.owl.carousel');
    owl.addClass('off');
}

function startCarousel(){
    $('.owl-carousel').owlCarousel({
        loop:true,
        nav:true,
        responsive:{
            0:{
                items:1
            }
        }
    });
    $('.owl-navigation').removeClass('display-none');
}

/* function initializeVue() {
    var vm = new Vue({
        el: '#app',
        mounted() {
            $.holdReady(false)
        },
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
} */
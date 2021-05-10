$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let cityName = $('#cityName').val();
        getCity(cityName);
        e.preventDefault();
    });    
});

const apiKey = '7d780f1f4327bb82e2e03efc37e177e3';

function getCity(city) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => alert('Wrong city name!'))
}
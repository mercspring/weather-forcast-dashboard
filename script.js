var fiveDays = [{ date: "date", icon: "01n", temp: "temp", humidity: "humidity" },
{ date: "date", icon: "01n", temp: "temp", humidity: "humidity" },
{ date: "date", icon: "01n", temp: "temp", humidity: "humidity" },
{ date: "date", icon: "01n", temp: "temp", humidity: "humidity" },
{ date: "date", icon: "01n", temp: "temp", humidity: "humidity" }]

console.log("five days: ", fiveDays)

var recentSearches = []

var todaysWeather = { city: "City", date: "date", icon: "01n", temp: "temp", humidity: "humidity", wind: "wind speed", uv: "UV index" }
var currentCity = { city: "spokane", lon: "", lat: "", timezone: "" };


//Set click event for unordered list
$(document).on("click", "button", function (event) {
    event.preventDefault();
    console.log("button clicked!")
    var input = "";
    console.log($(this))
    if ($(this).attr("id") === "search-btn") {
        input = $("#search-input").val().trim();
        console.log(input);
        if (!input) return;
    } else {
        input = $(this).attr("data-city")
        console.log("if failed", input)
    }
    currentCity.city = input;
    getLonLat()
})

function checkLocalStorage(){
    if(localStorage.getItem("lastCity") != null){
        
        currentCity.city = localStorage.getItem("lastCity");
    
        getLonLat();
    }
}


function getLonLat() {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity.city}&appid=fa30c4f3cf90208498e461891e75dd7f`
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        currentCity.lon = response.coord.lon;
        currentCity.lat = response.coord.lat;

        console.log(currentCity)
        getWeather()
    })

}

function getWeather() {
    var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCity.lat}&lon=${currentCity.lon}&exclude=hourly,alert,minutely&units=imperial&appid=fa30c4f3cf90208498e461891e75dd7f`
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        todaysWeather.date = moment.unix(response.current.dt).format("L");
        todaysWeather.city = currentCity.city.charAt(0).toUpperCase() + currentCity.city.slice(1);
        todaysWeather.temp = response.current.temp;
        todaysWeather.wind = response.current.wind_speed;
        todaysWeather.humidity = response.current.humidity;
        todaysWeather.icon = response.current.weather[0].icon;
        todaysWeather.uv = response.current.uvi;

        for (var i = 1; i <= 5; i++) {
            var j = i - 1;
            fiveDays[j].date = moment.unix(response.daily[i].dt).format("L");
            fiveDays[j].icon = response.daily[i].weather[0].icon;
            fiveDays[j].temp = response.daily[i].temp.day;
            fiveDays[j].humidity = response.daily[i].humidity;
        }
        console.log({ fiveDays, currentCity, todaysWeather })
        updateRecentSearches()
        clearAll()
        populateCards()
        populateRecentSearches()
        populateCurrentDay()

    })
    function updateRecentSearches() {
        localStorage.setItem("lastCity", todaysWeather.city);
        if (recentSearches.indexOf(todaysWeather.city) === -1) {
            if (recentSearches.length > 7) {
                recentSearches.pop();
            }
            recentSearches.unshift(todaysWeather.city);
        }
    }


}
function clearAll() {
    $(".dynamic-buttons").empty();
    $("#current-day").empty();
    for (var i = 1; i < 6; i++) {
        $(`#day${i}`).empty();
    }

}

function populateCards() {
    for (var i = 0; i < fiveDays.length; i++) {
        card = $("<div class='card'>");
        card.append("<p>" + "<strong>" + fiveDays[i].date + "</strong>" + "</p>");
        card.append(`<img src='http://openweathermap.org/img/wn/${fiveDays[i].icon}.png' width='25' height='25'>`);
        card.append("<p>" + "Temp: " + fiveDays[i].temp + "°" + "</p>");
        card.append("<p>" + "Humidity: " + fiveDays[i].humidity + "%" + "</p>");

        console.log("id", $(`#day${i + 1}`))

        $(`#day${i + 1}`).append(card)
    }
}

function populateRecentSearches() {

    var list = $(".dynamic-buttons");

    for (var j = 0; j < recentSearches.length; j++) {
        var listItem = $("<button class='btn btn-outline-dark col-6'>");
        listItem.text(recentSearches[j]);
        listItem.attr("data-city", recentSearches[j]);
        list.append(listItem);
    }
}

function populateCurrentDay() {
    var currentDay = $("#current-day");
    currentDay.append("<h2>" + todaysWeather.city +  "</h2>")
    $("head").append(`<style> h2::after{content: ' ${todaysWeather.date}'}`)
    currentDay.append(`<img src='http://openweathermap.org/img/wn/${todaysWeather.icon}.png'>`);
    currentDay.append("<p>" + "Temp: " + todaysWeather.temp + "°" + "</p>");
    currentDay.append("<p>" + "Humidity " + todaysWeather.humidity + "%" + "</p>");
    currentDay.append("<p>" + "Wind Speed: " + todaysWeather.wind + "</p>");
    currentDay.append("<p>" + "UV Index: " + "<span id='uv'>" + todaysWeather.uv + "</span>" + "</p>");


}

checkLocalStorage()
populateCards()
populateRecentSearches()
populateCurrentDay()
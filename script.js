var fiveDays = [{ date: "date", icon: "icon", temp: "temp", humidity: "humidity" },
{ date: "date", icon: "icon", temp: "temp", humidity: "humidity" },
{ date: "date", icon: "icon", temp: "temp", humidity: "humidity" },
{ date: "date", icon: "icon", temp: "temp", humidity: "humidity" },
{ date: "date", icon: "icon", temp: "temp", humidity: "humidity" }]

console.log("five days: ", fiveDays)

var recentSearches = ["Atlanta", "Everett", "Chicago", "Belize",]

var todaysWeather = { city: "City", date: "date", icon: "icon", temp: "temp", humidity: "humidity", wind: "wind speed", uv: "UV index" }
var currentCity = { city: "spokane", lon: "", lat: "", timezone: "" };
$("#search-btn").on("click", function (event) {
    event.preventDefault();
    var input = $("#search-input").val().trim();
    if (!input) return;
    currentCity.city = input;
    getLonLat()
})
//Set click event for unordered list
$(document).on("click", "button", function (event) {
    event.preventDefault();
    console.log("button clicked!")
    var input;
    if ($(this).attr("id") === "search-input") {
        input = $("#search-input").val().trim();
        if (!input) return;
    } else{
        input = $(this).attr("data-city")
    }
    currentCity.city = input;
    getLonLat()
})

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
        clearAll()
        populateCards()
        populateRecentSearches()
        populateCurrentDay()

    })



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
        card.append("<p>" + fiveDays[i].date + "<p>");
        card.append("<p>" + fiveDays[i].icon + "<p>");
        card.append("<p>" + "Temp " + fiveDays[i].temp "°"+ "<p>");
        card.append("<p>" + "Humidity " +fiveDays[i].humidity + "<p>");

        console.log("id", $(`#day${i + 1}`))

        $(`#day${i + 1}`).append(card)
    }
}

function populateRecentSearches() {

    var list = $(".dynamic-buttons");

    for (var j = 0; j < recentSearches.length; j++) {
        var listItem = $("<button class='btn btn-secondary col-6'>");
        listItem.text(recentSearches[j]);
        listItem.attr("data-city", recentSearches[j]);
        list.append(listItem);
    }
}

function populateCurrentDay() {
    var currentDay = $("#current-day");
    for (var key in todaysWeather) {
        if (key === "city") {
            currentDay.append("<h2>" + todaysWeather[key] + "<h2>")
        } else {

            currentDay.append("<p>" + todaysWeather[key] + "<p>");
        }


    }
}

populateCards()
populateRecentSearches()
populateCurrentDay()
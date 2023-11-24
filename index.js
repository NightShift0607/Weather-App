import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const cities = ["Delhi", "New York", "Shanghai", "Moscow", "London", "Paris"];

function cityRequest(city) {
    const options = {
        method: 'GET',
        url: 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather',
        params: {city: city},
        headers: {
            'X-RapidAPI-Key': 'c101f63b3emshd34669c9c7aacd8p1d8b2ajsnfc52ee8290d6',
            'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
        }
    };
    return options
}

async function extraWeather() {
    var extraCitiesWeather = [];
    for (let i = 0; i < cities.length; i++) {
        let city = cities[i];
        var options = cityRequest(city);
        var response = await axios.request(options);
        var result = response.data;
        extraCitiesWeather.push(result);
    }
    return extraCitiesWeather;
}

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    const extraCitiesWeather = await extraWeather();
    res.render(__dirname + "/views/index.ejs", {
        cities: cities,
        extra: extraCitiesWeather
    });
});

app.post("/search", async (req,res) => {
    const extraCitiesWeather = await extraWeather();
    let city = req.body.city;
    try {
        const options = cityRequest(city);
        const response = await axios.request(options);
        res.render(__dirname + "/views/index.ejs", {
            cities: cities,
            city: city,
            weather: response.data,
            extra: extraCitiesWeather
        })
    } catch (error) {
        console.error(error.message);
        res.render(__dirname + "/views/index.ejs", {
            error: "City not found",
            cities: cities,
            extra: extraCitiesWeather
        });
    }
});


app.listen(process.env.PORT || port, () => {
    console.log(`Server running on port: ${port}`);
})
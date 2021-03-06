`use strict;`

const poiFormId = 'new-poi-form';
let map;

document.addEventListener('DOMContentLoaded', initializeApplication, false);

function initializeApplication() {
    let form = document.getElementById(poiFormId);
    form.onsubmit = handleNewPOI;
    loadMap();
}

function getPostPOIfunction(poi) {
    return function (data) {
        poi.lat = data[0]["lat"];
        poi.lon = data[0]["lon"];
        fetch('/poi', {
            method: 'POST',
            body: JSON.stringify(poi),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(r => r.json())
            .then(placeMarker);
    };
}

function placeMarker(datum) {
    let lat = datum["lat"];
    let lng = datum["lon"];
    let marker = L.marker([lat, lng]);
    marker.addTo(map);
    let message = '<h1>' + datum['city'] + '</h1>'
        + '<p>' + (datum['zipcode'] != null ? datum['zipcode'] : '00-000') +
        (datum['street'] != null ? (', ' +  datum['street']) : '') +
        (datum['house'] != null ? (' ' + datum['house']) : '') + '</p>';
    marker.bindPopup(message);
    console.info(message);
}

function handleNewPOI() {
    let form = this;
    let poi = {};

    clearErrors();
    poi.country = this.country.value;
    poi.city = this.city.value;
    poi.zipcode = this.zipcode.value;
    poi.street = this.street.value;
    poi.house = this.house.value;
    let response = fetch('https://nominatim.openstreetmap.org/search' +
        '?street=' + this.house.value.trim() + ' ' + this.street.value.trim() +
        '&city=' + this.city.value.trim() +
        '&country=' + this.country.value.trim() +
        '&postalcode=' + this.zipcode.value.trim() +
        '&format=json')
    ;
    let jsonResponse = response
        .then(r => {
            if (r.ok) {
                return r.json();
            }
        });
    jsonResponse.then(checkIfSomeObjects);
    jsonResponse.then(getPostPOIfunction(poi));
    return false;

    function clearErrors() {
        let errorElements = form.getElementsByClassName('no-such-place-error-active');
        for (let i = 0; i < errorElements.length; ++i) {
            let errorElement = errorElements[i];
            errorElement.classList.add('no-such-place-error-inactive');
            errorElement.classList.remove('no-such-place-error-active');
        }
    }

    function checkIfSomeObjects(data) {
        if (data.length === 0) {
            let errorElements = form.getElementsByClassName('no-such-place-error-inactive');
            for (let i = 0; i < errorElements.length; ++i) {
                let errorElement = errorElements[i];
                errorElement.classList.add('no-such-place-error-active');
                errorElement.classList.remove('no-such-place-error-inactive');
            }
        }
    }
}

function loadMap() {
    //add map and set its center to specific location
    map = L.map('map-panel').setView([52.05, 20.00], 6);
    //add OSM as background layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">' +
            'OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 19,
        id: 'osm.tiles'
    }).addTo(map);

    fetch('/poi')
        .then(r => r.json())
        .then(function (data) {
            for (let i = 0; i < data.length; ++i) {
                placeMarker(data[i]);
            }
        })
}





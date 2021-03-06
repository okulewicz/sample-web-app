`use strict;`

const poiFormId = 'new-poi-form';
let map;

document.addEventListener('DOMContentLoaded', initializeApplication, false);

function initializeApplication() {
    let form = document.getElementById(poiFormId);
    form.onsubmit = handleNewPOI;
    loadMap();
}

function handleNewPOI() {
    let form = this;

    clearErrors();
    console.info(this.country.value);
    console.info(this.city.value);
    console.info(this.zipcode.value);
    console.info(this.street.value);
    console.info(this.house.value);
    let response = fetch('https://nominatim.openstreetmap.org/search' +
        '?street=' + this.house.value.trim() + ' ' + this.street.value.trim() +
        '&city=' + this.city.value.trim() +
        '&country=' + this.country.value.trim() +
        '&postalcode=' + this.zipcode.value.trim() +
        '&format=json')
    ;
    response
        .then(r => {
            if (r.ok) {
                return r.json();
            }
        })
        .then(showLocation);
    return false;

    function clearErrors() {
        let errorElements = form.getElementsByClassName('no-such-place-error-active');
        for (let i = 0; i < errorElements.length; ++i) {
            let errorElement = errorElements[i];
            errorElement.classList.add('no-such-place-error-inactive');
            errorElement.classList.remove('no-such-place-error-active');
        }
    }

    function showLocation(data) {
        if (data.length > 0) {
            let lat = data[0]["lat"];
            console.info(lat);
            let lng = data[0]["lon"];
            console.info(lng);
            let marker = L.marker([lat, lng]);
            marker.addTo(map);
        } else {
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

}





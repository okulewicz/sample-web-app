`use strict;`

const poiFormId = 'new-poi-form';

document.addEventListener('DOMContentLoaded', initializeApplication, false);

function initializeApplication() {
    let form = document.getElementById(poiFormId);
    form.onsubmit = handleNewPOI;
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
            console.info(data[0]["lat"]);
            console.info(data[0]["lon"]);
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




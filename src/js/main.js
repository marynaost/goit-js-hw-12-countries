import debounce from 'lodash.debounce'
import countryCardTpl from '../templates/country-card.hbs'
import countryListTpl from '../templates/country-list.hbs'
import refs from './refs'
import API from './fetchCountries'

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error, success } from '@pnotify/core';


const { cardContainer, inputCountry, listCountry } = refs

inputCountry.addEventListener('input', debounce(onSearch, 500))

function onSearch() {
    if (!inputCountry.value) {
        onClearSearch()
        return
    }
    onClearSearch()
    API.fetchCountries(inputCountry.value)
        .then(onSearchCountry)
        .catch(onFetchError)
}

function onSearchCountry(country) {
    if (country.length === 1) {
        success({
            text: 'Success!',
            delay: 1000
        });
        renderCountry(country)
    } else if (country.length <= 10) {
       renderList(country)
    } else if (country.length > 10) {
        error({
            title: 'Too many matches found',
            text: ' Please enter a more specific query!',
            delay: 2000
        });
    } else if (country.status === 404) {
        error({
            title: 'Sorry',
            text: 'Not Found',
            delay: 1000
        });
    }
}

function renderCountry(country) {
    const markup = countryCardTpl(country)
    cardContainer.innerHTML = markup   
}

function renderList(country) {
    const listMarkup = countryListTpl(country)
    listCountry.innerHTML = listMarkup 
}

function onClearSearch() {
    cardContainer.innerHTML = '';
    listCountry.innerHTML = '';
}

function onFetchError(error) {
    alert('Something went wrong')
}
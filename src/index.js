import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const infoDiv = document.querySelector('.country-info');

input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  const findCountry = e.target.value.trim();
  if (!searchCountry) {
    clearPage();
    return;
  }
  fetchCountries(findCountry)
    .then(country => {
      console.log(country);
      if (country.length > 10) {
        Notiflix.Notify.failure('Oups , to many countries');
        clearPage();
        return;
      } else if (country.length >= 2 && country.length <= 10) {
        marcupForCountries(country);
        infoDiv.innerHTML = '';
      } else if (country.length === 1) {
        marcupForOneCounry(country);
        list.innerHTML = '';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearPage();
      return error;
    });
}

function marcupForCountries(countries) {
  const marcup = countries
    .map(
      ({ name, flags }) =>
        `<div class="group__list"><img class='img__list' src="${flags.svg}" alt="${name}" width="80" height="50" /> <p class='text__list'>${name.common}</p></div>`
    )
    .join('');
  list.innerHTML = marcup;
}

function marcupForOneCounry(countries) {
  const marcup = countries
    .map(
      ({ name, flags, capital, population, languages }) =>
        `<section><div class="group__list">
  <img src="${
    flags.svg
  }" alt="${name}" width="80" height="50" /> <span><BIG><h1 class="country__caption">${
          name.official
        }</h1></BIG></span></div>
  <ul class="country__list">
    <li class="country__item"> <span><b>Capital:</b></span> ${capital} </li>
    <li class="country__item"> <span><b>Population:</b></span>  ${population} </li>
    <li class="country__item"> <span><b>Languages:</b></span> ${Object.values(
      languages
    ).join(',')} </li>
</ul>
</section>`
    )
    .join('');
  infoDiv.innerHTML = marcup;
}

function clearPage() {
  list.innerHTML = '';
  infoDiv.innerHTML = '';
}

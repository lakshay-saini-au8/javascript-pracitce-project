import axios from "axios";

var home = getElement("#home");
var details = getElement("#details");
var countryCard = getElement(".card-group");
var input = getElement("input.search");
var filter = getElement(".search__region-dropdown");
var ulFilter = getElement(".search__region-ul");
var fillterP = getElement(".search__region-dropdown-p");
var detailsMain = getElement(".details .main");
var backButton = getElement(".back__button");
var dark = getElement(".dark");
var light = getElement(".light");
var countryData = [];

// base URL
var cors = "https://corsanywhere.herokuapp.com/";
var baseURL = "https://restcountries.eu/rest/v2/";

function getElement(selector) {
  return document.querySelector(selector);
}
function getAllElement(selector) {
  return document.querySelectorAll(selector);
}

// check whether the hash is valid or not
function checkValidHash() {
  if (window.location.hash === "") {
    window.location.hash = "#home";
  } else {
    return true;
  }
}
// initial funtion
function init() {
  checkValidHash();
  renderHTML(window.location.hash);
}
// render function for home page
function renderHome(countryHome) {
  countryCard.innerHTML = " ";
  for (var value of countryHome) {
    var homeHTML = `<div class="card" data-code="${value.name}">
      <div class="card__img">
        <img src="${value.flag}" alt="${value.name}">
      </div>
      <div class="card__desc">
        <div class="card__desc-title">
          <p>${value.name}</p>
        </div>
        <div class="card__desc-con">
          <p><span>Population:</span>${value.population}</p>
          <p><span>Region:</span>${value.region}</p>
          <p><span>Capital:</span>${value.capital}</p>
        </div>
      </div>
    </div>`;
    countryCard.insertAdjacentHTML("beforeend", homeHTML);
  }
  var allCards = getAllElement(".card");
  allCards.forEach(function (items) {
    items.addEventListener("click", function () {
      window.location.hash = `#${items.dataset.code}`;
    });
  });
}
// to fetch country for home page
function fetchCountry() {
  return axios
    .get(`${cors}${baseURL}/all`)
    .then(function (result) {
      countryData = [];
      for (const value of result.data) {
        var newObj = {
          name: value.name,
          capital: value.capital,
          region: value.region,
          population: value.population.toLocaleString(),
          alpha3Code: value.alpha3Code,
          flag: value.flag,
        };
        countryData.push(newObj);
      }
      // console.log(countryData);

      return countryData;
    })
    .catch(function (err) {
      console.log(err);
    });
}
// fetch individual country
function fetchIndividualCountry(extraParam) {
  // var indi = getElement(".details");
  return axios
    .get(`${cors}${baseURL}/name/${extraParam}?fullText=true`)
    .then(function (indiCountry) {
      return indiCountry.data[0];
    })
    .catch(function (error) {
      detailsMain.innerHTML = `<h1 style="
      text-align: center;font-size:2rem;">No country with this name. Please go back to <a href="#home" style="color:var(--dmw-text);font-size:3rem;">Home</a> </h1>`;
    });
  // indi.innerHTML = extraParam;
}
function fetchCountryCode(code) {
  return axios
    .get(`${cors}${baseURL}alpha/${code}`)
    .then(function (indiCountry) {
      return indiCountry.data;
    })
    .catch(function (error) {
      detailsMain.innerHTML = `<h1 style="
      text-align: center;font-size:2rem;">No country with this code name. Please go back to <a href="#home" style="color:var(--dmw-text);font-size:3rem;">Home</a> </h1>`;
    });
}
// to render Individual country
function renderIndiHTML(data) {
  var indibutton = [];
  var indiCourrency = [];
  var indiLanguage = [];
  if (data.borders.length !== 0) {
    for (var value of data.borders) {
      indibutton.push(
        `<p class="indi__details--border--btn" data-border=${value}>${value}</p>`
      );
    }
  } else {
    indibutton.push(
      `<p class="indi__details--border--error">No border for this Country</p>`
    );
  }
  for (var value of data.currencies) {
    indiCourrency.push(value.name);
  }

  for (var value of data.languages) {
    indiLanguage.push(value.name);
  }
  var indiHtml = ` <div class="indi">
 <div class="indi__flag">
   <img src=${data.flag} alt="" />
 </div>
 <div class="indi__details">
   <div class="indi__details--upper">
     <div class="indi__details--head">${data.name}</div>
     <div class="indi__details--info">
       <div class="indi__details--info-l">
         <p><span>Native Name: </span>${data.nativeName}</p>
         <p><span>Population: </span>${data.population.toLocaleString()}</p>
         <p><span>Region: </span>${data.region}</p>
         <p><span>Sub Region: </span>${data.subregion}</p>
         <p><span>Capital: </span>${data.capital}</p>
       </div>
       <div class="indi__details--info-r">
         <p><span>Top Level Domain: </span>${data.topLevelDomain[0]}</p>
         <p><span>Currencies: </span>${indiCourrency.join(",")}</p>
         <p><span>Language: </span>${indiLanguage.join(",")}</p>
       </div>
     </div>
   </div>
   <div class="indi__details--border">
     <span>Border countries: </span>
     ${indibutton.join("")}
   </div>
 </div>
</div>`;

  detailsMain.innerHTML = indiHtml;
  var buttonGroup = getAllElement(".indi__details--border--btn");
  buttonGroup.forEach(function (items) {
    items.addEventListener("click", function (e) {
      window.location.hash = `#${items.dataset.border}`;
    });
  });
}
// to render particule section according to hashValue
function renderHTML(hashValue) {
  var changedHash = hashValue.replace("#", "");
  if (hashValue === "#home") {
    details.style.display = "none";
    home.style.display = "block";
    fetchCountry()
      .then(function (result) {
        renderHome(result);
      })
      .catch(function (err) {
        console.log(err);
      });
  } else {
    if (changedHash.length === 3) {
      detailsMain.innerHTML = "";
      details.style.display = "block";
      fetchCountryCode(changedHash)
        .then(function (dataCode) {
          renderIndiHTML(dataCode);
        })
        .catch(function (err) {
          console.log(err);
        });
    } else {
      detailsMain.innerHTML = "";
      details.style.display = "block";
      fetchIndividualCountry(changedHash).then(function (finalData) {
        renderIndiHTML(finalData);
      });
    }
    // fetchCountry();
  }
}
// finding the country according search
function findMatch(wordMatch, countryData) {
  return countryData.filter(function (country) {
    var regexMatch = new RegExp(wordMatch, "gi");
    return country.name.match(regexMatch);
  });
}
// finding the country according to region
function findRegion(wordMatch, countryData) {
  return countryData.filter(function (country) {
    var regexMatch = new RegExp(wordMatch, "gi");
    return country.region.match(regexMatch);
  });
}
// to render the countries according to search
function displayMatch() {
  var matchArray = findMatch(this.value, countryData);
  if (matchArray.length !== 0) {
    renderHome(matchArray);
  } else {
    countryCard.innerHTML = `<h1 style="text-align:center;width:100%;">Sorry!! Country with this name doesn't exist in our database. `;
  }
}
//  to render the countries according to region
function getRegion(countryDatas) {
  ulFilter.innerHTML = `<li class="search__region-ul-li" data-region = "All"><span>All</span></li>`;
  var totalRegion = [];
  countryDatas.forEach(function (country) {
    if (!totalRegion.includes(country.region) && country.region !== "") {
      totalRegion.push(country.region);
    }
  });
  return totalRegion;
}
// event listner on hash change
window.addEventListener("hashchange", function (event) {
  checkValidHash();
  home.style.display = "none";
  details.style.display = "none";
  renderHTML(window.location.hash);
});
backButton.addEventListener("click", function () {
  window.history.back();
});
// for serach option
input.addEventListener("change", displayMatch);
input.addEventListener("keyup", displayMatch);
input.addEventListener("focusout", function (e) {
  e.target.value = "";
});
filter.addEventListener("click", function (e) {
  ulFilter.classList.toggle("show");
  var totalRegions = getRegion(countryData);
  totalRegions.forEach(function (items) {
    var ulHtml = ` <li class="search__region-ul-li" data-region = "${items}"><span>${items}</span></li>`;
    ulFilter.insertAdjacentHTML("beforeend", ulHtml);
  });
  var lievent = getAllElement(".search__region-ul-li");
  lievent.forEach(function (items) {
    items.addEventListener("click", function () {
      fillterP.innerHTML = items.dataset.region;
      var regionName = items.dataset.region;
      if (regionName === "All") {
        var regionArray = findRegion("", countryData);
      } else {
        var regionArray = findRegion(regionName, countryData);
      }

      renderHome(regionArray);
    });
  });
});

dark.addEventListener("click", function () {
  dark.style.display = "none";
  light.style.display = "flex";
  document.documentElement.style.setProperty(
    "--dmb-element",
    " hsl(0, 0%, 100%)"
  );
  document.documentElement.style.setProperty(
    "--dmvb-backgroud",
    " hsl(0, 0%, 98%)"
  );
  document.documentElement.style.setProperty("--dmw-text", "hsl(200, 15%, 8%)");
});
light.addEventListener("click", function () {
  light.style.display = "none";
  dark.style.display = "flex";
  document.documentElement.style.setProperty(
    "--dmb-element",
    "hsl(209, 23%, 22%)"
  );
  document.documentElement.style.setProperty(
    "--dmvb-backgroud",
    "  hsl(207, 26%, 17%)"
  );
  document.documentElement.style.setProperty("--dmw-text", "hsl(0, 0%, 100%)");
});

// used to give initial url
init();

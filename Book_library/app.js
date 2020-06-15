var baseUrl =
  "https://raw.githubusercontent.com/attainu/curriculum-master-fullstack/master/coding-challenges/data/books.json?token=AOGF264MZS6LCBC5WIB7HR266BSOO";

var table = document.querySelector("table>tbody#full");
var tableSome = document.querySelector("table>tbody#some");
var submitButton = document.querySelector("form.formData");
var fulltable = document.querySelector("#data");
var loader = document.querySelector(".loader");
var allBooks = document.querySelector("#allBooks");

function getBooks() {
  return fetch(`${baseUrl}`, {
    method: "GET",
  }).then(function (books) {
    return books.json();
  });
}
// Function to get the language
function search(language) {
  getBooks().then(function (result) {
    var storeArray = [];
    if (localStorage.getItem(language.toUpperCase()) !== null) {
      var previousLang = JSON.parse(localStorage.getItem(language.toUpperCase()));
      for (const value of previousLang) {
        var tableData = `<tr>
                    <td scope="row">${value.title}</td>
                    <td>${value.author}</td>
                    <td>${value.country}</td>
                    <td>${value.language}</td>
                    <td><a href="${value.link}">Link</a></td>
                    <td>${value.pages}</td>
                    <td>${value.year}</td>
                </tr>`;
        loader.style.display = "none";
        fulltable.style.display = "block";

        table.insertAdjacentHTML("afterbegin", tableData);
      }
    } else {
      var langPresent = false;
      for (const value of result) {
        if (language.toUpperCase() === value.language.toUpperCase()) {
          langPresent = true;
          var tableData = `<tr>
                  <td scope="row">${value.title}</td>
                  <td>${value.author}</td>
                  <td>${value.country}</td>
                  <td>${value.language}</td>
                  <td><a href="${value.link}">Link</a></td>
                  <td>${value.pages}</td>
                  <td>${value.year}</td>
              </tr>`;
          loader.style.display = "none";
          fulltable.style.display = "block";
          table.insertAdjacentHTML("afterbegin", tableData);
          var newobj = {
            author: value.author,
            country: value.country,
            imageLink: value.imageLink,
            language: value.language,
            link: value.link,
            pages: value.pages,
            title: value.title,
            year: value.year,
          };
          storeArray.push(newobj);
        }
      }
      if(langPresent){
        localStorage.setItem(language.toUpperCase(), JSON.stringify(storeArray));
      }else{
        loader.innerHTML = "You Search For Wrong Language";
      }
     
    }
  });
}
// global function to get all BOOKS
function getAllBooks() {
  getBooks().then(function (result) {
    if (localStorage.getItem("bookData") !== null) {
      var dataStorage = JSON.parse(localStorage.getItem("bookData"));
      for (const value of dataStorage) {
        var tableData = `<tr>
                      <td scope="row">${value.title}</td>
                      <td>${value.author}</td>
                      <td>${value.country}</td>
                      <td>${value.language}</td>
                      <td><a href="${value.link}">Link</a></td>
                      <td>${value.pages}</td>
                      <td>${value.year}</td>
                  </tr>`;

        table.insertAdjacentHTML("afterbegin", tableData);
        loader.style.display = "none";
        fulltable.style.display = "block";
      }
    } else {
      localStorage.setItem("allBooks", JSON.stringify(result));
      for (const value of result) {
        var tableData = `<tr>
                      <td scope="row">${value.title}</td>
                      <td>${value.author}</td>
                      <td>${value.country}</td>
                      <td>${value.language}</td>
                      <td><a href="${value.link}">Link</a></td>
                      <td>${value.pages}</td>
                      <td>${value.year}</td>
                  </tr>`;

        table.insertAdjacentHTML("afterbegin", tableData);
        loader.style.display = "none";
        fulltable.style.display = "block";
      }
    }
  });
}

// when all books button is clicked
allBooks.addEventListener("click", function () {
  loader.style.display = "block";
  fulltable.style.display = "none";
  table.innerHTML = " ";

  getAllBooks();
});

// when we search using language
submitButton.addEventListener("submit", function (event) {
  event.preventDefault();
  var language = event.target.language.value;
  event.target.language.value = "";
  if (language === "") {
    loader.style.display = "block";
    fulltable.style.display = "none";
    table.innerHTML = " ";
    loader.innerHTML = "Please Type Language Name. To see all books click on All Books";
  } else {
    loader.style.display = "block";
    fulltable.style.display = "none";
    table.innerHTML = " ";
    search(language);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  localStorage.clear();
  getAllBooks();
});

import axios from "axios";

var tableTbody = document.querySelector("table>tbody");
var loader = document.querySelector(".loader");
var table = document.querySelector("#data");
var create = document.querySelector(".formData");
var deleteButtons;
var updateButtons;

var userDataArray = [];
var userDataArrayCounter = 0;
var cors = "https://corsanywhere.herokuapp.com/";
var baseURL = "https://reqres.in/api/users";

function fetchUser() {
  return axios
    .get(`${cors}${baseURL}`)
    .then(function (result) {
      for (var resultData of result.data.data) {
        userDataArray.push({
          name: `${resultData.first_name} ${resultData.last_name} `,
          email: `${resultData.email}`,
          id: `${resultData.id}`,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
function createUser(name, email) {
  return axios
    .post(`${cors}${baseURL}`, { name, job: email })
    .then(function (result) {
      userDataArray.push({
        name: `${result.data.name} `,
        email: `${result.data.job}`,
        id: `${result.data.id}`,
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}
function updateUser(userId, arrayIndex) {
  var username = prompt("enter your name");
  var email = prompt("enter your email");
  if (username === null || email === null) {
    alert("sorry we can update the data both the entry is required");
  } else {
    loader.style.display = "block";
    table.style.display = "none";
    loader.innerHTML = `Updataing the data of ${
      userDataArray[arrayIndex - 1].name
    }`;
    axios
      .put(`${baseURL}/${userId}`, { name: username, job: email })
      .then(function (succ) {
        tableTbody.innerHTML = " ";
        userDataArray[arrayIndex - 1] = {
          name: `${succ.data.name}`,
          email: `${succ.data.job}`,
        };
        userDataArrayCounter = 0;
        renderHtml(userDataArray);
      });
  }
}
function deleteUser(userId, arrayIndex) {
  loader.style.display = "block";
  table.style.display = "none";
  loader.innerHTML = `Deleting ${userDataArray[arrayIndex - 1].name}`;
  if (userDataArray.length === 1) {
    loader.innerHTML =
      "Sorry you deleted all data either enter new data or refresh";
  }
  axios.delete(`${baseURL}/${userId}`).then(function () {
    tableTbody.innerHTML = " ";
    userDataArray.splice(arrayIndex - 1, 1);
    userDataArrayCounter = 0;
    renderHtml(userDataArray);
  });
}
function renderHtml(uData) {
  for (var value of uData) {
    userDataArrayCounter++;
    var htmlData = ` <tr>
    <td>${value.name} </td>
    <td>${value.email}</td>
    <td>
      <button  data-id =${value.id} data-array=${userDataArrayCounter} class="btn btn-success">
        UPDATE
      </button>
    </td>
    <td>
      <button  data-id =${value.id} data-array=${userDataArrayCounter} class="btn btn-danger">
        DELETE
      </button>
    </td>
  </tr>`;
    tableTbody.insertAdjacentHTML("afterbegin", htmlData);
    loader.style.display = "none";
    loader.innerHTML = `Content is loading`;
    table.style.display = "contents";
  }
  deleteButtons = document.querySelectorAll(".btn-danger");
  updateButtons = document.querySelectorAll(".btn-success");
  deleteButtons.forEach(function (element) {
    element.addEventListener("click", function (e) {
      var iddata = e.target.dataset.id;
      var arrayId = e.target.dataset.array;
      deleteUser(iddata, arrayId);
    });
  });
  updateButtons.forEach(function (element) {
    element.addEventListener("click", function (e) {
      var iddata = e.target.dataset.id;
      var arrayId = e.target.dataset.array;
      updateUser(iddata, arrayId);
    });
  });
}

create.addEventListener("submit", function (e) {
  e.preventDefault();
  var name = e.target.name.value;
  var email = e.target.email.value;
  e.target.name.value = "";
  e.target.email.value = "";
  loader.style.display = "block";
  loader.innerHTML = `Creating New Entry for ${name}`;
  table.style.display = "none";
  tableTbody.innerHTML = " ";
  userDataArrayCounter = 0;
  createUser(name, email).then(function () {
    renderHtml(userDataArray);
  });
});
document.addEventListener("DOMContentLoaded", function () {
  fetchUser()
    .then(function () {
      renderHtml(userDataArray);
    })
    .catch(function (error) {
      console.log(error);
    });
});

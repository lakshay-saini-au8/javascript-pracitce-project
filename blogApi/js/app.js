import axios from "axios";
import { find, findAll } from "./utility";

const loader = find(".loader-wrapper");
const homeSection = find("#home");
const detailsSection = find("#details");
const paginationList = find(".pagination__list");
const allPost = find(".allPost");
const indiPostClass = find(".postD");
const commentsClass = find(".comments");
let pagelimit = 10;
const getAllPost = find(".header__post");
const limitPost = find(".header__post-limit");
const favIcon = find(".favourite__icon");
const favDiv = find(".favourite__list");
const favUlList = find(".favourite__ul");
let favPostData = [];
let userData = [];
// base URL
const cors = "https://corsanywhere.herokuapp.com/";
const baseURL = "https://jsonplaceholder.typicode.com";

// render home
const renderHome = (homeData) => {
  homeSection.style.display = "flex";
  loader.style.display = "none";
  allPost.innerHTML = "";
  let usersDataHome = JSON.parse(localStorage.getItem("userData"));
  homeData.forEach((item) => {
    let homeHtml = `  <div class="post" data-postid=${item.id}>
      <div class="post__title">
        <p>
          ${item.title}
        </p>
      </div>
      <div class="post__body">
        <p>
        ${item.body}
        </p>
      </div>
      <div class="post__user">
        <p><span>By:</span>${usersDataHome[item.userId - 1].username}</p>
      </div>
    </div>`;
    allPost.insertAdjacentHTML("beforeend", homeHtml);
  });
  let homepost = findAll(".post");
  homepost.forEach((item) => {
    item.addEventListener("click", (event) => {
      window.location.hash = `#${item.dataset.postid}`;
    });
  });
};
// render pagination
const renderPagination = (limit) => {
  paginationList.innerHTML = "";
  for (let i = 0; i < limit; i++) {
    let pageHtml = `<li class="pagination__list-item" data-limit= ${i}>${
      i + 1
    }</li>`;
    paginationList.insertAdjacentHTML("beforeend", pageHtml);
  }
  let pageClick = findAll(".pagination__list-item");
  pageClick.forEach((item) => {
    item.addEventListener("click", (event) => {
      homeSection.style.display = "none";
      renderHtml(window.location.hash, event.target.dataset.limit * 10);
    });
  });
};
const makeActive = (event) => {
  event.target.classList.add(".active");
};
const renderFavPost = () => {
  favUlList.innerHTML = " ";
  let favObjData = JSON.parse(localStorage.getItem("favPost"));
  if (favObjData === null || favObjData.length === 0) {
    favIcon.style.display = "none";
  } else {
    favIcon.style.display = "block";
    favObjData.forEach((item) => {
      let favItem = ` <li class="favourite__ul-li"  >
        <div class="favpostDetails" data-favid = ${item.postId}>
          <p class="title">
            ${item.postTitle}
          </p>
          <p class="username">${item.userName}</p>
        </div>

        <p class="favDeletePost" data-favid = ${item.postId}>
          <i class="fa fa-times-circle" aria-hidden="true"></i>
        </p>
      </li>`;
      favUlList.insertAdjacentHTML("beforeend", favItem);
    });
    let favUlLiPost = findAll(".favpostDetails");
    let delFavPost = findAll(".favDeletePost");
    favUlLiPost.forEach((item) => {
      item.addEventListener("click", () => {
        window.location.hash = `#${item.dataset.favid}`;
      });
    });
    delFavPost.forEach((item) => {
      item.addEventListener("click", () => {
        let favContent = find(".postD__fav");
        let favContentDel = find(".postD__fav-del");
        let dataId = item.dataset.favid;

        let faObj = JSON.parse(localStorage.getItem("favPost"));
        favPostData = faObj.filter((items) => {
          return +dataId !== +items.postId;
        });

        localStorage.setItem("favPost", JSON.stringify(favPostData));
        if (window.location.hash.replace("#", "") == dataId) {
          favContent.style.display = "block";
          favContentDel.style.display = "none";
        }
        renderFavPost();
      });
    });
  }
};
// render individual content
const renderIndi = (post, usersData, comments) => {
  detailsSection.style.display = "flex";
  loader.style.display = "none";
  let indipost = `
  
  <div class="postD__title">
    <p>
     ${post.title}
    </p><div class= "postD__fav" data-postid = ${post.id} data-userid = ${post.userId}> Add to Favourite</div>
    <div class= "postD__fav-del" data-postid = ${post.id} data-userid = ${post.userId}> Added to Favourite</div>
  </div>
  <div class="postD__user">
    <p><span>By:</span>${usersData.username}</p>
  </div>
  <div class="postD__body">
    ${post.body}
  </div>`;
  indiPostClass.insertAdjacentHTML("beforeend", indipost);
  comments.forEach((item) => {
    let commmentHtml = `
    <div class="commentbox">
    <div class="commentbox__name">
      <p><span>Name:</span>${item.name}</p>
    </div>
    <div class="commentbox__email">
      <p><span>Email:</span>${item.email}</p>
    </div>
    <div class="commentbox__body">
     ${item.body}
    </div>
  </div>
    `;
    commentsClass.insertAdjacentHTML("beforeend", commmentHtml);
  });

  let favContent = find(".postD__fav");
  let favContentDel = find(".postD__fav-del");
  let favObjData = JSON.parse(localStorage.getItem("favPost"));
  if (favObjData !== null) {
    favObjData.forEach((item) => {
      if (post.id === item.postId) {
        favContent.style.display = "none";
        favContentDel.style.display = "block";
      }
    });
  }
  favContent.addEventListener("click", () => {
    let favObjnewData = JSON.parse(localStorage.getItem("favPost"));
    let favObj = {
      postId: post.id,
      postTitle: post.title,
      userName: usersData.username,
    };

    if (favObjnewData === null || favObjnewData.length === 0) {
      favPostData.push(favObj);
      localStorage.setItem("favPost", JSON.stringify(favPostData));
    } else {
      favPostData.push(favObj);
      localStorage.setItem("favPost", JSON.stringify(favPostData));
    }
    favContent.style.display = "none";
    favContentDel.style.display = "block";
    renderFavPost();
  });
  favContentDel.addEventListener("click", () => {
    let favDelObj = JSON.parse(localStorage.getItem("favPost"));
    favPostData = favDelObj.filter((item) => {
      return post.id !== item.postId;
    });
    localStorage.setItem("favPost", JSON.stringify(favPostData));
    favContent.style.display = "block";
    favContentDel.style.display = "none";
    renderFavPost();
  });
};

// render html with data
const renderHtml = (hashValue, start = 0) => {
  renderFavPost();
  const changedHash = hashValue.replace("#", "");
  if (hashValue === "#home") {
    detailsSection.style.display = "none";
    loader.style.display = "flex";

    fetchPost().then((result) => {
      let limitArray = result.slice(start, start + pagelimit);

      let paginationLength = result.length / pagelimit;
      renderPagination(paginationLength);

      fetchUsers().then((user) => {
        renderHome(limitArray);
      });
    });
  } else {
    homeSection.style.display = "none";
    loader.style.display = "flex";

    fetchIndiData(changedHash).then((post) => {
      let usersData = JSON.parse(localStorage.getItem("userData"));
      if (usersData === null) {
        window.location.hash = "#home";
      } else {
        fetchComments(changedHash).then((comments) => {
          indiPostClass.innerHTML = "";
          commentsClass.innerHTML = "";
          renderIndi(post, usersData[post.userId - 1], comments);
        });
      }
    });
    // renderIndi(changedHash);
  }
};
// to check valid hash
const checkValidHash = () => {
  if (window.location.hash === "") {
    window.location.hash = "#home";
  } else {
    return true;
  }
};

// inital check at loading
const init = () => {
  checkValidHash();
  renderHtml(window.location.hash);
};

// fetch the data
const fetchPost = () => {
  return axios
    .get(`${baseURL}/posts`)
    .then((data) => {
      localStorage.removeItem("postData");
      localStorage.setItem("postData", JSON.stringify(data.data));
      return data.data;
    })
    .catch((err) => {
      console.error(err);
    });
};
const fetchUsers = () => {
  return axios
    .get(`${baseURL}/users`)
    .then((data) => {
      localStorage.removeItem("userData");
      localStorage.setItem("userData", JSON.stringify(data.data));

      return data.data;
    })
    .catch((err) => {
      console.error(err);
    });
};
const fetchComments = (extrapara) => {
  return axios
    .get(`${baseURL}/posts/${extrapara}/comments`)
    .then((data) => {
      return data.data;
    })
    .catch((err) => {
      console.error(err);
    });
};

// fetch the data
const fetchIndiData = (extraPara) => {
  return axios
    .get(`${baseURL}/posts/${extraPara}`)
    .then((data) => {
      return data.data;
    })
    .catch((err) => {
      console.error(err);
    });
};
favIcon.addEventListener("mouseover", () => {
  favDiv.style.display = "block";
  favIcon.style.color = "#fff";
});
favDiv.addEventListener("mouseover", () => {
  favDiv.style.display = "block";
  favIcon.style.color = "#fff";
});
favDiv.addEventListener("mouseout", () => {
  favDiv.style.display = "none";
  favIcon.style.color = "#737d8c";
});
// haschange event
window.addEventListener("hashchange", () => {
  checkValidHash();
  favDiv.style.display = "none";
  homeSection.style.display = "none";
  detailsSection.style.display = "none";
  renderHtml(window.location.hash);
});
getAllPost.addEventListener("click", () => {
  homeSection.style.display = "none";
  detailsSection.style.display = "none";
  getAllPost.style.display = "none";
  limitPost.style.display = "block";
  let postAllData = JSON.parse(localStorage.getItem("postData"));
  pagelimit = postAllData.length;
  renderHtml(window.location.hash);
});
limitPost.addEventListener("click", () => {
  homeSection.style.display = "none";
  detailsSection.style.display = "none";
  getAllPost.style.display = "block";
  limitPost.style.display = "none";
  pagelimit = 10;
  renderHtml(window.location.hash);
});
init();

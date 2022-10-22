"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const usersUrl = "http://localhost:3000/users",
    todosUrl = "http://localhost:3000/todos",
    usersSelector = ".selectUser select",
    todoListSelector = ".todoContent";

  //*ASYNC...AWAIT
// console.log(first)
  const getData = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  // Get Data from server
  let users = [],    
  todos = [];

  getData(usersUrl).then((data) => {
    data.forEach((item) => users.push(item));
  });

  getData(todosUrl).then((data) => {
  });
  const renderUsers = () => {
    // console.log(users);
    //! users видає пусту строку при переборі:
    users.forEach((item) => console.log(item.name));
  };

  renderUsers();

  //   console.log(users);
  //   console.log(todos);

  //*=======> FETCH().THEN()
  //   const renderData = (typeOfData, url, objSelector) => {
  //     const objDomPlace = document.querySelector(objSelector);
  //     //!зробити спіннер підгрузки тудушок
  //     fetch(url)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         objDomPlace.innerHTML =
  //           typeOfData === "todos" && data.length !== 0
  //             ? ""
  //             : "<li><h4>There is no todos yet...</h4></li>";

  //         data.forEach((item) => {
  //           if (typeOfData === "users") {
  //             objDomPlace.innerHTML += `<option value=${item.id}>${item.name} (${item.position})</option>`;
  //           }
  //           if (typeOfData === "todos") {
  //             objDomPlace.innerHTML += `
  //             <li>
  //               <i class="fa-regular fa-square unchecked"></i>
  //               ${item.user}: ${item.todo}
  //               <i class="fa-solid fa-xmark close"></i>
  //             </li>`;
  //           }

  //         });
  //       })
  //       .catch((err) => console.error("Виникла помилка: ", err));
  //   };

  //   renderData("users", usersUrl, usersSelector);
  //   renderData("todos", todosUrl, todoListSelector);

  //   console.log(document.querySelector(todoListSelector).children);
  //? зробити окрему функцію зміни значка, та зробити перевірку на чек/анчек

  //   for (const item of document.querySelectorAll(`.todoContent li`)) {
  //     console.log(item);
  //   }

  //   [...document.querySelector(todoListSelector).children].forEach((item) => {
  //     item.addEventListener("click", function (e) {
  //       //!Перевірити наявність виконаних вже завдань завантажених з БД
  //       this.firstElementChild.classList.remove("fa-square", "unchecked");
  //       this.firstElementChild.classList.add("fa-square-check", "checkedDone");
  //     });
  //   });
});

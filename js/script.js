"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const usersUrl = "http://localhost:3000/users",
    todosUrl = "http://localhost:3000/todos",
    usersSelector = ".selectUser select",
    todoListSelector = ".todoContent";
    
  //? Додати перевірку на помилки при з'єднанні
  const getData = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  // Render Data from server
  let users = [],    
  todos = []; 

  const renderUsers = async () => {
    users = await getData(usersUrl);
    users.forEach(item=>{
      document.querySelector(usersSelector).innerHTML += `
      <option value=${item.id}>${item.name} (${item.position})</option>
      `;
    });
  };
  
  const renderTodos = async () => {
    todos = await getData(todosUrl);
    const objDomPlace = document.querySelector(todoListSelector);   
    if (todos.length !== 0) {
      todos.forEach(item => {
        objDomPlace.innerHTML += `
        <li>
        <i class="fa-regular ${item.status?'fa-square-check todo-done':'fa-square'}"></i>
        ${item.user}: ${item.todo}
        <i class="fa-solid fa-xmark todo-close"></i>
        </li>`;
      });
      addListenerToTodos(objDomPlace.children);
    } else {
      objDomPlace.innerHTML = "<li><h4>There is no todos yet...</h4></li>";
    }
  };
  
  //AddEventListeners
  const addListenerToTodos = (todoCollection) => {    
    //!Додати функціонал додавання в БД виконанних завдань та їх видалення
    for(let item of todoCollection) {
      item.addEventListener("click", function (e) {
        this.firstElementChild.classList.remove("fa-square");
        this.firstElementChild.classList.add("fa-square-check", "todo-done");
      });
    }
  };
  
  renderUsers();
  renderTodos();  
});

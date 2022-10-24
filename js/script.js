"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const usersUrl = "http://localhost:3000/users",
    todosUrl = "http://localhost:3000/todos",
    usersSelector = ".selectUser select",
    todoListSelector = ".todoContent";    
  
  const getData = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  //? Зробити одну універсальну функцію POST-PATCH-DELETE ======>
  const postData = async (method, url, data = null) => {
    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  const deleteData = async (url, id) => {
    const res = await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }    
    });
    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  const updateData = async (url, id, data) => {
    const res = await fetch(`${url}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)  
    });
    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };
//?===========================================================================<<
  // Render Data from server
  let users = [],    
  todos = []; 

  const renderUsers = async () => {
    try{
    users = await getData(usersUrl);
    users.forEach(item=>{
      document.querySelector(usersSelector).innerHTML += `
      <option value=${item.id}>${item.name} (${item.position})</option>
      `;
    });
    }
    catch(err) {
        console.error('Error users fetch: ',err);
        document.querySelector(usersSelector).disabled = true;
        document.querySelector(usersSelector).style.color = 'red';
        document.querySelector(usersSelector).innerHTML = `<option selected>There is an error occured: ${err}</option>`;
    }    
  };
  
  const renderTodos = async () => {
    const objDomPlace = document.querySelector(todoListSelector);    
    try{
      todos = await getData(todosUrl);
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
    } 
    catch(err) {
        console.error('Error todos fetch: ',err);
        objDomPlace.innerHTML = `<li><h4>An error occured: ${err}</h4></li>`;
    }   
    
  };
  
  //AddEventListeners
  const addListenerToTodos = (todoCollection) => {    
//!Додати функціонал додавання в БД виконанних завдань та їх видалення
    for(let item of todoCollection) {
//! розділити події по різних кнопках (чек, видалення) - можливо треба використати делегування подій
      item.addEventListener("click", function (e) {
        if(!this.firstElementChild.classList.contains('todo-done')){
          this.firstElementChild.classList.remove("fa-square");
          this.firstElementChild.classList.add("fa-square-check", "todo-done");
          console.log(this);   
          // updateData(todosUrl, 1, {status: true});                 
        } else {
          this.firstElementChild.classList.add("fa-square");
          this.firstElementChild.classList.remove("fa-square-check", "todo-done");
          // updateData(todosUrl, 1, {status: false});  
        }        
      });
    }
  };
  
  renderUsers();
  renderTodos();  
});

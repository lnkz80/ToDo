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
  const setData = async (method, url, id = null, data = null) => {
    console.log(method, url, id, data);
    const res = await fetch(
      id?`${url}/${id}`:`${url}`, 
      {
        method: method,
        headers: {
          'Content-type': 'application/json'
        },
        body : data ? JSON.stringify(data) : "",
      }
    );
    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };  
//?<===========================================================================<<

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
          <li data-id=${item.id}>
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
    for(let item of todoCollection) {
      item.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("fa-square")){  
          // console.log(e.target);           
          e.target.classList.remove("fa-square");
          e.target.classList.add("fa-square-check", "todo-done");          
        //!Додати функціонал додавання в БД виконанних завдань та їх видалення
      } else 
      if (e.target && e.target.classList.contains("fa-square-check")){          
        e.target.classList.remove("fa-square-check", "todo-done");
        e.target.classList.add("fa-square");
        //!Додати функціонал додавання в БД виконанних завдань та їх видалення
        } else 
        if (e.target && e.target.classList.contains("todo-close")){   
        //! Зробити видалення запису і ререндеру списку тудушек  
          // setData("DELETE", todosUrl, e.target.parentNode.dataset.id);
          console.log(e.target.parentNode.dataset.id);
        }    
      });
    }
  };
  
  renderUsers();
  renderTodos();  
});

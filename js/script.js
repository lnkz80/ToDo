"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const usersUrl = "http://localhost:3000/users",
    todosUrl = "http://localhost:3000/todos",
    addTodoForm = document.querySelector('#addTodoForm'),
    todoTextInput = addTodoForm.querySelector('#todoTextInput'),   
    chooseUserSelect = addTodoForm.querySelector("#chooseUserSelect"),    
    confirmTodoBtn = addTodoForm.querySelector("#confirmTodoBtn"),
    todoList = document.querySelector(".todoContent");
  
  const getData = async (url, id = null) => {
    const res = await fetch(id?url/id:url);
    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

// ===== Універсальна функція POST-PATCH-DELETE ======>  
  const setData = async (method, url, id = null, data = null) => {    
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
    // if(method == "POST" || method == "DELETE") {
      await renderTodos();
    // }
    return await res.json();
  };  
  // ===================================================<

  // Render Data from server
  let users = [],    
  todos = []; 

  const renderUsers = async () => {
    try{
    users = await getData(usersUrl);
    users.forEach(item=>{
      chooseUserSelect.innerHTML += `
      <option value=${item.id}>${item.name} (${item.position})</option>
      `;
    });
    }
    catch(err) {
        console.error('Error users fetch: ',err);
        chooseUserSelect.disabled = true;
        chooseUserSelect.style.color = 'red';
        chooseUserSelect.innerHTML = `<option selected>There is an error occured: ${err}</option>`;
    }    
  };
  
  const renderTodos = async () => {    
    todoList.innerHTML = "";
    try{
      todos = await getData(todosUrl);
      if (todos.length !== 0) {
        todos.forEach(item => {          
          todoList.innerHTML += `
          <li data-id=${item.id}>
          <i class="fa-regular ${item.status?'fa-square-check todo-done':'fa-square'}"></i>
          <span class="${item.status?'todo-done-light':''}"><i>${users[item.user-1].name}</i> <i class="fa-solid fa-arrow-right-long"></i> ${item.todo}</span>
          <i class="fa-solid fa-xmark todo-close"></i>
          </li>`;
        });
        addListenerToTodos(todoList.children);
      } else {
        todoList.innerHTML = "<li><h4>There is no todos yet...</h4></li>";
      }
    } 
    catch(err) {
        console.error('Error todos fetch: ',err);
        todoList.innerHTML = `<li><h4>An error occured: ${err}</h4></li>`;
    }       
  };

  const renderAll = async ()=>{
    await renderUsers();
    await renderTodos();  
  };
  
  renderAll();
  
  //AddEventListeners
  const addListenerToTodos = (todoCollection) => {    
    for(let item of todoCollection) {
      item.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("fa-square")){                    
          e.target.classList.remove("fa-square");
          e.target.classList.add("fa-square-check", "todo-done");       
          setData("PATCH", todosUrl, e.target.parentNode.dataset.id, {status: true});        
      } else 
      if (e.target && e.target.classList.contains("fa-square-check")){          
          e.target.classList.remove("fa-square-check", "todo-done");
          e.target.classList.add("fa-square");
          setData("PATCH", todosUrl, e.target.parentNode.dataset.id, {status: false});        
        } else 
        if (e.target && e.target.classList.contains("todo-close")){           
          setData("DELETE", todosUrl, e.target.parentNode.dataset.id);          
        }    
      });
    }
  };
  
  confirmTodoBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(todoTextInput.value == "") {
      alert("Заповніть форму з задачею!!!");
      return false;
    }   
    setData("POST", todosUrl, null, {user: +chooseUserSelect.value, todo: todoTextInput.value, status: false});
    addTodoForm.reset();
  });
});
  

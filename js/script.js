"use strict";

/* TODO:
  * create functions that changes data on server
  * addEventListeners
*/

// Globals
let users, todos = [];
const todoList = document.querySelector('.todo-content'),
userList = document.querySelector('.form-select'),
form = document.querySelector('form');

//Attach Events
document.addEventListener("DOMContentLoaded", appInit);
form.addEventListener('submit', handleSubmit);

// Basic Logic
function getUser(userId){
  const user = users.find(item => item.id === userId);
  return user.name;
}

function renderTodo({id, user, todo, status}){    
  const li = document.createElement('li');
  li.innerHTML = `<i>${getUser(user)}</i><i class="fa-solid fa-arrow-right-long"></i>${todo}`;
  li.dataset.id = id;
  const checkBox = document.createElement('i');
  checkBox.classList.add('fa-regular');
  
  if(status){
    checkBox.classList.add('fa-square-check', 'todo-done');
    li.classList.add('todo-done--light');  
  } else {
    checkBox.classList.add('fa-square');
    li.classList.add('todo-undone--light');  
  }

  checkBox.addEventListener('click', handleTodoChange);
  
  const close = document.createElement('i');
  close.classList.add('todo-close', 'fa-solid', 'fa-xmark'); 
  
  li.prepend(checkBox);
  li.append(close);
  todoList.prepend(li);    
}

function renderUsers({id, name, position}){
  const option = document.createElement('option');
  option.innerText = `${name} (${position})`;
  option.value = id;  
  userList.append(option);
}

function toggleClasses(el, classes){
  classes.forEach(toggleClass => el.classList.toggle(toggleClass));
}

// Event Logic
function appInit(){
  Promise.all([getAllTodos(), getAllUsers()])
  .then(data=>{
    [todos, users] = data;

    //*  Send to html =================>
    // console.log(todos, users);
    todos.forEach(todo => renderTodo(todo));
    users.forEach(user => renderUsers(user));
    
    //* ===============================<
  });
}

function handleSubmit(e){
  e.preventDefault();
  
  createTodo({
    user: Number(form.user.value),
    todo: form.todo.value,
    status: false,
  });
}

function handleTodoChange(e){    
  const todoId = e.target.parentElement.dataset.id;
  const status = !e.target.classList.contains('todo-done');
  toggleClasses(e.target, ['todo-done', 'fa-square-check', 'fa-square']);
  toggleClasses(e.target.parentElement, ['todo-done--light', 'todo-undone--light']);  

  changeTodoStatus(todoId, status);
}

  // Async Logic
  async function getAllTodos(){
    const res = await fetch("http://localhost:3000/todos");
    if (!res.ok){
      throw new Error(`An error occured: ${res.status}`);
    }
    return await res.json();
  }
  
  async function getAllUsers(){
    const res = await fetch("http://localhost:3000/users");
    if (!res.ok){
      throw new Error(`An error occured: ${res.status}`);
    }
    return await res.json();
  }

  async function createTodo(todo){
    const response = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {'Content-type': 'application/json'},
    });

    const newTodo = await response.json();    
    renderTodo(newTodo);
  }

  async function changeTodoStatus(id, status){
    const response = await fetch(`http://localhost:3000/todos/${id}`,{ 
      method: 'PATCH',
      body: JSON.stringify({status}),
      headers: {'Content-type': 'application/json'},
  });
    const data = await response.json();    
  }
"use strict";

// Global
let users, todos = [];

document.addEventListener("DOMContentLoaded", appInit);

// App init
function appInit(){
  Promise.all([getAllTodos(), getAllUsers()])
  .then(data=>{
    [todos, users] = data;

    //*  Send to html =================>
    // console.log(todos, users);
    todos.forEach(todo => renderTodo(todo));
    //* ===============================<
  });
}

// Get data form server
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

// Basic Logic
function renderTodo({id, user, todo, status}){
  // console.log(id, user, todo, status);
  //! Написати генерацію строки li для рендерінгу у html
}

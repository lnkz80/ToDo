"use strict";

//! ========================== Globals ============================================
let users, todos = [];
const todoList = document.querySelector('.todo-content'),
userList = document.querySelector('.form-select'),
form = document.querySelector('form');

//! ========================== Attach Events ======================================
document.addEventListener("DOMContentLoaded", appInit);
form.addEventListener('submit', handleSubmit);

//! ========================== Basic Logic ========================================
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
  
  close.addEventListener('click', handleClose);

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

function  removeTodo(todoId){
  //remove from array
 todos = todos.filter(todo=>todo.id !== todoId);
  const todo = todoList.querySelector(`[data-id="${todoId}"]`);
  
  todo.querySelector('.fa-square').removeEventListener('click', handleTodoChange);
  todo.querySelector('.todo-close').removeEventListener('click', handleClose);

  todo.remove();
}

function alertError(error){
  alert(error.message);
}

//! ========================== Event Logic ===================================
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

function handleClose(e){
  // e.target.parentElement.remove(); //can use this instead of e.target
  const todoId = e.target.parentElement.dataset.id;  
  deleteTodo(todoId);
}

  //! ========================== Async Logic ======================================
  async function getAllTodos(){
    try {
      const res = await fetch("http://localhost:3000/todos");
      if (!res.ok){
        throw new Error(`An error occured: ${res.status}`);
      }
      return await res.json();      
    } catch (error) {
      alertError(error);
    }
  }
  
  async function getAllUsers(){
    try {
      const res = await fetch("http://localhost:3000/users");
      if (!res.ok){
        throw new Error(`An error occured: ${res.status}`);
      }
      return await res.json();      
    } catch (error) {
      alertError(error);
    }
  }

  async function createTodo(todo){
    try {
      const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {'Content-type': 'application/json'},
      });  
      const newTodo = await response.json();    
      renderTodo(newTodo);      
    } catch (error) {
      alertError(error);
    }
  }

  async function changeTodoStatus(id, status){
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`,{ 
        method: 'PATCH',
        body: JSON.stringify({status}),
        headers: {'Content-type': 'application/json'},
    });
      if(!response.ok){
        throw new Error('Something went wrong...');
      }      
    } catch (error) {
      alertError(error);
    }      
  }

  async function deleteTodo(id){
    try{
      const response = await fetch(`http://localhost:3000/todos/${id}`,{ 
        method: 'DELETE',        
        headers: {'Content-type': 'application/json'},
      });
      if(response.ok){
        removeTodo(id);
      } else {
        //ERROR
        throw new Error('Something went wrong...');
      }
    } catch(err){
      alertError(err);
    }
  }
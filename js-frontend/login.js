import Form from './form.js';

const loginForm = document.querySelector('#login');
new Form(loginForm, '/api/v1/auth/login', 'POST');

import React from 'react'

const Login = ({ submit, input }) =>
  (<div>
    <form onSubmit={submit}>
      <input
        data-form="firstName"
        type="text"
        placeholder="First Name"
        onChange={input}
      />
      <input
        data-form="lastName"
        type="text"
        placeholder="Last Name"
      />
      <input
        data-form="email"
        type="text"
        placeholder="Email"
      />
      <input
        data-form="password"
        type="password"
        placeholder="Password"
      />
      <button data-form="submit">Login</button>
    </form>
  </div>);

export default Login;

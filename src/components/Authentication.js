import React from 'react'
import '../css/login.css'

const Authentication = () => {
  return (
    <>
    
    <div className="login">
        <div className="formss">
          <form noValidate>
            <span>Login</span>

            <input
              type="email"
              name="email"
              placeholder="Enter email id / username"
              className="form-control inp_text"
              id="email"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="form-control"
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Authentication
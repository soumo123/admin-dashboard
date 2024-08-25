import React,{useState} from 'react'
import '../css/login.css'

const Authentication = () => {

    const[email,setEmail] = useState("")
    const[password,setPassword] = useState("")


    const handleSubmit = (e)=>{
        e.preventDefault()
    }

  return (
    <>
    
    <div className="login">
        <div className="formss">
          <form noValidate>
            <span>Admin Login</span>

            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter email id"
              className="form-control inp_text"
              id="email"
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter password"
              className="form-control"
              onChange={(e)=>setPassword(e.target.value)}

            />

            <button type="submit" onClick={handleSubmit}>Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Authentication
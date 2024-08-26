import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/login.css'
import axios from 'axios'
import Message from '../custom/Message';


const Authentication = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState(0)
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [adId, setAdId] = useState("")
  const [shops, setShops] = useState([])
  const [emailerr, setEmailerr] = useState(false)
  const [passworderr, setPasserr] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          'Content-Type': "application/json",
        },
        withCredentials: true
      }

      if (!email && !password) {
        setEmailerr(true)
        setPasserr(true)
        return
      }

      if (!email) {
        setEmailerr(true)
        return
      }
      if (!password) {
        setPasserr(true)
        return
      }

      let json = {
        email: email,
        password: password,
      }
      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/signinadmin`, json, config);
      if (response.status === 200) {
        setAdId(response.data.user.adminId)
        sessionStorage.setItem("adminToken", response.data.token)
        localStorage.setItem("adminToken", response.data.token)
        localStorage.setItem("adminImage", response.data.user.image)
        setMode(1)
      } else {
        console.log("errorrrrrrrrrrrrrrr", error)
        setMessageType("error")
        setMessage("Email or Password is wrong")
        setTimeout(() => {
          setMessage(false)
        }, 2000);
      }
    } catch (error) {
      setMessageType("error")
      setMessage("Email or Password is wrong")
      setTimeout(() => {
        setMessage(false)
      }, 2000);
      console.log(error.stack)
    }
  }

  const handleEnter = (e) => {
    e.preventDefault()
  }


  const getallshops = async (id) => {

    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_all_shops?adminId=${id}`);
      if (response.status === 200) {
        setShops(response.data.data)
      }
    } catch (error) {
      setShops([])
      console.log(error.stack)
    }
  }

  const handleShopSelect = (adminid, shopid, typid) => {
    localStorage.setItem("adminId", adminid)
    localStorage.setItem("shop_id", shopid)
    localStorage.setItem("type", typid)
    setMessageType("success")
    setMessage("Admin Login Successfully8")
    setTimeout(() => {
      setMessage(false)
    }, 2000);
    navigate("/")
  }

  useEffect(() => {
    if (adId) {
      getallshops(adId)
    }
  }, [adId])

  useEffect(() => {

    if (email || password) {
      setEmailerr(false)
      setPasserr(false)
    }
  }, [email, password])



  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <div className="login">
        {
          mode === 0 ? (
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
                  onChange={(e) => setEmail(e.target.value)}
                />
                {
                  emailerr ? (<p style={{color:"red",textAlign:"justify"}}>* Please enter the email</p>) : ("")
                }
                <input
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Enter password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {
                  passworderr ? (<p style={{color:"red",textAlign:"justify"}}>* Please enter the password</p>) : ("")
                }
                <button type="submit" onClick={handleSubmit}>Login</button>
              </form>
            </div>
          ) : (


            <div className="formss">
              <form noValidate>
                <span>Choose Your Shop</span>


                <div class="cards-list">
                  {
                    shops && shops.length === 0 ? (
                      <div className=''>
                        <h3>No Shops Created</h3>
                      </div>
                    ) :
                      (
                        <>
                          {
                            shops && shops.map((ele) => (
                              <div class="card 1" onClick={() => handleShopSelect(ele.adminId, ele.shop_id, ele.type)}>
                                <div class="card_image"> <img src={ele.logo} /> </div>
                                <div class="card_title title-white">
                                  <p>{ele.shop_name}</p>
                                </div>

                              </div>
                            ))
                          }

                        </>


                      )
                  }

                </div>


              </form>
            </div>
          )
        }

      </div>
    </>
  )
}

export default Authentication

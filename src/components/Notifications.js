import React, { useState, useEffect } from 'react'
import axios from 'axios'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { noteRefs } from '../redux/actions/userAction'
import { useSelector, useDispatch } from 'react-redux'
const Notifications = () => {

  const dispatch = useDispatch()
  const [notification, setNotifications] = useState([])
  const[ref,setRef] = useState(false)
  const adminId = localStorage.getItem("adminId")
  const type = localStorage.getItem("type")
  const getAllNotifications = async () => {

    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_notification?adminId=${adminId}&type=${type}`)
      if (response.status === 200) {
        setNotifications(response.data.data)
      }
    } catch (error) {
      console.log(error.stack)
    }

  }

  const updateNotification = async()=>{
    try {
      const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/update_noti?adminId=${adminId}&type=${type}`)
      if (response.status === 200) {
        dispatch(noteRefs(new Date().getSeconds()))
        console.log("---Updated Count -----")
      }
    } catch (error) {
      console.log(error.stack)
    }
  }

  useEffect(() => {
    getAllNotifications()
    updateNotification()
  }, [])



  return (
    <>

      <div className="container">
        <h1>Notifications</h1>
        <div className="row">
          <div className="col">
            <div className="alerts">
              <ul>
                {notification && notification.map((ele) => (
                  <>
                    {
                      ele.notification_type === 1 ? (
                        <li>


                          <div class="alert alert-warning d-flex align-items-center" role="alert">
                            <WarningAmberIcon />
                            <div>
                              {ele.message}
                            </div>
                          </div>
                        </li>
                      ) : (
                        <li>
                          <div class="alert alert-danger d-flex align-items-center" role="alert">
                            <WarningAmberIcon />
                            <div>
                              {ele.message}
                            </div>
                          </div>
                        </li>
                      )
                    }
                  </>

                ))}

              </ul>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}

export default Notifications
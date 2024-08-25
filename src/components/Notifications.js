import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { noteRefs } from '../redux/actions/userAction';
import { useDispatch } from 'react-redux';
import Message from '../custom/Message';

const Notifications = () => {
  const dispatch = useDispatch();
  const [notification, setNotifications] = useState([]);
  const [checkedStates, setCheckedStates] = useState({}); // Object to store the checked state of each accordion
  const adminId = localStorage.getItem('adminId');
  const type = localStorage.getItem('type');
  const shop_id = localStorage.getItem("shop_id");
  const [quantities, setQuantities] = useState({});
  const [messages, setMessages] = useState({})
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [ref,setRef] = useState(false)

  const getAllNotifications = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_notification?adminId=${adminId}&type=${type}`);
      if (response.status === 200) {
        setNotifications(response.data.data);
        // Initialize checked states based on the number of notifications
        const initialCheckedStates = response.data.data.reduce((acc, curr) => {
          acc[curr._id] = false;
          return acc;
        }, {});
        setCheckedStates(initialCheckedStates);
      }
    } catch (error) {
      console.log(error.stack);
    }
  };

  const updateNotification = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/update_noti?adminId=${adminId}&type=${type}`);
      if (response.status === 200) {
        dispatch(noteRefs(new Date().getSeconds()));
        console.log('---Updated Count -----');
      }
    } catch (error) {
      console.log(error.stack);
    }
  };

  const handlerequestOrder = async (not_id, name, agentId, email, phone) => {

    try {
      console.log("not_id", not_id, "quantity", quantities[not_id]);
      let json = {

        agentId: agentId,
        shopId: shop_id,
        quantity: quantities[not_id],
        agentname: name,
        email: email,
        phone: phone,
        message: messages[not_id]
      }
      console.log("json", json)
      const config = {
        headers: {
          'Content-Type': "application/json",
        },
        withCredentials: true
      }

      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/req_order?adminId=${adminId}&shop_id=${shop_id}&not_id=${not_id}`, json,config)
      if (response.status === 201) {
        setMessageType("success")
        setMessage("Request Sent")
        setCheckedStates({})
        setMessages({})
        setTimeout(() => {
          setMessage(false)
        }, 2000);
        dispatch(noteRefs(new Date().getSeconds()));
        dispatch(setRef(new Date().getSeconds()))
      } else {
        setMessageType("error")
        setMessage("Ooops..Something went wrong")
        setTimeout(() => {
            setMessage(false)
        }, 2000);
    }
    } catch (error) {
      console.log(error.stack)
    
    }
  }

  const handleQuantityChange = (id, value) => {
    setQuantities(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleMessageChange = (id, value) => {
    setMessages(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleCheck = (id, checked) => {
    setCheckedStates((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  useEffect(() => {
    getAllNotifications();
  }, [ref]);

  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <div className="container">
        <h1>Notifications</h1>
        <div className="row">
          <div className="col">
            <div className="alerts">
              <ul>
                {notification &&
                  notification.map((ele, index) => {
                    let color = '';
                    let bordercolor = '';
                    let textcolor = '';
                    if (ele.noti_type === 1) {
                      color = '#cce5ff';
                      bordercolor = '#b8daff';
                      textcolor = '#004085';
                    } else if (ele.noti_type === 2) {
                      color = '#fff3cd';
                      bordercolor = '#ffeeba';
                      textcolor = '#856404';
                    }

                    return (
                      <div
                        className={`accordion accordion-flush`}
                        id={`accordionFlushExample${index}`}
                        key={ele._id}
                        style={{ marginBottom: '15px' }} // Add gap between accordion items
                      >
                        <div className="accordion-item">
                          <h2 className="accordion-header" id={`flush-heading${index}`}>
                            <button
                              className={`accordion-button collapsed`}
                              type="button"
                              style={{ background: color, borderColor: bordercolor, color: textcolor }}
                              data-bs-toggle="collapse"
                              data-bs-target={`#flush-collapse${index}`}
                              aria-expanded="false"
                              aria-controls={`flush-collapse${index}`}
                            >
                              {ele.message}
                            </button>
                          </h2>
                          <div
                            id={`flush-collapse${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`flush-heading${index}`}
                            data-bs-parent={`#accordionFlushExample${index}`}
                          >
                            <div className="accordion-body">
                              {
                                ele.noti_type === 2 ? (
                                  <>
                                    <div>
                                      <h4>Note</h4>
                                      <WarningAmberIcon /> {ele.message}
                                      <p>Agent Name - {ele.agent_details?.name} ({ele.agent_details?.ag_id})</p>
                                      <p>Email - {ele.agent_details?.email}</p>
                                      <p>Mobile - {ele.agent_details?.phone}</p>
                                    </div>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`flexCheckDefault${index}`}
                                        checked={checkedStates[ele._id] || false}
                                        onChange={(e) => handleCheck(ele._id, e.target.checked)}
                                      />
                                      <p>Request for new order?</p>
                                      {checkedStates[ele._id] && ( // Conditionally render buttons
                                        <>
                                          <input
                                            type="number"
                                            value={quantities[ele._id] || 0}
                                            onChange={(e) => handleQuantityChange(ele._id, e.target.value)}
                                          />
                                          <input
                                            type="text"
                                            value={messages[ele._id] || ""}
                                            onChange={(e) => handleMessageChange(ele._id, e.target.value)}
                                          />
                                          <button type="button" className='btn btn-warning' onClick={(e) => handlerequestOrder(ele._id, ele.agent_details?.name, ele.agent_details?.ag_id, ele.agent_details?.email, ele.agent_details?.phone)}>Take order</button>
                                          <button type="button" className='btn btn-secondary'>Cancel</button>
                                        </>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <div>
                                    <h4>Note</h4>
                                    <WarningAmberIcon /> {ele.message}
                                  </div>

                                )
                              }

                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;

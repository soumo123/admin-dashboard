import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { noteRefs } from '../redux/actions/userAction';
import { useDispatch } from 'react-redux';
import Message from '../custom/Message';
import '../css/accordian.css'

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notification, setNotifications] = useState([]);
  const [checkedStates, setCheckedStates] = useState({}); // Object to store the checked state of each accordion
  const adminId = localStorage.getItem('adminId');
  const type = localStorage.getItem('type');
  const shop_id = localStorage.getItem("shop_id");
  const [quantities, setQuantities] = useState({});
  const [messages, setMessages] = useState({})
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [ref, setRef] = useState(false)
  const [loader, setLoader] = useState(false)

  const getAllNotifications = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_notification?adminId=${adminId}&type=${type}`);
      if (response.status === 200) {
        setNotifications(response.data.data);
        setLoader(true)

        // Initialize checked states based on the number of notifications
        const initialCheckedStates = response.data.data.reduce((acc, curr) => {
          acc[curr._id] = false;
          return acc;
        }, {});
        setCheckedStates(initialCheckedStates);
      }
    } catch (error) {
      console.log(error.stack);
      setLoader(true)
      setNotifications([])

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

  const handlerequestOrder = async (not_id, name, agentId, email, phone, weight, price, purchaseprice, productId, productname) => {

    try {
      console.log("not_id", not_id, "quantity", quantities[not_id]);
      let json = {

        agentId: agentId,
        shopId: shop_id,
        productId: productId,
        productname: productname,
        weight: weight,
        price: price,
        stock: Number(quantities[not_id]),
        purchaseprice: purchaseprice,
        agentname: name,
        email: email,
        phone: phone,
        message: messages[not_id]
      }
      console.log("json--reqq", json)
      const config = {
        headers: {
          'Content-Type': "application/json",
        },
        withCredentials: true
      }

      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/req_order?adminId=${adminId}&shop_id=${shop_id}&not_id=${not_id}`, json, config)
      if (response.status === 201) {
        setMessageType("success")
        setMessage("Request Sent")
        setCheckedStates({})
        setMessages({})
        setTimeout(() => {
          setMessage(false)
        }, 2000);
        navigate("/requests")
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
      <h1>Notifications</h1>
      <div className="container">
        <div className="row">
          <div className="col">
            <div class="" style={{ maxHeight: "400px", overflowY: "auto" }}>

              {
                !loader ? (

                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <div className="text-center">
                          loading....
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {
                      notification && notification.length > 0 ? (
                        <>
                          <div className="accordion-scroll-container" >
                            {
                              notification && notification.map((ele, index) => {
                                let color = '';
                                let bordercolor = '';
                                let textcolor = '';
                                if (ele.noti_type === 1) {
                                  color = 'rgb(194 76 76)';
                                  bordercolor = 'rgb(194 76 76)';
                                  textcolor = '#004085';
                                } else if (ele.noti_type === 2) {
                                  color = 'rgb(203 205 11)';
                                  bordercolor = 'rgb(203 205 11)';
                                  textcolor = '#856404';
                                }

                                return (
                                  <div class="accordion-item" key={index} style={{ background: color, borderColor: bordercolor, color: textcolor }}>
                                    <input type="checkbox" id={`item-${index}`} />
                                    <label for={`item-${index}`} class="accordion-header">
                                      <span style={{color:"white"}}>{ele.message}</span>
                                      <span class="arrow">
                                        <i class="fa-solid fa-caret-right"></i>
                                      </span>
                                    </label>
                                    <div class="accordion-content" >
                                      {
                                        ele.noti_type === 2 ? (
                                          <>
                                            <div style={{color:"white"}}>
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
                                              <p style={{color:"white"}}>Request for new order?</p>
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
                                                  <button type="button" className='btn btn-warning' onClick={(e) => handlerequestOrder(ele._id, ele.agent_details?.name, ele.agent_details?.ag_id, ele.agent_details?.email, ele.agent_details?.phone, ele.weight, ele.price, ele.purchaseprice, ele.productId, ele.productname)}>Take order</button>
                                                  <button type="button" className='btn btn-secondary'>Cancel</button>
                                                </>
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          <div style={{color:"white"}}>
                                            <h4>Note</h4>
                                            <WarningAmberIcon /> {ele.message}
                                          </div>

                                        )
                                      }
                                    </div>
                                  </div>
                                )


                              })
                            }
                          </div>
                        </>
                      ) :
                        (
                          <div className="container">
                            <div className="row">
                              <div className="col-12">
                                <div className="text-center">
                                  No notifications Found
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                    }
                  </>
                )
              }
              {/* <ul>
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
                                          <button type="button" className='btn btn-warning' onClick={(e) => handlerequestOrder(ele._id, ele.agent_details?.name, ele.agent_details?.ag_id, ele.agent_details?.email, ele.agent_details?.phone, ele.weight, ele.price, ele.purchaseprice, ele.productId, ele.productname)}>Take order</button>
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
              </ul> */}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Notifications;

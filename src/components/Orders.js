import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import Message from '../custom/Message';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from 'react-bootstrap/Button';
import ViewOrderModal from './ViewOrderModal.js';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Pagination from '@mui/material/Pagination';
import Slip from '../custom/Slip.js';
import DirectOrder from '../custom/DirectOrder.js';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

const Orders = ({ sidebarOpen }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('');
    const [lastTypingTime, setLastTypingTime] = useState(null);
    const [orders, setOrders] = useState([])
    const [status, setStatus] = useState(0)
    const [loader, setloader] = useState(false);
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const type = localStorage.getItem("type");
    const [show, setShow] = useState(false);
    const [text, setText] = useState("")
    const [odId, setOdId] = useState("")
    const [viewData, setViewData] = useState([])
    const [load, setLoad] = useState(false)
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const [ref, setRef] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [invo, setInvo] = useState(false)
    const [directModal, setDirectModal] = useState(false)
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0)
    const [totalPages, setTotalPages] = useState(0);
    const [ordertype, setOrderType] = useState("")
    const [totaReqorders, setTotalReqOrders] = useState(0)
    const adminToken = localStorage.getItem("adminToken")
    const handleClose = () => {
        setShow(false);
        setText("")
        setOdId("")
        setStatus(0)
    }

    const handleOpen = (text, odId, st) => {
        setShow(true);
        setText(text)
        setOdId(odId)
        setStatus(Number(st))
    }

    const handleSearch = (query) => {
        setLastTypingTime(new Date().getTime())
        setSearchQuery(query);
    };

    const handleSlipShow = () => {
        setInvo(true)
    }

    const getOrderDetails = async () => {
        try {
            const config = {
                headers: {
                  'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
              };
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/orders/getorders?type=${type}&shopId=${shop_id}&status=${true}&key=${""}&limit=${limit}&offset=${offset}&ordertype=${ordertype}&adminId=${adminId}`,config)
            if (response.status === 200) {
                setloader(true)
                setOrders(response.data.data)
                setTotalPages(Math.ceil(response.data.totalData / limit));
                setTotalReqOrders(response.data.totalReqorders)
            } else {
                setOrders([])
                setTotalPages(0)
                setTotalReqOrders(0)

            }
        } catch (error) {
            setloader(true)
            console.log(error)
            setOrders([])
            setTotalPages(0)
        }
    }


    useEffect(() => {
        if (lastTypingTime) {
            const timer = setTimeout(() => {
                const getOrderDetails = async () => {
                    try {
                        const config = {
                            headers: {
                              'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                            }
                          };
                        const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/orders/getorders?type=${type}&shopId=${shop_id}&status=${true}&key=${searchQuery}&ordertype=${ordertype}&adminId=${adminId}`,config)
                        if (response.status === 200) {
                            setloader(true)
                            setOrders(response.data.data)
                            setTotalPages(Math.ceil(response.data.totalData / limit));
                            setTotalReqOrders(response.data.totalReqorders)

                        } else {
                            setOrders([])
                            setTotalReqOrders(0)

                        }
                    } catch (error) {
                        setloader(true)
                        console.log(error)
                        setOrders([])
                        setTotalReqOrders(0)

                    }
                };

                getOrderDetails();

            }, 1000);
            return () => clearTimeout(timer)
        }
    }, [searchQuery, offset, limit])

    const handlePageChange = (event, value) => {
        setOffset((value - 1) * limit);
    };

    const updateOrder = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': "application/json",
                },
                withCredentials: true
            }
            console.log("statusstatus", status)
            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/orders/updateOrder?orderId=${odId}&type=${type}&shopId=${shop_id}&status=${status}`, config)
            if (response.status === 200) {
                setShow(false)
                setMessageType("success")
                setMessage("Order Updated")
                setOdId("")
                setText("")
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
                dispatch(setRef(new Date().getSeconds()))

            } else {
                setMessageType("error")
                setMessage("Order Not Updated")
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
            }

        } catch (error) {
            console.log(error)
        }
    }


    const getOrderById = async (id, num) => {
        try {
            if (num === 1) {
                setModalShow(true)
            } else {
                setInvo(true)
            }
            const config = {
                headers: {
                  'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
              };
            const result = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/orders/getorder/${id}/${adminId}`,config)
            if (result.status === 200) {
                setViewData(result.data.data)
            }
        } catch (error) {
            setViewData([])
            console.log(error)
        }
    }


    const handleOpenModal = () => {
        setDirectModal(true)
    }

    const handleOrderTypeChange = (e) => {
        setOrderType(e)
    }

    const handlReqOrder = () => {
        navigate("/manualorders")
    }

    useEffect(() => {
        getOrderDetails()
    }, [ordertype, offset, limit, ref])


    return (

        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
            <div className={`all-product ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <h3>Manage Orders</h3>
                <div className='form'>
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="form-group">
                                <label>Search Orders</label>
                                <input type="text" placeholder="Search orders by orderId" className='form-control' value={searchQuery} name="search" onChange={(e) => handleSearch(e.target.value)} />
                            </div>

                        </div>
                        <div className="col-sm-3">
                            <div className="form-group">
                                <label>Order Type</label>
                                <select className='form-control' value={ordertype} onChange={(e) => handleOrderTypeChange(e.target.value)}>
                                    <option value="">All Orders</option>
                                    <option value="direct">Direct Order</option>
                                    <option value="ordered">Ordered</option>
                                </select>
                            </div>

                        </div>
                        <div className='col-sm-3 text-end '>
                            <button type="button" className='btnSubmit' onClick={handleOpenModal}>+Take Order</button>
                        </div>
                        <div className="col-sm-3">

                            <button type="button" className='btnSubmit position-relative' onClick={handlReqOrder}>Online Orders
                                {
                                    totaReqorders > 0 && (
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {totaReqorders}
                                </span>

                                    )
                                }
                            </button>

                        </div>


                        {/* <div className="col-sm-4">
                            <div className="form-group">
                                <label>To</label>
                                <input type="number" placeholder="Enter Last Price" className='form-control' value={lastPrice} onChange={(e) => handleLastPrice(e.target.value)} />
                            </div>
                        </div> */}
                    </div>
                </div>







                <div className="table-responsive">
                    <table className="table data-tables table-hover">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Created on</th>
                                <th>Payment Method</th>
                                <th>Order Method</th>
                                <th>Delivery Date</th>
                                <th>Items</th>
                                {/* <th>Remaining</th> */}
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
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
                                        orders && orders.length > 0 ? (
                                            <tbody>
                                                {orders && orders.map((ele) => (
                                                    <tr key={ele.orderId}>
                                                        <td>{ele.orderId}</td>
                                                        <td>{(new Date(ele.created_at).toISOString().slice(0, 10).split('-').reverse().join('/'))}</td>
                                                        <td className='text-capitalize'>{ele.paymentmethod}</td>
                                                        <td className='text-capitalize'>{ele.order_method}</td>
                                                        <td>{ele.deliver_date === null || ele.deliver_date === "" ? "" : dayjs(ele.deliver_date).format('DD/MM/YYYY, hh:mm A')}</td>
                                                        <td>{ele.products.length}</td>
                                                        {/* <td>₹ {ele.initialDeposit}</td> */}
                                                        {/* <td>₹ {(ele.orderedPrice - ele.initialDeposit).toFixed(2)}</td> */}
                                                        <td>₹ {ele.orderedPrice?.toFixed(2)}</td>
                                                        <td>{ele.paid === true ? "Paid" : "Not Paid"}</td>
                                                        <td>{ele.status === 0 ? (<>
                                                            <button type="button" class="btn btn-accept" onClick={() => handleOpen("Are you sure want to accept the order ?", ele.orderId, 1)}>Accept</button>
                                                            <button type="button" class="btn btn-reject" onClick={() => handleOpen("Are you sure want to reject the order ?", ele.orderId, -1)}>Reject</button>

                                                        </>) : ele.status === 1 ? (

                                                            <button type="button" class="btn btn-process" onClick={() => handleOpen("Are you sure want to process the order ?", ele.orderId, 2)}><p style={{ fontSize: "10px", marginTop: "12px" }}>Start Processing</p></button>

                                                        ) : ele.status === 2 ? (<button type="button" class="btn btn-process" onClick={() => handleOpen("Processing Complete ?", ele.orderId, 3)}><p style={{ fontSize: "10px", marginTop: "12px" }}>Processing...</p></button>) : ele.status === 3 ?

                                                            (<button type="button" class="btn btn-delivery" onClick={() => handleOpen("Ready for delivery ?", ele.orderId, 4)}><p style={{ fontSize: "10px", marginTop: "12px" }}>Ready for delicvery</p></button>) : ele.status === -1 ? (<p style={{ fontSize: "15px", marginTop: "12px", color: "red" }}>Rejected</p>) : (<p style={{ color: "#1F932B" }}>Complete</p>)
                                                        }</td>
                                                        <td class="text-center">
                                                            <span className="view-invoice fs-xs" data-bs-toggle="tooltip"
                                                                data-bs-placement="top"
                                                                title="View Order">
                                                                <VisibilityIcon

                                                                    style={{ color: '#d7783b', cursor: 'pointer' }}
                                                                    onClick={() => getOrderById(ele.orderId, 1)}
                                                                />
                                                            </span>

                                                            <span className="view-invoice fs-xs" data-bs-toggle="tooltip"
                                                                data-bs-placement="top"
                                                                title="Invoice"
                                                                style={{ color: '#d7783b', cursor: 'pointer' }}>
                                                                <ReceiptIcon onClick={() => getOrderById(ele.orderId, 2)} />
                                                            </span>

                                                        </td>

                                                        {/* <td>
                                                            <div class="form-check form-switch">
                                                                <input data-toggle="tooltip" data-placement="top" title="Availability" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" value={ele.active} checked={ele.active} onChange={(e) => handleCheck(e.target.value, ele.productId)} />
                                                            </div>
                                                        </td>
                                                        <td>

                                                            <div className="data-icons">
                                                                <span data-toggle="tooltip" data-placement="top" title="View" style={{ cursor: "pointer" }} onClick={() => hanldleView(ele.productId)}><VisibilityIcon /></span>
                                                                <span data-toggle="tooltip" data-placement="top" title="Edit" style={{ cursor: "pointer" }} onClick={() => hanleNavigate(ele.productId)}><CreateIcon /></span>
                                                                <span data-toggle="tooltip" data-placement="top" title="Delete" style={{ cursor: "pointer" }} onClick={() => hanldleOpen(ele.productId)}><DeleteIcon /></span>
                                                            </div>
                                                        </td> */}

                                                    </tr>
                                                ))}
                                            </tbody>
                                        ) : (
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="text-center">
                                                            No Orders Found
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </>

                            )
                        }

                    </table>

                </div>

            </div>
            <Pagination count={totalPages} variant="outlined" color="secondary" onChange={handlePageChange} />
            {
                viewData && viewData ? (
                    <ViewOrderModal show={modalShow} setModalShow={setModalShow} viewData={viewData} setViewData={setViewData} setLoad={setLoad} setRef={setRef} />
                ) : ("")
            }
            <Dialog
                open={show}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{ fontSize: "larger" }}>
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className="submit" onClick={updateOrder}>Yes</Button>
                    <Button className="submi1" onClick={handleClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            {
                viewData && viewData && invo ? (
                    <Slip invo={invo} setInvo={setInvo} viewData={viewData} setViewData={setViewData} />
                ) : ("")
            }

            {
                directModal ? (
                    <DirectOrder directModal={directModal} setDirectModal={setDirectModal} setRef={setRef} />
                ) : ("")
            }

        </>


    )
}

export default Orders

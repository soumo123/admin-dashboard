import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';


// import { useAlert } from 'react-alert'


const ViewOrderModal = ({ show, setModalShow, viewData, setViewData, setLoad, setRef }) => {

    const dispatch = useDispatch()
    // const alert = useAlert()
    const userId = localStorage.getItem("userId")
    const type = localStorage.getItem("type")
    const shop_id = localStorage.getItem("shop_id");
    const [text, setText] = useState("")
    const [odId, setOdId] = useState("")
    const [status, setStatus] = useState(0)
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const [mod, setMod] = useState(false)
    const steps = [
        'Accept',
        'Processing',
        'Complete',
        'Reday to dispatch'
    ];

    const handleCloseModal = () => {
        setMod(false)
        setModalShow(false)
        setViewData([])
    }
    const handleClose = () => {
        setMod(false);
        setModalShow(false)
        setText("")
        setOdId("")
        setStatus(0)
    }

    const handleOpen = (text, odId, st) => {
        setMod(true);
        setText(text)
        setOdId(odId)
        setStatus(Number(st))
    }

    const updateOrder = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': "application/json",
                },
                withCredentials: true
            }
            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/orders/updateOrder?orderId=${odId}&type=${type}&shopId=${shop_id}&status=${status}`, config)
            if (response.status === 200) {
                setMod(false)
                setModalShow(false)
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

    return (

        <>
            <Modal
                show={show}
                onHide={handleCloseModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        View Order
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <h4>{viewData?.orderId}</h4>
                    <div class="card2 card-1">

                        <div class="card-body">
                            <div class="row justify-content-between mb-3">
                                <div class="col-auto"> <h6 class="color-1 mb-0 change-color">Receipt</h6> </div>
                                {/* <div class="col-auto  "> <small>Receipt Voucher : 1KAU9-84UIL</small> </div> */}
                            </div>
                            {
                                viewData && viewData?.products?.map((ele) => (
                                    <div class="row mt-4">
                                        <div class="col">
                                            <div class="card2 card-2">
                                                <div class="card-body">
                                                    <div class="media">
                                                        <div class="sq align-self-center "> <img class="img-fluid  my-auto align-self-center mr-2 mr-md-4 pl-0 p-0 m-0" src={ele.thumbImage} width="135" height="135" /> </div>
                                                        <div class="media-body my-auto text-right">
                                                            <div class="row  my-auto flex-column flex-md-row">
                                                                <div class="col my-auto"> <h6 class="mb-0">{ele.name}</h6>  </div>
                                                                <div class="col-auto my-auto"> <small>Golden Rim </small></div>
                                                                {/* {ele.weight === "" ? "" : (<div class="col my-auto"> <small>Weight : {ele.weight.map((ele)=>ele.value)}</small></div>)} */}
                                                                {ele.color === "" ? "" : (<div class="col my-auto"> <small>Color : {ele.color}</small></div>)}

                                                                <div class="col my-auto"> <small>Price : ₹ {ele.price}</small></div>
                                                                <div class="col my-auto"> <small>Qty : {ele.itemCount}</small></div>
                                                                <div class="col my-auto"><h6 class="mb-0">&#8377;{ele.totalPrice}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr class="my-3 " />
                                                    {/* <div class="row">
                                                        <div class="col-md-3 mb-3"> <small> Track Order <span><i class=" ml-2 fa fa-refresh" aria-hidden="true"></i></span></small> </div>
                                                        <div class="col mt-auto">
                                                            <div class="progress my-auto"> <div class="progress-bar progress-bar  rounded" style={{ width: "62%" }} role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div> </div>
                                                            <div class="media row justify-content-between ">
                                                                <div class="col-auto text-right"><span> <small class="text-right mr-sm-2"></small> <i class="fa fa-circle active"></i> </span></div>
                                                                <div class="flex-col"> <span> <small class="text-right mr-sm-2">Out for delivary</small><i class="fa fa-circle active"></i></span></div>
                                                                <div class="col-auto flex-col-auto"><small class="text-right mr-sm-2">Delivered</small><span> <i class="fa fa-circle"></i></span></div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div class="row mt-4">
                                <h4>Status</h4>
                                <div className="">
                                    {viewData.status === 0 ? (<>
                                        <button type="button" class="btn btn-accept" onClick={() => handleOpen("Are you sure want to accept the order ?", viewData.orderId, 1)}>Accept</button>
                                        <button type="button" class="btn btn-reject">Reject</button>

                                    </>) : viewData.status === 1 ? (

                                        <button type="button" class="btn btn-process" onClick={() => handleOpen("Are you sure want to process the order ?", viewData.orderId, 2)}><p style={{ fontSize: "10px", marginTop: "12px" }}>Start Processing</p></button>

                                    ) : viewData.status === 2 ? (<button type="button" class="btn btn-process" onClick={() => handleOpen("Processing Complete ?", viewData.orderId, 3)}><p style={{ fontSize: "10px", marginTop: "12px" }}>Processing...</p></button>) : viewData.status === 3 ?

                                        (<button type="button" class="btn btn-delivery" onClick={() => handleOpen("Ready for delivery ?", viewData.orderId, 4)}><p style={{ fontSize: "10px", marginTop: "12px" }}>Ready for delicvery</p></button>) : viewData?.status === -1 ? (<p style={{ fontSize: "15px", marginTop: "12px", color: "red" }}>Order Rejected</p>) : (<p style={{ color: "#1F932B" }}>Complete</p>)
                                    }
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col">
                                    <div class="row justify-content-between">
                                        <div class="flex-sm-col text-right col"><p class="mb-1"> <b>Order Type</b></p> </div>
                                        <div class="flex-sm-col col-auto"><p class="mb-1">{viewData?.order_method}</p></div>
                                    </div>
                                    {
                                        viewData?.deliver_date === null || viewData?.deliver_date==="" ? (""):(
                                            <div class="row justify-content-between">
                                            <div class="flex-sm-col text-right col"><p class="mb-1"> <b>Delivery Date</b></p> </div>
                                            <div class="flex-sm-col col-auto"><p class="mb-1">{dayjs(viewData?.deliver_date).format('DD/MM/YYYY, hh:mm A')}</p></div>
                                        </div>
                                        )
                                    }
                                   
                                    <div class="row justify-content-between">
                                        <div class="flex-sm-col text-right col"><p class="mb-1"> <b>Additional Items</b></p> </div>
                                        <div class="flex-sm-col col-auto"><p class="mb-1">{viewData?.extrathings}</p></div>
                                    </div>
                                    <div class="row justify-content-between">
                                        <div class="flex-sm-col text-right col"><p class="mb-1"> <b>Extra Price</b></p> </div>
                                        <div class="flex-sm-col col-auto"><p class="mb-1">&#8377;{viewData?.extraprice}</p></div>
                                    </div>
                                    <div class="row justify-content-between">
                                        <div class="flex-sm-col text-right col"><p class="mb-1"> <b>Discount</b></p> </div>
                                        <div class="flex-sm-col col-auto"><p class="mb-1">{viewData?.discount} %</p></div>
                                    </div>
                                    <div class="row justify-content-between">
                                        {/* <div class="col-auto"><p class="mb-1 text-dark"><b>Order Details</b></p></div> */}
                                        <div class="flex-sm-col text-right col"> <p class="mb-1"><b>SGST</b></p> </div>
                                        <div class="flex-sm-col col-auto"> <p class="mb-1">&#8377;{viewData?.cgst?.toFixed(2)}</p> </div>
                                    </div>
                                    <div class="row justify-content-between">
                                        <div class="flex-sm-col text-right col"><p class="mb-1"> <b>CGST</b></p> </div>
                                        <div class="flex-sm-col col-auto"><p class="mb-1">&#8377;{viewData?.cgst?.toFixed(2)}</p></div>
                                    </div>
                                    <div class="row justify-content-between">
                                        <div class="flex-sm-col text-right col"><p class="mb-1"><b>Initial Deposit</b></p></div>
                                        <div class="flex-sm-col col-auto"><p class="mb-1">- {viewData?.initialDeposit}</p></div>
                                    </div>
                                    <div class="row justify-content-between">
                                        <div class="flex-sm-col text-right col"><p class="mb-1"><b>Total</b></p></div>
                                        <div class="flex-sm-col col-auto"><p class="mb-1">₹ {viewData?.orderedPrice?.toFixed(2)}</p></div>
                                    </div>
                                    {/* <div class="row justify-content-between">
                                        <div class="flex-sm-col text-right col"><p class="mb-1"><b>Remaining</b></p></div>
                                        <div class="flex-sm-col col-auto"><p class="mb-1">₹{(viewData?.orderedPrice - viewData?.initialDeposit)?.toFixed(2)}</p></div>
                                    </div> */}
                                </div>
                            </div>
                            {/* <div class="row invoice ">
                                <div class="col"><p class="mb-1"> Invoice Number : 788152</p><p class="mb-1">Invoice Date : 22 Dec,2019</p><p class="mb-1">Recepits Voucher:18KU-62IIK</p></div>
                            </div> */}
                        </div>
                        {/* <div class="card-footer">
                            <div class="jumbotron-fluid">
                                <div class="row justify-content-between ">
                                    <div class="col-sm-auto col-auto my-auto"><img class="img-fluid my-auto align-self-center " src="https://i.imgur.com/7q7gIzR.png" width="115" height="115" /></div>
                                    <div class="col-auto my-auto "><h2 class="mb-0 font-weight-bold">TOTAL PAID</h2></div>
                                    <div class="col-auto my-auto ml-auto"><h1 class="display-3 ">&#8377; 5,528</h1></div>
                                </div>
                                <div class="row mb-3 mt-3 mt-md-0">
                                    <div class="col-auto border-line"> <small class="text-white">PAN:AA02hDW7E</small></div>
                                    <div class="col-auto border-line"> <small class="text-white">CIN:UMMC20PTC </small></div>
                                    <div class="col-auto "><small class="text-white">GSTN:268FD07EXX </small> </div>
                                </div>
                            </div>
                        </div> */}
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Dialog
                open={mod}
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
        </>
    )
}

export default ViewOrderModal
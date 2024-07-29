import React, { useRef, useState, useEffect } from 'react'
import '../css/reciept.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useReactToPrint } from 'react-to-print';
import '../css/reciept.css'
import axios from 'axios'


const TransactionSlip = ({ recShow, setRecShow, agId, shop_id, transactionId }) => {

    const slipRef = useRef();

    const handleCloseModal = () => {
        setRecShow(false)
    }
    const handlePrint = useReactToPrint({
        content: () => slipRef.current,
    });

    const [tranData, setTranData] = useState([])

    const viewTranstion = async (req, res) => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/view_transaction?agentId=${agId}&shop_id=${shop_id}&transaction_id=${transactionId}`)
            if (response.status === 200) {
                setTranData(response.data.data)
            }

        } catch (error) {
            console.log(error)
            setTranData([])
        }
    }

    useEffect(() => {
        if (agId && shop_id && transactionId) {
            viewTranstion()
        }
    }, [agId,
        shop_id,
        transactionId])

    console.log("tranData", tranData)
    return (
        <>
            <Modal
                show={recShow}
                onHide={handleCloseModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Generate Bill
                        <div className='col'>
                            <button type="button" class="btn btn-accept" onClick={handlePrint}>Print</button>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>

                    <div ref={slipRef} className="receipt">
                        <div className="header1">
                            <h1>Creamy Affairs</h1>
                            <p>75/3,G.T Road, Baidyabati, Hooghly<br />Baidyabati, West Bengal - 712222<br />Mobile No: 7003357288<br />GSTIN: 19BOCPP3213B1ZE</p>
                        </div>
                        <div className="info">
                            <p>Invoice(Reprint)</p>
                            <p>Takeaway</p>
                            <p><strong>Id No: {tranData ? tranData?.transaction_id : ""}</strong></p>

                            <p>{Object.keys(tranData).length===0 ? ("") : (new Date(tranData?.order_date).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', ''))}</p>
                        </div>
                        <div className="items">
                            <table class="main-table" style={{ fontSize: "6px" }}>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Variant</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tranData ? tranData?.products?.map((ele) => (
                                            <tr>
                                                <td>{ele.productName}</td>
                                                <td>
                                                    <table class="sub-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Weight</th>
                                                                <th>Quantity</th>
                                                                <th>Price</th>
                                                                <th>Total Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                ele?.weight?.map((item) => (
                                                                    <tr>
                                                                        <td>{item.weight} {ele.unit}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td>₹ {item.price}</td>
                                                                        <td>₹ {item.quantity * item.price}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </td>

                                            </tr>
                                        )) : ("")
                                    }


                                </tbody>
                            </table>
                        </div>
                        <div className="total">
                            <p>Total Price: <span>₹ {tranData?.totalAmount?.toFixed(2)}</span></p>
                            <p>Balance: <span>₹ {tranData?.balance?.toFixed(2)}</span></p>
                        </div>

                            {
                              tranData && tranData?.paymentInfo?.length > 0 ? (
                                <div className="payment">
                                <p><u>Last Payment : </u></p>
                                <div className="row">
                                    <div className="col-6">
                                        pay
                                       {
                                        tranData && tranData?.paymentInfo?.map((item)=>(
                                           <p>₹ {item.pay}  ------------ </p> 
                                        ))
                                       }
                                    </div>
                                    <div className="col-6">
                                        date
                                        {
                                        tranData && tranData?.paymentInfo?.map((item)=>(
                                           <p style={{fontSize:"11px"}}>{(new Date(item.date).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', ''))}</p> 
                                        ))
                                       }
                                    </div>
                                </div>
                            </div>
                              ):(<p style={{fontSize:"12px",textAlign:"center"}}>No Payemnt History</p>)   
                            }
                       
                        <div className="tax">
                            <p>Paid<span>{tranData?.paid===true ? (<p style={{fontSize:"12px",color:"green"}}>Paid Done</p>) :(<p style={{fontSize:"12px",color:"red"}}>Not Full Paid</p>)}</span></p>
                           
                         
                        </div>
                        <div className="footer">
                            <p>Thank You!</p>
                            <p>Powered by www.dotpe.in</p>
                        </div>
                    </div>


                </Modal.Body>
            </Modal>

        </>
    )
}

export default TransactionSlip
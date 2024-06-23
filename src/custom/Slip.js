import React, { useRef } from 'react'
import '../css/reciept.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useReactToPrint } from 'react-to-print';

const Slip = ({ invo, setInvo, viewData }) => {
    const slipRef = useRef();
    const handleCloseModal = () => {
        setInvo(false)
    }
    const handlePrint = useReactToPrint({
        content: () => slipRef.current,
    });

    console.log("viewDataviewData", viewData)
    return (
        <>
            <Modal
                show={invo}
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
                <Modal.Body>
                    <div className="App" ref={slipRef} >

                        <div className='row justify-content-center'>
                            <div class="receipt" >
                                <header class="receipt-header">
                                    <img src="	https://shopcake.s3.ap-south-1.amazonaws.com/logo.png" alt="QR Code" class="qr-code" />
                                    <p>------------- RECEIPT ------------</p>
                                    <div class="receipt-info">
                                        <div>
                                            <p>Shop Name : Creamy affairs</p>
                                            {/* <p>Cashier: #3</p> */}
                                        </div>
                                        <div>
                                            <p>Shop Address  :  Baidyabati</p>
                                            <p>Date : { viewData && viewData.length === 0 ? ("") : ((new Date(viewData?.updated_at).toISOString().slice(0, 10).split('-').reverse().join('/')))}</p>
                                             <p>Time : {viewData && viewData.length === 0 ? ("") : (new Date(viewData?.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))} </p>      
                                            {/* <p>Date: {viewData && viewData ? (new Date(viewData?.updated_at).toISOString().slice(0, 10).split('-').reverse().join('/')):("")}</p> */}
                                        </div>
                                    </div>
                                    <p>----------------------------------</p>
                                </header>
                                <div class="receipt-body">
                                    <table class="receipt-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                viewData && viewData.length === 0 ? ("") : (
                                                    <>
                                                        {
                                                            viewData && viewData?.products.map((ele) => (
                                                                <tr>
                                                                    <td>{ele.name}</td>
                                                                    <td>{ele.itemCount}</td>
                                                                    <td>₹ {ele.totalPrice}</td>
                                                                </tr>
                                                            ))
                                                        }

                                                    </>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    <p>----------------------------------</p>
                                </div>
                                <div class="receipt-total">
                                    <p>Tax: ₹ {viewData?.tax}</p>
                                    <p>Shipping Cost: ₹ {viewData?.shippingPrice}</p>
                                    <p>Total Price</p>
                                    <h2>₹ {viewData?.orderedPrice}</h2>
                                    <p>Initial Deposit : ₹ {viewData?.initialDeposit}</p>
                                    <p>Remaining Price</p>
                                    <h2>₹ {viewData?.orderedPrice - viewData?.initialDeposit}</h2>
                                    <p>Paid : {viewData?.paid===true ? (<span style={{color:"green"}}>Sucessfull</span>) : (<span style={{color:"red"}}>Not Paid</span>)}</p>
                
                                </div>
                                <footer class="receipt-footer">
                                    <p>----------------------------------</p>
                                    <p>THANK YOU!</p>
                                    <img src="https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs2/144091941/original/931441fa8639bd21f58c5bd33af4c9f5245d9238/qr-code-in-100-rs-only.png" alt="QR Code" class="qr-code" />
                                </footer>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Slip
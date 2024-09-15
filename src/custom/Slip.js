import React, { useRef ,useState,useEffect} from 'react'
import '../css/reciept.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useReactToPrint } from 'react-to-print';
import '../css/reciept.css'
import axios from 'axios'

const Slip = ({ invo, setInvo, viewData }) => {
    const slipRef = useRef();
    const handleCloseModal = () => {
        setInvo(false)
    }
    const handlePrint = useReactToPrint({
        content: () => slipRef.current,
    });

    const [sgst, setSgst] = useState(0)
    const [cgst, setCgst] = useState(0)
    const [value1, setValue1] = useState(0)
    const [value2, setValue2] = useState(0)


    const getTax = async () => {

        try {
          const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_tax`);
          if (response.status === 200) {
            setSgst(response.data.data.sgst)
            setCgst(response.data.data.cgst)
            setValue1(response.data.data.sgstvalue)
            setValue2(response.data.data.cgstvalue)
          }
    
        } catch (error) {
          console.log(error)
          setSgst(0)
          setCgst(0)
          setValue1(0)
          setValue2(0)
        }
    
    
      }
    
      useEffect(() => {
        getTax()
      }, [])
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
                <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>

                    <div ref={slipRef} className="receipt">
                        <div className="header1">
                            <h1>Creamy Affairs</h1>
                            <p>75/3,G.T Road, Baidyabati, Hooghly<br />Baidyabati, West Bengal - 712222<br />Mobile No: 7003357288<br />GSTIN: 19BOCPP3213B1ZE</p>
                        </div>
                        <div className="info">
                            <p>Invoice(Reprint)</p>
                            <p>Takeaway</p>
                            <p><strong>Token No: {viewData?.orderId}</strong></p>
                            {/* <p>Invoice(Reprint) 598</p> */}
                            <p>{viewData && viewData.length === 0 ? ("") : (new Date(viewData?.updated_at).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', ''))}</p>
                        </div>
                        <div className="items">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Qty</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
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
                                                            <td>₹ {ele.price}</td>
                                                            <td>₹ {ele.totalPrice}</td>

                                                        </tr>
                                                    ))
                                                }
                                            </>
                                        )
                                    }
                                    {/* <tr>
                                        <td>Jumbo Vanilla Cup (110 Ml)</td>
                                        <td>1</td>
                                        <td>25</td>
                                        <td>25.00</td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                        <div className="total">
                            <p>Extra Items: <span>{viewData?.extrathings}</span></p>

                            <p>Additional Price: <span>₹ {viewData?.extraprice?.toFixed(2)}</span></p>
                            <p>Discount: <span>{viewData?.discount} %</span></p>
                            <div className="tax">
                            <p>Tax Summary</p>
                            <p>CGST {cgst}%: <span>{viewData?.cgst?.toFixed(2)}</span></p>
                            <p>SGST {sgst}%: <span>{viewData?.sgst?.toFixed(2)}</span></p>
                        </div>
                            {
                                viewData?.initialDeposit === 0 ? (""):    
                                <>
                                {
                                    viewData?.paid ? (
                                        ""
                                    ):(
                                        <p>Cash: <span>- ₹ {viewData?.initialDeposit}</span></p>
                                    )
                                }
                                </>
                               

                            }
                        
                            <p>Sub Total: <span>₹ {viewData?.orderedPrice?.toFixed(2)}</span></p>
                          
                        </div>
                        <div className="bill-total">
                            <p>Bill Total: <span>₹ {viewData?.orderedPrice?.toFixed(2)}</span></p>
                        </div>
                        {/* <div className="payment">
                            <p>Payment Summary</p>
                            <p>Cash: <span>₹ {viewData?.initialDeposit}</span></p>
                            <p>Today Pay: <span>₹ {viewData?.orderedPrice?.toFixed(2) - viewData?.initialDeposit}</span></p>
                            <p>Balance: <span>₹ {(viewData?.orderedPrice?.toFixed(2) - viewData?.initialDeposit) - (viewData?.orderedPrice?.toFixed(2) - viewData?.initialDeposit)}.00</span></p>

                        </div> */}
                    
                        <div className="footer">
                            <p>Thank You!</p>
                            {/* <p>Powered by www.dotpe.in</p> */}
                        </div>
                    </div>


                </Modal.Body>
            </Modal>

        </>
    )
}

export default Slip
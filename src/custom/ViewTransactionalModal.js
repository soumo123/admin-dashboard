import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'

const ViewTransactionalModal = ({ viewTranModal, setVewTranMiodal, agId, shop_id, transactionId }) => {

  const [tranData, setTranData] = useState([])
  const handleClose = () => {
    setVewTranMiodal(false)
  }

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

// console.log("tranData",tranData)
  return (
    <>
      <Modal
        show={viewTranModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            View Transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <div class="row">
          <div class="col">
            <div class="">
             {
              tranData && tranData ? (
              <>
              {
                tranData?.products?.map((ele)=>(
                  <>
                  <p>Product Name : {ele.productName}</p>
                  <div className=''>
                  {
                    ele?.weight?.map((item)=>(
                      <span>
                      <p>Weight :{item.weight}</p>
                      <p>Quantity : {item.quantity}</p>
                      <p>Price :  ₹ {item.price}</p>
                      </span>
                    ))
                  }
                   </div>
                 
                  </>
                ))
              }
              
              </>
              
            ):("")
             }
             {
              tranData?.returncost===0 ? (""):(
              <h3>Return Cost :  ₹ {tranData?.returncost}</h3>

              ) 
             }
              <h3>Total Price :  ₹ {tranData?.totalAmount}</h3>
              <h3>Balance :  ₹ {tranData?.balance}</h3>
              <h3>Paid :  ₹ {tranData?.paid ? "Paid" :"Not Paid"}</h3>

              <div className='history'>
                {
                  tranData?.paymentInfo?.map((ele)=>(
                    <div className=''>

                    <p>Pay - {ele.pay}</p>
                    <p>Date - {ele.date}</p>
</div>
                  ))
                }
              </div>
            </div>
          </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ViewTransactionalModal





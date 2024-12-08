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
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            View Transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <div className="row">
            <div className="col-12">
              {tranData ? (
                <>
                  <div className="mb-4">
                    <h5 className="text-primary fw-bold mb-3">Products</h5>
                    {tranData.products?.map((product, index) => (
                      <div
                        key={index}
                        className="mb-3 border-bottom pb-3"
                        style={{ paddingBottom: "1rem" }}
                      >
                        <h6 className="fw-bold">{product.productName}</h6>
                        <div className="ms-3">
                          {product.weight?.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="d-flex justify-content-between align-items-center mb-2"
                            >
                              <span>Weight: {item.weight} {product.unit}</span>
                              <span>Quantity: {item.quantity}</span>
                              <span className="text-success fw-semibold">
                                Price: ₹ {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {tranData.returncost > 0 && (
                    <h5 className="text-danger mb-3">
                      Return Cost: ₹ {tranData.returncost}
                    </h5>
                  )}

                  <div className="border-top pt-3">
                    <h5>
                      Total Price:{" "}
                      <span className="text-success fw-bold">₹ {tranData.totalAmount}</span>
                    </h5>
                    <h5>
                      Balance:{" "}
                      <span className="text-warning fw-bold">₹ {tranData.balance}</span>
                    </h5>
                    <h5>
                      Paid Status:{" "}
                      <span
                        className={`fw-bold ${tranData.paid ? "text-success" : "text-danger"
                          }`}
                      >
                        {tranData.paid ? "Paid" : "Not Paid"}
                      </span>
                    </h5>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-primary fw-bold mb-3">Payment History</h5>
                    {tranData.paymentInfo?.map((payment, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between border-bottom py-2"
                      >
                        <span>Amount Paid: ₹ {payment.pay}</span>
                        <span className="text-muted">{payment.date}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-muted">No Transaction Data Available</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default ViewTransactionalModal





import React, { useState, useEffect } from 'react';
import axios from 'axios'
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Message from '../custom/Message';
import ViewTransactionalModal from '../custom/ViewTransactionalModal';
import '../css/view.css'
import TransactionSlip from '../custom/TransactionSlip';

const Transaction = () => {
  const [expanded, setExpanded] = useState(false);
  const [transactions, setTransationData] = useState({})
  const [agentData, setAgentData] = useState([]);
  const [show, setShow] = useState(false)
  const [recShow, setRecShow] = useState(false)
  const adminId = localStorage.getItem("adminId");
  const shop_id = localStorage.getItem("shop_id");
  const [agId, setAgId] = useState("")
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0)
  const [pay, setPay] = useState(0)
  const [transactionId, setTransactionId] = useState("")
  const [message, setMessage] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [loader, setLoader] = useState(false)
  const [ref, setRef] = useState(false)
  const [viewTranModal, setVewTranMiodal] = useState(false)
  const [totalUnpaid, setTotalUnpaid] = useState(0)
  const [totalpaid, setTotalpaid] = useState(0)

  const [total, setTotal] = useState(0)
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0)
  const [totalpaidAmount, setTotalpaidAmount] = useState(0)

  const adminToken = localStorage.getItem("adminToken")


  const handleRowClick = (e) => {
    if (e.target.closest('.icon')) {
      return;
    }
    setExpanded(!expanded);
  };

  const handleSetData = (total, balance, id) => {
    setShow(true)
    setTotalAmount(Number(total))
    setTotalBalance(Number(balance))
    setTransactionId(id)
  }
  const handleRecieptSetData = (total, balance, id) => {
    setRecShow(true)
    setTotalAmount(Number(total))
    setTotalBalance(Number(balance))
    setTransactionId(id)
  }


  const renderTransactionRow = (transaction) => (
    <tr
      key={transaction?._id}
      style={{ backgroundColor: '#8B3A3A', color: 'white', cursor: 'pointer' }}
      onClick={handleRowClick}
    >
      <td>{transaction?.transaction_id}</td>
      <td>{transaction?.distributorId}</td>
      <td>{transaction?.distributorName}</td>
      <td>₹ {transaction?.totalAmount}</td>
      <td>₹ {transaction?.pay}</td>
      <td>₹ {transaction?.balance}</td>
      <td>{transaction?.paid ? 'Yes' : 'No'}</td>
      <td>{new Date(transaction?.order_date).toLocaleDateString()}</td>
      <td>
        <span className="icon"><RemoveRedEyeIcon onClick={() => handleOpenTranModal(transaction?.transaction_id)} /></span>
        {transaction?.paid ? ("") : (
          <span className="icon" onClick={() => handleSetData(transaction?.totalAmount, transaction?.balance, transaction?.transaction_id)}><PaidIcon /></span>
        )}
        <span className="icon"><ReceiptIcon onClick={() => handleRecieptSetData(transaction?.totalAmount, transaction?.balance, transaction?.transaction_id)} /></span>
      </td>
    </tr>
  );

  const handleSelectAgentId = (e) => {
    setAgId(e)
  }
  const getTrsanctions = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_transtion?agentId=${agId}&shop_id=${shop_id}`)
      if (result.status === 200) {
        setTransationData(result.data.data)
        setTotalUnpaid(result.data.data.totalUenpaidTransaction)
        setTotalpaid(result.data.data.totalPaidTransaction)
        setTotal(result.data.data.totalAmount)
        setTotalUnpaidAmount(result.data.data.totalUnpaidAmount)
        setTotalpaidAmount(result.data.data.totalPaidAmount)
      }
    } catch (error) {
      setTransationData({})
      setTotalUnpaid(0)
      setTotalpaid(0)
      setTotal(0)
      setTotalUnpaidAmount(0)
      setTotalpaidAmount(0)
    }

  }

  const getAllAgents = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      }
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_al_agents?shop_id=${shop_id}&key=&statustype=1&adminId=${adminId}`, config);
      if (response.status === 200) {
        setAgentData(response.data.data);
      } else {
        setAgentData([]);
      }
    } catch (error) {
      setAgentData([]);
    }
  };

  const handleClose = () => {
    setShow(false)
    setPay(0)
    setTotalAmount(0)
    setTotalBalance(0)
  }

  const hamdlePayChange = (e) => {
    if (e > totalBalance) {
      setPay(0)
    } else {
      setPay(e)
    }
  }
  useEffect(() => {
    getAllAgents()
  }, [])


  const handleOpenTranModal = (e) => {
    setVewTranMiodal(true)
    setTransactionId(e)
  }


  const updatePayemnt = async (req, res) => {

    try {
      setLoader(true)
      const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/update_transction?pay=${pay}&agentId=${agId}&shop_id=${shop_id}&transaction_id=${transactionId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 201) {
        setMessageType("success");
        setMessage("Amount Deposit");
        setLoader(false)
        setRef((new Date().getSeconds()))
        setShow(false)
        setPay(0)
        setTotalAmount(0)
        setTotalBalance(0)
        setTimeout(() => {
          setMessage(false);
        }, 2000);
      }

    } catch (error) {
      console.log(error)
      setMessageType("error");
      setMessage("Ooops..Something went wong");
      setLoader(false)
      setTimeout(() => {
        setMessage(false);
      }, 2000);
    }
  }

  useEffect(() => {

    getTrsanctions()

  }, [ref, agId])


  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <h1>Transaction Details</h1>

      <div className="container-fluid">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6 col-lg-3">
            <label className="fw-bold fs-6">Distributor Name:</label>
            <select
              className="form-control"
              value={agId}
              onChange={(e) => handleSelectAgentId(e.target.value)}
            >
              <option value="">Select agent id</option>
              {agentData &&
                agentData.map((ele) => (
                  <option key={ele.agentId} value={ele.agentId}>
                    {`${ele.agent_name}(${ele.agentId})`}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <label className="fw-semibold fs-6">Total Unpaid Transaction:</label>
            <h5 className="text-primary">{totalUnpaid}</h5>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <label className="fw-semibold fs-6">Total Paid Transaction:</label>
            <h5 className="text-success">{totalpaid}</h5>
          </div>

          <div className="col-6 col-md-4 col-lg-1">
            <label className="fw-semibold fs-6">Total Bill Amount:</label>
            <h5>₹ {total}</h5>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <label className="fw-semibold fs-6">Total Paid Bill Amount:</label>
            <h5 className="text-success">₹ {totalpaidAmount}</h5>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <label className="fw-semibold fs-6">Total Unpaid Bill Amount:</label>
            <h5 className="text-danger">₹ {totalUnpaidAmount}</h5>
          </div>
        </div>

        <div className="row mt-4">
          {Object.keys(transactions).length ? (
            // Scrollable table for mobile
            <div className="table-container">
              <table className="table custom-table-header table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Transaction Id</th>
                    <th>Distributor Id</th>
                    <th>Distributor Name</th>
                    <th>Total Amount</th>
                    <th>Pay</th>
                    <th>Remaining</th>
                    <th>Paid</th>
                    <th>Transaction Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTransactionRow(transactions.lastTransaction)}
                  {expanded && transactions.remainingTransactions.length > 0 ? (
                    transactions.remainingTransactions.map(renderTransactionRow)
                  ) : (
                    expanded && (
                      <tr>
                        <td
                          colSpan="9"
                          style={{
                            backgroundColor: 'rgb(157 123 123)',
                            color: 'white',
                            textAlign: 'center',
                          }}
                        >
                          No previous transactions found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="container text-center py-4">
              <div className="text-muted fs-5 fw-semibold">No Transactions Found</div>
            </div>
          )}
        </div>
      </div>



      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose} // Ensures the modal closes on clicking the cross icon
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="d-flex align-items-center">
            <PaidIcon className="me-2 text-primary" />
            <span>Amount Deposit</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Total Amount</label>
              <input
                className="form-control"
                type="number"
                value={totalAmount}
                readOnly
                style={{ backgroundColor: "#f9f9f9" }}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Balance</label>
              <input
                className="form-control"
                type="number"
                value={totalBalance - pay}
                readOnly
                style={{ backgroundColor: "#f9f9f9" }}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Current Deposit</label>
              <input
                className="form-control"
                type="number"
                value={pay}
                onChange={(e) => hamdlePayChange(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btnSubmit"
              onClick={updatePayemnt}
              disabled={loader}
            >
              {loader ? "Processing..." : "Pay"}
            </button>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>

      {
        viewTranModal ? (
          <ViewTransactionalModal viewTranModal={viewTranModal} setVewTranMiodal={setVewTranMiodal} agId={agId} shop_id={shop_id} transactionId={transactionId} />
        ) : ("")
      }

      {
        recShow ? (
          <TransactionSlip recShow={recShow} setRecShow={setRecShow} agId={agId} shop_id={shop_id} transactionId={transactionId} />
        ) : ("")
      }
    </>
  );
};

export default Transaction;

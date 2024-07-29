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
  const[recShow,setRecShow] = useState(false)
  const shop_id = localStorage.getItem("id");
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
  const handleRecieptSetData = (total, balance, id)=>{
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
        <span className="icon"><RemoveRedEyeIcon onClick={()=>handleOpenTranModal(transaction?.transaction_id)} /></span>
        <span className="icon" onClick={() => handleSetData(transaction?.totalAmount, transaction?.balance, transaction?.transaction_id)}><PaidIcon /></span>
        <span className="icon"><ReceiptIcon onClick={() => handleRecieptSetData(transaction?.totalAmount, transaction?.balance, transaction?.transaction_id)}/></span>
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
      }
    } catch (error) {
      setTransationData({})
    }

  }

  const getAllAgents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_al_agents?shop_id=${shop_id}&key=`);
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
    if (agId) {

      getTrsanctions()
    } else {
      setTransationData({})
    }
  }, [ref, agId])


  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <h1>Transaction Details</h1>

      <div>
        <div className='col-md-3'>
          <label style={{ fontSize: "18px", fontWeight: "600" }}>Distributor Name : </label>
          <select class="form-control" value={agId} onChange={(e) => handleSelectAgentId(e.target.value)} >
            <option value="">Select agent id</option>

            {
              agentData && agentData.map((ele) => (
                <option key={ele.agentId} value={ele.agentId}>{`${ele.agent_name}(${ele.agentId})`}</option>

              ))
            }
          </select>
        </div>

        {
          Object.keys(transactions).length ? (
            <table className="transaction-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
              <thead>
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
                      <td colSpan="9" style={{ backgroundColor: '#B56565', color: 'white', textAlign: 'center' }}>
                        No previous transactions found
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="text-center" style={{ fontSize: "18px", fontWeight: "600" }}>
                    No Transactions Found
                  </div>
                </div>
              </div>
            </div>

          )
        }

      </div>

      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <PaidIcon /> Amount Deposit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='col'>
            <div className='col-md-4'>
              <label>Total Amount</label>
              <input class="form-control" type="number" value={totalAmount} readonly />
            </div>
            <div className='col-md-4'>
              <label>Balance</label>
              <input class="form-control" type="number" value={totalBalance - pay} readonly />
            </div>
            <div className='col-md-4'>
              <label>Current Deposit</label>
              <input class="form-control" type="number" value={pay} onChange={(e) => hamdlePayChange(e.target.value)} />
            </div>
          </div>
          <Button className="mt-3" type="submit" onClick={updatePayemnt} disabled={loader ? true : false}>{loader ? "Processong.." : "Pay"}</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>

      {
        viewTranModal ? (
          <ViewTransactionalModal viewTranModal={viewTranModal} setVewTranMiodal={setVewTranMiodal} agId={agId} shop_id={shop_id} transactionId={transactionId} />
        ) : ("")
      }

      {
          recShow ? (
            <TransactionSlip recShow={recShow} setRecShow={setRecShow} agId={agId} shop_id={shop_id} transactionId={transactionId} />
          ):("")
      }
    </>
  );
};

export default Transaction;

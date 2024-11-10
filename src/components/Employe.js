import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '@mui/material/Pagination';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Message from '../custom/Message';

const Employe = () => {
  const navigate = useNavigate()
  const [emps, setEmps] = useState([])
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0)
  const adminId = localStorage.getItem("adminId")
  const type = localStorage.getItem("type")
  const shop_id = localStorage.getItem("shop_id")
  const [totalPages, setTotalPages] = useState(0);
  const adminToken = localStorage.getItem("adminToken")
  const [loader, setloader] = useState(false);
  const [employeeId, setEmployeeId] = useState("")
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [loader1, setLoader1] = useState(false)
  const[totalCount,setTotalCount]=useState(0)

  const handleAddEmp = () => {
    navigate("/addemp")
  }
  const hanldleOpen = (id) => {
    setOpen(true)
    setEmployeeId(id)
  }
  const handleClose = () => {
    setOpen(false);
    setEmployeeId("")
  }
  const handlePageChange = (event, value) => {
    setOffset((value - 1) * limit);
  };

  const handleNavigateEdit = (id) => {
    navigate(`/editemp/${id}`)
  }

  const deleteEmp = async () => {

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };
      const response = await axios.delete(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/deleteemp?adminId=${adminId}&shop_id=${shop_id}&empId=${employeeId}`, config)
      if (response.status === 200) {
        setOpen(false)
        setMessageType("success")
        setMessage("Employee Deleted")
        setEmployeeId("")
        setLoader1(new Date().getMilliseconds())
        setTimeout(() => {
          setMessage(false)
        }, 2000);
      }

    } catch (error) {
      setOpen(false)
      setMessageType("error")
      setMessage("Employee Not Deleted")
      setTimeout(() => {
        setMessage(false)
      }, 2000);
    }

  }

  const getAllEmp = async () => {

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/getemp?adminId=${adminId}&limit=${limit}&offset=${offset}&shop_id=${shop_id}`, config)
      if (response.status === 200) {
        setloader(true)
        setEmps(response.data.data)
        setTotalCount(response.data.totalData)
        setTotalPages(Math.ceil(response.data.totalData / limit));
      }

    } catch (error) {
      setloader(true)
      setEmps([])
      setTotalPages(0)
      console.log(error.stack)
    }

  }


  useEffect(() => {
    getAllEmp()
  }, [loader1])




  return (
    <>

      <div className={`all-product`}>
        <h3>Employees</h3>
        <div className='form'>
          <div className="row">
            <div className="col-sm-9">
              <label>Total : {totalCount}</label>
            </div>
            <div className="col-sm-3">
              <div className="form-group">

                <button data-toggle="tooltip" data-placement="top" title="Add Tag" className="btnSubmit" type="button" onClick={handleAddEmp}>
                  + Add employee
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive-lg">
          <table className="table data-tables">
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>State</th>
                <th>City</th>
                <th>Pincode</th>
                <th>Actions</th>
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
                    emps && emps.length > 0 ? (
                      <tbody>
                        {emps && emps.map((ele, index) => (
                          <tr key={index}>
                            <td>
                              {ele.emp_id}
                            </td>
                            <td>
                              <div className="">
                                <img src={ele.logo} style={{ width: '50%', height: '50%' }} />
                              </div>
                            </td>
                            <td>
                              {ele.fname} {ele.lname}
                            </td>
                            <td>
                              {ele.phone}
                            </td>
                            <td>
                              {ele.email}
                            </td>
                            <td>
                              {ele.address}
                            </td>
                            <td>
                              {ele.state}
                            </td>
                            <td>
                              {ele.city}
                            </td>
                            <td>
                              {ele.zip}
                            </td>
                            <td>

                              <span data-toggle="tooltip" data-placement="top" title="Edit" style={{ cursor: "pointer" }} onClick={() => handleNavigateEdit(ele.emp_id)}><CreateIcon /></span>
                              <span data-toggle="tooltip" data-placement="top" title="Remove" style={{ cursor: "pointer" }} onClick={() => hanldleOpen(ele.emp_id)}><DeleteIcon /></span>

                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <div className="text-center">
                              No employees Found
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  <Pagination count={totalPages} variant="outlined" color="secondary" onChange={handlePageChange} />
                </>
              )
            }

          </table>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete the employee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteEmp} variant="contained" color="secondary">Yes</Button>
          <Button onClick={handleClose} variant="contained" color="primary" autoFocus>No</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Employe
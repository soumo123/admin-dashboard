import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import '../css/main.css'
import { noteRefs } from '../redux/actions/userAction'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
// import EditTag from "./EditTag";
import Message from '../custom/Message';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import Editplatform from "./Editplatform";

const Platforms = () => {
  const dispatch = useDispatch()
  const dataRefe = useSelector((state) => state.noteRef.arr);
  const [ShowAddTag, setShowAddTag] = useState(false)
  const [name, setName] = useState("")
  const [allTags, setAllTags] = useState([])
  const [error, setError] = useState(false)
  const [tagId, setTagId] = useState("")
  const [deleteModal, setDeleteModal] = useState(false)
  const [edit, setEdit] = useState(false)
  const [editName, seteditName] = useState("")
  const [editId, setEditId] = useState("")
  const [editImage, setEditImage] = useState("")
  const adminId = localStorage.getItem("adminId");
  const shop_id = localStorage.getItem("shop_id");
  const type = localStorage.getItem("type");
  const [loader, setloader] = useState(false);
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [imagePreview, setImagePreview] = useState("./default.jpg")
  const [disabled, setDisabled] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [err, setErr] = useState(false)
  const [platname, setPlatName] = useState("")
  const [platActive, setPlatActivate] = useState(false)

  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0)
  const adminToken = localStorage.getItem("adminToken")

  const handlePlatnameChange = (e) => {
    setErr(false);

    const value = e.target.value;

    // Regular expression to allow only non-numeric characters
    if (/^[^0-9]*$/.test(value)) {
      setPlatName(value);
    }
  };
  const handlePlatactivateChange = (e) => {
    setErr(false)
    // setFormsData({ ...formsdata, [e.target.name]: e.target.value });
    setPlatActivate(e.target.checked)
  };



  const handleCloseInvite = () => {
    setShowAddTag(false)
    setName("")
    setPlatName("")
    setPlatActivate(false)
    setErr(false)

  }

  const handleModalClose = () => {
    setDeleteModal(false)
    setTagId("")
    setErr(false)

  }


  const handleOpenTagModal = (id) => {
    setDeleteModal(true)
    setTagId(id)
  }
  const handleName = (e) => {
    setName(e)

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!platname) {
        setErr(true)
        return
      }
      setDisabled(true)

      let json = {
        name: platname,
        active: platActive

      }

      console.log("json", json)
      const config = {
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${adminToken}`
        },
        withCredentials: true
      }

      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/addPlatform?adminId=${adminId}&shop_id=${shop_id}`, json, config);
      if (response.status === 201) {
        setDisabled(false)
        setErr(false)
        setMessageType("success")
        setMessage("Platform added")
        setName("")
        setPlatName("")
        setPlatActivate(false)
        setShowAddTag(false)
        setTimeout(() => {
          dispatch(noteRefs(new Date().getSeconds()))
        }, 1000);

        setTimeout(() => {
          setMessage(false)
        }, 2000);
      }
    } catch (error) {
      setDisabled(false)
      setMessageType("error")
      setMessage("Platform Not added")
      setPlatName("")
      setPlatActivate(false)
      setTimeout(() => {
        setMessage(false)
      }, 2000);
    }
  }

  const handlePageChange = (event, value) => {
    setOffset((value - 1) * limit);
  };

  const getAllPlatforms = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/platforms?shop_id=${shop_id}&adminId=${adminId}`, config);
      if (response.status === 200) {
        setloader(true)
        setAllTags(response.data.data)
      }

    } catch (error) {
      setloader(true)
      setAllTags([])


    }
  }


  const handleEditOpen = (value, label, active) => {
    seteditName(label)
    setEditId(value)
    setEditImage(active)
    setEdit(true)
  }

  const handleCategoryChange = async (check, id) => {
    let active = undefined
    console.log(check, "check")
    if (Number(check) === 1) {
      active = 0
    } else {
      active = 1
    }

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };
      const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/category_update?userId=${adminId}&type=${type}&tag_id=${id}&status=${active}`, '', config)
      if (response.status === 200) {
        setMessageType("success")
        setMessage("Status Update")
        dispatch(noteRefs(new Date().getSeconds()))
        setTimeout(() => {
          setMessage(false)
        }, 2000);
      }
    } catch (error) {
      setMessageType("error")
      setMessage("Status Not Update")
      setTimeout(() => {
        setMessage(false)
      }, 2000);
    }

  }

  useEffect(() => {
    getAllPlatforms()
  }, [limit, offset, dataRefe])



  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <div className={`all-product`}>
        
        <div class="row align-items-center">
          <div class="col-12 col-md-4 mb-3 mb-md-0">
          <h2>Platforms</h2>
          </div>
          <div class="col-12 col-md-4 mb-3 mb-md-0">

          </div>
          <div class="col-12 col-md-4">
            <div className="form-group">
              <button data-toggle="tooltip" data-placement="top" title="Add Tag" className="btnSubmit" type="button" onClick={() => setShowAddTag(true)}>
                + Add platform
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
        <table className="table custom-table-header ">
            <thead>
              <tr>
                <th>Id</th>
                <th>Platform Name</th>
                <th>Activate</th>
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
                    allTags && allTags.length > 0 ? (
                      <tbody>
                        {allTags && allTags.map((ele, index) => (
                          <tr key={index}>

                            <td>
                              {ele.value}
                            </td>
                            <td>
                              {ele.label}
                            </td>
                            <td>
                              <div class="form-check actives">
                                {
                                  ele.active ? (

                                    <p style={{ color: "green" }}>Active</p>
                                  ) : (
                                    <p style={{ color: "red" }}>Deactive</p>

                                  )
                                }
                              </div>
                            </td>
                            <td>
                              <span data-toggle="tooltip" data-placement="top" title="Edit" style={{ cursor: "pointer" }} onClick={() => handleEditOpen(ele.value, ele.label, ele.active)}><CreateIcon /></span>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <div className="text-center">
                              No Platforms Found
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
      {/* <Pagination count={totalPages} variant="outlined" color="secondary" onChange={handlePageChange} /> */}

      <Modal
        show={ShowAddTag}
        onHide={handleCloseInvite}
        backdrop="static"
        keyboard={false}
        dialogclassNameName="modal-md patient_notes_popup"
      >
        <Modal.Header closeButton>
          <Modal.Title classNameName="text-center">Add Platform</Modal.Title>
        </Modal.Header>
        <Modal.Body classNameName="">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>* Platform Name</label>
                <input type="text" className="form-control" placeholder="Platform Name" name="name" value={platname} onChange={handlePlatnameChange} />

              </div>
              <div className="form-group">
                <label for="inputEmail4" class="form-label">Activate</label>
                <div class="form-check form-switch">

                  <input class="form-check-input" type="checkbox" role="switch" onChange={handlePlatactivateChange} name="activate" value={platActive} checked={platActive} />
                </div>
              </div>
              {
                err ? (
                  <p style={{ color: "red" }}>* Please fill mandatory fields</p>

                ) : ("")
              }
            </div>
          </div>


        </Modal.Body>
        <Modal.Footer>
          {
            disabled ? (
              <button class="btnSubmit1" type="button" disabled={disabled}>Creating...</button>
            ) : (
              <>
                <button type="button" class={disabled ? "btnSubmit1" : "btnSubmit"} onClick={handleSubmit} disabled={disabled}>Save</button>
                <button type="button" className="btnSubmit" onClick={handleCloseInvite}>Close</button>
              </>
            )
          }

        </Modal.Footer>
      </Modal >


      <Editplatform edit={edit} setEdit={setEdit} editName={editName} seteditName={seteditName} setEditId={setEditId} editId={editId} setEditImage={setEditImage} editImage={editImage} />
    </>

  )
}

export default Platforms

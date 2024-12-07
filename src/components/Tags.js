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
import EditTag from "./EditTag";
import Message from '../custom/Message';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';

const Tags = () => {
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
  const [formsdata, setFormsData] = useState({
    name: "",
    file: null,
    type: type
  })
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0)
  const adminToken = localStorage.getItem("adminToken")

  const handleChange = (e) => {
    setErr(false)
    if (e.target.type === 'file') {
      setFormsData({ ...formsdata, file: e.target.files[0] });
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('selectedImage').src = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setFormsData({ ...formsdata, [e.target.name]: e.target.value });
    }
  };

  const handleCloseInvite = () => {
    setShowAddTag(false)
    setName("")
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
      let { name, file, type } = formsdata
      if (!name || !file) {
        setErr(true)
        return
      }
      setDisabled(true)

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${adminToken}`
        },
        withCredentials: true
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", name)
      formDataToSend.append("type", type)
      formDataToSend.append("file", file)

      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/createTags/${adminId}`, formDataToSend, config);
      if (response.status === 201) {
        setDisabled(false)
        setErr(false)
        setMessageType("success")
        setMessage("Tag Created")
        setName("")
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
      setMessage("Tag Not Created")
      setTimeout(() => {
        setMessage(false)
      }, 2000);
    }
  }

  const handlePageChange = (event, value) => {
    setOffset((value - 1) * limit);
  };

  const getAllTags = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/getalltags?type=${type}&userId=${adminId}&limit=${limit}&offset=${offset}`);
      if (response.status === 200) {
        setloader(true)
        setAllTags(response.data.data)
        setTotalCount(response.data.totalData)
        setTotalPages(Math.ceil(response.data.totalData / limit));
      }

    } catch (error) {
      setloader(true)
      setAllTags([])
      setTotalPages(0);

    }
  }


  const deleteTag = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${adminToken}`
        },
        withCredentials: true
      }
      const response = await axios.delete(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/delete_tags/${adminId}?tagId=${tagId}&type=${type}`, config);
      if (response.status === 200) {

        setMessageType("success")
        setMessage("Tag deleted")
        setDeleteModal(false)
        setTimeout(() => {
          dispatch(noteRefs(new Date().getSeconds()))
        }, 1000);

        setTimeout(() => {
          setMessage(false)
        }, 2000);
      }

    } catch (error) {
      setMessageType("error")
      setMessage("Tag Not deleted")
      setTimeout(() => {
        setMessage(false)
      }, 2000);
    }
  }


  const handleEditOpen = (name, id, image) => {
    seteditName(name)
    setEditId(id)
    setEditImage(image)
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
    getAllTags()
  }, [limit, offset, dataRefe])



  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <div className={`all-product`}>
        <h3>Tags</h3>
        {/* <div className='form'>
          <div className="row">
            <div className="col-sm-9">
            <label>Total : {totalCount}</label>
            </div>
            <div className="col-sm-3">
              <div className="form-group">

                <button data-toggle="tooltip" data-placement="top" title="Add Tag" className="btnSubmit" type="button" onClick={() => setShowAddTag(true)}>
                  + Add Tag
                </button>
              </div>
            </div>
          </div>
        </div> */}

        <div class="row align-items-center">
          <div class="col-12 col-md-4 mb-3 mb-md-0">
            <label>Total : {totalCount}</label>
          </div>
          <div class="col-12 col-md-4 mb-3 mb-md-0">

          </div>
          <div class="col-12 col-md-4">
            <div className="form-group">
              <button data-toggle="tooltip" data-placement="top" title="Add Tag" className="btnSubmit" type="button" onClick={() => setShowAddTag(true)}>
                + Add Tag
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table custom-table-header">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Tag Name</th>
                <th>Top Category</th>
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
                              <div className="">
                                <img src={ele.thumbnailImage} style={{ width: '50%', height: '50%' }} />
                              </div>
                            </td>
                            <td>
                              {ele.label}
                            </td>
                            {/* <td>
                              {ele.label}
                            </td> */}
                            <td>
                              <div class="form-check form-switch">
                                <input data-toggle="tooltip" data-placement="top" title="Availability" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" value={ele.topCategory} checked={ele.topCategory} onChange={(e) => handleCategoryChange(e.target.value, ele.value)} />
                              </div>
                            </td>
                            <td>

                              <span data-toggle="tooltip" data-placement="top" title="Edit" style={{ cursor: "pointer" }} onClick={() => handleEditOpen(ele.label, ele.value, ele.thumbnailImage)}><CreateIcon /></span>
                              <span data-toggle="tooltip" data-placement="top" title="Remove" style={{ cursor: "pointer" }} onClick={() => handleOpenTagModal(ele.value)}><DeleteIcon /></span>

                            </td>

                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <div className="text-center">
                              No tags Found
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
        <Pagination count={totalPages} variant="outlined" color="secondary" onChange={handlePageChange} />
      </div>

      <Modal
        show={ShowAddTag}
        onHide={handleCloseInvite}
        backdrop="static"
        keyboard={false}
        dialogclassNameName="modal-md patient_notes_popup"
      >
        <Modal.Header closeButton>
          <Modal.Title classNameName="text-center">Add Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body classNameName="">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Tag Name</label>
                <input type="text" className="form-control" placeholder="Tag Name" name="name" value={formsdata.name} onChange={handleChange} />

              </div>
              <div className="form-group">
                <label for="inputEmail4" class="form-label">*Logo</label>
                <img style={{ width: '30%', height: '30%' }} id="selectedImage" src={imagePreview} alt="Selected Image" class="default-image" />
                <input type="file" id="imageUpload" name="file" onChange={handleChange} />
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

      <Dialog
        open={deleteModal}
        onClose={handleModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteTag}>Yes</Button>
          <Button onClick={handleModalClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <EditTag edit={edit} setEdit={setEdit} editName={editName} seteditName={seteditName} setEditId={setEditId} editId={editId} setEditImage={setEditImage} editImage={editImage} />
    </>

  )
}

export default Tags
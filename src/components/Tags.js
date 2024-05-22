import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import '../css/main.css'
import { noteRefs } from '../redux/actions/userAction'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import EditTag from "./EditTag";
import Message from '../custom/Message';

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
  const shop_id = localStorage.getItem("id");
  const type = localStorage.getItem("type");

  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [imagePreview, setImagePreview] = useState("./default.jpg")
  const [formsdata, setFormsData] = useState({
    name: "",
    file: null,
    type: type
  })


  const handleChange = (e) => {
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
  }

  const handleModalClose = () => {
    setDeleteModal(false)
    setTagId("")
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

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", name)
      formDataToSend.append("type", type)
      formDataToSend.append("file", file)

      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/createTags/${adminId}`, formDataToSend, config);
      if (response.status === 201) {
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
      setMessageType("error")
      setMessage("Tag Not Created")
      setTimeout(() => {
        setMessage(false)
      }, 2000);
    }
  }


  const getAllTags = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/getalltags?type=${type}&userId=${adminId}`);
      if (response.status === 200) {
        setAllTags(response.data.data)
      }

    } catch (error) {
      setAllTags([])
    }
  }


  const deleteTag = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': "application/json",
        },
        withCredentials: true
      }
      const response = await axios.delete(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/delete_tags/${adminId}?tagId=${tagId}&type=${type}`);
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

  const handleCategoryChange = async(check,id) => {
    let active = undefined
    console.log(check, "check")
    if (Number(check)===1) {
      active = 0
    } else {
      active = 1
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/category_update?userId=${adminId}&type=${type}&tag_id=${id}&status=${active}`)
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
  }, [dataRefe])



  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
            <h2 className="text-2xl leading-tight">
              All Tags
            </h2>
            <div className="text-end">
              <form className="flex w-full max-w-sm space-x-3">

                <button className="flex-shrink-0 px-4 py-2 text-base text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:shadow-outline" type="button" onClick={() => setShowAddTag(true)}>
                  + Add Tag
                </button>
              </form>
            </div>
          </div>
          <div className="text-zinc-600">
            {allTags.length} Results
          </div>
          <div className="py-4">
            <div className="overflow-x-auto overflow-y-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-zinc-200 bg-purple-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-5 py-3 border-b-2 border-zinc-200 bg-purple-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-5 py-3 border-b-2 border-zinc-200 bg-purple-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-5 py-3 border-b-2 border-zinc-200 bg-purple-800 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Top Category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allTags && allTags.length === 0 ? (
                    <tr>
                      <td colspan="3" className="px-5 py-5 border-b border-zinc-200 bg-white text-sm text-center">
                        No Tags
                      </td>
                    </tr>
                  ) : (
                    allTags.map((ele, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5 border-b border-zinc-200 bg-white text-sm">{index + 1}</td>
                        <td className="px-5 py-5 border-b border-zinc-200 bg-white text-sm">{ele.label}</td>
                        <td className="px-5 py-5 border-b border-zinc-200 bg-white text-sm">
                          <span classNameName="text-zinc-900 leading-none hover:text-purple-600" onClick={() => handleEditOpen(ele.label, ele.value, ele.thumbnailImage)}><FaEdit /></span>
                          <span classNameName="text-zinc-900 leading-none hover:text-purple-600 pl-6" onClick={() => handleOpenTagModal(ele.value)}><FaTrashAlt /></span>
                        </td>
                        <td className="px-5 py-5 border-b border-zinc-200 bg-white text-sm">
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" value={ele.topCategory} checked={ele.topCategory} onChange={(e) => handleCategoryChange(e.target.value,ele.value)} />
                            <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
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
          <div className="form-group">
            <label>Tag Name</label>
            <input type="text" className="form-control" placeholder="Tag Name" name="name" value={formsdata.name} onChange={handleChange} />

          </div>
          <div className="form-group">
            <label>Logo</label>
            <img id="selectedImage" src={imagePreview} alt="Selected Image" class="default-image" />
            <input type="file" id="imageUpload" name="file" onChange={handleChange} />
          </div>

        </Modal.Body>
        <Modal.Footer>
          <button type="submit" onClick={handleSubmit}>Save</button>
          <button type="submit" onClick={handleCloseInvite}>Close</button>

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
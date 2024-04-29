import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import '../css/main.css'
import { noteRefs } from '../redux/actions/userAction'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Button from '@mui/material/Button';
import Message from '../custom/Message';

const EditTag = ({ edit, setEdit, editName, seteditName, setEditId, editId, setEditImage, editImage }) => {

    const dispatch = useDispatch()
    const dataRefe = useSelector((state) => state.noteRef.arr);
    console.log("editImage", editImage)
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("id");
    const type = localStorage.getItem("type");
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const [imagePreview, setImagePreview] = useState("")
    const [formsdata, setFormsData] = useState({
        name: editName,
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


    const handleName = (e) => {
        seteditName(e)
    }

    const handleCloseInvite = () => {
        setEdit(false)
        seteditName("")
        setEditId("")
    }


    const handleSubmit = async () => {
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
            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/update_tags/${adminId}/${editId}`, formDataToSend, config);
            if (response.status === 201) {
                setMessageType("success")
                setMessage("Tag Updated")
                setEdit(false)
                seteditName("")
                setEditId("")
                setTimeout(() => {
                    dispatch(noteRefs(new Date().getSeconds()))
                }, 1000);

                setTimeout(() => {
                    setMessage(false)
                }, 2000);
            }
        } catch (error) {
            setMessageType("error")
            setMessage("Tag Not Updated")
            setTimeout(() => {
                setMessage(false)
            }, 2000);

        }
    }

    useEffect(() => {
        setImagePreview(editImage)
    }, [editImage])


    return (
        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
            <Modal
                show={edit}
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
                        <label>* Tag Name</label>
                        <input type="text" className="form-control" placeholder="Tag Name" name="name" value={formsdata.name} onChange={handleChange} />

                    </div>

                    <div className="form-group">
                        <label>Logo</label>
                        {
                            console.log("imagePreview", imagePreview)
                        }
                        <img id="selectedImage" src={imagePreview} alt="Selected Image" class="default-image" />
                        <input type="file" id="imageUpload" name="file" onChange={handleChange} />
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <button type="submit" onClick={handleSubmit}>Update</button>
                    <button type="submit" onClick={handleCloseInvite}>Close</button>

                </Modal.Footer>
            </Modal >




        </>
    )
}

export default EditTag
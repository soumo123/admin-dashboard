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
    const [disabled, setDisabled] = useState(false)
    const [err, setErr] = useState(false)
    const [formsdata, setFormsData] = useState({
        name: "",
        file: null,
        type: type
    })
    console.log("editName", formsdata)
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


    const handleName = (e) => {
        seteditName(e)
    }

    const handleCloseInvite = () => {
        setErr(false)

        setEdit(false)
        seteditName("")
        setEditId("")
    }


    const handleSubmit = async () => {
        try {
            let { name, file, type } = formsdata
            if (!name) {
                setErr(true)
                return
            }
            setDisabled(true)
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
                setDisabled(false)
                setErr(false)
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
            setDisabled(false)
            setMessageType("error")
            setMessage("Tag Not Updated")
            setTimeout(() => {
                setMessage(false)
            }, 2000);

        }
    }

    useEffect(() => {
        setImagePreview(editImage)
        setFormsData({
            name: editName,
            file: null,
            type: type
        })
    }, [editImage, editName])


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
                    <Modal.Title classNameName="text-center">Edit Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body classNameName="">
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label>* Tag Name</label>
                                <input type="text" className="form-control" placeholder="Tag Name" name="name" value={formsdata.name} onChange={handleChange} />

                            </div>

                            <div className="form-group">
                            <label for="inputEmail4" class="form-label">Logo</label>
                                {
                                    console.log("imagePreview", imagePreview)
                                }
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
                            <button class="btnSubmit1" type="button" disabled={disabled}>Updating...</button>
                        ) : (
                            <>
                                <button type="button" class={disabled ? "btnSubmit1" : "btnSubmit"} onClick={handleSubmit} disabled={disabled}>Update</button>
                                <button type="button" className="btnSubmit" onClick={handleCloseInvite}>Close</button>
                            </>
                        )
                    }


                </Modal.Footer>
            </Modal >




        </>
    )
}

export default EditTag
import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import '../css/main.css'
import { noteRefs } from '../redux/actions/userAction'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Button from '@mui/material/Button';
import Message from '../custom/Message';

const Editplatform = ({ edit, setEdit, editName, seteditName, setEditId, editId, setEditImage, editImage }) => {

    const dispatch = useDispatch()
    const dataRefe = useSelector((state) => state.noteRef.arr);
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
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
    const [platname, setPlatName] = useState("")
    const [platActive, setPlatActivate] = useState(false)
    console.log("editName , editId , editImage", editName, editId, editImage)
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


    const handlePlatnameChange = (e) => {
        setErr(false)
        // setFormsData({ ...formsdata, [e.target.name]: e.target.value });
        setPlatName(e.target.value)
    };

    const handlePlatactivateChange = (e) => {
        setErr(false)
        // setFormsData({ ...formsdata, [e.target.name]: e.target.value });
        setPlatActivate(e.target.checked)
    };

    const handleName = (e) => {
        seteditName(e)
    }

    const handleCloseInvite = () => {
        setErr(false)

        setEdit(false)
        seteditName("")
        setPlatName("")
        setPlatActivate(false)
        setEditId("")
    }


    const handleSubmit = async () => {
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
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${adminToken}`
                },
                withCredentials: true
            }
            console.log("json", json)
            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/editPlatform?adminId=${adminId}&shop_id=${shop_id}&plat_id=${editId}`, json, config);
            if (response.status === 201) {
                setDisabled(false)
                setErr(false)
                setMessageType("success")
                setMessage("Platform Updated")
                setEdit(false)
                seteditName("")
                setEditId("")
                setPlatName("")
                setPlatActivate(false)
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
            setMessage("Platform Not Updated")
            setTimeout(() => {
                setMessage(false)
            }, 2000);

        }
    }

    useEffect(() => {
        setPlatName(editName)
        setPlatActivate(editImage)
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
                    <Modal.Title classNameName="text-center">Edit platform</Modal.Title>
                </Modal.Header>
                <Modal.Body classNameName="">
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label>* Platform Name</label>
                                <input type="text" className="form-control" placeholder="Tag Name" name="name" value={platname} onChange={handlePlatnameChange} />

                            </div>

                            <div className="form-group">
                                <label for="inputEmail4" class="form-label">Activate</label>
                                <input class="form-check-input" type="checkbox" role="switch" onChange={handlePlatactivateChange} name="activate" value={platActive} checked={platActive} />
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

export default Editplatform
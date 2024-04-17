import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import '../css/main.css'
import { noteRefs } from '../redux/actions/userAction'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Button from '@mui/material/Button';


const EditTag = ({ edit, setEdit, editName, seteditName, setEditId, editId }) => {

    const dispatch = useDispatch()
    const dataRefe = useSelector((state) => state.noteRef.arr);

    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("id");
    const type = localStorage.getItem("type");

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
            const config = {
                headers: {
                    'Content-Type': "application/json",
                },
                withCredentials: true
            }
            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/update_tags/${adminId}/${editId}`, { name: editName, type: type }, config);
            if (response.status === 201) {
                alert("Tag Updated")
                setEdit(false)
                seteditName("")
                setEditId("")
                setTimeout(() => {
                    dispatch(noteRefs(new Date().getSeconds()))
                }, 1000);
            }
        } catch (error) {
            alert("Tag Not Updated")

        }
    }
    return (
        <>

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
                        <input type="text" className="form-control" placeholder="Tag Name" name="name" value={editName} onChange={(e) => handleName(e.target.value)} />

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
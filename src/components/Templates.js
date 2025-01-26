import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { noteRefs } from '../redux/actions/userAction'
import Pagination from '@mui/material/Pagination';
import Message from '../custom/Message';
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Templates = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [allTemps, setTemps] = useState([])
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const type = localStorage.getItem("type");
    const [loader, setloader] = useState(false);
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0)
    const dataRefe = useSelector((state) => state.noteRef.arr);
    const [viewdata, setViewData] = useState({})
    const [show, setShow] = useState(false)

    const adminToken = localStorage.getItem("adminToken")
    const handleReditrect = () => {
        navigate("/addtemplate")
    }

    const getAllTemps = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                },
                withCredentials: true
            }
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/gettemplates?shop_id=${shop_id}&adminId=${adminId}&limit=${limit}&offset=${offset}`, config);
            if (response.status === 200) {
                setloader(true)
                setTemps(response.data.data)
                setTotalCount(response.data.totalData)
                setTotalPages(Math.ceil(response.data.totalData / limit));
            }

        } catch (error) {
            setloader(true)
            setTemps([])
            setTotalPages(0);

        }
    }
    const handleClose = () => {
        setShow(false)
    }
    const handleStatusChange = async (check, id) => {
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
            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/updatetempstatus?adminId=${adminId}&shop_id=${shop_id}&temp_id=${id}&active=${active}`, '', config)
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
    const hanldeOpen = (temp_id, temp_url) => {
        setViewData({
            temp_id: temp_id,
            temp_url: temp_url
        })
        setShow(true)
    }
    const handlePageChange = (event, value) => {
        setOffset((value - 1) * limit);
      };

    useEffect(() => {
        getAllTemps()
    }, [limit, offset, dataRefe])


    return (
        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
            <div className={`all-product`}>
                <h1>Templates</h1>
                <div class="row align-items-center">
                    <div class="col-12 col-md-4 mb-3 mb-md-0">
                        <label>Total : {totalCount}</label>
                    </div>
                    <div class="col-12 col-md-4 mb-3 mb-md-0">

                    </div>
                    <div class="col-12 col-md-4">
                        <div className="form-group">
                            <button data-toggle="tooltip" data-placement="top" title="Add Template" className="btnSubmit" type="button" onClick={handleReditrect}>
                                +Add Template
                            </button>
                        </div>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table custom-table-header">
                        <thead>
                            <tr>
                                <th>Template Id</th>
                                <th>Template</th>
                                <th>Active</th>
                                <th>Date</th>
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
                                        allTemps && allTemps.length > 0 ? (
                                            <tbody>
                                                {allTemps && allTemps.map((ele, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {ele.temp_id}
                                                        </td>
                                                        <td>
                                                            <div className="">
                                                                <img src={ele.temp_url} style={{
                width: '80px',  // Adjust width to a smaller size
                height: 'auto', // Maintain aspect ratio
                borderRadius: '5px', // Optional: Rounded corners
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Optional: Subtle shadow
            }}/>
                                                            </div>
                                                        </td>


                                                        <td>
                                                            <div class="form-check form-switch">
                                                                <input data-toggle="tooltip" data-placement="top" title="Availability" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" value={ele.active} checked={ele.active} onChange={(e) => handleStatusChange(e.target.value, ele.temp_id)} />
                                                            </div>
                                                        </td>

                                                        <td>{ele.date === null || ele.date === "" ? "" : dayjs(ele.date).format('DD/MM/YYYY, hh:mm A')}</td>

                                                        <td>

                                                            <div className="data-icons">
                                                                <span data-toggle="tooltip" data-placement="top" title="View" style={{ cursor: "pointer" }} onClick={() => hanldeOpen(ele.temp_id, ele.temp_url)}><VisibilityIcon /></span>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        ) : (
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="text-center">
                                                            No templates Found
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
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={{
                    borderRadius: '10px', // Rounded corners
                    overflow: 'hidden' // Prevent overflow
                }}
            >
                <Modal.Header
                    style={{
                        backgroundColor: '#68033f', // Bootstrap primary color
                        color: 'white',
                        borderBottom: 'none'
                    }}
                >
                    <Modal.Title id="contained-modal-title-vcenter">
                    {viewdata?.temp_id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        padding: '20px', // Padding for body
                        textAlign: 'center', // Centered text
                        maxHeight: '400px', overflowY: 'auto'
                    }}

                >
                    <div>
                        <img
                            src={viewdata?.temp_url}
                            alt={`${viewdata?.temp_id}`}
                            style={{
                                maxWidth: '100%', // Responsive image
                                height: 'auto', // Maintain aspect ratio
                                borderRadius: '10px', // Rounded corners for the image
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                marginBottom: '20px' // Space below the image
                            }}
                        />

                    </div>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        borderTop: 'none'
                    }}
                >
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Templates
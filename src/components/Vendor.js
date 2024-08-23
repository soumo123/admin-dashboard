import React, { useState, useEffect } from 'react'
import axios from 'axios'
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddVendorModal from '../custom/AddVendorModal.js'
import AddAgentModal from '../custom/AddAgentModal.js'
import LoupeIcon from '@mui/icons-material/Loupe';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Vendor = () => {
    const [vendorData, setVendorData] = useState([])
    const [agentData, setAgentData] = useState([])
    const [loader, setloader] = useState(false);
    const [loader1, setloader1] = useState(false);
    const [key, setkey] = useState("")
    const [key1, setkey1] = useState("")
    const[show,setShow] = useState(false)
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const type = localStorage.getItem("type");
    const [lastTypingTime, setLastTypingTime] = useState(null);
    const [lastTypingTime1, setLastTypingTime1] = useState(null);

    const [modalShow1, setModalShow1] = useState(false);
    const [modalShow2, setModalShow2] = useState(false);
    const [refresh1, setRefresh1] = useState(false)
    const [refresh2, setRefresh2] = useState(false)
    const [mode, setMode] = useState(0)
    const[option,setOption] = useState(0)
    const[viewdata,setViewData] = useState({})
    const handleOpen1 = (mode) => {
        if (Number(mode) === 1) {
            setMode(1)
            setModalShow1(true)
        } else {
            setMode(2)
            setModalShow2(true)
        }
    }

    const getAllvendors = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_all_vendors?shop_id=${shop_id}&search=`)
            if (response.status === 200) {
                setloader(true)
                setVendorData(response.data.data)
            } else {
                setVendorData([])
            }
        } catch (error) {
            setloader(true)
            setVendorData([])
        }
    }

    const getAllagents = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_al_agents?shop_id=${shop_id}&key=`)
            if (response.status === 200) {
                setloader1(true)
                setAgentData(response.data.data)
            } else {
                setAgentData([])
            }
        } catch (error) {
            setloader1(true)
            setAgentData([])
        }
    }

    const handleSearchChange = (query) => {
        setLastTypingTime(new Date().getTime())
        setkey(query);
    };

    const handleSearchChange1 = (query) => {
        setLastTypingTime1(new Date().getTime())
        setkey1(query);
    };


    const hanldeOpen = (vendorId,agentId,key)=>{
        if(key===1){
            setOption(1)
            viewAgentvendor(vendorId,agentId,1)
            setShow(true)
        }else{
            setOption(2)
            viewAgentvendor(vendorId,agentId,2)
            setShow(true)
        }
     
    }


    const handleClose  = ()=>{
        setShow(false)
        setOption(0)
    }

    const viewAgentvendor = async(vendorId,agentId,option)=>{
        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/view_agent_vendor?agentId=${agentId}&vendorId=${vendorId}&shop_id=${shop_id}&key=${option}`)
        if (response.status === 200) {
            setViewData(response.data.data)
        }
        } catch (error) {
            console.log(error)
        }
        
    }

    useEffect(() => {
        if (lastTypingTime1) {
            const timer = setTimeout(() => {
                const getAllagents = async () => {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_al_agents?shop_id=${shop_id}&key=${key1}`)
                        if (response.status === 200) {
                            setloader1(true)
                            setAgentData(response.data.data)
                        } else {
                            setAgentData([])
                        }
                    } catch (error) {
                        setloader1(true)
                        setAgentData([])
                    }
                }

                getAllagents();

            }, 1000);
            return () => clearTimeout(timer)
        }
    }, [key1])



    useEffect(() => {
        if (lastTypingTime) {
            const timer = setTimeout(() => {
                const getAllvendors = async () => {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_all_vendors?shop_id=${shop_id}&search=${key}`)
                        if (response.status === 200) {
                            setloader(true)
                            setVendorData(response.data.data)
                        } else {
                            setVendorData([])
                        }
                    } catch (error) {
                        setloader(true)
                        setVendorData([])
                    }
                };

                getAllvendors();

            }, 1000);
            return () => clearTimeout(timer)
        }
    }, [key])




    useEffect(() => {
        getAllvendors()
    }, [refresh1])

    useEffect(() => {
        getAllagents()
    }, [refresh2])



    return (
        <>

            <div className="container3">
                <div className="section3">
                    <div className="header">
                        <h2>VENDORS</h2>
                        <div className="header-actions">
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                value={key}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="search-input"
                            />
                            <button className="btnSubmit" onClick={() => handleOpen1(1)}>+ Add vendor</button>
                        </div>
                    </div>
                    <div className="content">
                        <div className="table-responsive">
                            <table className="table data-tables1 table-hover">
                                <thead>
                                    <tr>
                                        <th>Profile</th>
                                        <th>vendor Id</th>
                                        <th>Name</th>
                                        <th>Phone</th>
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
                                                vendorData && vendorData.length > 0 ? (
                                                    <tbody>
                                                        {
                                                            vendorData && vendorData.map((ele) => (
                                                                <tr key={ele.vendorId}>
                                                                    <td>
                                                                        <div className='text-center'>
                                                                            <img className="profile-img" src={ele.vendor_image} />
                                                                        </div>
                                                                    </td>
                                                                    <td>{ele.vendorId}</td>
                                                                    <td>{ele.vendor_name}</td>
                                                                    <td>+91 {ele.vendor_phone}</td>
                                                                    <td>

                                                                        <div className="data-icons">
                                                                            <span data-toggle="tooltip" data-placement="top" title="View" style={{ cursor: "pointer" }} onClick={()=>hanldeOpen(ele.vendorId,undefined,1)}><VisibilityIcon /></span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>
                                                ) : (
                                                    <div className="container">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="text-center">
                                                                    No Vendor Found
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
                </div>
                <div className="section3">
                    <div className="header">
                        <h2>AGENTS</h2>
                        <div className="header-actions">
                            <input
                                type="text"
                                placeholder="Search agents..."
                                value={key1}
                                onChange={(e) => handleSearchChange1(e.target.value)}
                                className="search-input"
                            />
                            <button className="btnSubmit" onClick={() => handleOpen1(2)}>+ Add agents</button>
                        </div>
                    </div>
                    <div className="content">

                        <div className="table-responsive">
                            <table className="table data-tables1 table-hover">
                                <thead>
                                    <tr>
                                        <th>Profile</th>
                                        <th>Agent Id</th>
                                        <th>vendor Id</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                {
                                    !loader1 ? (
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
                                                agentData && agentData.length > 0 ? (
                                                    <tbody>
                                                        {
                                                            agentData && agentData.map((ele) => (
                                                                <tr key={ele.agentId}>
                                                                    <td>
                                                                        <div className='text-center'>
                                                                            <img className="profile-img" src={ele.agent_image} />
                                                                        </div>
                                                                    </td>
                                                                    <td>{ele.agentId}</td>
                                                                    <td>{ele.vendorId}</td>
                                                                    <td>{ele.agent_name}</td>
                                                                    <td>+91 {ele.agent_phone}</td>
                                                                    <td>

                                                                        <div className="data-icons">
                                                                            <Link to={`/addVendorProduct/${ele.agentId}/${ele.vendorId}`}><span data-toggle="tooltip" data-placement="top" title="add products" style={{ cursor: "pointer" }} ><LoupeIcon /></span></Link>
                                                                            <span data-toggle="tooltip" data-placement="top" title="View" style={{ cursor: "pointer" }} onClick={()=>hanldeOpen(ele.vendorId,ele.agentId,2)}><VisibilityIcon /></span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>
                                                ) :

                                                    (
                                                        <div className="container">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="text-center">
                                                                        No Agent Found
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
                </div>
            </div>
            {
                mode === 1 && modalShow1 ? (
                    <AddVendorModal modalShow1={modalShow1} setModalShow1={setModalShow1} setRefresh1={setRefresh1} setMode={setMode} />
                ) : ("")
            }
            {
                mode === 2 && modalShow2 ? (

                    <AddAgentModal modalShow2={modalShow2} setModalShow2={setModalShow2} setRefresh2={setRefresh2} vendorData={vendorData} setMode={setMode} />
                ) : ("")
            }

            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        View {option===1 ? ("Vendor"):("Agent")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='container'>
                        <div className="row">
                            <div className='col'>
                                <h3>Image :<img src={viewdata.image}/></h3>
                                <h3>Vendor Id :{viewdata.id}</h3>
                                {viewdata.ag_id ? (<h3>Agent Id :{viewdata.ag_id}</h3>):("")}  
                                <h3>Name : {viewdata.name}</h3>
                                <h3>Email : {viewdata.email}</h3>
                                <h3>Phone :{viewdata.phone}</h3>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Vendor

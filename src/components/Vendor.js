import React, { useState, useEffect } from 'react'
import axios from 'axios'
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddVendorModal from '../custom/AddVendorModal.js'
import AddAgentModal from '../custom/AddAgentModal.js'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Message from '../custom/Message.js';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Vendor = () => {
    const dispatch = useDispatch()
    const [vendorData, setVendorData] = useState([])
    const [agentData, setAgentData] = useState([])
    const [loader, setloader] = useState(false);
    const [loader1, setloader1] = useState(false);
    const [key, setkey] = useState("")
    const [key1, setkey1] = useState("")
    const [show, setShow] = useState(false)
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const type = localStorage.getItem("type");
    const [lastTypingTime, setLastTypingTime] = useState(null);
    const [lastTypingTime1, setLastTypingTime1] = useState(null);
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const [modalShow1, setModalShow1] = useState(false);
    const [modalShow2, setModalShow2] = useState(false);
    const [refresh1, setRefresh1] = useState(false)
    const [refresh2, setRefresh2] = useState(false)
    const [mode, setMode] = useState(0)
    const [option, setOption] = useState(0)
    const [viewdata, setViewData] = useState({})

    const adminToken = localStorage.getItem("adminToken")
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
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
            const config = {
                headers: {
                    'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
            };
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_all_vendors?shop_id=${shop_id}&adminId=${adminId}&search=`, config)
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
            const config = {
                headers: {
                    'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
            };
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_al_agents?shop_id=${shop_id}&adminId=${adminId}&key=&statustype=`, config)
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


    const hanldeOpen = (vendorId, agentId, key) => {
        if (key === 1) {
            setOption(1)
            viewAgentvendor(vendorId, agentId, 1)
            setShow(true)
        } else {
            setOption(2)
            viewAgentvendor(vendorId, agentId, 2)
            setShow(true)
        }

    }


    const handleClose = () => {
        setShow(false)
        setOption(0)
    }

    const viewAgentvendor = async (vendorId, agentId, option) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
            };
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/view_agent_vendor?agentId=${agentId}&vendorId=${vendorId}&adminId=${adminId}&shop_id=${shop_id}&key=${option}`, config)
            if (response.status === 200) {
                setViewData(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }

    }

    const handleCheck = async (check, agentId) => {
        let active = undefined
        console.log(check, "check")
        if (Number(check)) {
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
            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/update_agent_status?agentId=${agentId}&shopId=${shop_id}&status=${active}&adminId=${adminId}`, '', config)
            if (response.status === 200) {
                setMessageType("success")
                setMessage("Status Update")
                setTimeout(() => {
                    setMessage(false)

                }, 2000);
                setRefresh2(new Date().getMilliseconds())
            }
        } catch (error) {
            setMessageType("error")
            setMessage("Status Not Update")
            setTimeout(() => {
                setMessage(false)
            }, 2000);
        }



    }

    const handleCheck1 = async (check, venId) => {
        let active = undefined
        console.log(check, "check")
        if (Number(check)) {
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
            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/update_vendor_status?vendorId=${venId}&shopId=${shop_id}&status=${active}&adminId=${adminId}`, '', config)
            if (response.status === 200) {
                setMessageType("success")
                setMessage("Status Update")
                setTimeout(() => {
                    setMessage(false)

                }, 2000);
                setRefresh1(new Date().getMilliseconds())
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
        if (lastTypingTime1) {
            const timer = setTimeout(() => {
                const getAllagents = async () => {
                    try {
                        const config = {
                            headers: {
                                'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                            }
                        };
                        const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_al_agents?shop_id=${shop_id}&adminId=${adminId}&key=${key1}&statustype=`, config)
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
                        const config = {
                            headers: {
                                'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                            }
                        };
                        const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_all_vendors?shop_id=${shop_id}&adminId=${adminId}&search=${key}`, config)
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
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Vendors" {...a11yProps(0)} />
                        <Tab label=" Agents" {...a11yProps(1)} />

                    </Tabs>

                </Box>
                <CustomTabPanel value={value} index={0}>
                    <div className="section3">
                        <div class="row align-items-center">
                            <div class="col-12 col-md-4 mb-3 mb-md-0">
                                <h3>Vendors</h3>
                            </div>
                            <div class="col-12 col-md-4 mb-3 mb-md-0">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Search vendors..."
                                        value={key}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="form-control search-input"
                                    />
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div className="form-group">
                                    <button className="btnSubmit" onClick={() => handleOpen1(1)}>+ Add vendor</button>
                                </div>
                            </div>
                        </div>

                        <div className="content">
                            <div className="table-responsive">
                                <table className="table custom-table-header">
                                    <thead>
                                        <tr>
                                            <th>Profile</th>
                                            <th>vendor Id</th>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Action</th>
                                            <th>Status</th>

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
                                                                                <span data-toggle="tooltip" data-placement="top" title="View" style={{ cursor: "pointer" }} onClick={() => hanldeOpen(ele.vendorId, undefined, 1)}><VisibilityIcon /></span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div class="form-check form-switch">
                                                                                <input data-toggle="tooltip" data-placement="top" title="Availability" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked1" value={ele.status} checked={ele.status} onChange={(e) => handleCheck1(e.target.value, ele.vendorId)} />
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
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <div className="section3">

                        <div class="row align-items-center">
                            <div class="col-12 col-md-4 mb-3 mb-md-0">
                                <h3>Agents</h3>
                            </div>
                            <div class="col-12 col-md-4 mb-3 mb-md-0">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Search agents..."
                                        value={key1}
                                        onChange={(e) => handleSearchChange1(e.target.value)}
                                        className="form-control search-input"
                                    />
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div className="form-group">
                                    <button className="btnSubmit" onClick={() => handleOpen1(2)}>+ Add agents</button>
                                </div>
                            </div>
                        </div>

                        <div className="content">
                            <div className="table-responsive">
                                <table className="table custom-table-header">
                                    <thead>
                                        <tr>
                                            <th>Profile</th>
                                            <th>Agent Id</th>
                                            <th>vendor Id</th>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Action</th>
                                            <th>Status</th>
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
                                                                                {/* <Link to={`/addVendorProduct/${ele.agentId}/${ele.vendorId}`}><span data-toggle="tooltip" data-placement="top" title="add products" style={{ cursor: "pointer" }} ><LoupeIcon /></span></Link> */}
                                                                                <span data-toggle="tooltip" data-placement="top" title="View" style={{ cursor: "pointer" }} onClick={() => hanldeOpen(ele.vendorId, ele.agentId, 2)}><VisibilityIcon /></span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div class="form-check form-switch">
                                                                                <input data-toggle="tooltip" data-placement="top" title="Availability" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" value={ele.status} checked={ele.status} onChange={(e) => handleCheck(e.target.value, ele.agentId)} />
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
                </CustomTabPanel>
            </Box>
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
                        View {option === 1 ? "Vendor" : "Agent"}
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
                            src={viewdata.image}
                            alt={`${viewdata.name}`}
                            style={{
                                maxWidth: '100%', // Responsive image
                                height: 'auto', // Maintain aspect ratio
                                borderRadius: '10px', // Rounded corners for the image
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                marginBottom: '20px' // Space below the image
                            }}
                        />
                        <h3 style={{ fontWeight: 500, color: '#333', margin: '10px 0' }}>
                            Vendor ID: {viewdata.id}
                        </h3>
                        {viewdata.ag_id && (
                            <h3 style={{ fontWeight: 500, color: '#333', margin: '10px 0' }}>
                                Agent ID: {viewdata.ag_id}
                            </h3>
                        )}
                        <h3 style={{ fontWeight: 500, color: '#333', margin: '10px 0' }}>
                            Name: {viewdata.name}
                        </h3>
                        <h3 style={{ fontWeight: 500, color: '#333', margin: '10px 0' }}>
                            Email: {viewdata.email}
                        </h3>
                        <h3 style={{ fontWeight: 500, color: '#333', margin: '10px 0' }}>
                            Phone: {viewdata.phone}
                        </h3>
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

export default Vendor

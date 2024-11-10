import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Message from '../custom/Message';

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
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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


const Editemployee = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [value, setValue] = React.useState(0);
    const [isNextTabUnlocked, setIsNextTabUnlocked] = React.useState(false);
    const [imagePreviewofPassport, setImagePreviewPassport] = useState("")
    const [imagePreviewofDoc, setImagePreviewofDoc] = useState("")
    const [err, setErr] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const adminToken = localStorage.getItem("adminToken")

    const [empData, setEmpData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postcode: "",
        identity: "",
        access: {
            dashboard: false,
            notification: false,
            addprod: false,
            products: false,
            users: false,
            employees: false,
            tags: false,
            orders: false,
            settings: false,
            vendor: false,
            stocks: false,
            trasnsaction: false,
            tax: false,
            expproducts: false,
            reqorders: false,
            platforms: false
        },
        file1: null,
        file2: null
    })

    const handleChange1 = (e) => {
        setErr(false)
        if (e.target.type === 'file') {
            setEmpData({ ...empData, [e.target.name]: e.target.files[0], });
            const reader = new FileReader();
            //   reader.onload = () => {
            //     document.getElementById('selectedImage').src = reader.result;
            //     document.getElementById('selectedImage1').src = reader.result;

            //   };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setEmpData({ ...empData, [e.target.name]: e.target.value });
        }
    };
    const handleChange11 = (e) => {
        setErr(false)
        if (e.target.type === 'file') {
            setEmpData({ ...empData, [e.target.name]: e.target.files[0] });
            const reader = new FileReader();
            reader.onload = () => {
                document.getElementById('selectedImage').src = reader.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setEmpData({ ...empData, [e.target.name]: e.target.value });
        }
    };

    const handleChange12 = (e) => {
        setErr(false)
        if (e.target.type === 'file') {
            setEmpData({ ...empData, [e.target.name]: e.target.files[0] });
            const reader = new FileReader();
            reader.onload = () => {
                document.getElementById('selectedImage1').src = reader.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setEmpData({ ...empData, [e.target.name]: e.target.value });
        }
    };
    console.log("empData", empData)
    const handleAccessChange = (event) => {
        const { id, checked } = event.target;
        setEmpData((prevData) => ({
            ...prevData,
            access: {
                ...prevData.access,
                [id]: checked
            }
        }));
    };

    const handleChange = (event, newValue) => {
        // Prevent switching to a higher tab if it's locked
        if (newValue <= value || isNextTabUnlocked) {
            setValue(newValue);
        }
    };

    const handleSave = (e) => {
        e.preventDefault()
        // Unlock the next tab when the save button is clicked
        let { firstname,
            lastname,
            email,
            password,
            phone,
            address,
            city,
            state,
            postcode
        } = empData
        if (!firstname || !lastname || !email || !password || !phone || !address || !city || !state || !postcode) {
            setErr(true)
            setIsNextTabUnlocked(false);
            return
        }
        setIsNextTabUnlocked(true);
        setValue(1); // Jump to the next tab (Item 2)
    };


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            let { firstname,
                lastname,
                email,
                password,
                phone,
                address,
                city,
                state,
                postcode,
                identity,
                access,
                file1,
                file2 } = empData
            if (!firstname ||
                !lastname ||
                !email ||
                !password ||
                !phone ||
                !address ||
                !city ||
                !state ||
                !postcode ||
                !identity) {
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
            formDataToSend.append("firstname", firstname)
            formDataToSend.append("lastname", lastname)
            formDataToSend.append("phone", phone)
            formDataToSend.append("email", email)
            formDataToSend.append("password", password)
            formDataToSend.append("address", address)
            formDataToSend.append("city", city)
            formDataToSend.append("state", state)
            formDataToSend.append("postcode", postcode)
            formDataToSend.append("identity", identity)
            formDataToSend.append("access", JSON.stringify(access))

            formDataToSend.append("file1", file1)
            formDataToSend.append("file2", file2)

            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/updateemp?adminId=${adminId}&shop_id=${shop_id}&empId=${id}`, formDataToSend, config);
            if (response.status === 201) {
                setDisabled(false)
                setErr(false)
                setMessageType("success")
                setMessage("Employee Added")
                navigate("/employee")
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
            }
        } catch (error) {
            setDisabled(false)
            setMessageType("error")
            setMessage(error.response.data.message)
            setTimeout(() => {
                setMessage(false)
            }, 2000);
        }

    }


    const getDetails = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
            };
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/getemp/${id}?adminId=${adminId}&shop_id=${shop_id}`, config)
            if (response.status === 200) {
                console.log("response", response.data)
                setEmpData({
                    firstname: response.data.data.fname,
                    lastname: response.data.data.lname,
                    email: response.data.data.email,
                    password: response.data.data.password,
                    phone: response.data.data.phone,
                    address: response.data.data.address,
                    city: response.data.data.city,
                    state: response.data.data.state,
                    postcode: response.data.data.zip,
                    identity: response.data.data.identity,
                    access: response.data.data.access
                })
                setImagePreviewPassport(response.data.data.logo)
                setImagePreviewofDoc(response.data.data.doc)
            }

        } catch (error) {
            setEmpData({})
            console.log(error.stack)
        }
    }

    useEffect(() => {
        getDetails()
    }, [])




    return (
        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
            <h2>Add employee</h2>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Step 1" {...a11yProps(0)} />
                        <Tab label="Step 2" {...a11yProps(1)} disabled={!isNextTabUnlocked} />
                        {/* <Tab label="Item Three" {...a11yProps(2)} disabled={!isNextTabUnlocked} /> */}
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <div style={styles.formContainer}>
                        <form class="row g-3">
                            <div class="col-md-4">
                                <label for="inputEmail4" class="form-label">*First Name</label>
                                <input type="text" class="form-control" id="inputEmail4" name="firstname" value={empData.firstname} onChange={handleChange1} />
                            </div>
                            <div class="col-md-4">
                                <label for="inputPassword4" class="form-label">*Last Name</label>
                                <input type="text" class="form-control" id="inputPassword4" name="lastname" value={empData.lastname} onChange={handleChange1} />
                            </div>
                            <div class="col-md-4">
                                <label for="inputPassword4" class="form-label">*Phone number</label>
                                <input type="text" class="form-control" id="inputPassword4" name="phone" value={empData.phone} onChange={handleChange1} />
                            </div>
                            <div class="col-4">
                                <label for="inputPassword4" class="form-label">*Email</label>
                                <input type="text" class="form-control" id="inputPassword4" name="email" value={empData.email} onChange={handleChange1} />
                            </div>
                            <div class="col-4">
                                <label for="inputPassword4" class="form-label">*Set Password</label>
                                <input type="password" class="form-control" id="inputPassword4" name="password" value={empData.password} onChange={handleChange1} />
                            </div>
                            <div class="col-12">
                                <label for="inputAddress" class="form-label">*Address</label>
                                <input type="text" class="form-control" id="inputAddress" placeholder="" name="address" value={empData.address} onChange={handleChange1} />
                            </div>

                            <div class="col-md-6">
                                <label for="inputCity" class="form-label">*City</label>
                                <input type="text" class="form-control" id="inputCity" name="city" value={empData.city} onChange={handleChange1} />
                            </div>
                            <div class="col-md-4">
                                <label for="inputState" class="form-label">*State</label>
                                <input type="text" class="form-control" id="inputAddress" placeholder="State" name="state" value={empData.state} onChange={handleChange1} />
                            </div>
                            <div class="col-md-2">
                                <label for="inputZip" class="form-label">*Zip</label>
                                <input type="text" class="form-control" id="inputZip" name="postcode" value={empData.postcode} onChange={handleChange1} />
                            </div>
                            {
                                err ? (
                                    <span style={{ color: "red" }}>*Please fill required fields</span>
                                ) : ("")
                            }
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary" onClick={handleSave}>Next</button>
                            </div>


                        </form>

                    </div>



                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <div style={styles.formContainer}>
                        <form class="row g-3">
                            <div class="col-md-6">
                                <label for="inputEmail4" class="form-label">*Upload passport size photo</label>
                                <input type="file" class="form-control" id="inputEmail4" name="file1" onChange={handleChange11} />
                                <img style={{ width: '30%', height: '30%' }} id="selectedImage" src={imagePreviewofPassport} alt="Selected Image" class="default-image" />
                            </div>
                            <div class="col-md-6">
                                <label for="inputPassword4" class="form-label">*Identity proof name</label>
                                <input type="text" class="form-control" id="inputPassword4" name="identity" value={empData.identity} onChange={handleChange1} />
                            </div>
                            <div class="col-md-4">
                                <label for="inputPassword4" class="form-label">* Upload identity proof</label>
                                <input type="file" class="form-control" id="inputPassword4" name="file2" onChange={handleChange12} />
                                <img style={{ width: '30%', height: '30%' }} id="selectedImage1" src={imagePreviewofDoc} alt="Selected Image" class="default-image" />

                            </div>
                            <div class="col-md-8">
                                <label for="inputPassword4" class="form-label">Access</label>
                                {/* <ul class="list-group">
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="firstCheckbox" checked={empData.access.dashboard} />
                                        <label class="form-check-label" for="firstCheckbox">Dashboard</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="secondCheckbox" checked={empData.access.notification} />
                                        <label class="form-check-label" for="secondCheckbox">Notifications</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox" checked={empData.access.addprod} />
                                        <label class="form-check-label" for="thirdCheckbox">Add Product</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox1" checked={empData.access.products} />
                                        <label class="form-check-label" for="thirdCheckbox1">Product</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox2" checked={empData.access.users} />
                                        <label class="form-check-label" for="thirdCheckbox2">Users</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox3" checked={empData.access.employees} />
                                        <label class="form-check-label" for="thirdCheckbox3">Employees</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox4" checked={empData.access.tags} />
                                        <label class="form-check-label" for="thirdCheckbox4">Tags</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox5" checked={empData.access.orders} />
                                        <label class="form-check-label" for="thirdCheckbox5">Orders</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox6" checked={empData.access.settings} />
                                        <label class="form-check-label" for="thirdCheckbox6">Settings</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox7" checked={empData.access.vendor} />
                                        <label class="form-check-label" for="thirdCheckbox7">Vendors</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox8" checked={empData.access.stocks} />
                                        <label class="form-check-label" for="thirdCheckbox8">Stocks</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox9" checked={empData.access.trasnsaction} />
                                        <label class="form-check-label" for="thirdCheckbox9">Transactions</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox10" checked={empData.access.tax} />
                                        <label class="form-check-label" for="thirdCheckbox10">Taxes</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox11" checked={empData.access.expproducts} />
                                        <label class="form-check-label" for="thirdCheckbox11">Expired Products</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox12" checked={empData.access.reqorders} />
                                        <label class="form-check-label" for="thirdCheckbox12">Requested Orders</label>
                                    </li>
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="checkbox" value="" id="thirdCheckbox13" checked={empData.access.platforms} />
                                        <label class="form-check-label" for="thirdCheckbox13">Platforms</label>
                                    </li>
                                </ul> */}
                                <ul className="list-group">
                                    {Object.keys(empData.access).map((key) => (
                                        <li className="list-group-item" key={key}>
                                            <input
                                                className="form-check-input me-1"
                                                type="checkbox"
                                                id={key}
                                                checked={empData.access[key]}
                                                onChange={handleAccessChange}
                                            />
                                            <label className="form-check-label" htmlFor={key}>
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {
                                err ? (
                                    <span style={{ color: "red" }}>*Please fill required fields</span>
                                ) : ("")
                            }
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary" onClick={handleSubmit}>Update</button>
                            </div>
                        </form>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Item Three Content
                </CustomTabPanel>
            </Box>

        </>
    )
}

const styles = {
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        //   maxWidth: '400px',
        margin: 'auto',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        outline: 'none',
        fontSize: '14px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        outline: 'none',
        fontSize: '14px',
        resize: 'vertical',
        minHeight: '80px',
    },
    submitBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        color: '#ffffff',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    '@media (maxWidth: 480px)': {
        formContainer: {
            padding: '15px',
        },
    },
};
export default Editemployee
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Message from '../custom/Message';
import { Grid, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';

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
   
            <Box
            sx={{
                height: '77vh', // Full viewport height
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden', // Prevent page overflow
                p: 3,
            }}
        >

            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
                Update Employee
            </Typography>
                        {/* Tabs Section */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="form tabs">
                    <Tab label="Step 1" {...a11yProps(0)} />
                    <Tab label="Step 2" {...a11yProps(1)} disabled={!isNextTabUnlocked} />
                </Tabs>
            </Box>
            {/* Tab Panels */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: { xs: 2, sm: 3 },
                }}
            >
                {/* Step 1: User Details Form */}
                {value === 0 && (
                    <Box maxWidth="800px" mx="auto">
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="First Name"
                                    name="firstname"
                                    value={empData.firstname}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Last Name"
                                    name="lastname"
                                    value={empData.lastname}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Phone Number"
                                    name="phone"
                                    value={empData.phone}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Email"
                                    name="email"
                                    value={empData.email}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="password"
                                    label="Set Password"
                                    name="password"
                                    value={empData.password}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Address"
                                    name="address"
                                    value={empData.address}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="City"
                                    name="city"
                                    value={empData.city}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    required
                                    label="State"
                                    name="state"
                                    value={empData.state}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Zip Code"
                                    name="postcode"
                                    value={empData.postcode}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            {err && (
                                <Grid item xs={12}>
                                    <Typography color="error">*Please fill all required fields</Typography>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleSave}
                                >
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Step 2: File Upload and Access */}
                {value === 1 && (
                    <Box maxWidth="800px" mx="auto">
                        <Typography variant="h6" gutterBottom>
                            Upload Documents & Access
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="file"
                                    label="Upload Passport Size Photo"
                                    InputLabelProps={{ shrink: true }}
                                    name="file1"
                                    onChange={handleChange1}
                                />
                                <img
                                    src={imagePreviewofPassport}
                                    alt="Passport Preview"
                                    style={{ marginTop: 10, width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Identity Proof Name"
                                    name="identity"
                                    value={empData.identity}
                                    onChange={handleChange1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="file"
                                    label="Upload Identity Proof"
                                    InputLabelProps={{ shrink: true }}
                                    name="file2"
                                    onChange={handleChange1}
                                />
                                <img
                                    src={imagePreviewofDoc}
                                    alt="Identity Proof Preview"
                                    style={{ marginTop: 10, width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Access Permissions</Typography>
                                {Object.keys(empData.access).map((key) => (
                                    <FormControlLabel
                                        key={key}
                                        control={
                                            <Checkbox
                                                checked={empData.access[key]}
                                                onChange={() => handleAccessChange(key)}
                                            />
                                        }
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    />
                                ))}
                            </Grid>
                            {err && (
                                <Grid item xs={12}>
                                    <Typography color="error">*Please fill all required fields</Typography>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleSubmit}
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
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
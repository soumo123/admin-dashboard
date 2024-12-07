import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Message from '../custom/Message';
import { Grid, TextField, Typography } from '@mui/material';

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


const AddEmployee = () => {
    const navigate = useNavigate()
    const [value, setValue] = React.useState(0);
    const [isNextTabUnlocked, setIsNextTabUnlocked] = React.useState(false);
    const [imagePreviewofPassport, setImagePreviewPassport] = useState("./default.jpg")
    const [imagePreviewofDoc, setImagePreviewofDoc] = useState("./default.jpg")
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
        file1: null,
        file2: null
    })

    const handleChange1 = (e) => {
        setErr(false)
        if (e.target.type === 'file') {
            setEmpData({ ...empData, [e.target.name]: e.target.files[0]});
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

    console.log("empData", empData)


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
                !identity || !file1 || !file2) {
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
            formDataToSend.append("file1", file1)
            formDataToSend.append("file2", file2)

            const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/addemp?adminId=${adminId}&shop_id=${shop_id}`, formDataToSend, config);
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
                Add Employee
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="Employee Form Steps">
                    <Tab label="Step 1" />
                    <Tab label="Step 2" disabled={value < 1} />
                </Tabs>
            </Box>
            <Box
                sx={{
                    flex: 1, // Allow content to fill remaining space
                    overflow: 'auto', // Make content scrollable
                    mt: 2,
                }}
            >
                {value === 0 && (
                    <Box sx={{ p: 3 }}>
                        <form onSubmit={handleSave}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="firstname"
                                        value={empData.firstname || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="lastname"
                                        value={empData.lastname || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        name="phone"
                                        value={empData.phone || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={empData.email || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={empData.password || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        value={empData.address || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        name="city"
                                        value={empData.city || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="State"
                                        name="state"
                                        value={empData.state || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Zip Code"
                                        name="postcode"
                                        value={empData.postcode || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                            </Grid>
                            {err && (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    *Please fill all required fields
                                </Typography>
                            )}
                            <Box sx={{ mt: 3 }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Next
                                </Button>
                            </Box>
                        </form>
                    </Box>
                )}
                {value === 1 && (
                    <Box sx={{ p: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        type="file"
                                        label="Passport Photo"
                                        name="file1"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Identity Proof Name"
                                        name="identity"
                                        value={empData.identity || ''}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        type="file"
                                        label="Upload Identity Proof"
                                        name="file2"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleChange1}
                                    />
                                </Grid>
                            </Grid>
                            {err && (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    *Please fill all required fields
                                </Typography>
                            )}
                            <Box sx={{ mt: 3 }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Box>
                        </form>
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
export default AddEmployee
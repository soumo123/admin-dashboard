import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
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
                                <input type="file" class="form-control" id="inputEmail4" name="file1" onChange={handleChange1} />
                                {/* <img style={{ width: '30%', height: '30%' }} id="selectedImage" src={imagePreviewofPassport} alt="Selected Image" class="default-image" /> */}
                            </div>
                            <div class="col-md-6">
                                <label for="inputPassword4" class="form-label">*Identity proof name</label>
                                <input type="text" class="form-control" id="inputPassword4" name="identity" value={empData.identity} onChange={handleChange1} />
                            </div>
                            <div class="col-md-4">
                                <label for="inputPassword4" class="form-label">* Upload identity proof</label>
                                <input type="file" class="form-control" id="inputPassword4" name="file2" onChange={handleChange1} />
                                {/* <img style={{ width: '30%', height: '30%' }} id="selectedImage1" src={imagePreviewofDoc} alt="Selected Image" class="default-image" /> */}

                            </div>

                            {
                                err ? (
                                    <span style={{ color: "red" }}>*Please fill required fields</span>
                                ) : ("")
                            }
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary" onClick={handleSubmit}>Submit</button>
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
export default AddEmployee
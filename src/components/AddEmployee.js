import React from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

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

    const [value, setValue] = React.useState(0);
    const [isNextTabUnlocked, setIsNextTabUnlocked] = React.useState(false);

    const handleChange = (event, newValue) => {
        // Prevent switching to a higher tab if it's locked
        if (newValue <= value || isNextTabUnlocked) {
            setValue(newValue);
        }
    };

    const handleSave = () => {
        // Unlock the next tab when the save button is clicked
        setIsNextTabUnlocked(true);
        setValue(1); // Jump to the next tab (Item 2)
    };


    return (
        <>
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
                                <input type="email" class="form-control" id="inputEmail4" />
                            </div>
                            <div class="col-md-4">
                                <label for="inputPassword4" class="form-label">*Last Name</label>
                                <input type="password" class="form-control" id="inputPassword4" />
                            </div>
                            <div class="col-md-4">
                                <label for="inputPassword4" class="form-label">*Phone number</label>
                                <input type="password" class="form-control" id="inputPassword4" />
                            </div>
                            <div class="col-4">
                                <label for="inputPassword4" class="form-label">Email</label>
                                <input type="email" class="form-control" id="inputPassword4" />
                            </div>
                            <div class="col-12">
                                <label for="inputAddress" class="form-label">*Address</label>
                                <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St" />
                            </div>

                            <div class="col-md-6">
                                <label for="inputCity" class="form-label">*City</label>
                                <input type="text" class="form-control" id="inputCity" />
                            </div>
                            <div class="col-md-4">
                                <label for="inputState" class="form-label">*State</label>
                                <input type="text" class="form-control" id="inputAddress" placeholder="State" />
                            </div>
                            <div class="col-md-2">
                                <label for="inputZip" class="form-label">*Zip</label>
                                <input type="text" class="form-control" id="inputZip" />
                            </div>
                         
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
                                <input type="file" class="form-control" id="inputEmail4" />
                            </div>
                            <div class="col-md-6">
                                <label for="inputPassword4" class="form-label">*Identity proof name</label>
                                <input type="password" class="form-control" id="inputPassword4" />
                            </div>
                            <div class="col-md-4">
                                <label for="inputPassword4" class="form-label">* Upload identity proof</label>
                                <input type="file" class="form-control" id="inputPassword4" />
                            </div>
                
                         
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary">Submit</button>
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
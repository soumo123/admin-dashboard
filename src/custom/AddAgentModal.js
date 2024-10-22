import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait';
import EmailIcon from '@mui/icons-material/Email';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Message from './Message';


const AddAgentModal = ({ modalShow2, setModalShow2, setRefresh2, vendorData, setMode }) => {

  const dispatch = useDispatch()
  const shop_id = localStorage.getItem("shop_id");
  const [imagePreview, setImagePreview] = useState("./avatar.jpg")
  const [vendorId, setVendorId] = useState("")
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    file: null // for storing the selected file
  });
  const [errorMessage, setErrorMessage] = useState('');
  const adminToken = localStorage.getItem("adminToken")
  const adminId = localStorage.getItem("adminId");

  const handleClose = () => {
    setModalShow2(false)
    setMode(0)
  }

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, file: e.target.files[0] });
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('selectedImage').src = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);


    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, address, file } = formData;
    if (!name || !email || !mobile || !address || !file || vendorId === "0") {
      setErrorMessage('Please fill in all fields');
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("email", email);
      formDataToSend.append("phone", mobile);
      formDataToSend.append("address", address);
      formDataToSend.append("file", file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };

      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/addAgent?shop_id=${shop_id}&vendor_id=${vendorId}&adminId=${adminId}`, formDataToSend, config);

      if (response.status === 201) {
        setFormData({})
        setMessageType("success")
        setMessage("Agent added")
        setModalShow2(false);
        setMode(0)
        setTimeout(() => {
          setMessage(false)
        }, 2000);
        dispatch(setRefresh2(new Date().getSeconds()))

      }
    } catch (error) {
      console.error('Error signing up:', error);
      setMessageType("error")
      setMessage(error.response.data.message)
      setTimeout(() => {
        setMessage(false)
      }, 2000);
    }
  };

  const modifyVendorData = vendorData && vendorData.map((ele) => {
    return {
      label: `${ele.vendor_name} (${ele.vendorId})`,
      value: `${ele.vendorId}`
    }


  })
  console.log("modifyVendorData", modifyVendorData)


  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <Modal
        show={modalShow2}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Agent
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <h4>Centered Modal</h4> */}
          <div className="row">
            <div className="col-md-">



              <div className="form-title">
                <div class="image-container">
                  <img id="selectedImage" src={imagePreview} alt="Selected Image" class="default-image" />
                  <label for="imageUpload" class="choose-image" onCl><AddCircleIcon /></label>
                  <input type="file" id="imageUpload" name="file" onChange={handleChange} />
                </div>


                <div className="email-input">
                  <div className='form-group'>
                    <label className="name-label" >
                      <StorefrontIcon />
                    </label>
                    <select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                      <option value="0">Select</option>
                      {
                        modifyVendorData && modifyVendorData.map((ele) => (
                          <option value={ele.value}>{ele.label}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>



                <div className="email-input">
                  <div className='form-group'>
                    <label className="name-label" >
                      <PersonIcon />
                    </label>
                    <input type="text" name="name" value={formData.name} placeholder="Enter name " onChange={handleChange} />
                  </div>
                </div>

                <div className="email-input mt-3">
                  <div className='form-group'>
                    <label className="signup-email-label" >
                      <EmailIcon />
                    </label>
                    <input type="text" name="email" value={formData.email} placeholder="Enter email " onChange={handleChange} />
                  </div>
                </div>

                <div className="email-input">
                  <div className='form-group'>
                    <label className="name-label" >
                      <AddLocationAltIcon />
                    </label>
                    <input type="text" name="address" value={formData.address} placeholder="Enter address " onChange={handleChange} />
                  </div>
                </div>

                <div className="email-input mt-3">
                  <div className='form-group'>
                    <label className="number-label" >
                      <StayCurrentPortraitIcon />
                    </label>
                    <input type="text" name="mobile" value={formData.mobile} placeholder="Enter Mobile No " onChange={handleChange} />
                  </div>
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Save</Button>

          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default AddAgentModal

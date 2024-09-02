import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait';
import EmailIcon from '@mui/icons-material/Email';
import Message from '../custom/Message';


const AddVendorModal = ({ modalShow1, setModalShow1,setRefresh1,setMode }) => {

  const dispatch = useDispatch()
  const shop_id = localStorage.getItem("shop_id");
  const [imagePreview, setImagePreview] = useState("./avatar.jpg")
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    file: null // for storing the selected file
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {
    setModalShow1(false)
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
    const { name, email, mobile, file } = formData;
    if (!name || !email || !mobile || !file) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("email", email);
      formDataToSend.append("phone", mobile);
      formDataToSend.append("file", file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/addVendor?shop_id=${shop_id}`, formDataToSend, config);

      if (response.status === 201) {
        setFormData({})
        setMessageType("success")
        setMessage("Vendor added")
        setModalShow1(false);
        setMode(0)
        
        setTimeout(() => {
          setMessage(false)
        }, 2000);
        dispatch(setRefresh1(new Date().getSeconds()))

      }
    } catch (error) {
      console.error('Error signing up:', error);
      setMessageType("error")
        setMessage("Oops , Something went wrong !")
        setTimeout(() => {
          setMessage(false)
        }, 2000);
    }
  };


  return (
    <>
    {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
      <Modal
        show={modalShow1}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Vendor
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

export default AddVendorModal

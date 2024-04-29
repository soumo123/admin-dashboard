import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import axios from 'axios';
import { noteRefs } from '../redux/actions/userAction'
import { useSelector, useDispatch } from 'react-redux'
import Message from '../custom/Message';


const AllProduct = ({ sidebarOpen }) => {

  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("")
  const adminId = localStorage.getItem("adminId")
  const type = localStorage.getItem("type")
  const dataRefe = useSelector((state) => state.noteRef.arr);
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")


  const handleClose = () => {
    setOpen(false);
    setProductId("")
  }

  const hanldleOpen = (id) => {
    setOpen(true)
    setProductId(id)
  }


  const getAllProductsByAdmin = async () => {

    try {

      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/get_admin_products?adminId=${adminId}&type=${type}`)
      if (response.status === 200) {
        setProducts(response.data.data)

      }

    } catch (error) {
      console.log(error.stack)
    }

  }


  const deleteProduct = async () => {

    try {

      const response = await axios.delete(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/delete_product_by_admin?adminId=${adminId}&type=${type}&productId=${productId}`)
      if (response.status = 200) {
        setOpen(false)
        setMessageType("success")
        setMessage("Product Deleted")
        dispatch(noteRefs(new Date().getSeconds()))

        setTimeout(() => {
          setMessage(false)
        }, 2000);
      } else {
        setOpen(false)
        setMessageType("error")
        setMessage("Product Not Deleted")
        setTimeout(() => {
          setMessage(false)
        }, 2000);
      }

    } catch (error) {

    }

  }



  useEffect(() => {
    getAllProductsByAdmin()
  }, [dataRefe])



  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <div className={`all-product ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Actual Price</th>
              <th>Stock</th>
              <th>Color</th>
              <th>Size</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products && products.map((ele) => (
              <tr key={ele.productId}>
                <td>{ele.productId}</td>
                <td>{ele.name}</td>
                <td>{ele.description}</td>
                <td>₹ {ele.price}</td>
                <td>{ele.discount} %</td>
                <td>₹ {ele.actualpricebydiscount}</td>
                <td>{ele.stock} pieces</td>
                <td>{ele.color}</td>
                <td>{ele.size}</td>
                <td>
                  <button className="btn btn-edit"><i className="fas fa-edit"></i> Edit</button>
                  <button className="btn btn-delete" onClick={() => hanldleOpen(ele.productId)}><i className="fas fa-trash-alt"></i> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteProduct} variant="contained" color="secondary">Yes</Button>
          <Button onClick={handleClose} variant="contained" color="primary" autoFocus>No</Button>
        </DialogActions>
      </Dialog>
    </>

  );
};

export default AllProduct;

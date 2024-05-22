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
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
const AllProduct = ({ sidebarOpen }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("")
  const adminId = localStorage.getItem("adminId")
  const type = localStorage.getItem("type")
  const dataRefe = useSelector((state) => state.noteRef.arr);
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [searchQuery, setSearchQuery] = useState('');
  const [lastTypingTime, setLastTypingTime] = useState(null);
  const [startPrice, setStartPrice] = useState("")
  const [lastPrice, setLatPrice] = useState("")
  const [loader, setloader] = useState(false);



  const handleClose = () => {
    setOpen(false);
    setProductId("")
  }

  const hanldleOpen = (id) => {
    setOpen(true)
    setProductId(id)
  }
  const handleSearch = (query) => {
    setLastTypingTime(new Date().getTime())
    setSearchQuery(query);
  };

  const handleStartPrice = (p1) => {
    setLastTypingTime(new Date().getTime())
    setStartPrice(p1);
  }

  const hanldleView = (id) => {
    navigate(`/vewProduct/${id}`)

  }


  const handleLastPrice = (p2) => {
    setLastTypingTime(new Date().getTime())
    setLatPrice(p2);
  }
  const getAllProductsByAdmin = async () => {

    try {

      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/get_admin_products?adminId=${adminId}&type=${type}&keyword=${searchQuery}&startprice=${startPrice}&lastprice=${lastPrice}`)
      if (response.status === 200) {
        setloader(true)
        setProducts(response.data.data)

      }

    } catch (error) {
      setloader(true)
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

  const hanleNavigate = (id) => {
    navigate(`/updateproduct/${id}`)
  }



  useEffect(() => {
    if (lastTypingTime) {
      const timer = setTimeout(() => {
        const getAllProductsByAdmin = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/get_admin_products?adminId=${adminId}&type=${type}&keyword=${searchQuery}&startprice=${startPrice}&lastprice=${lastPrice}`)
            if (response.status === 200) {
              console.log("response.data.data", response.data.data)
              setProducts(response.data.data)
            }
          } catch (error) {
            setProducts([])
          }
        };

        getAllProductsByAdmin();

      }, 1000);
      return () => clearTimeout(timer)
    }
  }, [searchQuery, startPrice, lastPrice])

  const handleCheck = async (check, pdId) => {
    let active = undefined
    console.log(check, "check")
    if (Number(check)) {
      active = 0
    } else {
      active = 1
    }
    console.log("activee", active)
    try {
      const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/active?adminId=${adminId}&type=${type}&productId=${pdId}&active=${active}`)
      if (response.status === 200) {
        setMessageType("success")
        setMessage("Status Update")
        dispatch(noteRefs(new Date().getSeconds()))
        setTimeout(() => {
          setMessage(false)
        }, 2000);
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
        <div className='form'>
          <div className="row">
            <div className="col-sm-4">
              <div className="form-group">
                <label>Search Products</label>
                <input type="text" placeholder="Search Products By Name and Description" className='form-control' value={searchQuery} name="search" onChange={(e) => handleSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label>Price starts from </label>
                <input type="number" placeholder="Enter Starting Price" className='form-control' value={startPrice} onChange={(e) => handleStartPrice(e.target.value)} />
              </div>
            </div>


            <div className="col-sm-4">
              <div className="form-group">
                <label>To</label>
                <input type="number" placeholder="Enter Last Price" className='form-control' value={lastPrice} onChange={(e) => handleLastPrice(e.target.value)} />
              </div>
            </div>
          </div>
        </div>







        <div className="table-responsive">
          <table className="table data-tables table-hover">
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
                {/* <th>Size</th> */}
                <th>active</th>
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
            ):(
              <>
              {
                products && products.length > 0 ? (
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
                      {/* <td>{ele.size}</td> */}
                      <td>
                        <div class="form-check form-switch">
                          <input data-toggle="tooltip" data-placement="top" title="Availability" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" value={ele.active} checked={ele.active} onChange={(e) => handleCheck(e.target.value, ele.productId)} />
                        </div>
                      </td>
                      <td>
    
                        <div className="data-icons">
                          <span data-toggle="tooltip" data-placement="top" title="View" style={{ cursor: "pointer" }} onClick={() => hanldleView(ele.productId)}><VisibilityIcon /></span>
                          <span data-toggle="tooltip" data-placement="top" title="Edit" style={{ cursor: "pointer" }} onClick={() => hanleNavigate(ele.productId)}><CreateIcon /></span>
                          <span data-toggle="tooltip" data-placement="top" title="Delete" style={{ cursor: "pointer" }} onClick={() => hanldleOpen(ele.productId)}><DeleteIcon /></span>
                        </div>
                      </td>
    
                    </tr>
                  ))}
                </tbody>
                ):(
                  <div className="container">
                  <div className="row">
                      <div className="col-12">
                          <div className="text-center">
                              No Products Product Found
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

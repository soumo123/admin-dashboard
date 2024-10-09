import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AddProductModal from '../custom/AddProductModal';
import Message from '../custom/Message';
import { useDispatch } from 'react-redux'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateStock = ({ sidebarOpen }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [agentData, setAgentData] = useState([]);
  const shop_id = localStorage.getItem("shop_id");
  const type = localStorage.getItem("type");
  const adminId = localStorage.getItem("adminId");
  const [open, setOpen] = React.useState(false);
  const [discount, setDiscount] = useState(0)
  const [loader, setLoader] = useState(false);
  const [boomer, setBoomer] = useState(false)
  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState([])
  const [savedProducts, setSavedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastTypingTime, setLastTypingTime] = useState(null);
  const [startPrice, setStartPrice] = useState('');
  const [lastPrice, setLastPrice] = useState('');
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [agId, setAgId] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [err, setErr] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [returnPrie, setReturnPrice] = useState(0)
  const [expireproducts, setExpireproducts] = useState([])
  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0)
  const [message, setMessage] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [weightErrors, setWeightErrors] = useState(false);
  const [ref, setRef] = useState(false)
  const [returnProducts, setReturnProducts] = useState([]);
  const [manufature_date, setManufactureDate] = useState("")
  const [expiry_date, setExpiryDate] = useState("")
  const [totalPages, setTotalPages] = useState(0);
  const [pd, setPd] = useState({})
  const [disMode, setDisMode] = useState("1")
  const[addedPrice,setAddedPrice] = useState(0)
  const[savePrice,setSavePrice] = useState(0)

  const handleSearch = (query) => {
    setLastTypingTime(new Date().getTime());
    setSearchQuery(query);
  };

  const handleStartPrice = (p1) => {
    setLastTypingTime(new Date().getTime());
    setStartPrice(p1);
  };

  const handleLastPrice = (p2) => {
    setLastTypingTime(new Date().getTime());
    setLastPrice(p2);
  };

  const getAllAgents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_al_agents?shop_id=${shop_id}&key=&statustype=${1}`);
      if (response.status === 200) {
        setAgentData(response.data.data);
      } else {
        setAgentData([]);
      }
    } catch (error) {
      setAgentData([]);
    }
  };
  console.log("savedProducts", savedProducts)
  // const getAllProductsByAdmin = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/get_admin_products?adminId=${adminId}&type=${type}&keyword=${searchQuery}&startprice=${startPrice}&lastprice=${lastPrice}`);
  //     if (response.status === 200) {
  //       setLoader(true);
  //       setProducts(response.data.data);
  //     }
  //   } catch (error) {
  //     setLoader(true);
  //     console.log(error.stack);
  //   }
  // };

  const getReqOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_req_orders_agents?adminId=${adminId}&agentId=${agId}`);
      if (response.status === 200) {
        setLoader(true);
        setProducts(response.data.data);
      }
    } catch (error) {
      setLoader(true);
      console.log(error.stack);
    }
  }



  useEffect(() => {
    // if (lastTypingTime) {
    //   const timer = setTimeout(() => {
    //     getAllProductsByAdmin();
    //   }, 1000);
    //   return () => clearTimeout(timer);
    // }
    // getAllProductsByAdmin();
    if (agId) {

      getReqOrders()
    }
  }, [ref, agId]);

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };

  const hanldleView = (id) => {
    navigate(`/vewProduct/${id}`)

  }

  const handleClose = () => {
    setShow(false);
    setSelectedProduct(null);
    // setRef((new Date().getSeconds()))
    setWeightErrors(false)
    setManufactureDate("")
    setExpiryDate("")

  };

  const handleWeightChange = (index, field, value) => {
    const updatedProduct = { ...selectedProduct };
    console.log("index, field, value", index, field, value)
    updatedProduct.weight[index][field] = Number(value);
    setSelectedProduct(updatedProduct);
    setWeightErrors(false)
  };

  const handleAddWeight = () => {
    const updatedProduct = { ...selectedProduct };
    updatedProduct.weight.push({ weight: 0, price: 0, stock: 0 });
    setSelectedProduct(updatedProduct);
  };

  const handleDeleteWeight = (index) => {
    const updatedProduct = { ...selectedProduct };
    updatedProduct.weight.splice(index, 1);
    setSelectedProduct(updatedProduct);
  };

  const handleReturnWeight = (index) => {
    const updatedProduct = { ...selectedProduct };
    const weightToReturn = updatedProduct.weight[index];

    // Remove the weight from selectedProduct
    updatedProduct.weight.splice(index, 1);
    setSelectedProduct(updatedProduct);

    // Update returnProducts state
    setReturnProducts(prevReturnProducts => {
      const existingProductIndex = prevReturnProducts.findIndex(p => p.productId === selectedProduct.productId);

      if (existingProductIndex > -1) {
        // Product already exists in returnProducts
        const updatedReturnProducts = [...prevReturnProducts];
        updatedReturnProducts[existingProductIndex].weights.push(weightToReturn);
        return updatedReturnProducts;
      } else {
        // Product does not exist, add a new entry
        return [
          ...prevReturnProducts,
          {
            name: selectedProduct.productname,
            productId: selectedProduct.productId,
            reqId: selectedProduct.reqId,
            weights: [weightToReturn]
          }
        ];
      }
    });
  };

  function validateWeightArray(productToSave) {
    for (const item of productToSave.weights) {
      if (!item.weight || !item.purchaseprice || !item.stock) {
        return true
      }
    }
    return false;
  }
  const handleSave = async () => {
    const productToSave = {
      productId: selectedProduct.productId,
      name: selectedProduct.productname,
      reqId: selectedProduct.reqId,
      weights: selectedProduct.weight,
      manufacture_date: manufature_date,
      expiry_date: expiry_date,
    };

    let err = validateWeightArray(productToSave)

    if (err) {
      setWeightErrors(true)
      return
    }
    setSavedProducts([...savedProducts, productToSave]);
    setManufactureDate("")
    setExpiryDate("")
    setShow(false);
  };

  const handleDeleteTransaction = (productId) => {
    setSavedProducts(savedProducts.filter(product => product.productId !== productId));
  };
  const handleDeleteAddedProduct = (productName) => {
    setAddedProducts(addedProducts.filter(product => product.productName !== productName));
  };


  const handleSelectAgentId = (e) => {
    setAgId(e)
  }



  const handleUpdateStock = async () => {
    try {

      if (!agId || agId === "") {
        setErr(true)
        return
      }
      setBoomer(true)
      let json = {
        savedProducts: savedProducts,
        addedProducts: addedProducts,
        returnProducts:selectedProducts,
        returnPrie:Number(returnPrie),
        cuttoffdiscount:discount || 0,
      }
      console.log("jsonjsonjsonjsonjson", json)
      const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/update_stock?adminId=${adminId}&agentId=${agId}&vendorId=${""}&type=${type}&shop_id=${shop_id}`, json, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 201) {
        setMessageType("success");
        setMessage("Stock Updated");
        setSavedProducts([])
        setAddedProducts([])
        setManufactureDate("")
        setExpiryDate("")
        setBoomer(false)
        setRef((new Date().getSeconds()))
        setTimeout(() => {
          setMessage(false);
        }, 2000);
      }

    } catch (error) {
      console.log(error)
      setBoomer(false)
      setMessageType("error");
      setMessage("Oops.. Something went wrong");
      setTimeout(() => {
        setMessage(false);
      }, 2000);
    }
  }

  const handleOpenNewProduct = () => {
    setOpenModal(true)
  }


  const getAllExpiredProducts = async () => {

    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/get_expiry_products?adminId=${adminId}&shop_id=${shop_id}&agentId=${agId}&limit=${limit}&offset=${offset}`);
      if (response.status === 200) {

        setExpireproducts(response.data.data);
        setTotalPages(Math.ceil(response.data.totaldata / limit));
      } else {

        setExpireproducts([]);
      }

    } catch (error) {

      setExpireproducts([]);
      console.log(error)
    }


  }

  useEffect(() => {
    if (agId) {
      getAllExpiredProducts()
    }
  }, [agId])


  useEffect(() => {
    getAllAgents();
    // getAllProductsByAdmin();
    getReqOrders()
  }, []);

  useEffect(() => {
    if (agId) {
      setErr(false)
    }

  }, [agId])


  useEffect(() => {
    let returnProductPrice;
    let saveProductPrice = savedProducts.reduce((total, product) => {
      return total + product.weights.reduce((subTotal, weight) => subTotal + (parseFloat(weight.purchaseprice) * parseInt(weight.stock)), 0);
    }, 0)
    setSavePrice(saveProductPrice)
    let addedProductPrice = addedProducts.reduce((total, product) => {
      return total + product.weights.reduce((subTotal, weight) => subTotal + (parseFloat(weight.purchaseprice) * parseInt(weight.stock)), 0);
    }, 0)
    setAddedPrice(addedProductPrice)
    if (disMode === "1") {
      returnProductPrice = selectedProducts.reduce((total, product) => {
        return total + product.weights.reduce((subTotal, weight) => subTotal + (parseFloat(weight.purchaseprice) * parseInt(weight.stock)), 0);
      }, 0)
      let discountedPrice = returnProductPrice - (returnProductPrice * (discount / 100));
      returnProductPrice = discountedPrice
      console.log("returnProductPrice",returnProductPrice)
      setReturnPrice(discountedPrice)
    }
    if (disMode === "2") {
     returnProductPrice = selectedProducts.reduce((total, product) => {
        // Calculate product's total price before discount
        let productTotal = product.weights.reduce((subTotal, weight) => {
          return subTotal + (parseFloat(weight.purchaseprice) * parseInt(weight.stock));
        }, 0);

        // Apply the cutoff discount for the product
        let discount = product.cuttoffdiscount || 0; // Use 0 if no discount is provided
        let discountedProductTotal = productTotal - (productTotal * (discount / 100));

        // Add the discounted total to the overall total

        setReturnPrice(total + discountedProductTotal)
      }, 0);
      

    }

    console.log("returnProductPricereturnProductPrice",returnProductPrice)

    setTotalPrice((saveProductPrice + addedProductPrice) - returnProductPrice)
  }, [savedProducts, addedProducts, selectedProducts, discount, disMode])


  // Handle date change
  const handleDateChange = (newDate) => {
    const formattedDate = dayjs(newDate).format('YYYY-MM-DD'); // Or any format you prefer
    setManufactureDate(formattedDate)

  };

  const handleopendia = (product,checked) => {



    if (disMode === "1" && checked) {
      handleCheckboxChange1(product)
    } else if (disMode === "2" && checked) {
      setOpen(true)
      setPd(product)
      setDiscount(0)
    } else {
      setOpen(false)
      handleCheckboxChange1(product)
      setDiscount(0)

    }
  }

  const handleCheckboxChange1 = (pd) => {
    const isAlreadySelected = selectedProducts.find(p => p.productId === pd.productId);

    if (isAlreadySelected) {
      // Remove product if unchecked
      setSelectedProducts(selectedProducts.filter(p => p.productId !== pd.productId));
    } else {
      // Add product if checked
      const productToAdd = {
        productId: pd.productId,
        name: pd.name,
        cuttoffdiscount: Number(discount),
        weights: pd.weight,
        expiry_date: '',
        manufacture_date: ''
      };
      setSelectedProducts([...selectedProducts, productToAdd]);
    }
    setOpen(false)
  };

  console.log("selectedProducts", selectedProducts)

  const handleCheckboxChange = () => {
    const isAlreadySelected = selectedProducts.find(p => p.productId === pd.productId);

    if (isAlreadySelected) {
      // Remove product if unchecked
      setSelectedProducts(selectedProducts.filter(p => p.productId !== pd.productId));
    } else {
      // Add product if checked
      const productToAdd = {
        productId: pd.productId,
        name: pd.name,
        cuttoffdiscount: Number(discount),
        weights: pd.weight,
        expiry_date: '',
        manufacture_date: ''
      };
      setSelectedProducts([...selectedProducts, productToAdd]);
    }
    setOpen(false)
  };
  const handleClosedia = () => {
    setOpen(false);
    setSelectedProducts([...selectedProducts]);
    setDiscount(0)

  };

  const handleDisMode = (e) => {
    setDisMode(e)
  }


  const handleDateChange1 = (newDate) => {
    const formattedDate = dayjs(newDate).format('YYYY-MM-DD'); // Or any format you prefer
    setExpiryDate(formattedDate)
  };
  console.log("selectedProductselectedProduct", selectedProducts)
  console.log("addedProducts", addedProducts)




  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <div className="row">
        <div className="col-md-8">
          <div className="header">
            <h1>Update Stock / Add Product</h1>
          </div>

          <div className="content">
            <label htmlFor="agent-id">* Agent Id</label>
            <Form.Select id="agent-id" value={agId} onChange={(e) => handleSelectAgentId(e.target.value)}>
              <option value="">Select agent id</option>
              {agentData &&
                agentData.map((ele) => (
                  <option key={ele.agentId} value={ele.agentId}>{`${ele.agent_name}(${ele.agentId})`}</option>
                ))}

            </Form.Select>
            {err === true ? <p style={{ color: "red" }}>* Please select the agent id</p> : ""}
            <Button className="mt-3" onClick={handleOpenNewProduct}>+ Add New Product</Button>
          </div>
          <div className="product-list">
            <div className={`all-product ${sidebarOpen ? 'sidebar-open' : ''}`}>
              {/* <Form>
                <Row>
                  <Col sm={4}>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Search Products By Name and Description"
                        value={searchQuery}
                        name="search"
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                </Row>
              </Form> */}

              {/* <div className="table-responsive mt-4">
                <table className="table data-tables table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Expired</th>
                      <th>Delivery Partner</th>
                      <th>Weight & Price</th>
                    
                      <th>Color</th>
                    </tr>
                  </thead>
                  {!loader ? (
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                          <div className="text-center">loading....</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {products && products.length > 0 ? (
                        <tbody>
                          {products.map((ele) => (
                            <React.Fragment key={ele.productId}>
                              <tr onClick={() => handleOpen(ele)}>
                                <td>{ele.productId}</td>
                                <td>{ele.name}</td>
                                <td>{ele.description}</td>
                            <td>{ele.expired ? <p style={{color: 'red'}}>Expired</p>:<p style={{color: 'green'}}>Not Expire</p>}</td>
                                
                           
                                <td>{ele.delivery_partner}</td>
                                <td>
                                  {

                                    ele.weight && ele.weight.map((item) => (
                                      <>
                                        <p>Weight : {item.weight} {ele.unit}, Quantity : {item.stock} , Price : ₹ {item.price}</p>

                                      </>
                                    ))

                                  }
                                </td>
                                
                                <td>{ele.color}</td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      ) : (
                        <div className="container">
                          <div className="row">
                            <div className="col-12">
                              <div className="text-center">No Products Found</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </table>
              </div> */}
              <div className="table-responsive mt-4">
                <table className="table data-tables table-hover">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Weight & Price</th>


                    </tr>
                  </thead>
                  {!loader ? (
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                          <div className="text-center">loading....</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {products && products.length > 0 ? (
                        <tbody>
                          {products.map((ele) => (
                            <React.Fragment key={ele.productId}>
                              <tr onClick={() => handleOpen(ele)}>
                                <td>{ele.productId}</td>
                                <td>{ele.productname}</td>
                                {/* <td>{ele.expired ? <p style={{color: 'red'}}>Expired</p>:<p style={{color: 'green'}}>Not Expire</p>}</td>
                                <td>{ele.delivery_partner}</td> */}
                                <td>
                                  {
                                    ele.weight && ele.weight.map((item) => (
                                      <>
                                        <p>Weight : {item.weight} {ele.unit}, Quantity : {item.stock} , Price : ₹ {item.price}</p>

                                      </>
                                    ))
                                  }
                                </td>

                                {/* <td>{ele.color}</td> */}
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      ) : (
                        <div className="container">
                          <div className="row">
                            <div className="col-12">
                              <div className="text-center">No Products Found</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </table>
              </div>
            </div>
          </div>

          {selectedProduct && (
            <Modal show={show} size="lg" onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Update Stock</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                      Product Name:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control plaintext readOnly defaultValue={selectedProduct.productname} />
                    </Col>
                  </Form.Group>
                  {selectedProduct.weight.map((item, index) => (
                    <Form.Group key={index} as={Row} className="mb-3 align-items-center">

                      <Col sm="3">
                        <Form.Label>Weight:</Form.Label>
                        <Form.Control
                          type="text"
                          value={item.weight}
                          onChange={(e) => handleWeightChange(index, 'weight', e.target.value)}
                        />
                      </Col>
                      <Col sm="3">
                        <Form.Label>Purchas Price:</Form.Label>
                        <Form.Control
                          type="number"
                          value={item.purchaseprice}
                          onChange={(e) => handleWeightChange(index, 'purchaseprice', Number(e.target.value))}
                        />
                      </Col>
                      <Col sm="3">
                        <Form.Label>Stock:</Form.Label>
                        <Form.Control
                          type="number"
                          value={item.stock}
                          onChange={(e) => handleWeightChange(index, 'stock', Number(e.target.value))}
                        />
                      </Col>
                      <Col sm="3">
                        <Form.Label>Selling Price:</Form.Label>
                        <Form.Control
                          type="number"
                          value={item.price}
                          // onChange={(e) => handleWeightChange(index, 'price', Number(e.target.value))}
                          readOnly
                        />
                      </Col>
                      <Col sm="3">
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDeleteWeight(index)}
                        >
                          Delete
                        </Button>
                        {/* <Button variant="danger" onClick={() => handleReturnWeight(index)}>Return</Button> */}
                      </Col>

                    </Form.Group>
                  ))}
                  {
                    weightErrors ? (
                      <p style={{ color: 'red' }}>* Please select the specific fields</p>
                    ) : ("")
                  }

                  <Button onClick={handleAddWeight} variant="outline-primary" className="mt-3">
                    + Add Weight
                  </Button>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Manufacture Date"
                        value={dayjs(manufature_date)} // Convert it back to a Dayjs object if needed
                        onChange={(newDate) => handleDateChange(newDate)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Expiry Date"
                        value={dayjs(expiry_date)} // Convert it back to a Dayjs object if needed
                        onChange={(newDate) => handleDateChange1(newDate)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleSave} variant="success">Save</Button>
                <Button onClick={handleClose} variant="secondary">Close</Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
        <div className="col-md-4">
          <div className="transaction-container">
            <h2>Transaction:</h2>
            <div className="product-container">
              {savedProducts.length > 0 ? (
                savedProducts.map((product) => (
                  <div className="product-card" key={product.productId}>
                    <p>{product.name} ({product.productId})</p>
                    {product.weights.map((weight, index) => (
                      <p key={index}>Weight: {weight.weight}, Price: ₹{weight.purchaseprice}, Stock: {weight.stock}</p>
                    ))}
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDeleteTransaction(product.productId)}
                    >
                      Delete
                    </Button>

                  </div>

                ))
              ) : (
                <p>No transactions found</p>
              )}

            </div>
            <p>----------------------------------------------</p>
            <h2>New Products</h2>
            <div className="product-container">
              {addedProducts.length > 0 ? (
                addedProducts.map((product) => (
                  <div className="product-card" key={product.prdouctName}>
                    <p>Product Name: {product.productName}</p>
                    <p>Unit :{product.unit}</p>

                    {product.weights.map((weight, index) => (
                      <p key={index}>Weight: {weight.weight}, Price: ₹{weight.purchaseprice}, Stock: {weight.stock}</p>
                    ))}
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDeleteAddedProduct(product.productName)}
                    >
                      Delete
                    </Button>


                  </div>

                ))
              ) : (
                <p>No transactions found</p>
              )}

            </div>




            <p>----------------------------------------------</p>
            <h2>Return Products</h2>
            <div className="product-container">
              {selectedProducts.length > 0 ? (
                selectedProducts && selectedProducts?.map((product) => (
                  <div className="product-card" key={product.productId}>
                    <p>{product.name} ({product.productId})</p>
                    {product.weights.map((weight, index) => (
                      <p key={index}>Weight: {weight.weight}, Price: ₹{weight.purchaseprice}, Stock: {weight.stock}</p>
                    ))}
                  </div>
                ))
              ) : (
                <p>No transactions found</p>
              )}

            </div>


            <p className="total-price">Total added products Price: ₹{Math.abs(addedPrice + savePrice)}</p>
            {returnPrie > 0 ? (<p className="total-price">Return Product Price: - ₹{returnPrie}</p>) : ("")}

            {

              disMode === "1" ? (
                <div className='row'>
                  <div className="col">
                    <label for="inputEmail4" class="form-label">Cut off discount (%)</label>

                    <input type="number" className="form-control" value={discount} onChange={(e) => setDiscount(e.target.value)} />

                  </div>
                </div>
              ) : ("")

            }
            <p className="total-price">Net Price : ₹ {Math.abs(totalPrice)}</p>

            <button className="create-button" onClick={handleUpdateStock} disabled={boomer ? true : false}>{boomer ? "Updating..." : "Update Stock"}</button>
          </div>
          <div className="transaction-container mt-4">

            <h2>Expired Products:</h2>
            <select className="form-control" value={disMode} onChange={(e) => handleDisMode(e.target.value)}>
              <option value="">Select</option>
              <option value="1">Overall Discount</option>
              <option value="2">Individual Discount</option>
            </select>
            <div style={{ height: "200px", overflowY: "auto" }}>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Select</th>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">View</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    expireproducts && expireproducts.length > 0 ? (
                      <>
                        {
                          expireproducts.map((ele) => (
                            <tr>
                              <td><input class="form-check-input" type="checkbox" id="flexCheckDefault" onChange={(e) => handleopendia(ele,e.target.checked)} /></td>
                              <td><img src={ele.image} style={{ width: '100%', height: '100%' }} /></td>
                              <td>{ele.name}</td>
                              <td style={{cursor:"pointer"}} onClick={() => hanldleView(ele.productId)}><VisibilityIcon /></td>
                            </tr>
                          ))
                        }

                      </>

                    ) : (
                      <p>No products found</p>
                    )
                  }


                </tbody>
              </table>
            </div>
          </div>
        </div>


        {
          openModal ? (
            <>
              <AddProductModal openModal={openModal} setOpenModal={setOpenModal} setAddedProducts={setAddedProducts} />
            </>
          ) : ("")
        }

      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Cutt-off discount
          </DialogContentText>
          <div className="row">
            <div className="col">
              <input type="text" className="form-control" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosedia}>close</Button>
          <Button onClick={handleCheckboxChange}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateStock;

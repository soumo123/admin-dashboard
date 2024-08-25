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


const UpdateStock = ({ sidebarOpen }) => {
  const dispatch = useDispatch()
  const [agentData, setAgentData] = useState([]);
  const shop_id = localStorage.getItem("shop_id");
  const type = localStorage.getItem("type");
  const adminId = localStorage.getItem("adminId");

  const [loader, setLoader] = useState(false);
  const [boomer, setBoomer] = useState(false)
  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState([])
  const [savedProducts, setSavedProducts] = useState([]);
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

  const [message, setMessage] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [weightErrors, setWeightErrors] = useState(false);
  const [ref, setRef] = useState(false)
  const [returnProducts, setReturnProducts] = useState([]);
  const [manufature_date, setManufactureDate] = useState("")
  const [expiry_date, setExpiryDate] = useState("")

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
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_al_agents?shop_id=${shop_id}&key=`);
      if (response.status === 200) {
        setAgentData(response.data.data);
      } else {
        setAgentData([]);
      }
    } catch (error) {
      setAgentData([]);
    }
  };

  const getAllProductsByAdmin = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/get_admin_products?adminId=${adminId}&type=${type}&keyword=${searchQuery}&startprice=${startPrice}&lastprice=${lastPrice}`);
      if (response.status === 200) {
        setLoader(true);
        setProducts(response.data.data);
      }
    } catch (error) {
      setLoader(true);
      console.log(error.stack);
    }
  };

  useEffect(() => {
    // if (lastTypingTime) {
    //   const timer = setTimeout(() => {
    //     getAllProductsByAdmin();
    //   }, 1000);
    //   return () => clearTimeout(timer);
    // }
    getAllProductsByAdmin();
  }, [ref]);

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };

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
            name: selectedProduct.name,
            productId: selectedProduct.productId,
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
  console.log("selectedProduct.weightselectedProduct.weight", savedProducts)
  const handleSave = async () => {
    const productToSave = {
      productId: selectedProduct.productId,
      name: selectedProduct.name,
      weights: selectedProduct.weight,
      manufacture_date: manufature_date,
      expiry_date: expiry_date,
    };
    console.log("productToSave", productToSave)
    let err = validateWeightArray(productToSave)
    console.log("errerrerrerr", err)
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

  console.log("savedProducts", savedProducts)

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


  useEffect(() => {
    getAllAgents();
    getAllProductsByAdmin();
  }, []);

  useEffect(() => {
    if (agId) {
      setErr(false)
    }

  }, [agId])


  useEffect(() => {

    let saveProductPrice = savedProducts.reduce((total, product) => {
      return total + product.weights.reduce((subTotal, weight) => subTotal + (parseFloat(weight.purchaseprice) * parseInt(weight.stock)), 0);
    }, 0)
    let addedProductPrice = addedProducts.reduce((total, product) => {
      return total + product.weights.reduce((subTotal, weight) => subTotal + (parseFloat(weight.purchaseprice) * parseInt(weight.stock)), 0);
    }, 0)

    let returnProductPrice = returnProducts.reduce((total, product) => {
      return total + product.weights.reduce((subTotal, weight) => subTotal + (parseFloat(weight.purchaseprice) * parseInt(weight.stock)), 0);
    }, 0)

    setReturnPrice(returnProductPrice)
    setTotalPrice(saveProductPrice + addedProductPrice)
  }, [savedProducts, addedProducts, returnProducts])


  // Handle date change
  const handleDateChange = (newDate) => {
    const formattedDate = dayjs(newDate).format('YYYY-MM-DD'); // Or any format you prefer
    setManufactureDate(formattedDate)

  };
  const handleDateChange1 = (newDate) => {
    const formattedDate = dayjs(newDate).format('YYYY-MM-DD'); // Or any format you prefer
    setExpiryDate(formattedDate)
  };
  console.log("returnProducts", returnProducts)
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
              <Form>
                <Row>
                  <Col sm={4}>
                    <Form.Group>
                      {/* <Form.Label>Search Products</Form.Label> */}
                      <Form.Control
                        type="text"
                        placeholder="Search Products By Name and Description"
                        value={searchQuery}
                        name="search"
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  {/* <Col sm={4}>
                    <Form.Group>
                      <Form.Label>Price starts from</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Starting Price"
                        value={startPrice}
                        onChange={(e) => handleStartPrice(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={4}>
                    <Form.Group>
                      <Form.Label>To</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Last Price"
                        value={lastPrice}
                        onChange={(e) => handleLastPrice(e.target.value)}
                      />
                    </Form.Group>
                  </Col> */}
                </Row>
              </Form>

              <div className="table-responsive mt-4">
                <table className="table data-tables table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Expired</th>
                      <th>Delivery Partner</th>
                      <th>Weight & Price</th>
                      {/* <th>Actual Price</th>
                      <th>Stock</th> */}
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
                                
                                {/* <td>₹ {ele.price}</td> */}
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
                                {/* <td>{ele.discount} %</td> */}
                                {/* <td>₹ {ele.actualpricebydiscount}</td> */}
                                {/* <td>{ele.stock} pieces</td> */}
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
                      <Form.Control plaintext readOnly defaultValue={selectedProduct.name} />
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





{/* 
            <p>----------------------------------------------</p>
            <h2>Return Products</h2>
            <div className="product-container">
              {returnProducts.length > 0 ? (
                returnProducts.map((product) => (
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

            </div> */}


            {returnPrie > 0 ? (<p className="total-price">Return Product Price: - ₹{returnPrie}</p>) : ("")}
            <p className="total-price">Total Price: ₹{totalPrice}</p>
            <p className="total-price">Net Price : ₹{totalPrice - returnPrie}</p>

            <button className="create-button" onClick={handleUpdateStock} disabled={boomer ? true : false}>{boomer ? "Updating..." : "Update Stock"}</button>
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
    </>
  );
};

export default UpdateStock;

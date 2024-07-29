import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Box, IconButton, Typography, Divider, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Message from '../custom/Message';

const AddProductModal = ({ openModal, setOpenModal, setAddedProducts }) => {
  const [products, setProducts] = useState([]);
  const [forms, setForms] = useState([{ id: Date.now(), productName: '', unit: '', weights: [], weightInput: { weight: '', price: 0, stock: 0 }, weightFormVisible: false }]);

  const [message, setMessage] = useState(false);
  const [messageType, setMessageType] = useState("");
  const type = localStorage.getItem("type");
  const adminId = localStorage.getItem("adminId");
  const shop_id = localStorage.getItem("shop_id");
  const { agentId, vendorId } = useParams();

  const handleAddWeight = (formIndex) => {
    const newForms = [...forms];
    const form = newForms[formIndex];
    form.weights.push({ ...form.weightInput });
    form.weightInput = { weight: '', price: 0, stock: 0 };
    form.weightFormVisible = false;
    setForms(newForms);
  };

  const handleDeleteWeight = (formIndex, weightIndex) => {
    const newForms = [...forms];
    const form = newForms[formIndex];
    form.weights = form.weights.filter((_, i) => i !== weightIndex);
    setForms(newForms);
  };

  const handleFormChange = (formIndex, field, value) => {
    const newForms = [...forms];
    newForms[formIndex][field] = value;
    setForms(newForms);
  };

  const handleWeightInputChange = (formIndex, field, value) => {
    const newForms = [...forms];
    newForms[formIndex].weightInput[field] = value;
    setForms(newForms);
  };

  const handleAddProduct = (formIndex) => {
    const form = forms[formIndex];
    const product = {
      productName: form.productName,
      unit: form.unit,
      weights: form.weights
    };
    setProducts([...products, product]);
    const newForms = forms.filter((_, index) => index !== formIndex);
    setForms(newForms);
  };

  const handleAddMoreForm = () => {
    setForms([...forms, { id: Date.now(), productName: '', unit: '', weights: [], weightInput: { weight: '', price: 0, stock: 0 }, weightFormVisible: false }]);
  };

  const handleDeleteProduct = (productIndex) => {
    const newProducts = products.filter((_, index) => index !== productIndex);
    setProducts(newProducts);
    if (newProducts.length === 0) {
      setForms([{ id: Date.now(), productName: '', unit: '', weights: [], weightInput: { weight: '', price: 0, stock: 0 }, weightFormVisible: false }]);
    }
  };

  // const addAgentProduct = async () => {
  //     try {
  //         const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/addinventory?adminId=${adminId}&agentId=${agentId}&vendorId=${vendorId}&type=${type}&shop_id=${shop_id}`, products, {
  //             headers: {
  //                 'Content-Type': 'application/json'
  //             }
  //         });
  //         if (response.status === 201) {
  //             setMessageType("success");
  //             setMessage("Product Added");
  //             setProducts([]);
  //             setForms([{ id: Date.now(), name: '', unit: '', weights: [], weightInput: { weight: '', price: '', stock: '' }, weightFormVisible: false }]);
  //             setTimeout(() => {
  //                 setMessage(false);
  //             }, 2000);
  //         }
  //     } catch (error) {
  //         console.log(error);
  //         setMessageType("error");
  //         setMessage("Oops.. Something went wrong");
  //         setTimeout(() => {
  //             setMessage(false);
  //         }, 2000);
  //     }
  // };

  const handleClose = () => {
    setOpenModal(false);
    setAddedProducts(products)
  };

  const handleCancel = ()=>{
    setOpenModal(false);
    setProducts([])
    setForms([{ id: Date.now(), productName: '', unit: '', weights: [], weightInput: { weight: '', price: 0, stock: 0 }, weightFormVisible: false }]);
    setAddedProducts([])

  }



  return (
    <>
      {
        openModal ? (
          <>

           <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
           <Button variant="contained" color="primary"sx={{ mb: 4 }} onClick={handleCancel}>
           Cancel
          </Button>
           {products.length > 0 && (
          <Button variant="contained" color="primary" onClick={handleAddMoreForm} sx={{ mb: 4 }}>
            Add More
          </Button>
        )}
           </Box>
            {forms.map((form, formIndex) => (
              <Box key={form.id} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h6">Product {formIndex + 1}</Typography>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAddProduct(formIndex);
                }}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    margin="normal"
                    value={form.productName}
                    onChange={(e) => handleFormChange(formIndex, 'productName', e.target.value)}
                  />
                  <TextField
                    label="Unit"
                    fullWidth
                    margin="normal"
                    value={form.unit}
                    onChange={(e) => handleFormChange(formIndex, 'unit', e.target.value)}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Button variant="outlined" onClick={() => handleFormChange(formIndex, 'weightFormVisible', true)}>
                      Add Weight
                    </Button>
                  </Box>
                  <List>
                    {form.weights.map((weight, weightIndex) => (
                      <ListItem
                        key={weightIndex}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteWeight(formIndex, weightIndex)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={`Weight: ${weight.weight}, Price: ${weight.price}, Stock: ${weight.stock}`} />
                      </ListItem>
                    ))}
                  </List>
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Save Product
                  </Button>
                </form>

                <Dialog open={form.weightFormVisible} onClose={() => handleFormChange(formIndex, 'weightFormVisible', false)}>
                  <DialogTitle>Add Weight</DialogTitle>
                  <DialogContent>
                    <TextField
                      label="Weight"
                      fullWidth
                      margin="normal"
                      type="number"
                      value={form.weightInput.weight}
                      onChange={(e) => handleWeightInputChange(formIndex, 'weight', e.target.value)}
                    />
                    <TextField
                      label="Price"
                      fullWidth
                      margin="normal"
                      type="number"
                      value={form.weightInput.price}
                      onChange={(e) => handleWeightInputChange(formIndex, 'price', e.target.value)}
                    />
                    <TextField
                      label="Stock"
                      fullWidth
                      margin="normal"
                      type="number"
                      value={form.weightInput.stock}
                      onChange={(e) => handleWeightInputChange(formIndex, 'stock', e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => handleAddWeight(formIndex)} color="primary" variant="contained">
                      Add
                    </Button>
                    <Button onClick={() => handleFormChange(formIndex, 'weightFormVisible', false)} color="secondary" variant="outlined">
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            ))}
            <Box sx={{ mt: 4 }}>
              {products.length > 0 && (
                <Typography variant="h6">Products List</Typography>
              )}
              {products.map((product, index) => (
                <Card key={index} sx={{ mb: 2, boxShadow: 3, borderRadius: 2, p: 2, backgroundColor: '#f9f9f9' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{product.productName}</Typography>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProduct(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Unit: {product.unit}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Weights:</Typography>
                    <List>
                      {product.weights.map((weight, weightIndex) => (
                        <ListItem key={weightIndex}>
                          <ListItemText primary={`Weight: ${weight.weight}, Price: ${weight.price}, Stock: ${weight.stock}`} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Button type="button" variant="contained" color="primary" onClick={handleClose}>
              Add 
            </Button>
            {message && <Message type={messageType} message={message} />}
          </>
        ) : ("")
      }

    </>
  );
};

export default AddProductModal;

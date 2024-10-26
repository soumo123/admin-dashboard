import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Box, IconButton, Typography, Divider, Card, CardContent, CardActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Message from '../custom/Message';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from 'dayjs';

const AddVendorProducts = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [forms, setForms] = useState([{ id: Date.now(), productName: '', unit: '', manufacture_date: null, expiry_date: null, weights: [], weightInput: { weight: '', price: 0, stock: 0, purchaseprice: 0 }, weightFormVisible: false }]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const type = localStorage.getItem("type")
  const adminId = localStorage.getItem("adminId");
  const shop_id = localStorage.getItem("shop_id");
  // const { agentId, vendorId } = useParams();
  const [searchData, setSerachData] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [lastTypingTime, setLastTypingTime] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const [agentId, setAgentId] = useState("")
  const [vendorId, setVendorId] = useState("")
  const [title, setTitle] = useState("")
  const [err, setErr] = useState(false)
  const [loader, setLoader] = useState(false)
  const adminToken = localStorage.getItem("adminToken")

  const handleAddWeight = (formIndex) => {
    setErr(false)
    const newForms = [...forms];
    const form = newForms[formIndex];
    form.weights.push(form.weightInput);
    form.weightInput = { weight: '', price: 0, stock: 0, purchaseprice: 0 };
    form.weightFormVisible = false;
    setForms(newForms);
  };

  const handleDeleteWeight = (formIndex, weightIndex) => {
    setErr(false)
    const newForms = [...forms];
    const form = newForms[formIndex];
    form.weights = form.weights.filter((_, i) => i !== weightIndex);
    setForms(newForms);
  };

  const handleFormChange = (formIndex, field, value) => {
    setErr(false)
    const newForms = [...forms];
    newForms[formIndex][field] = value;
    setForms(newForms);
  };

  const handleWeightInputChange = (formIndex, field, value) => {
    setErr(false)
    const newForms = [...forms];
    newForms[formIndex].weightInput[field] = value;
    setForms(newForms);
  };

  const handleAddProduct = (formIndex) => {
    setErr(false)
    const form = forms[formIndex];
    const product = {
      productName: form.productName,
      unit: form.unit,
      weights: form.weights,
      manufacture_date: form.manufacture_date,
      expiry_date: form.expiry_date

    };
    let validationResult = validateData(product);
    if (validationResult) {
      setErr(true)
      return
    }
    setProducts([...products, product]);
    const newForms = forms.filter((_, index) => index !== formIndex);
    setForms(newForms);
  };

  const handleAddMoreForm = () => {
    setForms([...forms, { id: Date.now(), productName: '', unit: '', manufacture_date: null, expiry_date: null, weights: [], weightInput: { weight: '', price: 0, stock: 0, purchaseprice: 0 }, weightFormVisible: false }]);
  };

  const handleClearall = () => {
    setSelectedOption(null)
    setAgentId("")
    setVendorId("")
    setTitle("")
  }

  const handleDeleteProduct = (productIndex) => {
    setErr(false)
    const newProducts = products.filter((_, index) => index !== productIndex);
    setProducts(newProducts);
    if (newProducts.length === 0) {
      setForms([{ id: Date.now(), productName: '', unit: '', manufacture_date: null, expiry_date: null, weights: [], weightInput: { weight: '', price: 0, stock: 0, purchaseprice: 0 }, weightFormVisible: false }]);
    }
  };

console.log("productsporductsproductsproducts",products)

  const addAgentProduct = async () => {

    try {
      if (products.length === 0 || !agentId) {
        setErr(true)
        return
      }
      setLoader(true)
      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/addinventory?adminId=${adminId}&agentId=${agentId}&vendorId=${vendorId}&type=${type}&shop_id=${shop_id}`, products, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (response.status === 201) {
        setLoader(false)
        setMessageType("success")
        setMessage("Product Added")
        setProducts([])
        setSelectedOption(null)
        setForms([{ id: Date.now(), name: '', unit: '', manufacture_date: null, expiry_date: null, weights: [], weightInput: { weight: '', price: 0, stock: 0, purchaseprice: 0 }, weightFormVisible: false }])
        setTimeout(() => {
          setMessage(false)
        }, 2000);
        navigate("/allproducts")
      }
    } catch (error) {
      console.log(error)
      setMessageType("error")
      setMessage("Oops.. Something went wrong")
      setLoader(false)
      setTimeout(() => {
        setMessage(false)
      }, 2000);
    }
  }



  // Handle date change
  const handleDateChange = (formIndex, newDate) => {
    const formattedDate = dayjs(newDate).format('YYYY-MM-DD'); // Or any format you prefer
    handleFormChange(formIndex, 'manufacture_date', formattedDate);
  };
  const handleDateChange1 = (formIndex, newDate) => {
    const formattedDate = dayjs(newDate).format('YYYY-MM-DD'); // Or any format you prefer
    handleFormChange(formIndex, 'expiry_date', formattedDate);
  };



  const handleSearch = (query) => {
    setLastTypingTime(new Date().getTime())
    setSearchQuery(query);
  };

  const handleSelectOpton = (e) => {
    setSelectedOption(e)
    setErr(false)
  }


  function validateData(data) {
    for (const [key, value] of Object.entries(data)) {
      if (
        value === null ||    // Check if the value is null
        value === undefined || // Check if the value is undefined
        (typeof value === 'string' && value.trim() === "") || // Check if the value is an empty string
        (Array.isArray(value) && value.length === 0) // Check if the value is an empty array
      ) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (lastTypingTime) {
      const timer = setTimeout(() => {
        const searchResult = async () => {
          try {
            const config = {
              headers: {
                'Authorization': `Bearer ${adminToken}` // Bearer Token Format
              }
            };
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/search_vendor?adminId=${adminId}&key=${searchQuery}`, config)
            if (response.status === 200) {

              setSerachData(response.data.data)
            }
          } catch (error) {
            setSerachData([])
          }
        };

        searchResult();

      }, 1000);
      return () => clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    if (selectedOption) {
      setAgentId(selectedOption.value);
      setVendorId(selectedOption.label)
      setTitle(selectedOption.title)
    }
  }, [selectedOption])

  console.log("productsssforms", products, forms)


  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Add Products From Agent
          <Stack spacing={2} sx={{ width: 300 }}>

            <Autocomplete
              freeSolo
              id="vendor-agent-autocomplete"
              disableClearable={false} // Allow clearing with the clear icon
              clearOnEscape={true}
              clearIcon={<ClearIcon />} // Add the clear icon
              options={searchData}
              getOptionLabel={(option) => option.title || ""}
              onChange={(event, newValue) => {
                if (newValue === null) {
                  handleClearall(); // Call handleClearall when cleared
                } else {
                  handleSelectOpton(newValue);
                  console.log("Selected Option:", newValue);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Backspace' && searchQuery === '') {
                  setSerachData([]); // Clear the search data
                  setSearchQuery(''); // Clear the search query
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => handleSearch(e.target.value)}
                  label="Search Vendor & Agents"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: 'search',
                    },
                  }}
                />
              )}

            />

          </Stack>

          <Stack spacing={2} sx={{ width: 300 }}>
            <label for="inputEmail4" class="form-label">Agent & Vendor</label>
            <input type="text" className='form-control' value={title} readOnly />

          </Stack>

        </Typography>
        {/* <div class="row">
          <div className='col'>
        
          </div>
        </div> */}

        {products.length > 0 && (
          <Button variant="contained" color="primary" onClick={handleAddMoreForm} sx={{ mb: 4 }}>
            Add More
          </Button>
        )}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Manufacture Date"
                    value={dayjs(form.manufacture_date)} // Convert it back to a Dayjs object if needed
                    onChange={(newDate) => handleDateChange(formIndex, newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Expiry Date"
                    value={dayjs(form.expiry_date)} // Convert it back to a Dayjs object if needed
                    onChange={(newDate) => handleDateChange1(formIndex, newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>
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
                    <ListItemText primary={`Weight: ${weight.weight}, Price: ${weight.purchaseprice}, Stock: ${weight.stock}`} />
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
                  type="text"
                  value={form.weightInput.weight}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {  // Allows only numbers and decimal point
                      handleWeightInputChange(formIndex, 'weight', value);
                    }
                  }}
                  inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                />
                <TextField
                  label="Price"
                  fullWidth
                  margin="normal"
                  type="text"
                  value={form.weightInput.purchaseprice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {  // Allows only numbers and decimal point
                      handleWeightInputChange(formIndex, 'purchaseprice', value);
                    }
                  }}
                  inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*' }}
                />
                <TextField
                  label="Stock"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={form.weightInput.stock}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {  // Allows only numbers and decimal point
                      handleWeightInputChange(formIndex, 'stock', value);
                    }
                  }}
                  inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*' }}
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
        {
          err ? (
            <p style={{ color: "red" }}>* Please fill all the details </p>
          ) : ("")
        }

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
                      <ListItemText primary={`Weight: ${weight.weight}, Price: ${weight.purchaseprice}, Stock: ${weight.stock}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
        {
          loader ? (
            <button class="btn btn-primary" type="button" disabled>
              <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
              Uploading ....
            </button>
          ) : (

            <Button type="button" variant="contained" color="primary" onClick={addAgentProduct}>
              Submit
            </Button>
          )
        }
      </Box>
    </>
  );
};

export default AddVendorProducts;

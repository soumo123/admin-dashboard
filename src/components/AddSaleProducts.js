import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios'
import Message from '../custom/Message';
import { useNavigate } from 'react-router-dom';

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
const AddSaleProducts = () => {
  const [value, setValue] = useState(0);
  const [startdateTime, setStartDateTime] = useState(dayjs());
  const [enddateTime, setEndDateTime] = useState(dayjs());
  const [category, setCategory] = useState("")
  const [catObj, setCatObj] = useState({})
  const [depositeErr, setDepoErr] = useState(false)
  const [starttime, setStartTime] = useState("")
  const [endtime, setEndTime] = useState("")
  const [caption, setCaption] = useState("")
  const [products, setProducts] = useState([]); // Tracks selected products or `true` for all
  const [selectAll, setSelectAll] = useState(false); // Tracks state of the main checkbox
  const [discount, setDiscount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loader, setloader] = useState(true);
  const adminId = localStorage.getItem("adminId");
  const shop_id = localStorage.getItem("shop_id");
  const adminToken = localStorage.getItem("adminToken");
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState("")
  const [productsData, setProductsData] = useState([])
  const [allTemps, setTemps] = useState([])
  const [tempId, setTEmpId] = useState("")
  const navigate = useNavigate()


  // const productsData = [
  //   { id: '1', name: 'Product 1' },
  //   { id: '2', name: 'Product 2' },
  //   { id: '3', name: 'Product 3' },
  // ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDateChange = (newValue) => {
    setDepoErr(false)
    setStartDateTime(newValue);
    setStartTime(newValue.format('YYYY-MM-DD HH:mm:ss'))
    console.log('Selected date and time:', newValue, newValue.format('YYYY-MM-DD HH:mm:ss'));
  };


  const handleDateChange1 = (newValue) => {
    setDepoErr(false)
    setEndDateTime(newValue);
    setEndTime(newValue.format('YYYY-MM-DD HH:mm:ss'))
    console.log('Selected date and time:', newValue, newValue.format('YYYY-MM-DD HH:mm:ss'));
  };


  const handleMainCheckboxChange = () => {
    if (selectAll) {
      // Uncheck all
      setProducts([]);
    } else {
      // Check all
      setProducts(true);
    }
    setSelectAll(!selectAll);
  };

  const handleIndividualCheckboxChange = (id) => {
    if (products === true) {
      // Switch from boolean to array
      setProducts([id]);
      setSelectAll(false);
    } else {
      const newProducts = products.includes(id)
        ? products.filter((productId) => productId !== id) // Uncheck
        : [...products, id]; // Check
      setProducts(newProducts);

      // If all individual products are checked, mark the main checkbox as true
      if (newProducts.length === productsData.length) {
        setProducts(true);
        setSelectAll(true);
      }
    }
  };

  const checkerrros = (json) => {

    let { caption,
      category,
      start_date,
      end_date,
      discount,
      products ,temp_id} = json

    if (products.length === 0 || !products) {
      return {
        error: true,
        message: "Products not selected"
      }
    }
    if (!caption || !category || !start_date || !end_date || !discount || !temp_id) {
      return {
        error: true,
        message: "Fill all the mandatory fields"
      }
    }

    return {
      error: false
    }

  }

  const handleCategory = async (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex]; // Get the selected <option>
    setCatObj({
      name: selectedOption.getAttribute("name"), // Access the "name" attribute of the selected <option>
      value: e.target.value,
    });
    setProducts([])
    await getCatgoricalproducts(e.target.value)
  };

  const getCatgoricalproducts = async (cat_id) => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`, // Bearer Token Format
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/get_cat_pds?shop_id=${shop_id}&adminId=${adminId}&category=${cat_id}`,
        config
      );
      if (response.status === 200) {
        setloader(true);
        setProductsData(response.data.data);
        setTotalCount(response.data.totalData);
      }
    } catch (error) {
      setloader(true);
      setProductsData([]);
    }

  }

  const getAllTemplates = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`, // Bearer Token Format
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/gettemplates?shop_id=${shop_id}&adminId=${adminId}&limit=${10000000}&offset=${0}`,
        config
      );
      if (response.status === 200) {
        setloader(true);
        setTemps(response.data.data);
        setTotalCount(response.data.totalData);
      }
    } catch (error) {
      setloader(true);
      setTemps([]);
    }

  }


  const createSale = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
      };
      let json = {
        caption: caption,
        category: catObj,
        start_date: starttime,
        end_date: endtime,
        discount: Number(discount),
        products: products,
        temp_id:tempId
      }

      let flag = checkerrros(json)
      if (flag.error) {
        setMessageType("error")
        setMessage(flag.message)
        setTimeout(() => {
          setMessage(false)
        }, 2000);
        return
      }
      const response = await axios.post(
        `${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/addsale?shop_id=${shop_id}&adminId=${adminId}`, json, config
      );
      if (response.status === 201) {
        setMessageType("success")
        setMessage("Sale added")
        setTimeout(() => {
          setMessage(false)
        }, 2000);
        navigate("/saleproducts")
      }
    } catch (error) {
      setMessageType("error")
      setMessage(error.response.data.message)
      setTimeout(() => {
        setMessage(false)
      }, 2000);

    }
  };

  const handleTemplateSelect = (e) => {
    setTEmpId(e.target.value)
  }

  useEffect(() => {
    getAllTemplates()
  }, [])



  return (
    <>
      {
        message ? (
          <Message type={messageType} message={message} />
        ) : ("")
      }

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Sale Start and End time" {...a11yProps(0)} />
            <Tab label="Sale Caption" {...a11yProps(1)} />
            <Tab label="Add Products" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <div className="row">
            <div className="col-6">
              <label for="inputEmail4" class="form-label">Start Date & Time</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    label="Pick the Date and Time"
                    value={startdateTime}
                    minDateTime={dayjs()}
                    onChange={handleDateChange}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="col-6">
              <label for="inputEmail4" class="form-label">End Date & Time</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    label="Pick the Date and Time"
                    value={enddateTime}
                    minDateTime={dayjs()}
                    onChange={handleDateChange1}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div className="row">
            <div className="col">
              <label for="inputEmail4" class="form-label">Sale Caption</label>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Enter the caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
              </div>

            </div>
            <div className="col">
              <label for="inputEmail4" class="form-label">Discount</label>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Discount (%) " value={discount} onChange={(e) => setDiscount(e.target.value)} />
              </div>

            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <div className={`all-product`}>
            <div class="row align-items-center">
              <div class="col-12 col-md-4">
                <div className="form-group">
                  <label className="fw-bold">Category</label>
                  <select
                    className="form-control"
                    onChange={handleCategory}
                  >
                    <option name="" value="">Select</option>
                    <option name="cakes" value="1">Cakes</option>
                    <option name="pastrys" value="2">Pastrys</option>
                    <option name="chocolates" value="3">Chocolates</option>

                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-9">
                <div className="table-responsive">
                  <table className="table custom-table-header ">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleMainCheckboxChange}
                          />
                        </th>
                        <th>ProductId</th>
                        <th>Name</th>
                        <th>Description</th>


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
                        {productsData && productsData.length > 0 ? (
                          <tbody>
                            {productsData.map((ele, index) => (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={
                                      products === true || (Array.isArray(products) && products.includes(ele.productId))
                                    }
                                    onChange={() => handleIndividualCheckboxChange(ele.productId)}
                                  />
                                </td>
                                <td>{ele.productId}</td>
                                <td>{ele.name}</td>
                                <td>{ele.description}</td>


                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <div className="container">
                            <div className="row">
                              <div className="col-12">
                                <div className="text-center">No reports Found</div>
                              </div>
                            </div>
                          </div>
                        )}

                      </>
                    )}
                  </table>

                </div>
              </div>
              <div className="col-3">
                <h4>All Templates</h4>
                {
                  allTemps && allTemps.length > 0 ? (
                    <div className="container-custom w-100 w-md-50">
                      {allTemps &&
                        allTemps.map((ele) => (
                          <div className="image-item" key={ele.temp_id}>
                            <img src={ele.temp_url} alt={ele.temp_id} />
                            <input
                              className="form-check-input"
                              type="radio"
                              name="template-selection" // Add a common name to group the radio buttons
                              id={ele.temp_id}
                              value={ele.temp_id}
                              onChange={handleTemplateSelect}
                            />
                          </div>
                        ))}
                    </div>

                  ) : (
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                          <div className="text-center">No templates \found</div>
                        </div>
                      </div>
                    </div>
                  )
                }

              </div>
            </div>

          </div>

          <button className="btnSubmit" type="button" onClick={createSale}>Create</button>
        </CustomTabPanel>
      </Box>
    </>
  )
}

export default AddSaleProducts
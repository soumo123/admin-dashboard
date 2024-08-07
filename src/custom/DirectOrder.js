import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Message from '../custom/Message';
import { useDispatch } from 'react-redux';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';


const DirectOrder = ({ directModal, setDirectModal, setRef }) => {

    const dispatch = useDispatch()
    const [products, setProducts] = useState([]);
    const [weight, setWeight] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [selectedWeight, setSelectedWeight] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [orderItems, setOrderItems] = useState([]);
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const type = localStorage.getItem("type");
    const [extra, setExtra] = useState("")
    const [extraPrice, setExtraPrice] = useState("")
    const [discount, setDiscount] = useState("")
    const [customer_name, setCustomerName] = useState("")
    const [notes, setNotes] = useState("")
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const [unit, setUnit] = useState("")
    const [sgst, setSgst] = useState(0)
    const [cgst, setCgst] = useState(0)
    const [value1, setValue1] = useState(0)
    const [value2, setValue2] = useState(0)
    const [orderMethod, setOrderMethod] = useState("direct")
    const [dateTime, setDateTime] = useState(dayjs());
    const [time, setTime] = useState("")
    const [addErr, setAddErr] = useState(false)
    const [initialDeposit, setInitialDeposit] = useState(0)
    const [phone, setPhone] = useState("")
    const [depositeErr, setDepoErr] = useState(false)

    let totalPrice = 0
    const handleClose = () => {
        setDirectModal(false);
        setProducts([])
        setOrderItems([])
        setSelectedId("");
        setWeight([]);
        setSelectedWeight("");
        setPrice("");
        setQuantity(1);
        setDateTime(dayjs())
        setInitialDeposit(0)
        setPhone("")
    };

    const handleDateChange = (newValue) => {
        setDateTime(newValue);
        setTime(newValue.format('YYYY-MM-DD HH:mm:ss'))
        console.log('Selected date and time:', newValue, newValue.format('YYYY-MM-DD HH:mm:ss'));
    };

    const handleOrderMethod = (e) => {
        console.log("eeeeeeeeeeee", e)
        setOrderMethod(e)
        setDateTime(dayjs())
        setInitialDeposit(0)
        setPhone("")
        setDepoErr(false)
    }

    const getTax = async () => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_tax`);
            if (response.status === 200) {
                setSgst(response.data.data.sgst)
                setCgst(response.data.data.cgst)
                setValue1(response.data.data.sgstvalue)
                setValue2(response.data.data.cgstvalue)
            }

        } catch (error) {
            console.log(error)
            setSgst(0)
            setCgst(0)
            setValue1(0)
            setValue2(0)
        }


    }


    const handleDeposit = (e)=>{
        setInitialDeposit(e)
        setDepoErr(false)
    }

    const hanldePhone = (e)=>{
        setPhone(e)
        setDepoErr(false)

    }

    const getAllProductsByAdmin = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/get_admin_products?adminId=${adminId}&type=${type}&keyword=&startprice=&lastprice=`);
            if (response.status === 200) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.log(error.stack);
            setProducts([]);
        }
    };

    useEffect(() => {
        getAllProductsByAdmin();
    }, []);

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        console.log("selectedProductId", selectedProductId);
        setSelectedId(selectedProductId);

        if (selectedProductId) {
            const product = products.find(p => p.productId === selectedProductId);
            if (product) {
                setWeight(product.weight);
                setUnit(product.unit);
                setSelectedWeight("");
                setPrice("");
            } else {
                setWeight([]);
                setUnit("");
                setSelectedWeight("");
                setPrice("");
            }
        } else {
            // If no product is selected, reset weight, unit, selectedWeight, and price
            setWeight([]);
            setUnit("");
            setSelectedWeight("");
            setPrice("");
        }

        setAddErr(false);
    };
    const handleWeightChange = (e) => {
        const selectedWeight = e.target.value;
        setSelectedWeight(selectedWeight);

        if (selectedId) {
            const selectedProduct = products.find(p => p.productId === selectedId);

            if (selectedProduct) {
                const weightInfo = selectedProduct.weight.find(w => Number(w.weight) === Number(selectedWeight));

                if (weightInfo) {
                    setPrice(weightInfo.price);
                } else {
                    setPrice("");
                }
            } else {
                setPrice("");
            }
        } else {
            setPrice("");
        }

        setAddErr(false);
    };


    const handleQuantityChange = (e) => {
        setAddErr(false)
        if (e.target.value === 0 || "") {
            setQuantity(1)
        } else {
            setQuantity(e.target.value);
        }
    };

    const handleSaveProduct = () => {
        if (selectedId && selectedWeight && quantity && price) {
            const selectedProduct = products.find(p => p.productId === selectedId);
            const orderItem = {
                productId: selectedId,
                name: selectedProduct.name,
                description: selectedProduct.description,
                color: "",
                thumbImage: selectedProduct.thumbnailimage,
                weight: Number(selectedWeight),
                price: Number(price),
                itemCount: Number(quantity),
                totalPrice: price * quantity,
            };
            setOrderItems([...orderItems, orderItem]);
            // Reset selections for the next product
            setSelectedId("");
            setWeight([]);
            setSelectedWeight("");
            setPrice("");
            setQuantity(1);
        } else {
            setAddErr(true)
            return
        }
    };

    const handleOrder = async (e) => {
        e.preventDefault()
        try {

            if (orderItems.length > 0) {

                if (orderMethod === "ordered" || (Number(initialDeposit) === 0 && Number(initialDeposit) === "")) {
                    setDepoErr(true)
                    return
                }
                let orderedPrice = orderItems.reduce((acc, item) => acc + item.totalPrice, 0) + Number(extraPrice);
                let cgst = Number(value2) * orderedPrice
                let sgst = Number(value1) * orderedPrice
                orderedPrice = ((orderedPrice + cgst + sgst) - ((orderedPrice + cgst + sgst) * discount / 100)) - Number(initialDeposit)

                let json = {
                    receivedData: orderItems,
                    cgst: cgst,
                    sgst: sgst,
                    phone: phone,
                    initialDeposit: Number(initialDeposit),
                    orderedPrice: orderedPrice,
                    username: customer_name,
                    extrathings: extra,
                    extraprice: Number(extraPrice),
                    notes: notes,
                    discount: Number(discount),
                    paid: orderMethod === "direct" ? true : false,
                    order_method: orderMethod,
                    deliver_date: time,
                    status: orderMethod === "direct" ? 4 : 1,
                }
                console.log("jsonjson", json)
                const config = {
                    headers: {
                        'Content-Type': "application/json",
                    },
                    withCredentials: true
                }
                const result = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/orders/create?adminId=${adminId}&type=${type}&shop_id=${shop_id}`, json, config)
                if (result.status === 201) {
                    setMessage("Order Created")
                    setMessageType("success")
                    setProducts([])
                    setOrderItems([])
                    setSelectedId("");
                    setWeight([]);
                    setSelectedWeight("");
                    setPrice("");
                    setQuantity(1);
                    setDirectModal(false)
                    setTimeout(() => {
                        setMessage(false)
                    }, 2000);
                    dispatch(setRef(new Date().getSeconds()))
                }
            } else {
                setAddErr(true)
                return
            }

        } catch (error) {
            setMessageType("error")
            setMessage("Oops..Something went wrong")
            setTimeout(() => {
                setMessage(false)
            }, 2000);
        }




    }
    useEffect(() => {
        getTax()
    }, [])

    console.log("orderItemsorderItems", orderItems)

    return (
        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
            <Modal
                show={directModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Take Order
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>* Customer Name :</label>
                    <input type="text" value={customer_name} onChange={(e) => setCustomerName(e.target.value)} />
                    {orderItems.map((item, index) => (
                        <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                            <p>{item.name} ({item.productId}) - {item.weight} {unit} - Quantity: {item.itemCount} Pieces- Total Price: ₹ {item.totalPrice}</p>
                        </div>
                    ))}
                    <label>* Select Product :</label>
                    <select value={selectedId} onChange={handleProductChange}>
                        <option value="">Select Product</option>
                        {products && products.map((ele) => (
                            <option key={ele.productId} value={ele.productId}>{`${ele.name} (${ele.productId})`}</option>
                        ))}
                    </select>
                    <label>* Select Variation :</label>
                    <select value={selectedWeight} onChange={handleWeightChange} disabled={!selectedId}>
                        <option value="">Select Variation</option>
                        {weight && weight.map((ele) => (
                            <option key={ele.weight} value={ele.weight}>{`${ele.weight} ${unit}`}</option>
                        ))}
                    </select>
                    {price ? (

                        <p>Price:₹ {price}</p>

                    ) : ""}
                    <label>* Select Quantity :</label>
                    <input type="number" min={1} value={quantity} onChange={handleQuantityChange} />
                    <Button onClick={handleSaveProduct}>Save</Button>
                    {
                        addErr ? (
                            <p style={{ color: 'red' }}>* Please select mandatory fields</p>
                        ) : ("")
                    }
                    {/* {orderItems.length > 0 && (
                        <Button onClick={() => {
                            setSelectedId("");
                            setWeight([]);
                            setSelectedWeight("");
                            setPrice("");
                            setQuantity(1);
                        }} style={{ marginTop: '10px' }}>+ Add More</Button>
                    )} */}
                    <div className="">
                        <label>Extra things :</label>
                        <textarea type="text" value={extra} onChange={(e) => setExtra(e.target.value)} />
                        <label>
                            Extra Price
                        </label>
                        <input type="number" value={extraPrice} onChange={(e) => setExtraPrice(e.target.value)} />
                        <label>Discount</label>
                        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />%

                        <label>Notes</label>
                        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />

                        <label>Notes</label>
                        <select value={orderMethod} onChange={(e) => handleOrderMethod(e.target.value)}>
                            <option value="direct">Direct</option>
                            <option value="ordered">Ordered</option>

                        </select>
                        {
                            orderMethod === "ordered" ? (

                                <>
                                    <label>* Advance Pay</label>
                                    <input type="number" value={initialDeposit} onChange={(e) => handleDeposit(e.target.value)} />

                                    <label>* Phone Number </label>
                                    <input type="number" value={phone} onChange={(e) => hanldePhone(e.target.value)} />

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <p>Select Date and Time</p>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <DateTimePicker
                                                label="Pick the Date and Time"
                                                value={dateTime}
                                                onChange={handleDateChange}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    {
                                        depositeErr ? (
                                            <p style={{ color: 'red' }}>* Please select mandatory fields</p>
                                        ) : ("")
                                    }
                                </>
                            ) : (
                                ""
                            )
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleOrder}>Create order</Button>

                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DirectOrder;

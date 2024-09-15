import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../css/accordian.css'
import Pagination from '@mui/material/Pagination';
import Message from '../custom/Message';
import { useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

const ReqManualOrder = () => {
    const dispatch = useDispatch()
    const [sgst, setSgst] = useState(0)
    const [cgst, setCgst] = useState(0)
    const [value1, setValue1] = useState(0)
    const [value2, setValue2] = useState(0)
    const [extra, setExtra] = useState("")
    const [orders, setOrders] = useState([])
    const [loader, setLoader] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [lastTypingTime, setLastTypingTime] = useState(null);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0)
    const type = localStorage.getItem("type");
    const [totalPages, setTotalPages] = useState(0);
    const [orderChanges, setOrderChanges] = useState({});
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const [ref, setRef] = useState(false)
    const [err, setErr] = useState(false)

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

    const getOrders = async () => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/orders/getmanualorders?type=${type}&limit=${limit}&offset=${offset}&key=${searchQuery}`);
            if (response.status === 200) {
                setLoader(true)
                setOrders(response.data.data)
                setTotalPages(Math.ceil(response.data.totalData / limit));

            }

        } catch (error) {
            setLoader(true)
            setOrders([])
            console.log(error)

        }


    }



    useEffect(() => {
        if (lastTypingTime) {
            const timer = setTimeout(() => {
                const getOrders = async () => {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/orders/getmanualorders?type=${type}&limit=${limit}&offset=${offset}&key=${searchQuery}`)
                        if (response.status === 200) {
                            setLoader(true)
                            setOrders(response.data.data)
                            setTotalPages(Math.ceil(response.data.totalData / limit));
                        } else {
                            setOrders([])
                        }
                    } catch (error) {
                        setLoader(true)
                        console.log(error)
                        setOrders([])
                    }
                };

                getOrders();

            }, 1000);
            return () => clearTimeout(timer)
        }
    }, [searchQuery, offset, limit])

    const handlePageChange = (event, value) => {
        setOffset((value - 1) * limit);
    };


    const handleInputChange = (tokenId, field, value) => {
        setOrderChanges(prevState => ({
            ...prevState,
            [tokenId]: {
                ...prevState[tokenId],
                [field]: value
            }
        }));
    };
    const handleSubmit = async (tokenId, ele) => {
        const changes = orderChanges[tokenId] || {};

        let orderedPrice = calculateTotalPrice({
            ...ele,
            extraPrice: Number(changes.extraPrice) || Number(ele.extraprice),
            extra: changes.extra || ele.extrathings,
            discount: Number(changes.discount) || Number(ele.discount)
        });
        console.log("orderedPriceorderedPrice", orderedPrice)

        const updatedOrder = {
            receivedData: ele.products,
            cgst: orderedPrice.cgst,
            sgst: orderedPrice.sgst,
            orderedPrice: orderedPrice.orderedPrice,
            phone: ele.phone,
            initialDeposit: 0,
            username: ele.username,
            extrathings: changes.extra || ele.extrathings,
            extraprice: Number(changes.extraPrice) || Number(ele.extraprice),
            notes: "",
            discount: Number(changes.discount) || Number(ele.discount),
            paid: true,
            order_method: "direct",
            deliver_date: new Date(),
            status: 4
        };

        console.log("Submitting Order:", updatedOrder);


        try {
            const config = {
                headers: {
                    'Content-Type': "application/json",
                },
                withCredentials: true
            }
            const result = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/orders/create?adminId=${adminId}&type=${type}&shop_id=${shop_id}&tokenId=${ele.tokenId}`, updatedOrder, config)

            if (result.status === 201) {
                setMessage("Order Created")
                setMessageType("success")
                setLoader(false)
                setOrderChanges({})
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
                dispatch(setRef(new Date().getSeconds()))
            }

        } catch (error) {
            console.log('Error while updating the order:', error);
        }
    };

    const handleRemoveItem = (tokenId, productId) => {
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.tokenId === tokenId) {
                const updatedProducts = order.products.filter(product => product.productId !== productId);
                return {
                    ...order,
                    products: updatedProducts,
                    orderedPrice: calculateTotalPrice({
                        ...order,
                        products: updatedProducts
                    })
                };
            }
            return order;
        }));
    }

    const calculateTotalPrice = (order) => {
        let orderedPrice = order.products.reduce((acc, item) => acc + item.totalPrice, 0);
        console.log("orderedPrice1", orderedPrice)
        let cgst = Number(value2) * orderedPrice
        let sgst = Number(value1) * orderedPrice
        console.log("cgst,sgst", cgst, sgst)
        orderedPrice = ((orderedPrice + cgst + sgst) - ((orderedPrice + cgst + sgst) * (Number(order.discount) || 0) / 100))
        let allprices = {
            orderedPrice: orderedPrice + (Number(order.extraPrice) || 0),
            cgst,
            sgst
        }
        return allprices
    }
    useEffect(() => {
        getTax()
    }, [])

    useEffect(() => {
        getOrders()
    }, [ref])


    console.log("extraextra", extra)

    return (
        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
            <h1>Requested Orders</h1>
            <div class="accordion">
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
                    ) : (
                        <>
                            {
                                orders && orders.length > 0 ? (
                                    <>
                                        {
                                            orders && orders.map((ele, index) => (
                                                <div class="accordion-item" key={index}>
                                                    <input type="checkbox" id={`item-${index}`} />
                                                    <label for={`item-${index}`} class="accordion-header">
                                                        <span>{ele.tokenId}</span>
                                                        <span class="arrow">
                                                            <i class="fa-solid fa-caret-right"></i>
                                                        </span>
                                                    </label>
                                                    <div class="accordion-content">
                                                        <div className="row">
                                                            <div className="col">
                                                                <label for="inputEmail4" class="form-label">Token Number</label>
                                                                <input type="text" class="form-control" placeholder="Token No." aria-label="Token No." value={ele.tokenId} readOnly />
                                                            </div>
                                                            <div className="col">
                                                                <label for="inputEmail4" class="form-label">Customer name</label>
                                                                <input type="text" class="form-control" placeholder="Customer name" aria-label="Customer name" value={ele.username} readOnly />
                                                            </div>
                                                            <div className="col">
                                                                <label for="inputEmail4" class="form-label">Mobile</label>
                                                                <input type="text" class="form-control" placeholder="Mobile" aria-label="Mobile" readOnly value={ele.phone} />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col">
                                                                <label for="inputEmail4" class="form-label">Extra Things</label>
                                                                <input type="text" class="form-control" placeholder="Extra Things" aria-label="Extra Things" value={orderChanges[ele.tokenId]?.extra || ele.extrathings}

                                                                    onChange={(e) => handleInputChange(ele.tokenId, 'extra', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col">
                                                                <label for="inputEmail4" class="form-label">Extra Cost (₹)</label>
                                                                <input
                                                                    type="text" // Restricts to numbers only
                                                                    className="form-control"
                                                                    placeholder="Extra Cost"
                                                                    aria-label="Extra Cost"
                                                                    // min="0" // Prevents negative values
                                                                    value={orderChanges[ele.tokenId]?.extraPrice || ele.extraprice}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        // Check if value is a valid number and not negative
                                                                        if (!isNaN(value) && Number(value) >= 0) {
                                                                            handleInputChange(ele.tokenId, 'extraPrice', value);
                                                                        } else {
                                                                            // If it's not a valid number or negative, reset to 0 or previous value
                                                                            handleInputChange(ele.tokenId, 'extraPrice', 0);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col">
                                                                <label for="inputEmail4" class="form-label">Discount (%)</label>
                                                                <input type="text"
                                                                    class="form-control"
                                                                    placeholder="discount"
                                                                    aria-label="discount"
                                                                    value={orderChanges[ele.tokenId]?.discount || ele.discount}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        if (!isNaN(value) && Number(value) >= 0) {
                                                                            handleInputChange(ele.tokenId, 'discount', value)

                                                                        } else {

                                                                            handleInputChange(ele.tokenId, 'discount', 0)
                                                                        }
                                                                    }
                                                                    } />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col">
                                                                <label for="inputEmail4" class="form-label">Items</label>
                                                                {ele.products.map((item, itemIndex) => (
                                                                    <div key={index}>
                                                                        <p>{item.name} ({item.productId}) - {item.weight} {item.unit} - Quantity: {item.itemCount} Pieces- Price: ₹ {item.totalPrice}
                                                                            <button className="btn btn-danger" onClick={() => handleRemoveItem(ele.tokenId, item.productId)}>
                                                                                <CloseIcon />
                                                                            </button>
                                                                        </p>
                                                                    </div>
                                                                ))}

                                                            </div>

                                                        </div>

                                                        <div className="row">
                                                            <div className="col">
                                                                <label for="inputEmail4" class="form-label">
                                                                    CGST (2.5 %) &
                                                                    SGST (2.5 %)


                                                                </label>
                                                            </div>

                                                        </div>
                                                        <div className="row">
                                                            <div className="col">
                                                                <label for="inputEmail4" class="form-label">Total Price : </label>
                                                                <input type="text" className="form-control" placeholder="Total Price" aria-label="Total Price" value={calculateTotalPrice({ ...ele, extraPrice: Number(orderChanges[ele.tokenId]?.extraPrice) || Number(ele.extraprice), extra: orderChanges[ele.tokenId]?.extra || ele.extrathings, discount: Number(orderChanges[ele.tokenId]?.discount) || Number(ele.discount) }).orderedPrice} readOnly />
                                                            </div>

                                                        </div>

                                                        {
                                                            ele.products.length === 0 ? (
                                                                <span style={{ color: "red" }}>* You have to select minimum one product</span>
                                                            ) : (

                                                                <button type="button" className="btn btn-primary" onClick={() => handleSubmit(ele.tokenId, ele)}>Place Order</button>
                                                            )
                                                        }

                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <Pagination count={totalPages} variant="outlined" color="secondary" onChange={handlePageChange} />
                                    </>

                                ) :
                                    (
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="text-center">
                                                        No Orders Found
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            }

                        </>
                    )
                }



            </div>
        </>

    )
}

export default ReqManualOrder
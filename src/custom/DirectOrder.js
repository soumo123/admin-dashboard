import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Message from '../custom/Message';
import { useDispatch } from 'react-redux';

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
    const[unit,setUnit] = useState("")
    const [sgst, setSgst] = useState(0)
    const [cgst, setCgst] = useState(0)
    const [value1, setValue1] = useState(0)
    const [value2, setValue2] = useState(0)


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
    };


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
        setSelectedId(selectedProductId);
        const product = products.find(p => p.productId === selectedProductId);
        setWeight(product.weight);
        setUnit(product.unit)
        setSelectedWeight("");
        setPrice("");
    };

    const handleWeightChange = (e) => {
        const selectedWeight = e.target.value;
        setSelectedWeight(selectedWeight);
        const selectedProduct = products.find(p => p.productId === selectedId);
        const weightInfo = selectedProduct.weight.find(w => w.weight === selectedWeight);
        setPrice(weightInfo.price);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
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
                weight: selectedWeight,
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
        }
    };

    console.log("orderItemsorderItems",orderItems)
    const handleOrder = async (e) => {
        e.preventDefault()
        try {
            let orderedPrice = orderItems.reduce((acc, item) => acc + item.totalPrice, 0) + Number(extraPrice);
            let cgst = Number(value2) * orderedPrice
            let sgst = Number(value1) * orderedPrice
            orderedPrice = orderedPrice + Number(value2) + Number(value1)
            let json = {
                receivedData: orderItems,
                cgst: cgst,
                sgst: sgst,
                initialDeposit: 0,
                orderedPrice: orderedPrice,
                username: customer_name,
                extrathings: extra,
                extraprice: Number(extraPrice),
                notes: notes,
                discount: Number(discount),
                status: 4,
                paid: true

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
                setMessageType("success")
                setMessage("Order Created")
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
      
    console.log("orderItems", orderItems)

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
                    <label>Customer Name :</label>
                    <input type="text" value={customer_name} onChange={(e) => setCustomerName(e.target.value)} />
                    {orderItems.map((item, index) => (
                        <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                            <p>{item.name} ({item.productId}) - {item.weight} {unit} - Quantity: {item.itemCount} Pieces- Total Price: ₹ {item.totalPrice}</p>
                        </div>
                    ))}
                    <select value={selectedId} onChange={handleProductChange}>
                        <option value="">Select Product</option>
                        {products && products.map((ele) => (
                            <option key={ele.productId} value={ele.productId}>{`${ele.name} (${ele.productId})`}</option>
                        ))}
                    </select>
                    <select value={selectedWeight} onChange={handleWeightChange} disabled={!selectedId}>
                        <option value="">Select Variation</option>
                        {weight && weight.map((ele) => (
                            <option key={ele.weight} value={ele.weight}>{`${ele.weight} ${unit}`}</option>
                        ))}
                    </select>
                    {price && (
                        <div>
                            <p>Price:₹ {price}</p>
                        </div>
                    )}
                    <input type="number" min="1" value={quantity} onChange={handleQuantityChange} />
                    <Button onClick={handleSaveProduct}>Save</Button>
                    {orderItems.length > 0 && (
                        <Button onClick={() => {
                            setSelectedId("");
                            setWeight([]);
                            setSelectedWeight("");
                            setPrice("");
                            setQuantity(1);
                        }} style={{ marginTop: '10px' }}>+ Add More</Button>
                    )}
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

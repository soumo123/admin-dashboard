import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../css/main.css'
import { Multiselect } from "multiselect-react-dropdown";
import Message from '../custom/Message';
import { useNavigate, useParams, Link } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable';

const EditProduct = () => {

    const navigate = useNavigate()
    const { id } = useParams()
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("id");
    const type = localStorage.getItem("type");

    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")

    const [check5, setCheck5] = useState(false)
    const [check6, setCheck6] = useState(false)
    const [check7, setCheck7] = useState(false)
    const [check8, setCheck8] = useState(false)
    const [check9, setCheck9] = useState(false)
    const [check10, setCheck10] = useState(false)
    const [check11, setCheck11] = useState(false)
    const [check12, setCheck12] = useState(false)
    const [check13, setCheck13] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [tagId, setTagId] = useState([])
    // const [actualPriceAfterDiscount, setActualPriceAfterDiscount] = useState("")

    const [selectedOptions1, setSelectedOptions1] = useState([]);
    const [selectedOptions2, setSelectedOptions2] = useState([]);

    const [error, setError] = useState('');
    const handleChange1 = (selectedOptions) => {
        setSelectedOptions1(selectedOptions);
    };
    const handleChange2 = (selectedOptions) => {
        setSelectedOptions2(selectedOptions);
    };



    const [productData, setProductData] = useState({
        name: '',
        description: '',
        // price: 0,
        purchase_price: '',
        delivery_partner: '',
        selling_price_method: '',
        // discount: 0,
        other_description1: '',
        other_description2: '',
        weight: '',
        unit: '',
        type: type,
        // stock: '',
        color: '',
        size: '',
        product_type: '',
        deliverydays: 0,
        zomato_service: false,
        zomato_service_price: "",
        swiggy_service: false,
        swiggy_service_price: "",
        zepto_service: false,
        zepto_service_price: "",
        blinkit_service: false,
        blinkit_service_price: "",
        tags: [],
        isBestSelling: false,
        isFeatured: false,
        isTopSelling: false,
        isBranded: false,
        isOffered: false,
        files: [], // Store selected files here,
        imagePreviews: []
    });

    console.log("productDataproductData", productData)
    const [check1, setCheck1] = useState(false)
    const [check2, setCheck2] = useState(false)
    const [check3, setCheck3] = useState(false)
    const [check4, setCheck4] = useState(false)



    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [stockError, setStockError] = useState('');
    const [fileError, setFileError] = useState('');
    const [purchaseError, setPurchaseError] = useState('')
    const [deliveryPartnerErr, setDeliveryPartnerErr] = useState('');
    const [sellingPriceMethderr, setSellingPriceMethodErr] = useState('')
    const [deliveryServiceErr, setDeliveryServiceErr] = useState("")
    const [tagsData, setTagsData] = useState([])



    const handleChange = (e) => {
        const { name, value } = e.target;
        // Prevent input containing a minus sign for price, stock, and discount
        // if ((name === 'price' || name === 'stock' || name === 'discount') && value.includes('-')) {
        //     return; // Don't update state for input containing a minus sign
        // }

        // Prevent setting negative values for price, stock, and discount
        // if ((name === 'price' || name === 'stock' || name === 'discount') && parseFloat(value) < 0) {
        //     return; // Don't update state for negative values
        // }

        if (name === "selling_price_method") {
            setProductData(prevState => ({
                ...prevState,
                zomato_service: false,
                zomato_service_price: '',
                swiggy_service: false,
                swiggy_service_price: '',
                zepto_service: false,
                zepto_service_price: '',
                blinkit_service: false,
                blinkit_service_price: ''
            }));
        }

        setProductData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'name') setNameError('');
        if (name === 'description') setDescriptionError('');
        // if (name === 'price') setPriceError('');
        if (name === 'stock') setStockError('');
        if (name === "purchase_price") setPurchaseError('')
        if (name === "delivery_partner") setDeliveryPartnerErr('')
        if (name === "selling_price_method") setSellingPriceMethodErr('')
        if (name === "zomato_service" || name === "swiggy_service" || name === "swiggy_service" || name === "blinkit_service") setDeliveryServiceErr('')
        if (name === "zomato_service_price" || name === "swiggy_service_price" || name === "zepto_service_price" || name === "blinkit_service_price") setDeliveryServiceErr('')



    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const imagePreviews = files.map(file => URL.createObjectURL(file)); // Create preview URLs
        setProductData(prevState => ({
            ...prevState,
            files: files,
            imagePreviews: imagePreviews
        }));
        setFileError('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productData.name) {
            setNameError('Please enter a name.');
            return;
        }
        if (!productData.description) {
            setDescriptionError('Please enter a description.');
            return;
        }
        if (!productData.purchase_price) {
            setPurchaseError('Please select any option');
            return;
        }
        if (!productData.delivery_partner) {
            setDeliveryPartnerErr('Please enter the delivery partner');
            return;
        }
        if (!productData.selling_price_method) {
            setSellingPriceMethodErr('Please enter price method');
            return;
        }
        // if (productData.selling_price_method === "offline" && !productData.price) {
        //     setPriceError('Please enter a price.');
        //     return;
        // }
        if (productData.selling_price_method === "online" && !productData.zomato_service_price && !productData.swiggy_service && !productData.swiggy_service_price && !productData.zepto_service_price && !productData.blinkit_service_price) {
            setDeliveryServiceErr('Please choose atleast one');
            return;
        }
        if (productData.selling_price_method === "online" && !productData.zomato_service && !productData.swiggy_service && !productData.zepto_service && !productData.blinkit_service && !productData.blinkit_service) {
            setDeliveryServiceErr('Please choose atleast one');
            return;
        }
        // if (!productData.stock) {
        //     setStockError('Please enter stock.');
        //     return;
        // }
        if (!validatePrices()) {
           return
        }
        // if (productData.files.length === 0 ) {
        //     setFileError('Please enter images.');
        //     return;
        // }
        try {
            setDisabled(true)
            const formData = new FormData();
            for (const key in productData) {

                if (key === 'files') {
                    productData[key].forEach((file, index) => {
                        formData.append(`files`, file);
                    });
                } else if (key === 'tags') {
                    // Append tagId to formData under the 'tags' field
                    tagId.forEach(id => formData.append('tags', Number(id)));
                } else {
                    formData.append(key, productData[key]);
                }
            }
            // Append isBestSelling to formData based on check5 value
            formData.set('isBestSelling', check5);
            formData.set('isTopSelling', check7);
            formData.set('isOffered', check9);
            formData.set('isFeatured', check6);
            formData.set('isBranded', check8);
            formData.append('weight11', JSON.stringify(productData.weight))
            formData.append('size1', JSON.stringify(selectedOptions2))
            const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/update/${adminId}?productId=${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                setDisabled(false)
                setMessageType("success")
                setMessage("Product Updated")
                setTagId([]);
                setSelectedOptions1([])
                setSelectedOptions2([])
                setCheck1(false);
                setCheck2(false);
                setCheck3(false);
                setCheck4(false);
                setCheck5(false);
                setCheck6(false);
                setCheck7(false);
                setCheck8(false);
                setCheck9(false);
                setCheck10(false)
                setCheck11(false)
                setCheck12(false)
                setCheck13(false)
                setNameError('');
                setDescriptionError('');
                setPriceError('');
                setStockError('');
                setProductData({
                    name: '',
                    description: '',
                    // price: 0,
                    purchase_price: '',
                    delivery_partner: '',
                    selling_price_method: '',
                    // discount: 0,
                    other_description1: '',
                    other_description2: '',
                    weight: '',
                    unit: '',
                    type: type,
                    // stock: '',
                    color: '',
                    size: '',
                    product_type: '',
                    deliverydays: 0,
                    zomato_service: false,
                    zomato_service_price: "",
                    swiggy_service: false,
                    swiggy_service_price: "",
                    zepto_service: false,
                    zepto_service_price: "",
                    blinkit_service: false,
                    blinkit_service_price: "",
                    tags: [],
                    isBestSelling: false,
                    isFeatured: false,
                    isTopSelling: false,
                    isBranded: false,
                    isOffered: false,
                    files: [], // Store selected files here,
                    imagePreviews: []
                });
                navigate('/allproducts')
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
            }
        } catch (error) {
            setDisabled(false)
            setMessageType("error")
            setMessage("Product Not Update")
            setTimeout(() => {
                setMessage(false)
            }, 3000);

        }
    };
    const handleImageDelete = (index) => {
        const newFiles = productData.files.filter((file, i) => i !== index);
        const newImagePreviews = productData.imagePreviews.filter((preview, i) => i !== index);
        setProductData(prevState => ({
            ...prevState,
            files: newFiles,
            imagePreviews: newImagePreviews
        }));
    };

    const selectOption = (event) => {
        const getID = event.map(option => Number(option.value));
        setSelectedOptions(event);
        setTagId(getID);
    };

    const getAlltags = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/getalltags?userId=${adminId}&type=${type}`)
            if (response.status === 200) {
                setTagsData(response.data.data)
            } else {
                setTagsData([])
            }
        } catch (error) {
            console.log(error)
        }


    }


    const handleDescChange = () => {
        setCheck1(!check1);
        if (!check1) { // If unchecked, clear the weight input
            setProductData(prevState => ({
                ...prevState,
                other_description1: '',
                other_description2: ''
            }));
        }
    }
    const handleWeight = () => {
        setCheck2(!check2);
        if (!check2) { // If unchecked, clear the weight input
            setSelectedOptions1([])
            setProductData(prevState => ({
                ...prevState,
                weight: '',
                unit: ''
            }));
        }

    }




    const handleColorChange = () => {
        setCheck3(!check3);
        if (!check3) { // If unchecked, clear the weight input
            setProductData(prevState => ({
                ...prevState,
                color: '',
            }));
        }
    }
    const handleSize = () => {
        setCheck4(!check4);
        if (!check4) { // If unchecked, clear the weight input
            setSelectedOptions2([])
            setProductData(prevState => ({
                ...prevState,
                size: '',
            }));
        }
    }

    const handleZomatoService = (e) => {
        setCheck10(!check10)
        if (!check10) { // If unchecked, clear the weight input
            setProductData(prevState => ({
                ...prevState,
                zomato_service_price: '',
                zomato_service: e.target.checked
            }));
        } else {
            setProductData(prevState => ({
                ...prevState,
                zomato_service_price: '',
                zomato_service: e.target.checked
            }));
        }
    }

    const handleSwiggyService = (e) => {
        setCheck11(!check11)
        if (!check11) { // If unchecked, clear the weight input
            setProductData(prevState => ({
                ...prevState,
                swiggy_service_price: '',
                swiggy_service: e.target.checked
            }));
        } else {
            setProductData(prevState => ({
                ...prevState,
                swiggy_service_price: '',
                swiggy_service: e.target.checked
            }));
        }
    }


    const handleZeptoService = (e) => {
        setCheck12(!check12)
        if (!check12) { // If unchecked, clear the weight input
            setProductData(prevState => ({
                ...prevState,
                zepto_service_price: '',
                zepto_service: e.target.checked
            }));
        } else {
            setProductData(prevState => ({
                ...prevState,
                zepto_service_price: '',
                zepto_service: e.target.checked
            }));
        }
    }

    const handleBlinkitService = (e) => {
        setCheck13(!check13)
        if (!check13) { // If unchecked, clear the weight input
            setProductData(prevState => ({
                ...prevState,
                blinkit_service_price: '',
                blinkit_service: e.target.checked
            }));
        } else {
            setProductData(prevState => ({
                ...prevState,
                blinkit_service_price: '',
                blinkit_service: e.target.checked
            }));
        }
    }

    const getProduct = async () => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/getProductById?productId=${id}&type=${type}&adminId=${adminId}`);
            if (response.status === 200) {
                setProductData({
                    name: response.data.data[0].name,
                    description: response.data.data[0].description,
                    // price: response.data.data[0].price,
                    purchase_price: response.data.data[0].purchase_price,
                    delivery_partner: response.data.data[0].delivery_partner,
                    selling_price_method: response.data.data[0].selling_price_method,
                    // discount: response.data.data[0].discount,
                    other_description1: response.data.data[0].other_description1,
                    other_description2: response.data.data[0].other_description2,
                    weight: response.data.data[0].weight,
                    unit: response.data.data[0].unit,
                    type: response.data.data[0].type,
                    // stock: response.data.data[0].stock,
                    color: response.data.data[0].color,
                    // size: response.data.data[0].size, //lets check at last//
                    product_type: response.data.data[0].product_type,
                    deliverydays: response.data.data[0].deliverydays,
                    zomato_service: response.data.data[0].zomato_service,
                    zomato_service_price: response.data.data[0].zomato_service_price,
                    swiggy_service: response.data.data[0].swiggy_service,
                    swiggy_service_price: response.data.data[0].swiggy_service_price,
                    zepto_service: response.data.data[0].zepto_service,
                    zepto_service_price: response.data.data[0].zepto_service_price,
                    blinkit_service: response.data.data[0].blinkit_service,
                    blinkit_service_price: response.data.data[0].blinkit_service_price,
                    tags: response.data.data[0].tags,
                    isBestSelling: response.data.data[0].isBestSelling,
                    isFeatured: response.data.data[0].isFeatured,
                    isTopSelling: response.data.data[0].isTopSelling,
                    isBranded: response.data.data[0].isBranded,
                    isOffered: response.data.data[0].isOffered,
                    files: [], // Store selected files here,
                    imagePreviews: response.data.data[0].otherimages
                });
                setTagId(response.data.data[0].tags)
                setSelectedOptions1(response.data.data[0].weight)
                setSelectedOptions2(response.data.data[0].size)

                setCheck1(response.data.data[0].other_description1 ? true : false)
                setCheck2(response.data.data[0].weight.length ? true : false)
                setCheck3(response.data.data[0].color ? true : false)
                setCheck4(response.data.data[0].size.length ? true : false)


                setCheck5(response.data.data[0].isBestSelling);
                setCheck6(response.data.data[0].isFeatured);
                setCheck7(response.data.data[0].isTopSelling);
                setCheck8(response.data.data[0].isBranded);
                setCheck9(response.data.data[0].isOffered);
                setCheck10(response.data.data[0].zomato_service)
                setCheck11(response.data.data[0].swiggy_service)
                setCheck12(response.data.data[0].zepto_service)
                setCheck13(response.data.data[0].blinkit_service)
            }

        } catch (error) {
            console.log(error)
        }
    }

    console.log("check5check5", check5)

    useEffect(() => {
        getProduct()
        getAlltags()
    }, [])






    const handlePriceChange = (index, newPrice) => {
        const newWeights = [...productData.weight];
        newWeights[index] = { ...newWeights[index], price: Number(newPrice) };
        setProductData(prevState => ({
            ...prevState,
            weight: newWeights
        }));
    };

    const validatePrices = () => {
        for (let weight of productData.weight) {
            if (!weight.price) {
                setError(`Please specify the price for weight ${weight.weight}`);
                return false;
            }
        }
        setError('');
        return true;
    };





    // useEffect(() => {
    //     let discountData = productData.price * productData.discount / 100
    //     setActualPriceAfterDiscount(productData.price - discountData)
    // }, [productData.discount])

    useEffect(() => {
        // Match and select options based on initialTags
        const matchedOptions = tagsData.filter(option => tagId.includes(option.value));
        setSelectedOptions(matchedOptions);
    }, [tagId]);

    console.log("productDataproductDataproductData", productData)
    return (
        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
            <div class="register-form">
                <div class="form">
                    <div class="note">
                        <h4>Update Product</h4>
                    </div>

                    <div class="form-content">
                        <div class="row">
                            <div class="col-sm-3 col-md-4">

                                <div class="form-group">
                                    <label>Product Name <span>*</span> </label>
                                    <input type="text" class="form-control" placeholder="Enter Name" name="name" value={productData.name} onChange={handleChange} />
                                    <span className="error-message">{nameError}</span>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Delivery Partner <span>*</span></label>
                                    <input type="text" class="form-control" placeholder="Enter Delivery Partner" name="delivery_partner" value={productData.delivery_partner} onChange={handleChange} readOnly/>
                                    <span className="error-message">{deliveryPartnerErr}</span>

                                </div>
                            </div>
                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Description <span>*</span></label>
                                    <input type="text" class="form-control" placeholder="Enter Description" name="description" value={productData.description} onChange={handleChange} />
                                    <span className="error-message">{descriptionError}</span>
                                </div>
                            </div>
                            {/* <div class="col-sm-3 col-md-4">

                                <div class="form-group">
                                    <label>Stock <span>*</span></label>
                                    <input type="number" class="form-control" placeholder="Stock" name="stock" value={productData.stock} onChange={handleChange} />
                                    <span className="error-message">{stockError}</span>
                                </div>
                            </div> */}
                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Delivery Days</label>
                                    <input type="number" class="form-control" placeholder="Days" name="deliverydays" value={productData.deliverydays} onChange={handleChange} />
                                </div>
                            </div>

                            {
                                productData?.selling_price_method === "online" ? (
                                    <div class="col-sm-3 col-md-4">
                                        <div class="form-group">
                                            <label>Choose Delivery Services</label>
                                            <div className="col" style={{ border: "2px solid black", padding: "10px" }}>
                                                <label>Zomato</label>
                                                <input type="checkbox" name="zomato" value={check10} checked={check10} onChange={handleZomatoService} />
                                                {
                                                    check10 ? (
                                                        <input type="number" placeholder="₹ :" value={productData.zomato_service_price} name="zomato_service_price" onChange={handleChange} />
                                                    ) : ("")
                                                }
                                                <label>Swiggy</label>
                                                <input type="checkbox" name="swiggy" value={check11} checked={check11} onChange={handleSwiggyService} />
                                                {
                                                    check11 ? (
                                                        <input type="number" placeholder="₹ :" value={productData.swiggy_service_price} name="swiggy_service_price" onChange={handleChange} />
                                                    ) : ("")
                                                }

                                                <label>Zepto</label>
                                                <input type="checkbox" name="zepto" value={check12} checked={check12} onChange={handleZeptoService} />
                                                {
                                                    check12 ? (
                                                        <input type="number" placeholder="₹ :" value={productData.zepto_service_price} name="zepto_service_price" onChange={handleChange} />
                                                    ) : ("")
                                                }

                                                <label>Blinkit</label>
                                                <input type="checkbox" name="blinkit" value={check13} checked={check13} onChange={handleBlinkitService} />
                                                {
                                                    check13 ? (
                                                        <input type="number" placeholder="₹ :" value={productData.blinkit_service_price} name="blinkit_service_price" onChange={handleChange} />
                                                    ) : ("")
                                                }

                                            </div>
                                            <span className="error-message">{deliveryServiceErr}</span>

                                        </div>
                                    </div>
                                ) : ("")
                            }

                            <div class="col-sm-12">
                                <label>Weight</label><input class="form-check-input" type="checkbox" value={check2} checked={check2} id="flexCheckDefault" onChange={handleWeight} />
                                {check2 && (
                                <>
                                    {productData.weight.map((ele, index) => (
                                        <div className="row mb-3" key={index}>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label>Weight</label>
                                                    <input type="text" className="form-control" value={ele.weight} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label>Stock</label>
                                                    <input type="number" className="form-control" value={ele.stock} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label>Price</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={ele.price}
                                                        onChange={e => handlePriceChange(index, Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                             {error && <div className="alert alert-danger mt-3">{error}</div>}
                            </div>
                            <div class="col-sm-12">

                                <label>Color</label><input class="form-check-input2" type="checkbox" value={check3} checked={check3} id="flexCheckDefault" onChange={handleColorChange} />

                                {
                                    check3 ? (
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                <label>Color</label>
                                                <input type="text" class="form-control" placeholder="color" name="color" value={productData.color} onChange={handleChange} />
                                            </div>
                                        </div>


                                    ) : ("")
                                }
                            </div>
                            <div class="col-sm-12">

                                <span>Size</span><input class="form-check-input3" type="checkbox" value={check4} checked={check4} id="flexCheckDefault" onChange={handleSize} />

                                {
                                    check4 ? (
                                        <>
                                            <div class="col-sm-4">

                                                <div class="form-group">
                                                    <label>Size</label>
                                                    {/* <input type="text" class="form-control" placeholder="size" name="size" value={productData.size} onChange={handleChange} /> */}
                                                    <CreatableSelect
                                                        isMulti
                                                        onChange={handleChange2}
                                                        options={selectedOptions2}
                                                        placeholder="Add Size"
                                                        value={selectedOptions2}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : ("")
                                }
                            </div>

                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Purchase Price <span>*</span></label>
                                    <select class="form-select form-control" aria-label="Default select example" name="purchase_price" value={productData.purchase_price} onChange={handleChange}>
                                        <option selected value="">Select</option>
                                        <option value="piece">Piece purchase price</option>
                                        <option value="box">Box purchase price.</option>
                                    </select>
                                    <span className="error-message">{purchaseError}</span>

                                </div>
                            </div>
                            <div class="col-sm-3 col-md-4">

                                <div class="form-group">
                                    <label>Selling Price Method <span>*</span></label>
                                    <select class="form-select form-control" aria-label="Default select example" name="selling_price_method" value={productData.selling_price_method} onChange={handleChange}>
                                        <option selected value="">Select</option>
                                        <option value="online">Online</option>
                                        <option value="offline">Offline</option>
                                    </select>
                                    <span className="error-message">{sellingPriceMethderr}</span>
                                </div>
                            </div>


                            {
                                productData?.selling_price_method === "offline" ? (
                                    <>
                                        {/* <div class="col-sm-3 col-md-4">
                                            <div class="form-group">
                                                <label>Price <span>*</span></label>
                                                <input type="number" class="form-control" placeholder="Enter Price" name="price" value={productData.price} onChange={handleChange} />
                                                <span className="error-message">{priceError}</span>
                                            </div>
                                        </div> */}
                                        {/* <div class="col-sm-3 col-md-4">

                                            <div class="form-group">
                                                <label>Selling price after discount <span>*</span></label>
                                                <input type="number" class="form-control" placeholder="Total Price" value={actualPriceAfterDiscount} disabled />
                                            </div>
                                        </div> */}
                                        {/* <div class="col-sm-3 col-md-4">

                                            <div class="form-group">
                                                <label>Discount <span>*</span></label>
                                                <input type="number" class="form-control" placeholder="Enter Discount" name="discount" value={productData.discount} onChange={handleChange} />
                                            </div>
                                        </div> */}

                                    </>
                                ) : ("")
                            }


                            <div class="col-sm-12">
                                <div class="form-group">

                                    <span>Want to add other description?</span><input class="form-check-input" type="checkbox" value={check1} checked={check1} id="flexCheckDefault" onChange={handleDescChange} />
                                    {
                                        check1 ? (
                                            <div class="row">
                                                <div class="col-sm-4">
                                                    <div class="form-group">
                                                        <label>Other Description- Section 1 </label>
                                                        <input type="text" class="form-control" placeholder="Enter Description" name="other_description1" value={productData.other_description1} onChange={handleChange} />
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">

                                                    <div class="form-group">
                                                        <label>Other Description- Section 2 </label>
                                                        <input type="text" class="form-control" placeholder="Enter Description" name="other_description2" value={productData.other_description2} onChange={handleChange} />
                                                    </div>
                                                </div>
                                            </div>

                                        ) : ("")
                                    }
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Tags</label>
                                    <Multiselect
                                        options={tagsData && tagsData}
                                        onSelect={(event) => selectOption(event)}
                                        onRemove={(event) => selectOption(event)}
                                        displayValue="label"
                                        name="tags"
                                        className="multi_select_main"
                                        selectedValues={selectedOptions}
                                    // showCheckbox
                                    />
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-4">

                                <div class="form-group">
                                    <label>Is the product veg , non-veg or other <span>*</span></label>
                                    <select class="form-select form-control" aria-label="Default select example" name="product_type" value={productData.product_type} onChange={handleChange}>
                                        <option selected value="">Select</option>
                                        <option value="0">Veg</option>
                                        <option value="1">Non Veg</option>
                                        <option value="2">Other</option>

                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Images</label>
                                    <input type="file" name="files" onChange={handleFileChange} multiple />
                                    <span className="error-message">{fileError}</span>
                                    <div>
                                        {productData.imagePreviews.map((preview, index) => (
                                            <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
                                                <img src={preview} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                <span style={{ cursor: "pointer" }} onClick={() => handleImageDelete(index)}>x</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div class="col-sm-3 col-md-4">

                                <div class="form-group">
                                    <label>Is the product best seliing ?</label>
                                    <input class="form-check-input5" type="checkbox" name="isBestSelling" value={check5} checked={check5} id="flexCheckDefault2" onChange={() => setCheck5(!check5)} />
                                </div>

                                <div class="form-group">
                                    <label>Is the product Top seliing ?</label>
                                    <input class="form-check-input7" type="checkbox" name="isTopSelling" value={check7} checked={check7} id="flexCheckDefault7" onChange={() => setCheck7(!check7)} />
                                </div>


                                <div class="form-group">
                                    <label>Is the product offered ?</label>
                                    <input class="form-check-input7" type="checkbox" name="isOffered" value={check9} checked={check9} id="flexCheckDefault7" onChange={() => setCheck9(!check9)} />
                                </div>


                                <div class="form-group">
                                    <label>Is the product belongs to fetured category ?</label>
                                    <input class="form-check-input6" type="checkbox" name="isFeatured" value={check6} checked={check6} id="flexCheckDefault3" onChange={() => setCheck6(!check6)} />
                                </div>

                                <div class="form-group">
                                    <label>Is the product is Branded ?</label>
                                    <input class="form-check-input8" type="checkbox" name="isBranded" value={check8} checked={check8} id="flexCheckDefault8" onChange={() => setCheck8(!check8)} />
                                </div>
                            </div>
                        </div>
                        <Link to="/allproducts"><button type="button" className="btnSubmit">Back</button></Link>
                        <button type="button" class={disabled ? "btnSubmit1" : "btnSubmit"} onClick={handleSubmit} disabled={disabled}>Update</button>
                    </div>

                </div>
            </div >

        </>
    )
}

export default EditProduct
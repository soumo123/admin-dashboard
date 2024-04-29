import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../css/main.css'
import { Multiselect } from "multiselect-react-dropdown";
import Message from '../custom/Message';


const CreateProduct = () => {



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
    const [tagId, setTagId] = useState([])
    const [actualPriceAfterDiscount, setActualPriceAfterDiscount] = useState("")

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        other_description1: '',
        other_description2: '',
        weight: '',
        unit: '',
        type: type,
        stock: '',
        color: '',
        size: '',
        deliverydays: '',
        tags: [],
        isBestSelling: false,
        isFeatured: false,
        isTopSelling: false,
        isBranded: false,
        isOffered: false,
        files: [], // Store selected files here,
        imagePreviews: []
    });

    const [check1, setCheck1] = useState(false)
    const [check2, setCheck2] = useState(false)
    const [check3, setCheck3] = useState(false)
    const [check4, setCheck4] = useState(false)

    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [stockError, setStockError] = useState('');
    const [fileError, setFileError] = useState('');



    const [tagsData, setTagsData] = useState([])



    const handleChange = (e) => {
        const { name, value } = e.target;
        // Prevent input containing a minus sign for price, stock, and discount
        if ((name === 'price' || name === 'stock' || name === 'discount') && value.includes('-')) {
            return; // Don't update state for input containing a minus sign
        }

        // Prevent setting negative values for price, stock, and discount
        if ((name === 'price' || name === 'stock' || name === 'discount') && parseFloat(value) < 0) {
            return; // Don't update state for negative values
        }


        setProductData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'name') setNameError('');
        if (name === 'description') setDescriptionError('');
        if (name === 'price') setPriceError('');
        if (name === 'stock') setStockError('');

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
        if (!productData.price) {
            setPriceError('Please enter a price.');
            return;
        }
        if (!productData.stock) {
            setStockError('Please enter stock.');
            return;
        }
        if (productData.files.length === 0) {
            setFileError('Please enter images.');
            return;
        }
        try {
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
            formData.append('isBestSelling', check5);
            formData.append('isTopSelling', check7);
            formData.append('isOffered', check9);
            formData.append('isFeatured', check6);
            formData.append('isBranded', check8);
            const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/create/${adminId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                setMessageType("success")
                setMessage("Product Created")
                setProductData({
                    name: '',
                    description: '',
                    price: '',
                    discount: '',
                    other_description1: '',
                    other_description2: '',
                    weight: '',
                    unit: '',
                    type: 1,
                    stock: '',
                    color: '',
                    size: '',
                    deliverydays: '',
                    tags: [],
                    isBestSelling: false,
                    isFeatured: false,
                    isTopSelling: false,
                    isBranded: false,
                    isOffered: false,
                    files: [],
                    imagePreviews: []
                });
                setTagId([]);
                setCheck5(false);
                setCheck6(false);
                setCheck7(false);
                setCheck8(false);
                setCheck9(false);
                setNameError('');
                setDescriptionError('');
                setPriceError('');
                setStockError('');
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
            }
        } catch (error) {
            setMessageType("error")
            setMessage("Product Not Created")
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
        const getID = [];
        for (let index = 0; index < event.length; index++) {
            getID.push(Number(event[index].value));
        }
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
            setProductData(prevState => ({
                ...prevState,
                size: '',
            }));
        }
    }


    useEffect(() => {
        getAlltags()
    }, [])

    useEffect(() => {
        let discountData = productData.price * productData.discount / 100
        setActualPriceAfterDiscount(productData.price - discountData)
    }, [productData.discount])

    return (
        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }
            <div class="container register-form">
                <div class="form">
                    <div class="note">
                        <p>Create Product</p>
                    </div>

                    <div class="form-content">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Product Name * </label>
                                    <input type="text" class="form-control" placeholder="Enter Name" name="name" value={productData.name} onChange={handleChange} />
                                    <span className="error-message">{nameError}</span>
                                </div>
                                <div class="form-group">
                                    <label>Description *</label>
                                    <input type="text" class="form-control" placeholder="Enter Description" name="description" value={productData.description} onChange={handleChange} />
                                    <span className="error-message">{descriptionError}</span>
                                </div>
                                <div class="form-group">
                                    <label>Stock *</label>
                                    <input type="number" class="form-control" placeholder="Stock" name="stock" value={productData.stock} onChange={handleChange} />
                                    <span className="error-message">{stockError}</span>
                                </div>
                                <div class="form-group">
                                    <label>Delicery Days *</label>
                                    <input type="number" class="form-control" placeholder="Days" name="deliverydays" value={productData.deliverydays} onChange={handleChange} />
                                </div>

                                <span>Weight</span><input class="form-check-input" type="checkbox" value={check2} id="flexCheckDefault" onChange={handleWeight} />
                                {
                                    check2 ? (
                                        <>
                                            <div class="form-group">
                                                <label>Weight</label>
                                                <input type="number" class="form-control" placeholder="Weight" name="weight" value={productData.weight} onChange={handleChange} />
                                            </div>
                                            <div class="form-group">
                                                <label>Unit</label>
                                                <input type="text" class="form-control" placeholder="unit" name="unit" value={productData.unit} onChange={handleChange} />
                                            </div>
                                        </>
                                    ) : ("")
                                }

                                <span>Color</span><input class="form-check-input2" type="checkbox" value={check3} id="flexCheckDefault" onChange={handleColorChange} />

                                {
                                    check3 ? (

                                        <div class="form-group">
                                            <label>Color</label>
                                            <input type="text" class="form-control" placeholder="color" name="color" value={productData.color} onChange={handleChange} />
                                        </div>

                                    ) : ("")
                                }


                                <span>Size</span><input class="form-check-input3" type="checkbox" value={check4} id="flexCheckDefault" onChange={handleSize} />

                                {
                                    check4 ? (
                                        <>
                                            <div class="form-group">
                                                <label>Size</label>
                                                <input type="text" class="form-control" placeholder="size" name="size" value={productData.size} onChange={handleChange} />
                                            </div>
                                        </>
                                    ) : ("")
                                }



                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Price *</label>
                                    <input type="number" class="form-control" placeholder="Enter Price" name="price" value={productData.price} onChange={handleChange} />
                                    <span className="error-message">{priceError}</span>
                                </div>
                                <div class="form-group">
                                    <label>Actual price after discount *</label>
                                    <input type="number" class="form-control" placeholder="Total Price" value={actualPriceAfterDiscount} disabled />
                                </div>
                                <div class="form-group">
                                    <label>Discount *</label>
                                    <input type="number" class="form-control" placeholder="Enter Discount" name="discount" value={productData.discount} onChange={handleChange} />
                                </div>
                                <span>Want to add other description?</span><input class="form-check-input" type="checkbox" value={check1} id="flexCheckDefault" onChange={handleDescChange} />
                                {
                                    check1 ? (
                                        <div class="">
                                            <div class="form-group">
                                                <label>Other Description- Section 1 </label>
                                                <input type="text" class="form-control" placeholder="Enter Description" name="other_description1" value={productData.other_description1} onChange={handleChange} />
                                            </div>
                                            <div class="form-group">
                                                <label>Other Description- Section 2 </label>
                                                <input type="text" class="form-control" placeholder="Enter Description" name="other_description2" value={productData.other_description2} onChange={handleChange} />
                                            </div>
                                        </div>
                                    ) : ("")
                                }

                                <div class="form-group">
                                    <label>Tags</label>
                                    <Multiselect
                                        options={tagsData && tagsData}
                                        onSelect={(event) => selectOption(event)}
                                        onRemove={(event) => selectOption(event)}
                                        displayValue="label"
                                        name="tags"
                                        className="multi_select_main"
                                    // showCheckbox
                                    />
                                </div>
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
                        </div>
                        <div classs="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Is the product best seliing ?</label>
                                    <input class="form-check-input5" type="checkbox" name="isBestSelling" value={check5} id="flexCheckDefault2" onChange={() => setCheck5(!check5)} />
                                </div>

                                <div class="form-group">
                                    <label>Is the product Top seliing ?</label>
                                    <input class="form-check-input7" type="checkbox" name="isTopSelling" value={check7} id="flexCheckDefault7" onChange={() => setCheck7(!check7)} />
                                </div>


                                <div class="form-group">
                                    <label>Is the product offered ?</label>
                                    <input class="form-check-input7" type="checkbox" name="isOffered" value={check9} id="flexCheckDefault7" onChange={() => setCheck9(!check9)} />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Is the product belongs to fetured category ?</label>
                                    <input class="form-check-input6" type="checkbox" name="isFeatured" value={check6} id="flexCheckDefault3" onChange={() => setCheck6(!check6)} />
                                </div>

                                <div class="form-group">
                                    <label>Is the product is Branded ?</label>
                                    <input class="form-check-input8" type="checkbox" name="isBranded" value={check8} id="flexCheckDefault8" onChange={() => setCheck8(!check8)} />
                                </div>
                            </div>
                        </div>
                        <button type="button" onClick={handleSubmit} class="btnSubmit">Create</button>
                    </div>
                </div>
            </div >

        </>
    )
}

export default CreateProduct
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom'
const ViewProduct = () => {
    const { id } = useParams()
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("id");
    const type = localStorage.getItem("type");

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
    const [check1, setCheck1] = useState(false)
    const [check2, setCheck2] = useState(false)
    const [check3, setCheck3] = useState(false)
    const [check4, setCheck4] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [tagId, setTagId] = useState([])
    const [tagsData, setTagsData] = useState([])
    const [actualPriceAfterDiscount, setActualPriceAfterDiscount] = useState("")


    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
        purchase_price: '',
        delivery_partner: '',
        selling_price_method: '',
        discount: 0,
        other_description1: '',
        other_description2: '',
        weight: [],
        unit: '',
        type: type,
        stock: '',
        color: '',
        size: [],
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

    const getProduct = async () => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/getProductById?productId=${id}&type=${type}&adminId=${adminId}`);
            if (response.status === 200) {
                setProductData({
                    name: response.data.data[0].name,
                    description: response.data.data[0].description,
                    price: response.data.data[0].price,
                    purchase_price: response.data.data[0].purchase_price,
                    delivery_partner: response.data.data[0].delivery_partner,
                    selling_price_method: response.data.data[0].selling_price_method,
                    discount: response.data.data[0].discount,
                    other_description1: response.data.data[0].other_description1,
                    other_description2: response.data.data[0].other_description2,
                    weight: response.data.data[0].weight,
                    unit: response.data.data[0].unit,
                    type: response.data.data[0].type,
                    stock: response.data.data[0].stock,
                    color: response.data.data[0].color,
                    size: response.data.data[0].size, //lets check at last//
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
                setActualPriceAfterDiscount(response.data.data[0].actualpricebydiscount)
                setCheck1(response.data.data[0].other_description1 ? true : false)
                setCheck2(response.data.data[0].weight ? true : false)
                setCheck3(response.data.data[0].color ? true : false)
                setCheck4(response.data.data[0].size ? true : false)


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
    console.log("check5check5", check5)

    useEffect(() => {
        getAlltags()
        getProduct()
    }, [])

    useEffect(() => {
        // Match and select options based on initialTags
        const matchedOptions = tagsData.filter(option => tagId.includes(option.value));
        setSelectedOptions(matchedOptions);
    }, [tagId]);



    return (
        <>
            <div class="register-form">
                <div class="form">
                    <div class="note">
                        <h4>View Product</h4>
                    </div>

                    <div class="form-content">
                        <div class="row">
                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Product Name</label>
                                    <h4>{productData.name}</h4>
                                </div>
                            </div>


                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Delivery Partner</label>
                                    <h4>{productData.delivery_partner}</h4>
                                </div>
                            </div>

                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Description</label>
                                    <h4>{productData.description}</h4>
                                </div>
                            </div>
                            {/* <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Stock</label>
                                    <h4>{productData.stock}</h4>

                                </div>
                            </div> */}
                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Delivery Days</label>
                                    <h4>{productData.deliverydays} Days</h4>

                                </div>
                            </div>

                            {
                                productData?.selling_price_method === "online" ? (
                                    <div class="col-sm-3 col-md-4">
                                        <div class="form-group">
                                            <label>Choose Delivery Services</label>
                                            <div className="col" style={{ border: "2px solid black", padding: "10px" }}>
                                                <label>Zomato</label>
                                                <h4>{productData.zomato_service_price ? (`₹ ${productData.zomato_service_price}`) : "Not Set"}</h4>

                                                <label>Swiggy</label>
                                                <h4>{productData.swiggy_service_price ? (`₹ ${productData.swiggy_service_price}`) : "Not Set"}</h4>

                                                <label>Zepto</label>
                                                <h4>{productData.zepto_service_price ? (`₹ ${productData.zepto_service_price}`) : "Not Set"}</h4>


                                                <label>Blinkit</label>
                                                <h4>{productData.blinkit_service_price ? (`₹ ${productData.blinkit_service_price}`) : "Not Set"}</h4>


                                            </div>

                                        </div>
                                    </div>

                                ) : ("")
                            }

                            <div class="col-sm-12">


                                <div class="row">
                                    <div class="col-sm-4">
                                        <div class="form-group">
                                            <label>Weight</label>
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
                                                    <input type="text" className="form-control" value={ele.stock} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label>Price</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={ele.price}
                                                        readOnly
                                                        // onChange={e => handlePriceChange(index, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <div class="col-sm-12">

                                <div class="col-sm-4">

                                    <div class="form-group">
                                        <label>Color</label>
                                        <h4>{productData.color ? productData.color : "None"}</h4>
                                    </div>
                                </div>

                            </div>

                            <div class="col-sm-12">
                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <label>Size Avaliability</label>
                                       {
                                            productData && productData.size.map((ele)=>(
                                                <h4>{ele.value}</h4>
                                            )
                                        )}
                                        
                                        {/* <h4>{productData.size ? productData.size : "None"}</h4> */}
                                    </div>
                                </div>
                            </div>

                            {/* <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Purchase Price</label>
                                    <h4>{productData.purchase_price}</h4>


                                </div>
                            </div> */}
                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Selling Price Method</label>
                                    <h4>{productData.selling_price_method}</h4>

                                </div>
                            </div>

                            {/* {
                                productData?.selling_price_method === "offline" ? (
                                    <>
                                        <div class="col-sm-3 col-md-4">
                                            <div class="form-group">
                                                <label>Price</label>
                                                <h4>₹ {productData.price}</h4>
                                            </div>
                                        </div>
                                        <div class="col-sm-3 col-md-4">
                                            <div class="form-group">
                                                <label>Selling price after discount</label>
                                                <h4>₹ {actualPriceAfterDiscount}</h4>

                                            </div>
                                        </div>
                                        <div class="col-sm-3 col-md-4">

                                            <div class="form-group">
                                                <label>Discount</label>
                                                <h4>{productData.discount} %</h4>

                                            </div>
                                        </div>

                                    </>
                                ) : ("")
                            } */}




                            <div class="col-sm-12">

                                <div class="form-group">

                                    <div class="row">
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                <label>Other Description- Section 1 </label>
                                                <h4>{productData.other_description1 ? productData.other_description1 : "None"}</h4>
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                <label>Other Description- Section 2 </label>
                                                <h4>{productData.other_description2 ? productData.other_description2 : "None"}</h4>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>



                            <div class="col-sm-3 col-md-4">


                                <div class="form-group">
                                    <label>Tags</label>
                                    <div className=''>
                                        {
                                            selectedOptions && selectedOptions.map((ele)=>(
                                                <h3>{ele.label}</h3>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-4">


                                <div class="form-group">
                                    <label>Is the product veg , non-veg or other</label>
                                    <h4>{productData.product_type === 0 ? "Veg" : productData.product_type === 1 ? "Non Veg" : "Other"}</h4>

                                </div>
                            </div>
                            <div class="col-sm-3 col-md-4">
                                <div class="form-group">
                                    <label>Images</label>
                                    <div>
                                        {productData.imagePreviews.map((preview, index) => (
                                            <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
                                                <img src={preview} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />

                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            <div class="col-sm-6">

                                <div class="form-group">
                                    <label>Is the product best seliing ?</label>
                                    <h4>{productData.isBestSelling ? "Yes" : "No"}</h4>

                                </div>
                            </div>

                            <div class="col-sm-6">

                                <div class="form-group">
                                    <label>Is the product Top seliing ?</label>
                                    <h4>{productData.isTopSelling ? "Yes" : "No"}</h4>

                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                <label>Is the product offered ?</label>
                                    <h4>{productData.isOffered ? "Yes" : "No"}</h4>
                                </div>
                            </div>

                            <div class="col-sm-6">

                                <div class="form-group">
                                    <label>Is the product belongs to fetured category ?</label>
                                    <h4>{productData.isFeatured ? "Yes" : "No"}</h4>

                                </div>
                            </div>
                            <div class="col-sm-6">

                                <div class="form-group">
                                    <label>Is the product is Branded ?</label>
                                    <h4>{productData.isBranded ? "Yes" : "No"}</h4>

                                </div>

                            </div>


                        </div>
                        <Link to="/allproducts"><button type="button" class={"btnSubmit"}>Back</button></Link>
                    </div>



                </div>


            </div>

        </>
    )
}

export default ViewProduct
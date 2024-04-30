import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from '../images/nav1.png'
import '../css/checkbox.css'
import Category from '../images/category.png'
import Feature from '../images/feture.png'
import FeatureCard from '../images/feature_card.png'
import Trending from '../images/trending.png'
import TrendingCard from '../images/trending_cards.png'
import Deals from '../images/deals.png'
import DealCard from '../images/deal_card.png'
import MiddleCard from '../images/middle_card.png'
import Client from '../images/client.png'
import NewProduct from '../images/new_products.png'
import Browser from '../images/browser.png'
import Caraousel from '../images/caraousel.png'
import axios from 'axios'
import Message from '../custom/Message';
import { useSelector, useDispatch } from 'react-redux'
import { noteRefs } from '../redux/actions/userAction'



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
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
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
const Settings = () => {
    const dispatch = useDispatch()
    const [browserCategory, setBrowserCategory] = useState(false)
    const [logoheading, setLogoHeading] = useState("")
    const[email,setEmail] = useState("")
    const[phone,setPhone] = useState("")
    const[location,setlocation]=useState("")
    const [home, setHome] = useState(false)
    const [blogs, setBlogs] = useState(false)
    const [products, setProducts] = useState(false)
    const [search, setSerach] = useState(false)
    const [user, setUser] = useState(false)
    const [cart, setCart] = useState(false)
    const [carousel, setCarousel] = useState(false)
    const [userDetails, setUserdetails] = useState(false)
    const [category, setCategory] = useState(false)
    const [fetaureProducts, setFeatureProducts] = useState(false)
    const [featureCard, setFeatureCard] = useState(false)
    const [trendingProducts, setTrendingProducts] = useState(false)
    const [trendingCard, setTrendingCard] = useState(false)
    const [deals, setDeals] = useState(false)
    const [dealsProducts, setDealProducts] = useState(false)
    const [dealCard, setDealCard] = useState(false)
    const [middleCard, setMiddleCard] = useState(false)
    const [client, setClient] = useState(false)
    const [newProducts, setNewProducts] = useState(false)
    const [newProductCard, setNewProductCard] = useState(false)
    const [browserPost, setBrowserPost] = useState(false)
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    let adminId = localStorage.getItem("adminId")
    let type = localStorage.getItem("type")
    const dataRefe = useSelector((state) => state.noteRef.arr);

    const [value, setValue] = React.useState(0);

    const [imageUplaod, setImageUplaod] = useState({
        file: null
    })
    const handleImageChange = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        if (e.target.type === 'file') {
            let name = e.target.name
            setImageUplaod({ ...imageUplaod, file: e.target.files[0] });
            const reader = new FileReader();
            reader.onload = () => {
                document.getElementById('selectedImage').src = reader.result;
            };
            reader.readAsDataURL(e.target.files[0]);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            formData.append("file", e.target.files[0])

            await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/update_image?adminId=${adminId}&type=${type}&name=${name}`, formData, config).then((res) => {
                if (res.status === 200) {
                    setMessageType("success")
                    setMessage("Image Updated")
                    dispatch(noteRefs(new Date().getSeconds()))
                    setTimeout(() => {
                        setMessage(false)
                    }, 2000);
                    setImageUplaod({
                        file: null
                    })
                }
            }).catch((err) => {
                setMessageType("error")
                setMessage("Settings Not Updated")
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
                setImageUplaod({
                    file: null
                })
            })



        }
    };


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const getSettings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/setting_rules?adminId=${adminId}&type=${type}`)
            if (response.status === 200) {
                console.log(response.data.data.blog, "settings")
                setLogoHeading(response.data.data.logoheading)
                setEmail(response.data.data.email)
                setPhone(response.data.data.phone)
                setlocation(response.data.data.location)
                setBrowserCategory(response.data.data.browse_category)
                setHome(response.data.data.home)
                setBlogs(response.data.data.blog)
                setProducts(response.data.data.products)
                setSerach(response.data.data.search)
                setUser(response.data.data.user)
                setCart(response.data.data.cart)
                setCarousel(response.data.data.caraousel1)
                setUserdetails(response.data.data.user_details)
                setCategory(response.data.data.category)
                setFeatureProducts(response.data.data.feature_products)
                setFeatureCard(response.data.data.feature_card)
                setTrendingProducts(response.data.data.trending_products)
                setTrendingCard(response.data.data.trending_cards)
                setDeals(response.data.data.deals)
                setDealProducts(response.data.data.deals_products)
                setDealCard(response.data.data.deals_products_card)
                setMiddleCard(response.data.data.middle_card)
                setClient(response.data.data.client)
                setNewProducts(response.data.data.new_products)
                setNewProductCard(response.data.data.new_product_card)
                setBrowserPost(response.data.data.browse_recent_post)
            }

        } catch (error) {
            console.log(error)
        }
    }


    const updateSettings = async () => {

        try {
            let json = {
                adminId: adminId,
                type: Number(type),
                logoheading:logoheading,
                email:email,
                phone:phone,
                location:location,
                browse_category: browserCategory,
                home: home,
                products: products,
                blog: blogs,
                search: search,
                user: user,
                cart: cart,
                user_details: userDetails,
                caraousel1: carousel,
                category: category,
                feature_products: fetaureProducts,
                feature_card: featureCard,
                trending_products: trendingProducts,
                trending_cards: trendingCard,
                deals: deals,
                deals_products: dealsProducts,
                deals_products_card: dealCard,
                middle_card: middleCard,
                client: client,
                new_products: newProducts,
                new_product_card: newProductCard,
                browse_recent_post: browserPost

            }
            const config = {
                headers: {
                    'Content-Type': "application/json",
                },
                withCredentials: true
            }



            console.log("jsonjson", json)

            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/update_settings?adminId=${adminId}&type=${type}`, json, config)

            if (response.status === 200) {
                setMessageType("success")
                setMessage("Settings Updated")
                dispatch(noteRefs(new Date().getSeconds()))
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
            }


        } catch (error) {
            console.log(error)
            setMessageType("error")
            setMessage("Settings Not Updated")

            setTimeout(() => {
                setMessage(false)
            }, 2000);
        }


    }

    const handleLogoHeading = (e) => {
        setLogoHeading(e.target.value)
    }

    const handleEmail = (e)=>{
        setEmail(e.target.value)
    }

    const handlePhone = (e)=>{
        setPhone(e.target.value)
    }

    const handleLocation = (e)=>{
        setlocation(e.target.value)
    }

    const handleBrowserCatrgory = (e) => {
        setBrowserCategory(e.target.checked)
    }
    console.log("browserrrr", browserCategory)
    const handleHome = (e) => {
        setHome(e.target.checked)

    }

    const handleProducts = (e) => {
        setProducts(e.target.checked)
    }

    const hanldleBlogs = (e) => {
        setBlogs(e.target.checked)
    }

    const handleSearch = (e) => {
        setSerach(e.target.checked)
    }

    const handleUser = (e) => {
        setUser(e.target.checked)
    }
    const handleCart = (e) => {
        setCart(e.target.checked)
    }

    const handleUserDeatails = (e) => {
        setUserdetails(e.target.checked)
    }

    const handleCraousel = (e) => {
        console.log("caraaa",e)
        setCarousel(e.target.checked)
    }

    const hanldeCat = (e) => {
        setCategory(e.target.checked)
    }

    const handleFeatureProducts = (e) => {
        setFeatureProducts(e.target.checked)
    }


    const handleFeatureCard = (e) => {
        setFeatureCard(e.target.checked)
    }

    const handleTrendingProducts = (e) => {
        setTrendingProducts(e.target.checked)
    }

    const handleTrendingCard = (e) => {
        setTrendingCard(e.target.checked)
    }

    const handleDeals = (e) => {
        setDeals(e.target.checked)
    }

    const handleDealProducts = (e) => {
        setDealProducts(e.target.checked)
    }

    const handleDealCard = (e) => {
        setDealCard(e.target.checked)
    }

    const handleMiddleCard = (e) => {
        setMiddleCard(e.target.checked)
    }

    const handleClient = (e) => {
        setClient(e.target.checked)
    }


    const handleNewProducts = (e) => {
        setNewProducts(e.target.checked)
    }

    const hanldeNewProductCard = (e) => {
        setNewProductCard(e.target.checked)
    }


    const handleBrowserPost = (e) => {
        console.log("blogg",e)
        setBrowserPost(e.target.checked)
    }

    useEffect(() => {
        getSettings()
    }, [dataRefe])



    return (
        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }

            <div className="container">
                <div className="row">
                    <div className="col">
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Header" {...a11yProps(0)} />
                                    <Tab label=" Products" {...a11yProps(1)} />
                                    <Tab label=" Footer" {...a11yProps(2)} />

                                </Tabs>

                            </Box>

                            <CustomTabPanel value={value} index={0}>
                                <div class="container text-center">
                                    <ol >
                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "100px" }} src={Navbar} />
                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="">
                                                            <label><span> </span> <span>Logo Heading</span> </label>
                                                            <input  type="text" value={logoheading} onChange={handleLogoHeading} />
                                                        </div>
                                                    </div>

                                                    <div className='' style={{
                                                    }}>
                                                        <div class="">
                                                            <label><span> </span> <span>Email Heading</span> </label>
                                                            <input  type="text" value={email} onChange={handleEmail} />
                                                        </div>
                                                    </div>


                                                    <div className='' style={{
                                                    }}>
                                                        <div class="">
                                                            <label><span> </span> <span>Mobile Number</span> </label>
                                                            <input  type="text" value={phone} onChange={handlePhone} />
                                                        </div>
                                                    </div>


                                                    <div className='' style={{
                                                    }}>
                                                        <div class="">
                                                            <label><span> </span> <span>Location</span> </label>
                                                            <input  type="text" value={location} onChange={handleLocation} />
                                                        </div>
                                                    </div>




                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-12" type="checkbox" value={browserCategory} onChange={handleBrowserCatrgory} checked={browserCategory} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-12"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Browse Category</span> </label>
                                                        </div>
                                                    </div>
                                                    <div class="">
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-13" type="checkbox" value={home} onChange={handleHome} checked={home} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-13"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Home </span> </label>
                                                        </div>
                                                    </div>
                                                    <div class="">
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-14" type="checkbox" value={products} onChange={handleProducts} checked={products} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-14"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Products</span> </label>
                                                        </div>
                                                    </div>
                                                    <div class="">
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-15" type="checkbox" value={blogs} onChange={hanldleBlogs} checked={blogs} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-15"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Blog</span> </label>
                                                        </div>
                                                    </div>
                                                    <div class="">
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-16" type="checkbox" value={search} onChange={handleSearch} checked={search} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-16"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Search</span> </label>
                                                        </div>
                                                    </div>
                                                    <div class="">
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-17" type="checkbox" value={user} onChange={handleUser} checked={user} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-17"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Users</span> </label>
                                                        </div>
                                                    </div>
                                                    <div class="">
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-18" type="checkbox" value={cart} onChange={handleCart} checked={cart} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-18"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Cart</span> </label>
                                                        </div>
                                                    </div>
                                                    <div class="">
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-199" type="checkbox" value={userDetails} onChange={handleUserDeatails} checked={userDetails} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-199"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>User Details</span> </label>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <label>Logo Image</label>
                                                        <input type="file" name="logo" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Loader</label>
                                                        <input type="file" name="loader" onChange={handleImageChange} />
                                                    </div>
                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>


                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "300px" }} src={Caraousel} />
                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-212" type="checkbox" value={carousel} onChange={handleCraousel} checked={carousel} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-212"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Caraousel</span> </label>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <label>Caraousel Image 1</label>
                                                        <input type="file" name="caraousel1" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Caraousel Image 2 </label>
                                                        <input type="file" name="caraousel2" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Caraousel Image 3</label>
                                                        <input type="file" name="caraousel3" onChange={handleImageChange} />
                                                    </div>

                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>


                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "300px" }} src={Category} />
                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-19" type="checkbox" value={category} onChange={hanldeCat} checked={category} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-19"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Category</span> </label>
                                                        </div>
                                                    </div>

                                                    <div className="">
                                                        <label>Category Image 1</label>
                                                        <input type="file" name="category1" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Category Image 2 </label>
                                                        <input type="file" name="category2" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Category Image 3</label>
                                                        <input type="file" name="category3" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Category Image 4</label>
                                                        <input type="file" name="category4" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Category Image 5 </label>
                                                        <input type="file" name="category5" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Category Image 6</label>
                                                        <input type="file" name="category6" onChange={handleImageChange} />
                                                    </div>
                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "300px" }} src={Feature} />
                                                    <img style={{ height: "300px" }} src={FeatureCard} />

                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-200" type="checkbox" value={fetaureProducts} onChange={handleFeatureProducts} checked={fetaureProducts} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-200"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Feature Products</span> </label>
                                                        </div>
                                                    </div>
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-201" type="checkbox" value={featureCard} onChange={handleFeatureCard} checked={featureCard} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-201"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Feature Products Card</span> </label>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <label>Feature Image Card</label>
                                                        <input type="file" name="middle_banner1" onChange={handleImageChange} />
                                                    </div>
                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>

                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "230px" }} src={Trending} />
                                                    <img style={{ height: "230px" }} src={TrendingCard} />
                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-202" type="checkbox" value={trendingProducts} onChange={handleTrendingProducts} checked={trendingProducts} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-202"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Trending Products</span> </label>
                                                        </div>
                                                    </div>
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-203" type="checkbox" value={trendingCard} onChange={handleTrendingCard} checked={trendingCard} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-203"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>TrendingCard</span> </label>
                                                        </div>


                                                        <div className="">
                                                            <label>Trending Image Card Image 1</label>
                                                            <input type="file" name="banner1" onChange={handleImageChange} />
                                                        </div>
                                                        <div className="">
                                                            <label>Trending Image Card Image 2</label>
                                                            <input type="file" name="banner2" onChange={handleImageChange} />
                                                        </div>
                                                        <div className="">
                                                            <label>Trending Image Card Image 3</label>
                                                            <input type="file" name="banner3" onChange={handleImageChange} />
                                                        </div>
                                                    </div>

                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>

                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "230px" }} src={Deals} />
                                                    <img style={{ height: "230px" }} src={DealCard} />

                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-204" type="checkbox" value={deals} onChange={handleDeals} checked={deals} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-204"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Deals</span> </label>
                                                        </div>
                                                    </div>
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-205" type="checkbox" value={dealsProducts} onChange={handleDealProducts} checked={dealsProducts} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-205"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Deals Products</span> </label>
                                                        </div>
                                                    </div>
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-206" type="checkbox" value={dealCard} onChange={handleDealCard} checked={dealCard} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-206"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Deals Card</span> </label>
                                                        </div>
                                                        <div className="">
                                                            <label>Deals Image Card Image</label>
                                                            <input type="file" name="middle_banner2" onChange={handleImageChange} />
                                                        </div>

                                                    </div>
                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>

                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "300px" }} src={MiddleCard} />
                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-207" type="checkbox" value={middleCard} onChange={handleMiddleCard} checked={middleCard} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-207"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Middle card</span> </label>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <label>Middle Card Image 1</label>
                                                        <input type="file" name="middle_banner3" onChange={handleImageChange} />
                                                    </div>

                                                    <div className="">
                                                        <label>Middle Card Image 2</label>
                                                        <input type="file" name="middle_banner4" onChange={handleImageChange} />
                                                    </div>

                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>

                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "300px" }} src={Client} />
                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-208" type="checkbox" value={client} onChange={handleClient} checked={client} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-208"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Client</span> </label>
                                                        </div>
                                                    </div>


                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>

                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "300px" }} src={NewProduct} />
                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-209" type="checkbox" value={newProducts} onChange={handleNewProducts} checked={newProducts} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-209"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>New Products</span> </label>
                                                        </div>
                                                    </div>
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-210" type="checkbox" value={newProductCard} onChange={hanldeNewProductCard} checked={newProductCard} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-210"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>New Products Card</span> </label>
                                                        </div>
                                                    </div>

                                                    <div className="">
                                                        <label>New Product Card Image</label>
                                                        <input type="file" name="middle_banner5" onChange={handleImageChange} />
                                                    </div>
                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>

                                        <li>
                                            <div class="row">
                                                <div class="col">
                                                    <img style={{ height: "300px" }} src={Browser} />
                                                </div>
                                                <div class="col">
                                                    <div className='' style={{
                                                    }}>
                                                        <div class="checkbox-wrapper-15"> <input class="inp-cbx" id="cbx-211" type="checkbox" value={browserPost} onChange={handleBrowserPost} checked={browserPost} style={{ display: "none" }} />
                                                            <label class="cbx" for="cbx-211"> <span> <svg width="12px" height="9px" viewbox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg> </span> <span>Blogs</span> </label>
                                                        </div>
                                                    </div>

                                                    <div className="">
                                                        <label>Blog  Card Image 1</label>
                                                        <input type="file" name="middle_banner6" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Blog  Card Image 2</label>
                                                        <input type="file" name="middle_banner7" onChange={handleImageChange} />
                                                    </div>
                                                    <div className="">
                                                        <label>Blog  Card Image 3</label>
                                                        <input type="file" name="middle_banner8" onChange={handleImageChange} />
                                                    </div>
                                                </div>
                                                <hr style={{
                                                    marginTop: "100px"
                                                }}></hr>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                                <button type="submit" className="btn btn-primary" onClick={updateSettings}>Save</button>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>

                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>

                            </CustomTabPanel>
                        </Box>
                    </div>
                </div>
            </div>
        </>


    );
}
export default Settings
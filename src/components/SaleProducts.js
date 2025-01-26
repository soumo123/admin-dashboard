import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios'
import Message from '../custom/Message';

const SaleProducts = () => {

    const [loader, setloader] = useState(false);
    const [salesProducts, setSaleProducts] = useState([]);
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const adminToken = localStorage.getItem("adminToken");
    const [load, setLoad] = useState(false)
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const handlePageChange = (event, value) => {
        setOffset((value - 1) * limit);
    };

    const getSaleProducts = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${adminToken}`, // Bearer Token Format
                },
            };
            const response = await axios.get(
                `${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/getsale?shop_id=${shop_id}&adminId=${adminId}&limit=${limit}&offset=${offset}`,
                config
            );
            if (response.status === 200) {
                setloader(true);
                setSaleProducts(response.data.data);
                setTotalCount(response.data.totalData);
                setTotalPages(Math.ceil(response.data.totalData / limit));
            }
        } catch (error) {
            setloader(true);
            setSaleProducts([]);
            setTotalPages(0);
        }
    };

    const handleCheck = async (check, temp_id) => {
        let active = undefined
        console.log("checkcheck",check)
        if (check===true || check==="true") {
            active = 0
        } else {
            active = 1
        }
        console.log("activeeeeeeeee",check,active)
   
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
            };
            const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/updatesale?adminId=${adminId}&shop_id=${shop_id}&temp_id=${temp_id}&active=${active}`, "", config)
            if (response.status === 200) {
                setMessageType("success")
                setMessage("Status Update")
                setLoad(new Date().getSeconds())
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
            }
        } catch (error) {
            setMessageType("error")
            setMessage("Status Not Update")
            setTimeout(() => {
                setMessage(false)
            }, 2000);
        }



    }


    useEffect(() => {
        getSaleProducts()
    }, [load])



    return (
        <div className={`all-product`}>
            <h2>Sales Products</h2>

            <div class="row align-items-center">
                <div class="col-12 col-md-4 mb-3 mb-md-0">
                    <label className='fw-bold'>Total : {totalCount}</label>
                </div>
                <div class="col-12 col-md-4 mb-3 mb-md-0">

                </div>
                <div class="col-12 col-md-4">

                </div>
            </div>

            <div className="table-responsive">
                <table className="table custom-table-header ">
                    <thead>
                        <tr>
                            <th>Caption</th>
                            <th>Category</th>
                            <th>Start Date & Time</th>
                            <th>End Date & Time</th>
                            <th>Products</th>
                            <th>Active</th>

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
                            {salesProducts && salesProducts.length > 0 ? (
                                <tbody>
                                    {salesProducts.map((ele, index) => (
                                        <tr key={index}>
                                            <td>{ele.caption}</td>
                                            <td>{ele.category.name}</td>
                                            <td>{ele.start_date === null || ele.start_date === "" ? "" : dayjs(ele.start_date).format('DD/MM/YYYY, hh:mm A')}</td>
                                            <td>{ele.end_date === null || ele.end_date === "" ? "" : dayjs(ele.end_date).format('DD/MM/YYYY, hh:mm A')}</td>
                                            <td>
                                                {
                                                    ele.products.length > 0 ? (
                                                        <>
                                                            {
                                                                ele.products.map((item) => (
                                                                    <>
                                                                        <p>{item}</p>

                                                                    </>
                                                                ))
                                                            }
                                                        </>

                                                    ) : (
                                                        <p>All Products</p>
                                                    )
                                                }
                                            </td>
                                            <td>
                                                <div class="form-check form-switch">
                                                    <input data-toggle="tooltip" data-placement="top" title="Status" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" value={ele.active_sale} checked={ele.active_sale} onChange={(e) => handleCheck(e.target.value, ele.temp_id)} />
                                                </div>
                                            </td>
                                            {/* <td>{ele.active_sale ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Deactive</span>}</td> */}
                                            {/* <td>

                                                <div className="data-icons">
                                                    <span data-toggle="tooltip" data-placement="top" title="View" style={{ cursor: "pointer" }}><VisibilityIcon /></span>
                                                    <span data-toggle="tooltip" data-placement="top" title="Edit" style={{ cursor: "pointer" }}><CreateIcon /></span>
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                <div className="container">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="text-center">No sale avaliable</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </>
                    )}
                </table>

            </div>
            <Pagination
                count={totalPages}
                variant="outlined"
                color="secondary"
                onChange={handlePageChange}
            />
        </div>

    )
}

export default SaleProducts
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Pagination from '@mui/material/Pagination';

const Expiredproducts = ({ sidebarOpen }) => {

    const [agentData, setAgentData] = useState([]);
    const [expireproducts, setExpireproducts] = useState([])
    const shop_id = localStorage.getItem("shop_id");
    const adminId = localStorage.getItem("adminId")
    const type = localStorage.getItem("type")
    const [agId, setAgId] = useState("")
    const [loader, setloader] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0)
    const adminToken = localStorage.getItem("adminToken")


    const getAllAgents = async () => {
        try {
            const config = {
                headers: {
                  'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
              };
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_al_agents?shop_id=${shop_id}&key=&statustype=1&adminId=${adminId}`,config);
            if (response.status === 200) {
                setAgentData(response.data.data);
            } else {
                setAgentData([]);
            }
        } catch (error) {
            setAgentData([]);
        }
    };
    const handleSelectAgentId = (e) => {
        setAgId(e)
    }

    const getAllExpiredProducts = async () => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/product/get_expiry_products?adminId=${adminId}&shop_id=${shop_id}&agentId=${agId}&limit=${limit}&offset=${offset}`);
            if (response.status === 200) {
                setloader(true)
                setExpireproducts(response.data.data);
                setTotalPages(Math.ceil(response.data.totaldata / limit));
            } else {
                setloader(true)
                setExpireproducts([]);
            }

        } catch (error) {
            setloader(true)
            setExpireproducts([]);
            console.log(error)
        }


    }
    const handlePageChange = (event, value) => {
        setOffset((value - 1) * limit);
    };

    useEffect(() => {
        getAllAgents()
    }, [])

    useEffect(() => {
        if (agId) {
            getAllExpiredProducts()
        }
    }, [agId])

    console.log("expireee", expireproducts)


    return (

        <>
            <h1>Expired Products</h1>
            <div className={`all-product ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div class="row">
                    <div className='col-md-3'>
                        <label style={{ fontSize: "18px", fontWeight: "600" }}>Distributor Name : </label>
                        <select class="form-control" value={agId} onChange={(e) => handleSelectAgentId(e.target.value)} >
                            <option value="">Select agent id</option>
                            {
                                agentData && agentData.map((ele) => (
                                    <option key={ele.agentId} value={ele.agentId}>{`${ele.agent_name}(${ele.agentId})`}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <div className="table-responsive-lg">
                    <table className="table data-tables">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Id</th>
                                <th>Name</th>
                                <th>Expired</th>
                                <th>Unit</th>
                                <th>Weight</th>

                            </tr>
                        </thead>
                        {
                            !loader ? (
                                <div className="container">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="text-center">
                                                No Data Found
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {

                                        expireproducts && expireproducts.length > 0 ? (
                                            <tbody>
                                                {
                                                    expireproducts.map((ele) => (
                                                        <tr
                                                            key={ele?.productId}


                                                        >
                                                            <td>
                                                                <div className="">
                                                                    <img src={ele.image} style={{ width: '100%', height: '100%' }} />
                                                                </div>
                                                            </td>
                                                            <td>{ele?.productId}</td>
                                                            <td>{ele?.name}</td>
                                                            <td style={{ color: 'red' }}>{ele?.expired && "Expired"}</td>
                                                            <td> {ele?.unit}</td>
                                                            <td>
                                                                {

                                                                    ele.weight && ele.weight.map((item) => (
                                                                        <>
                                                                            <p>Weight : {item.weight} {ele.unit}, Quantity : {item.stock} , Price : ₹ {item.price}</p>

                                                                        </>
                                                                    ))

                                                                }
                                                            </td>

                                                        </tr>
                                                    ))
                                                }

                                                <Pagination count={totalPages} variant="outlined" color="secondary" onChange={handlePageChange} />
                                            </tbody>

                                        ) : (
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="text-center">
                                                            No Products Product Found
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                </>
                            )
                        }
                    </table>
                </div>


            </div>
        </>
    )
}

export default Expiredproducts

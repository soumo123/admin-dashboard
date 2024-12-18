import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ViewModal from '../custom/ViewModal'


const AllUsers = ({ sidebarOpen }) => {

    const [users, setUsers] = useState([])
    const [details, setDetails] = useState([])
    const [open, setOpen] = useState(false)
    const [userId, setUserId] = useState("")
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("id");
    const type = localStorage.getItem("type");
    const [loader, setloader] = useState(false);
    const adminToken = localStorage.getItem("adminToken")


    const handleOpen = async (id) => {
        setOpen(true)
        const config = {
            headers: {
                'Authorization': `Bearer ${adminToken}` // Bearer Token Format
            }
        };
        const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_user_details?type=${type}&userId=${id}&adminId=${adminId}`, config)
        if (response.status === 200) {
            setDetails(response.data)
        } else {
            setDetails([])
        }

    }
    console.log("detailssss", details)

    const getAllUsersByAdmin = async () => {

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
            };
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_users_by_admin?type=${type}&adminId=${adminId}`, config)
            if (response.status === 200) {
                setloader(true)
                setUsers(response.data.data)
            }

        } catch (error) {
            setloader(true)
            console.log(error.stack)
        }

    }


    useEffect(() => {
        getAllUsersByAdmin()
    }, [])


    return (
        <>

            <div className={`all-product ${sidebarOpen ? 'sidebar-open' : ''} mt-5`}>
                <div class="row align-items-center">
                    <div class="col-12 col-md-4 mb-3 mb-md-0">
                        <h3>Users</h3>
                    </div>
                    <div class="col-12 col-md-4 mb-3 mb-md-0">
                        <div className="form-group">

                        </div>
                    </div>
                    <div class="col-12 col-md-4">

                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table custom-table-header">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>Date of joining</th>

                                <th>Action</th>
                            </tr>
                        </thead>
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
                                        users && users.length > 0 ? (
                                            <tbody>
                                                {users && users.map((ele) => (
                                                    <tr key={ele.userId}>
                                                        <td>{ele.userId}</td>
                                                        <td>{ele.name}</td>
                                                        <td>{new Date(ele.created_at).toLocaleDateString('en-GB').split('/').reverse().join('/')}</td>

                                                        <td>
                                                            <button className="btn btn-edit" onClick={() => handleOpen(ele.userId)}><i className="fas fa-edit"></i>View</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        ) : (
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="text-center">
                                                            No Users Found
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


            <ViewModal open={open} setOpen={setOpen} details={details} />
        </>
    )
}

export default AllUsers
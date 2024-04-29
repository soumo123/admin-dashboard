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


    const handleOpen = async (id) => {
        setOpen(true)

        const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_user_details?type=${type}&userId=${id}`)
        if (response.status === 200) {
            setDetails(response.data)
        } else {
            setDetails([])
        }

    }
    console.log("detailssss", details)

    const getAllUsersByAdmin = async () => {

        try {

            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_users_by_admin?type=${type}`)
            if (response.status === 200) {
                setUsers(response.data.data)
            }

        } catch (error) {

        }

    }


    useEffect(() => {
        getAllUsersByAdmin()
    }, [])


    return (
        <>

            <div className={`all-product ${sidebarOpen ? 'sidebar-open' : ''} mt-5`}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>Date of joining</th>

                            <th>Action</th>
                        </tr>
                    </thead>
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
                </table>
            </div>


            <ViewModal open={open} setOpen={setOpen} details={details} />
        </>
    )
}

export default AllUsers
import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const ViewModal = ({ open, setOpen, details }) => {

    const [pdName, setPdName] = useState("")

    console.log("detailsdetails", details)

    useEffect(() => {


        if (details.carts && details.carts.length > 0) {
            console.log("comming 1")
            details.carts.map((ele) => {
                setPdName(ele.name)
            })
        }

    }, [details.length])

    console.log("pdName", pdName)
    return (
        <>

            <Modal
                show={open}
                onHide={() => setOpen(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        User Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col">
                            Carts Products
                            <hr />
                            {
                                details.carts && details.carts.length === 0 ? (
                                    <h3>No Product in Cart</h3>
                                ) : (
                                    <>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Product Name</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">price</th>
                                                    <th scope="col">Quantity</th>
                                                    <th scope="col">Images</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {details.carts && details.carts.map((ele) => (
                                                    <tr key={ele.name}>
                                                        <td>{ele.name}</td>
                                                        <td>{ele.description}</td>
                                                        <td>{ele.price}</td>
                                                        <td>{ele.count} Piece</td>
                                                        <td>
                                                            <img src={ele.thumbImage} style={{ height: "60px" }} />
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )
                            }


                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            WhishList Products
                            <hr />

                            
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ViewModal
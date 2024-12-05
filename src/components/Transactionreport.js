import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import * as XLSX from 'xlsx'; // Import the xlsx library
import jsPDF from 'jspdf'; // Import the jsPDF library
import 'jspdf-autotable'; // Import the autotable plugin
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

const Transactionreport = () => {
    const [loader, setloader] = useState(false);
    const [reports, setReports] = useState([]);
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const adminToken = localStorage.getItem("adminToken");

    const getAllReports = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${adminToken}`, // Bearer Token Format
                },
            };
            const response = await axios.get(
                `${process.env.REACT_APP_PRODUCTION_URL}/api/v1/reportsdata?shop_id=${shop_id}&adminId=${adminId}&limit=${limit}&offset=${offset}`,
                config
            );
            if (response.status === 200) {
                setloader(true);
                setReports(response.data.data);
                setTotalCount(response.data.totalData);
                setTotalPages(Math.ceil(response.data.totalData / limit));
            }
        } catch (error) {
            setloader(true);
            setReports([]);
            setTotalPages(0);
        }
    };

    const handleExport = (event) => {
        const exportType = event.target.value;
        if (exportType === "1") {
            // Excel Export
            const headers = [
                "PRODUCT NAME",
                "ORDER ID",
                "QUANTITY",
                "WEIGHT",
                "PURCHASE PRICE",
                "SELLING PRICE",
                "TOTAL PRICE",
            ];

            const data = reports.map((ele) => ({
                "PRODUCT NAME": `${ele.productname} (${ele.productId})`,
                "ORDER ID": ele.orderId,
                QUANTITY: ele.quantity,
                WEIGHT: ele.weight,
                "PURCHASE PRICE": `₹ ${ele.purchaseprice}`,
                "SELLING PRICE": `₹ ${ele.sellingprice}`,
                "TOTAL PRICE": `₹ ${ele.totalprice}`,
            }));

            const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction Reports");
            XLSX.writeFile(workbook, "TransactionReports.xlsx");
        } else if (exportType === "2") {
            // PDF Export
            const doc = new jsPDF();
            const headers = [
                ["PRODUCT NAME", "ORDER ID", "QUANTITY", "WEIGHT", "PURCHASE PRICE", "SELLING PRICE", "TOTAL PRICE"],
            ];
            const data = reports.map((ele) => [
                `${ele.productname} (${ele.productId})`,
                ele.orderId,
                ele.quantity,
                ele.weight,
                `₹ ${ele.purchaseprice}`,
                `₹ ${ele.sellingprice}`,
                `₹ ${ele.totalprice}`,
            ]);

            doc.text("Transaction Reports", 14, 10);
            doc.autoTable({
                startY: 20,
                head: headers,
                body: data,
                theme: "striped",
                headStyles: { fillColor: [22, 160, 133] },
            });
            doc.save("TransactionReports.pdf");
        }
    };

    const handlePageChange = (event, value) => {
        setOffset((value - 1) * limit);
    };

    useEffect(() => {
        getAllReports();
    }, [limit, offset]); // Trigger fetch when limit or offset changes

    return (
        <>
            <div className={`all-product`}>
                <h2>Transaction Reports</h2>
            
                <div class="row align-items-center">
                    <div class="col-12 col-md-4 mb-3 mb-md-0">
                        <label className='fw-bold'>Total : {totalCount}</label>
                    </div>
                    <div class="col-12 col-md-4 mb-3 mb-md-0">
                        <div className="form-group">
                            <label className='fw-bold'>Export Data</label>
                            <select className="form-control" onChange={handleExport}>
                                <option value={""}>Select</option>
                                <option value="1">Export in Excel</option>
                                <option value="2">Export in PDF</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <div className="form-group">
                            <label className="fw-bold">Choose limits</label>
                            <select
                                className="form-control"
                                onChange={(e) => setLimit(Number(e.target.value))}
                            >
                                <option value={10}>Select</option>
                                <option value={10000000000}>All</option>
                                <option value={20}>20</option>
                                <option value={40}>40</option>
                                <option value={60}>60</option>
                                <option value={80}>80</option>
                            </select>
                        </div>
                    </div>
                </div>
            
                <div className="table-responsive">
                    <table className="table custom-table-header ">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Product name</th>
                                <th>Order Id</th>
                                <th>Quantity</th>
                                <th>Weight</th>
                                <th>Purchase price</th>
                                <th>Selling price</th>
                                <th>Total price</th>
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
                                {reports && reports.length > 0 ? (
                                    <tbody>
                                        {reports.map((ele, index) => (
                                            <tr key={index}>
                                                <td>{ele.date === null || ele.date === "" ? "" : dayjs(ele.date).format('DD/MM/YYYY, hh:mm A')}</td>
                                                <td>{ele.productname} ({ele.productId})</td>
                                                <td>{ele.orderId}</td>
                                                <td>{ele.quantity}</td>
                                                <td>{ele.weight}</td>
                                                <td>₹ {ele.purchaseprice}</td>
                                                <td>₹ {ele.sellingprice}</td>
                                                <td>₹ {ele.totalprice}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : (
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="text-center">No reports Found</div>
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

        </>
    );
};

export default Transactionreport;

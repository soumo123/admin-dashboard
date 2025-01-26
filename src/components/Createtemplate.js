import React, { useRef, useState, useEffect } from "react";
import { fabric } from "fabric";
import axios from 'axios'
import Message from '../custom/Message';
import { useNavigate } from "react-router-dom";

const Createtemplate = () => {
    const canvasRef = useRef(null);
        const navigate = useNavigate()
    
    const [uploadedImage, setUploadedImage] = useState(null);

    const [uploadedFileName, setUploadedFileName] = useState("");
    const [textObject, setTextObject] = useState(null);
    const [message, setMessage] = useState(false)
    const [messageType, setMessageType] = useState("")
    const adminId = localStorage.getItem("adminId");
    const shop_id = localStorage.getItem("shop_id");
    const adminToken = localStorage.getItem("adminToken")
    useEffect(() => {
        // Initialize Fabric Canvas
        const canvas = new fabric.Canvas("designCanvas", {
            width: 800,
            height: 600,
            backgroundColor: "#f3f3f3",
            selection: true, // Enable selection for all objects
        });
        canvasRef.current = canvas;
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            setUploadedFileName(file.name); 
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result; // Base64 string of the image

                fabric.Image.fromURL(imageUrl, (img) => {
                    img.set({
                        left: 50,
                        top: 50,
                        scaleX: 0.5, // Initial scale
                        scaleY: 0.5, // Initial scale
                        selectable: true, // Make the image selectable
                        evented: true,  // Enable dragging and interactions
                        hasControls: true,
                        hasBorders: true,
                    });
                    canvasRef.current.add(img);
                    canvasRef.current.renderAll();
                    setUploadedImage(img); // Set image for later size adjustment
                });
            };

            reader.readAsDataURL(file); // Read the file as a Base64 string
        }
    };

    const handleImageSizeChange = (e, dimension) => {
        if (uploadedImage) {
            const value = e.target.value;

            if (dimension === "width") {
                const scaleX = value / uploadedImage.width; // Update scaleX based on width change
                uploadedImage.set({ width: value, scaleX });
            } else if (dimension === "height") {
                const scaleY = value / uploadedImage.height; // Update scaleY based on height change
                uploadedImage.set({ height: value, scaleY });
            }

            canvasRef.current.renderAll(); // Re-render the canvas after update
        }
    };

    const handleScaleChange = (e, dimension) => {
        if (uploadedImage) {
            const value = e.target.value;
            if (dimension === "scaleX") {
                uploadedImage.set({ scaleX: value });
            } else if (dimension === "scaleY") {
                uploadedImage.set({ scaleY: value });
            }
            canvasRef.current.renderAll(); // Re-render after scale change
        }
    };

    const addText = () => {
        const text = new fabric.Textbox("Editable Text", {
            left: 200,
            top: 200,
            fontSize: 20,
            fill: "#000", // Initial font color
            fontWeight: "normal", // Initial font weight
            fontFamily: "Arial", // Initial font family
            textAlign: "left", // Initial text alignment
            selectable: true, // Make the text selectable
            evented: true,  // Enable interaction (dragging, resizing, etc.)
        });
        canvasRef.current.add(text);
        setTextObject(text); // Store text object for further customizations
    };

    const handleTextChange = (e, property) => {
        if (textObject) {
            const value = e.target.value;
            if (property === "fontSize") {
                textObject.set({ fontSize: value });
            } else if (property === "fontColor") {
                textObject.set({ fill: value });
            } else if (property === "fontWeight") {
                textObject.set({ fontWeight: value });
            } else if (property === "fontFamily") {
                textObject.set({ fontFamily: value });
            } else if (property === "textAlign") {
                textObject.set({ textAlign: value });
            }
            canvasRef.current.renderAll();
        }
    };

    const saveAsImage = async () => {
        const canvasData = canvasRef.current.toDataURL({
            format: "png",
            quality: 1,
        });

        const blob = await fetch(canvasData).then((res) => res.blob()); // Convert the canvas data URL to a Blob
        console.log("blobblob", blob);
        const formData = new FormData();
        const fileName = uploadedFileName || "custom-design.png";
        formData.append("file", blob, fileName); // Add the Blob to FormData

        // Send the image to the server via POST request
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${adminToken}`
                },
                withCredentials: true
            }
            const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/settings/createtemplate?shop_id=${shop_id}&adminId=${adminId}`, formData, config);
            if (response.status === 201) {
                setMessageType("success")
                setMessage("Template Created")
                navigate("/template")
            }
        } catch (error) {
            setMessageType("error")
            setMessage(error.response.data.message)
        }
    };

    return (
        <>
            {
                message ? (
                    <Message type={messageType} message={message} />
                ) : ("")
            }

            <div className="row">
                <div className="col">
                    <div className="editor-content">
                        <h1 className="editor-header">Create Template</h1>

                        <div className="file-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="upload-button"
                            />
                        </div>

                        {uploadedImage && (
                            <div className="image-controls">
                                <h3>Adjust Image Size</h3>
                                <label>
                                    Width:
                                    <input
                                        type="number"
                                        value={uploadedImage.width}
                                        onChange={(e) => handleImageSizeChange(e, "width")}
                                        className="input-field"
                                    />
                                </label>
                                <br />
                                <label>
                                    Height:
                                    <input
                                        type="number"
                                        value={uploadedImage.height}
                                        onChange={(e) => handleImageSizeChange(e, "height")}
                                        className="input-field"
                                    />
                                </label>
                                <br />
                                <label>
                                    Scale X:
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="2"
                                        step="0.1"
                                        value={uploadedImage.scaleX}
                                        onChange={(e) => handleScaleChange(e, "scaleX")}
                                        className="range-slider"
                                    />
                                </label>
                                <br />
                                <label>
                                    Scale Y:
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="2"
                                        step="0.1"
                                        value={uploadedImage.scaleY}
                                        onChange={(e) => handleScaleChange(e, "scaleY")}
                                        className="range-slider"
                                    />
                                </label>
                            </div>
                        )}

                        <button className="button" onClick={addText}>
                            Add Text
                        </button>

                        {textObject && (
                            <div className="text-controls">
                                <h3>Text Customization</h3>
                                <label>
                                    Font Size:
                                    <input
                                        type="number"
                                        value={textObject.fontSize}
                                        onChange={(e) => handleTextChange(e, "fontSize")}
                                        className="input-field"
                                    />
                                </label>
                                <br />
                                <label>
                                    Font Color:
                                    <input
                                        type="color"
                                        value={textObject.fill}
                                        onChange={(e) => handleTextChange(e, "fontColor")}
                                        className="input-field"
                                    />
                                </label>
                                <br />
                                <label>
                                    Font Weight:
                                    <select
                                        value={textObject.fontWeight}
                                        onChange={(e) => handleTextChange(e, "fontWeight")}
                                        className="input-field"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="bold">Bold</option>
                                        <option value="lighter">Lighter</option>
                                    </select>
                                </label>
                                <br />
                                <label>
                                    Font Family:
                                    <select
                                        value={textObject.fontFamily}
                                        onChange={(e) => handleTextChange(e, "fontFamily")}
                                        className="input-field"
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                    </select>
                                </label>
                                <br />
                                <label>
                                    Text Align:
                                    <select
                                        value={textObject.textAlign}
                                        onChange={(e) => handleTextChange(e, "textAlign")}
                                        className="input-field"
                                    >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </label>
                            </div>
                        )}

                        <button className="button-add" onClick={saveAsImage}>
                            Save as Image
                        </button>
                    </div>
                </div>

                <div className="col">

                    <canvas id="designCanvas"></canvas>
                </div>
            </div>
        </>
    );
};

export default Createtemplate;

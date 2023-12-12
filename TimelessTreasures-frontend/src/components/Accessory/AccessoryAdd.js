import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";

import AccessoryDataService from "../../services/AccessoryService";
import AuthService from "../../services/AuthService";
import FileService from "../../services/FileService";
import MapsInput from "../Helpers/MapsInput"

const AccessoryAdd = () => {
    let navigate = useNavigate();
    const form = useRef();
    const checkBtn = useRef();

    const currentUser = AuthService.getCurrentUser();

    const initialAccessoryState = {
        id: null,
        author: "",
        published: false,
        sold: false,
        buyer: "",
        title: "",
        description: "",
        category: "",
        gender: "",
        price: "",
        location: "",
        fileName: "",
    };
    const [accessory, setAccessory] = useState(initialAccessoryState);

    // handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccessory({ ...accessory, [name]: value });
    };

    // File
    const [currentFile, setCurrentFile] = useState(undefined);
    const [imagePreview, setImagePreview] = useState("");
    const [fileSizeError, setFileSizeError] = useState(false);
    const selectFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log(file.size)
            const fileSizeInMB = file.size / (1024 * 1024);
            console.log(file.name)
            if (fileSizeInMB <= 1) {
                setCurrentFile(file);
                setFileSizeError(false);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setCurrentFile(null);
                setFileSizeError(true);
            }
        }
    };

    // Validations
    const [submitted, setSubmitted] = useState(false);
    const required = (value) => {
        if (!value) {
            return (
                <div className="alert alert-danger" role="alert">
                    Bitte ausfüllen.
                </div>
            );
        }
    };

    // Save Accessory
    const saveAccessory = (e) => {
        e.preventDefault();
        setSubmitted(true);

        // check validation
        form.current.validateAll();
        if (checkBtn.current.context._errors.length === 0 && meetingPlace !== "") {
            // unique img name
            const uuid = uuidv4();
            const modifiedName = `${uuid}-${currentFile.name}`;

            const modifiedFile = new File([currentFile], modifiedName, {
                type: currentFile.type,
            });

            // upload img
            FileService.uploadImg(modifiedFile)
                .then((response) => {
                    console.log("Image uploaded successfully:", response.data);
                    setCurrentFile(undefined); // Clear the selected file
                })
                .catch((error) => {
                    console.log("Error uploading the image:", error);
                    setCurrentFile(undefined); // Clear the selected file
                });

            var data = {
                author: currentUser.username,
                title: accessory.title,
                description: accessory.description,
                category: accessory.category,
                gender: accessory.gender,
                price: accessory.price,
                location: meetingPlace,
                fileName: modifiedName,
            };

            // create accessory
            AccessoryDataService.create(data)
                .then(response => {
                    setAccessory({
                        id: response.data.id,
                        author: response.data.author,
                        published: response.data.published,
                        sold: response.data.sold,
                        buyer: response.data.buyer,
                        title: response.data.title,
                        description: response.data.description,
                        category: response.data.category,
                        gender: response.data.gender,
                        price: response.data.price,
                        fileName: response.data.fileName,
                    });
                    console.log(response.data);
                    navigate("/accessorylist")
                })
                .catch(e => {
                    console.log(e);
                });
        }
    };

    // Location
    const [meetingPlace, setMeetingplace] = useState("");
    const handleMeetingPointChange = (formattedAddress) => {
        setMeetingplace(formattedAddress);
    };

    const handleResetMeetingPoint = () => {
        setMeetingplace("");
    };

    return (
        <div >
            <h1>Neues Inserat</h1>
            <Form onSubmit={saveAccessory} ref={form}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="title">Titel</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="title"
                                value={accessory.title}
                                onChange={handleInputChange}
                                validations={[required]}
                                placeholder="Gib den Titel deines Inserats ein..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Beschreibung</label>
                            <Textarea
                                type="textarea"
                                className="form-control"
                                rows="5"
                                name="description"
                                value={accessory.description}
                                onChange={handleInputChange}
                                validations={[required]}
                                placeholder="Gib eine kurze Beschreibung an..."
                            />
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="category">Kategorie</label>
                                    <Select
                                        className="form-control"
                                        name="category"
                                        value={accessory.category}
                                        onChange={handleInputChange}
                                        validations={[required]}
                                    >
                                        <option disabled value="">Auswählen...</option>
                                        <option value="Uhr">Uhr</option>
                                        <option value="Ring">Ring</option>
                                        <option value="Kette">Kette</option>
                                        <option value="Armband">Armband</option>
                                        <option value="Brille">Brille</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="gender">Geschlecht</label>
                                    <Select
                                        className="form-control"
                                        name="gender"
                                        value={accessory.gender}
                                        onChange={handleInputChange}
                                        validations={[required]}
                                    >
                                        <option disabled value="">Auswählen...</option>
                                        <option value="Men">Männlich</option>
                                        <option value="Woman">Weiblich</option>
                                        <option value="Unisex">Unisex</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="price">Preis</label>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        value={accessory.price}
                                        onChange={handleInputChange}
                                        validations={[required]}
                                        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                                        placeholder="Preis angeben..."
                                    />
                                </div>
                            </div>
                        </div>
                        <label>Treffpunkt</label>
                        {meetingPlace === "" ? (
                            <MapsInput onMeetingpointChange={handleMeetingPointChange} />
                        ) : (
                            <div className="row">
                                <div className="col-8">
                                    <Input
                                        type="text"
                                        className="form-control"
                                        placeholder={meetingPlace}
                                        disabled
                                    />
                                </div>
                                <div className="col-4">
                                    <button
                                        className="btn btn-outline-danger"
                                        style={{ width: '100%' }}
                                        type="button"
                                        onClick={handleResetMeetingPoint}
                                    >
                                        Löschen
                                    </button>
                                </div>
                            </div>
                        )}
                        {submitted && meetingPlace === "" ? (
                            <div className="alert alert-danger" role="alert">
                                Bitte ausfüllen.
                            </div>
                        ) : null}
                    </div>
                    <div className="col-md-6">
                        <label> Bild</label>
                        <div className="row align-items-center">
                            <div className="col-12">
                                <div className="input-group mb-3 align-items-center">
                                    <div className="custom-file">
                                        <Input
                                            type="file"
                                            className="custom-file-input"
                                            id="inputGroupFile02"
                                            onChange={selectFile}
                                            validations={[required]}
                                        />
                                        <label className="custom-file-label" htmlFor="inputGroupFile02">
                                            {currentFile ? currentFile.name : 'Choose file'}
                                        </label>
                                    </div>
                                </div>
                                {fileSizeError && (
                                    <div className="alert alert-danger" role="alert">
                                        Bitte Bild welches kleiner als 1MB ist hochladen.
                                    </div>
                                )}
                            </div>
                        </div>
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '360px', objectFit: 'cover' }} />
                        )}
                    </div>
                </div>
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>

            <div style={{ position: "fixed", top: '90vh', right: '50%', transform: 'translateX(50%)', zIndex: 999 }}>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                    <button onClick={saveAccessory} className="btn btn-success">
                        Zur Prüfung hochladen
                    </button>
                </div>
            </div>
            <div style={{ height: '100px' }}></div>
        </div>
    );
};

export default AccessoryAdd;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AccessoryDataService from "../../services/AccessoryService";
import PaypalCheckoutButton from "../Helpers/PaypalCheckoutButton";
import MapsDisplay from "../Helpers/MapDetail";

const AccessoryDetail = () => {
    const { id } = useParams();

    const initialAccessoryState = {
        id: null,
        author: "",
        published: false,
        title: "",
        description: "",
        category: "",
        gender: "",
        price: "",
        location: "",
        fileName: "",
    };

    const [currentAccessory, setCurrentAccessory] = useState(
        initialAccessoryState
    );

    // get accessory with id
    const getAccessory = (id) => {
        AccessoryDataService.get(id)
            .then((response) => {
                setCurrentAccessory(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        if (id) getAccessory(id);
    }, [id]);

    // set location
    const mapsLocation = {
        meetingPlace: currentAccessory.location
    }

    return (
        <div className="container" style={{ width: '80%' }}>
            <div className="card">
                <img
                    className="card-img-top-big"
                    src={`http://localhost:8080/api/files/${currentAccessory.fileName}`}
                    alt="Accessory"
                />
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-8"><h2>{currentAccessory.title}</h2></div>
                        <div className="col-md-4"><label htmlFor="difficulty">Kategorie: {currentAccessory.category} • Stil: {currentAccessory.gender}</label></div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <label><strong>Beschreibung</strong></label>
                            <p>{currentAccessory.description}</p>
                            <label><strong>Anbieter</strong></label>
                            {currentAccessory.author}
                            <label><strong>Treffpunkt</strong></label>
                            <p>{currentAccessory.location}</p>
                            <label><strong>Preis </strong></label>
                            <p>{currentAccessory.price},00 Euro</p>
                            <div className="paypal-button-container">
                                <PaypalCheckoutButton></PaypalCheckoutButton>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <MapsDisplay location={mapsLocation}></MapsDisplay>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height: '50px' }}></div>
        </div>
    );
};

export default AccessoryDetail;

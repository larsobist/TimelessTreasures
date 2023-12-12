import React, { useState, useEffect } from "react";
import AccessoryDataService from "../../services/AccessoryService";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import FileService from "../../services/FileService";

const AccessoriesList = () => {
  const [accessories, setAccessories] = useState([]);
  const [currentAccessorySold, setCurrentAccessorySold] = useState(null);
  const [currentAccessoryBought, setCurrentAccessoryBought] = useState(null);
  const [currentAccessoryAvailable, setCurrentAccessoryAvailable] = useState(null);
  const [currentIndexSold, setCurrentIndexSold] = useState(-1);
  const [currentIndexAvailable, setCurrentIndexAvailable] = useState(-1);
  const [currentIndexBought, setCurrentIndexBought] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    retrieveAccessories();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchTitle) {
      const filteredAccessories = accessories.filter((accessory) =>
        accessory.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      setAccessories(filteredAccessories);
    } else {
      retrieveAccessories();
    }
    // eslint-disable-next-line
  }, [searchTitle]);

  // get all data
  const retrieveAccessories = () => {
    AccessoryDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setAccessories(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // search
  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const clearSearchTitle = () => {
    setSearchTitle("");
  };

  // set active in the correct list
  const setActiveAccessoryBought = (accessory, index) => {
    setCurrentAccessoryBought(accessory);
    setCurrentAccessorySold(null);
    setCurrentAccessoryAvailable(null);
    setCurrentIndexBought(index);
    setCurrentIndexAvailable(-1);
    setCurrentIndexSold(-1);
  };

  const setActiveAccessorySold = (accessory, index) => {
    setCurrentAccessoryBought(null);
    setCurrentAccessorySold(accessory);
    setCurrentAccessoryAvailable(null);
    setCurrentIndexBought(-1);
    setCurrentIndexSold(index);
    setCurrentIndexAvailable(-1);
  };

  const setActiveAccessoryAvailable = (accessory, index) => {
    setCurrentAccessoryBought(null);
    setCurrentAccessorySold(null);
    setCurrentAccessoryAvailable(accessory);
    setCurrentIndexBought(-1);
    setCurrentIndexSold(-1);
    setCurrentIndexAvailable(index);
  };

  // delete 
  const deleteAccessory = (accessory) => {
    AccessoryDataService.remove(accessory.id)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    // remove img also
    FileService.removeImg(accessory.fileName)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    const updatedAccessories = accessories.filter((r) => r.id !== accessory.id);
    setAccessories(updatedAccessories);
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Inseratsverwaltung von {currentUser.username}</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Suchen..."
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={clearSearchTitle}
            >
              Suche leeren
            </button>
          </div>
        </div>
      </div>
      {accessories.length > 0 ? (
        <div className="col-md-4">
          {accessories.filter((accessory) => accessory.sold && accessory.buyer === currentUser.username).length > 0 && (
            <h2>Gekaufte Accessoires</h2>
          )}
          <ul className="list-group">
            {accessories.length > 0 ? (
              accessories
                .filter((accessory) => accessory.sold && accessory.buyer === currentUser.username)
                .map((accessory, index) => (
                  <li
                    className={
                      "list-group-item " + (index === currentIndexBought ? "active" : "")
                    }
                    onClick={() => setActiveAccessoryBought(accessory, index)}
                    key={index}
                  >
                    {accessory.title}
                  </li>
                ))
            ) : (
              <li className="list-group-item">Keine gekauften Objekte gefunden</li>
            )}
          </ul>
          {accessories.filter((accessory) => accessory.sold && accessory.author === currentUser.username).length > 0 && (
            <h2>Verkaufte Accessoires</h2>
          )}
          <ul className="list-group">
            {accessories.length > 0 ? (
              accessories
                .filter((accessory) => accessory.sold && accessory.author === currentUser.username)
                .map((accessory, index) => (
                  <li
                    className={
                      "list-group-item " + (index === currentIndexSold ? "active" : "")
                    }
                    onClick={() => setActiveAccessorySold(accessory, index)}
                    key={index}
                  >
                    {accessory.title}
                  </li>
                ))
            ) : (
              <li className="list-group-item">Keine verkauften Inserate gefunden</li>
            )}
          </ul>
          {accessories.filter((accessory) => !accessory.sold && accessory.author === currentUser.username).length > 0 && (
            <h2>Inserate</h2>
          )}
          <ul className="list-group">
            {accessories.length > 0 ? (
              accessories
                .filter((accessory) => !accessory.sold && accessory.author === currentUser.username)
                .map((accessory, index) => (
                  <li
                    className={
                      "list-group-item " + (index === currentIndexAvailable ? "active" : "")
                    }
                    onClick={() => setActiveAccessoryAvailable(accessory, index)}
                    key={index}
                  >
                    {accessory.title}
                  </li>
                ))
            ) : (
              <li className="list-group-item">Keine erstellten Inserate gefunden</li>
            )}
          </ul>
        </div>
      ) : (
        <>
          <div className="col-md-4">Keine Inserate oder Käufe</div>
          <Link to={"/add"} className="btn btn-success">
            Erstelle dein erstes Inserat
          </Link>
        </>
      )}

      <div className="col-md-8">
        {currentAccessorySold ? (
          <div className="card">
            <div className="card-header" >
              <div className="row">
                <div className="col-md-10">
                  <div> <h4>{currentAccessorySold.title}</h4>
                    {currentAccessorySold.sold && "Verkauft"}
                  </div>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteAccessory(currentAccessorySold)}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label><strong>Beschreibung</strong></label>
                  {currentAccessorySold.description}
                  <label><strong>Kategorie</strong></label>
                  {currentAccessorySold.category}
                  <label><strong>Für...</strong></label>
                  {currentAccessorySold.gender}
                  <label><strong>Preis</strong></label>
                  {currentAccessorySold.price},00 Euro
                  <label><strong>Treffpunkt</strong></label>
                  {currentAccessorySold.location}
                  <label><strong>Verkauft an</strong></label>
                  <span>{currentAccessorySold.buyer}</span>
                </div>
                <div className="col-md-6">
                  <img
                    src={`http://localhost:8080/api/files/${currentAccessorySold.fileName}`}
                    alt={"Bild"}
                    className="card-img"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : currentAccessoryAvailable ? (
          <div className="card">
            <div className="card-header" >
              <div className="row">
                <div className="col-md-8">
                  <div> <h4>{currentAccessoryAvailable.title}</h4>
                    {currentAccessoryAvailable.published ? "Veröffentlicht" : "In der Überprüfung"}
                  </div>
                </div>
                {!currentAccessoryAvailable.sold && (
                  <div className="col-md-2">
                    <Link
                      to={"/accessories/" + currentAccessoryAvailable.id}
                      className="btn btn-sm btn-warning"
                    >
                      Bearbeiten
                    </Link>
                  </div>)}
                <div className="col-md-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteAccessory(currentAccessoryAvailable)}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label><strong>Beschreibung</strong></label>
                  {currentAccessoryAvailable.description}
                  <label><strong>Kategorie</strong></label>
                  {currentAccessoryAvailable.category}
                  <label><strong>Für...</strong></label>
                  {currentAccessoryAvailable.gender}
                  <label><strong>Preis</strong></label>
                  {currentAccessoryAvailable.price},00 Euro
                  <label><strong>Treffpunkt</strong></label>
                  {currentAccessoryAvailable.location}
                </div>
                <div className="col-md-6">
                  <img
                    src={`http://localhost:8080/api/files/${currentAccessoryAvailable.fileName}`}
                    alt={"Bild"}
                    className="card-img"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : currentAccessoryBought ? (
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-10">
                  <div>
                    <h4>{currentAccessoryBought.title}</h4>
                    {currentAccessoryBought.sold && "Gekauft"}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label><strong>Beschreibung</strong></label>
                  {currentAccessoryBought.description}
                  <label><strong>Kategorie</strong></label>
                  {currentAccessoryBought.category}
                  <label><strong>Für...</strong></label>
                  {currentAccessoryBought.gender}
                  <label><strong>Preis</strong></label>
                  {currentAccessoryBought.price},00 Euro
                  <label><strong>Treffpunkt</strong></label>
                  {currentAccessoryBought.location}
                  <label><strong>Verkauft von</strong></label>
                  <span>{currentAccessoryBought.author}</span>
                </div>
                <div className="col-md-6">
                  <img
                    src={`http://localhost:8080/api/files/${currentAccessoryBought.fileName}`}
                    alt={"Bild"}
                    className="card-img"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : accessories.length > 0 ? (
          <div>
            <p>Klick auf ein Inserat...</p>
          </div>
        ) : (<></>)}
      </div>
    </div>
  );
};

export default AccessoriesList;

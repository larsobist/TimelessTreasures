import React, { useState, useEffect } from "react";
import AccessoryDataService from "../../services/AccessoryService";
import FileService from "../../services/FileService";

const AccessoriesListMod = () => {
  const [accessories, setAccessories] = useState([]);
  const [currentAccessory, setCurrentAccessory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    retrieveAccessories();
  }, []);

  useEffect(() => {
    if (accessories.length > 0) {
      setCurrentAccessory(accessories[currentIndex]);
    } else {
      setCurrentAccessory(null);
      setCurrentIndex(-1);
    }
  }, [accessories, currentIndex]);

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

  // get all unpublished accessories
  const retrieveAccessories = () => {
    AccessoryDataService.getAll()
      .then((response) => {
        const unpublishedAccessories = response.data.filter((accessory) => !accessory.published && !accessory.sold);
        setAccessories(unpublishedAccessories);
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

  // active of list
  const setActiveAccessory = (accessory, index) => {
    setCurrentAccessory(accessory);
    setCurrentIndex(index);
  };

  // delete selected 
  const deleteAccessory = (accessory) => {
    AccessoryDataService.remove(accessory.id)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

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

  // update status of published
  const updatePublished = (publishedStatus, index) => {
    const accessory = accessories[index];

    if (!accessory || !accessory.id) {
      console.log("Invalid accessory or accessory id");
      return;
    }

    var data = {
      id: accessory.id,
      author: accessory.author,
      published: publishedStatus,
      sold: accessory.sold,
      buyer: accessory.buyer,
      title: accessory.title,
      description: accessory.description,
      category: accessory.category,
      gender: accessory.gender,
      price: accessory.price,
      location: accessory.location,
      fileName: accessory.fileName,
    };

    AccessoryDataService.update(accessory.id, data)
      .then((response) => {
        const updatedAccessories = accessories.filter((r) => r.id !== accessory.id); // Remove the updated accessory from the accessories array
        setAccessories(updatedAccessories);
        setActiveAccessory("");

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Unveröffentlichte Inserate</h1>
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

      <div className="col-md-4">
        <ul className="list-group">
          {accessories.length > 0 ? (
            accessories.map((accessory, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveAccessory(accessory, index)}
                key={index}
              >
                {accessory.title}
              </li>
            ))
          ) : (
            <li className="list-group-item">Keine Inserate gefunden</li>
          )}
        </ul>
      </div>

      <div className="col-md-8">
        {currentAccessory ? (
          <div className="card">
            <div className="card-header" >
              <div className="row">
                <div className="col-md-8">
                  <div> <h4>{currentAccessory.title}</h4>
                    {currentAccessory.published ? "Veröffentlicht" : "In der Überprüfung"}
                  </div>
                </div>
                <div className="col-md-2">
                  <button
                    className={"btn btn-success btn-sm"}
                    onClick={() => updatePublished(true, currentIndex)}
                  >
                    Veröffentlichen
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteAccessory(currentAccessory)}
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
                  {currentAccessory.description}
                  <label><strong>Kategorie</strong></label>
                  {currentAccessory.category}
                  <label><strong>Für...</strong></label>
                  {currentAccessory.gender}
                  <label><strong>Preis</strong></label>
                  {currentAccessory.price},00 Euro
                  <label><strong>Location</strong></label>
                  {currentAccessory.location}
                  <label><strong>Anbieter</strong></label>
                  {currentAccessory.author}
                </div>
                <div className="col-md-6">
                  <img
                    src={`http://localhost:8080/api/files/${currentAccessory.fileName}`}
                    alt={"Bild"}
                    className="card-img"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p>Klick auf ein Inserat...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoriesListMod;

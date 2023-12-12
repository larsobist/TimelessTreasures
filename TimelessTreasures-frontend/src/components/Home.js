import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccessoryDataService from "../services/AccessoryService";
import FileService from "../services/FileService";
import AuthService from "../services/AuthService";
import Map from "../components/Helpers/Map"

const Accessories = () => {
  const user = AuthService.getCurrentUser();

  const [accessories, setAccessories] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredAccessories, setFilteredAccessories] = useState([]);

  useEffect(() => {
    retrieveAccessories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    retrieveImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterAccessories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessories, selectedCategory]);

  // Get all data from db
  const retrieveAccessories = () => {
    AccessoryDataService.getAll()
      .then((response) => {
        const publishedAccessories = response.data.filter((accessory) => accessory.published);
        setAccessories(publishedAccessories);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // get all img from server
  const retrieveImages = () => {
    FileService.getFiles()
      .then((response) => {
        setImgs(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //category filter
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filterAccessories = () => {
    const filteredAccessories = accessories.filter((accessory) => {
      if (selectedCategory === "all") {
        return true;
      }
      return accessory.category && accessory.category.includes(selectedCategory);
    });
    setFilteredAccessories(filteredAccessories);
  };

  // search
  useEffect(() => {
    if (searchTitle) {
      const filteredAccessories = accessories.filter((accessory) =>
        accessory.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      setAccessories(filteredAccessories);
    } else {
      retrieveAccessories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle]);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const clearSearchTitle = () => {
    setSearchTitle("");
  };

  //Toggle for Content oder Map
  const [showContent, setShowContent] = useState(true);
  const handleContentSwitch = () => {
    setShowContent((prevState) => !prevState);
  };

  return (
    <div>
      {user && showContent && (
        <div>
          {/* Search */}
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

          {/* Overview Content */}
          <div class="card">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item">
                  <button
                    className={`nav-link ${selectedCategory === "" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("")}
                  >
                    Alle
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    className={`nav-link ${selectedCategory === "Uhr" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("Uhr")}
                  >
                    Uhren
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    className={`nav-link ${selectedCategory === "Ring" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("Ring")}
                  >
                    Ringe
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    className={`nav-link ${selectedCategory === "Kette" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("Kette")}
                  >
                    Ketten
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    className={`nav-link ${selectedCategory === "Armband" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("Armband")}
                  >
                    Armbänder
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    className={`nav-link ${selectedCategory === "Brille" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("Brille")}
                  >
                    Brillen
                  </button>
                </li>
              </ul>
            </div>
            <div class="card-background">
              {filteredAccessories.length > 0 ? (
                <div className="row">
                  {filteredAccessories.map((accessory, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="card">
                        <img
                          className="card-img-top"
                          src={`http://localhost:8080/api/files/${accessory.fileName}`}
                          alt="Accessory"
                        />
                        <div className="card-body">
                          <h5 className="card-title">{accessory.title}</h5>
                          <p className="card-text">{"Preis: " + accessory.price + " Euro"}</p>
                          <Link to={"/accessory/" + accessory.id} className="btn btn-success btn-block">
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Kein Accessoire gefunden</div>
              )}
            </div>
          </div>
          <div style={{ height: '50px' }}></div>
        </div>
      )}

      {/* Map View */}
      {user &&
        <div style={{ position: "fixed", top: "90vh", right: "40%", zIndex: 2 }}>
          <div style={{ backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '5px', display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Link className="btn btn-success" onClick={handleContentSwitch}>
              {showContent ? "Kartenübersicht anzeigen" : "Inseratübersicht anzeigen"}
            </Link>
          </div>
        </div>
      }
      {user && !showContent && (
        <div style={{ position: "relative", overflow: "hidden" }}>
          <Map></Map>
        </div>
      )}

      {/* Logged out view */}
      {!user && <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1, width: "100%", height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
              <Link className="btn btn-success" style={{ marginRight: "5px" }} to={"/login"}>Login</Link>
              <Link className="btn btn-success" style={{ marginLeft: "5px" }} to={"/register"}>Registrieren</Link>
            </div>
          </div>
        </div>
        <div className="row" style={{ filter: "blur(8px)" }}>
          {imgs.map((img, index) => (
            <div className="col-md-4" key={index}>
              <div className="card" >
                <img className="card-img-top" src={`http://localhost:8080/api/files/${img.name}`} alt="Accessory" />
              </div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
};

export default Accessories;

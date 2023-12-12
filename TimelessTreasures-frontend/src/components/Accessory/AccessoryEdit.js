import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";

import AccessoryDataService from "../../services/AccessoryService";
import FileService from "../../services/FileService";
import MapsInput from "../Helpers/MapsInput"

const AccessoryEdit = props => {
  const { id } = useParams();
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

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

  // get accessory with id
  const [currentAccessory, setCurrentAccessory] = useState(initialAccessoryState);
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

  useEffect(() => {
    if (currentAccessory.id) {
      const {
        id,
        author,
        published,
        sold,
        buyer,
        title,
        description,
        category,
        gender,
        price,
        location,
        fileName,
      } = currentAccessory;

      setCurrentAccessory({
        id,
        author,
        published,
        sold,
        buyer,
        title,
        description,
        category,
        gender,
        price,
        location,
        fileName,
      });
    }
  }, [currentAccessory]);

  // handle change of input field
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentAccessory({ ...currentAccessory, [name]: value });
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

  // update the accessory
  const updateAccessory = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // check if all validated
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0 && currentAccessory.location !== "") {

      if (currentFile) {
        // create unique name for img
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

            const updatedAccessory = {
              ...currentAccessory,
              fileName: modifiedName,
            };

            // update the data
            AccessoryDataService.update(currentAccessory.id, updatedAccessory)
              .then(response => {
                console.log(response.data);
                navigate('/accessorylist')
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch((error) => {
            console.log("Error uploading the image:", error);
            setCurrentFile(undefined); // Clear the selected file
          });
      } else {
        const updatedAccessory = { ...currentAccessory };

        // update the data
        AccessoryDataService.update(currentAccessory.id, updatedAccessory)
          .then(response => {
            console.log(response.data);
            navigate('/accessorylist')
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  };

  // remove image from server
  const deleteImage = () => {
    FileService.removeImg(currentAccessory.fileName)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    setCurrentAccessory({ ...currentAccessory, fileName: "" });
  };

  // File
  const [currentFile, setCurrentFile] = useState(undefined);
  const [imagePreview, setImagePreview] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);
  const selectFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
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

  // remove accessory
  const deleteAccessory = () => {
    AccessoryDataService.remove(currentAccessory.id)
      .then(response => {
        console.log(response.data);
        navigate("/accessories");
      })
      .catch(e => {
        console.log(e);
      });

    // remove the img also
    FileService.removeImg(currentAccessory.fileName)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // Location
  const handleMeetingPointChange = (formattedAddress) => {
    setCurrentAccessory({ ...currentAccessory, location: formattedAddress });
  };

  // reset location
  const handleResetMeetingPoint = () => {
    setCurrentAccessory({ ...currentAccessory, location: "" });
  };

  return (
    <div>
      <h1>Inserat bearbeiten</h1>
      {currentAccessory ? (
        <div>
          <Form onSubmit={updateAccessory} ref={form}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="title">Titel</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="title"
                    value={currentAccessory.title}
                    onChange={handleInputChange}
                    validations={[required]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Beschreibung</label>
                  <Textarea
                    type="textarea"
                    className="form-control"
                    rows="5"
                    name="description"
                    value={currentAccessory.description}
                    onChange={handleInputChange}
                    validations={[required]}
                  />
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="category">Kategorie</label>
                      <Select
                        className="form-control"
                        name="category"
                        value={currentAccessory.category}
                        onChange={handleInputChange}
                      >
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
                        value={currentAccessory.gender}
                        onChange={handleInputChange}
                      >
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
                        value={currentAccessory.price}
                        onChange={handleInputChange}
                        validations={[required]}
                        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                        placeholder="Preis angeben..."
                      />
                    </div>
                  </div>
                </div>
                <label>Treffpunkt</label>
                {currentAccessory.location === "" ? (
                  <MapsInput onMeetingpointChange={handleMeetingPointChange} />
                ) : (
                  <div className="row">
                    <div className="col-8">
                      <Input
                        type="text"
                        className="form-control"
                        placeholder={currentAccessory.location}
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
                {submitted && currentAccessory.location === "" ? (
                  <div className="alert alert-danger" role="alert">
                    Bitte ausfüllen.
                  </div>
                ) : null}
              </div>

              {/* img column */}
              <div className="col-6">
                <label>Bild</label>
                <div>
                  {currentAccessory.fileName ? (
                    <div>
                      <button className="btn btn-outline-danger" style={{ marginBottom: "15px" }} onClick={deleteImage}>
                        Bild löschen
                      </button>
                      <img
                        src={`http://localhost:8080/api/files/${currentAccessory.fileName}`}
                        alt={currentAccessory.title}
                        style={{ width: '100%', maxHeight: '360px', objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div>
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
                                {currentFile ? currentFile.name : "Choose file"}
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
                        <div className="row align-items-center">
                          <div className="col-12">
                            <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '360px', objectFit: 'cover' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>

          <div style={{ position: "fixed", top: '90vh', right: '50%', transform: 'translateX(50%)', zIndex: 999 }}>
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
              <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={deleteAccessory}>
                Löschen
              </button>
              <button type="submit" className="btn btn-success" onClick={updateAccessory}>
                Aktualisieren
              </button>
            </div>
          </div>
          <div style={{ height: '100px' }}></div>
        </div>
      ) : (<></>)}
    </div>
  );
};

export default AccessoryEdit;
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AuthService from "../../services/AuthService";
import AccessoryDataService from "../../services/AccessoryService";
import { useNavigate } from 'react-router-dom';

const PaypalCheckoutButton = () => {
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [accessory, setAccessory] = useState(null); 

  // get accessory with id
  useEffect(() => {
    if (id) {
      AccessoryDataService.get(id)
        .then((response) => {
          setAccessory(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [id]);

  const accessoryRef = useRef(accessory);

  useEffect(() => {
    accessoryRef.current = accessory;
  }, [accessory]);

  const handleApprove = () => {
    const currentAccessory = accessoryRef.current;

    if (!currentAccessory) {
      return;
    }

    // data for request
    var data = {
      id: currentAccessory.id,
      author: currentAccessory.author,
      published: false,
      sold: true,
      buyer: currentUser.username,
      title: currentAccessory.title,
      description: currentAccessory.description,
      category: currentAccessory.category,
      gender: currentAccessory.gender,
      price: currentAccessory.price,
      location: currentAccessory.location,
      fileName: currentAccessory.fileName,
    };

    AccessoryDataService.update(id, data)
      .then((response) => {
        console.log(response.data);
        navigate("/success/" + id);
      })
      .catch((e) => {
        console.log(e);
      });

  };

  // Display error message 
  if (error) {
    alert(error);
  }

  if (accessory === null) {
    return <div>Loading...</div>;
  }

  return (
    <PayPalButtons
      style={{
        layout: "horizontal",
        height: 48,
        width: 100,
        tagline: false,
      }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              title: accessory.title,
              amount: {
                value: accessory.price,
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order.capture();
        console.log("order", order);
        handleApprove();
      }}
      onCancel={() => {
        alert("Cancelled");
      }}
      onError={(err) => {
        setError(err);
        console.log("Paypal Error", err);
      }}
    />
  );
};

export default PaypalCheckoutButton;

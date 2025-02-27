import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../tools";




const SubscriptionPlans = () => {

  const navigate = useNavigate()

  const userData = useSelector(state => state.auth)

  // console.log("User", userData)

  const {_id:userId} = userData.user

  // console.log("ID:", UserId)



  const [plans, setPlans] = useState([]);
  //   {
  //     id: 1,
  //     name: "Silver",
  //     price: 20000,
  //     features: ["Feature A", "Feature B"],
  //   },
  //   {
  //     id: 2,
  //     name: "Gold",
  //     price: 30000,
  //     features: ["Feature C", "Feature D"],
  //   },
  // ]);

  // const [selectedPlan, setSelectedPlan] = useState(null);

  // console.log("selected Plan: ", selectedPlan )

  useEffect(() => {
    const fetchPlans = async () => {
      try {

        const token = localStorage.getItem("token"); 

        if (!token) {
          console.error("No token found!");
          return; 
        }


        const plans_response = await axios.get("http://localhost:3000/subscriptionPlans", 
          {
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(plans_response.data)

        setPlans(plans_response.data.allplans);

        
        
      } catch(error) {
        throw error;
      }
    };

    fetchPlans();
  }, []);


  useEffect(() => {
    console.log("Updated Plans State:", plans); // Logs updated state after re-rendering
  }, [plans]);
  


  const makePayment = (token, selectedPlan) => {

    const tokenId = localStorage.getItem("token"); 

    if (!tokenId) {
      console.error("No token found!");
      return; 
    }

    const body = {
      token,
      planName:selectedPlan,
      userId: userId
    };

    console.log("Plan: ", selectedPlan )
    console.log('UserId: ', userId )

    return axios
      .post("http://localhost:3000/planPayment", body,
        {
          headers: {
            Authorization: `Bearer ${tokenId}`, 
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data)
        showToast("SUCCESS", 'Plan added successfully.')
        navigate('../business_setup')
      })
      .catch((error) => {
        throw error;
      });
  };

  return (
    <div className="flex justify-center">
      <div
        className="main-container w-[90%] md:w-[85%] lg:w-[80%] rounded-lg border-gray-400 border-opacity-50
        border p-5 lg:10 my-20"
      >
        <h3 className="font-medium text-2xl">Which plan do you want to try?</h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-10 items-stretch mt-6">
          
        {Array.isArray(plans) && plans.length === 0 ? (
            <p className="text-center text-gray-500">No plans available yet.</p>
          ) : (
            Array.isArray(plans) && plans.map((plan, index) => (
              <div
                key={index}
                className="rounded-md border border-gray-400 border-opacity-70 
                    p-5 pb-8"
              >
                <h2 className="font-semibold text-xl mb-4 text-[#603F26]">
                  {plan.name}
                </h2>
                <h1 className="font-semibold text-3xl mb-4 text-[#603F26]">
                  {plan.price}
                  <span className="font-medium text-[15px] ml-1">$/month</span>
                </h1>
                <StripeCheckout
                  stripeKey="pk_test_51QOJ4oDZzPFomXhEJc2PFEnX4MqUEEzMkA8gwhbgA7I7GzXobg0QAwn06yuHn2Gb1ofTkwLHiGPI7N8XrxVMi0xt00zvcbJDcy"
                  token={(token) => {
                    makePayment(token, plan.name)
                  }}
                  name="Buy plan"
                  amount={plan.price * 100}
                  // currency="PKR"
                >
                  <Button
                    variant="contained"
                    size="small"
                    type="submit"
                    sx={{
                      textTransform: "none",
                      width: "100%",
                      backgroundColor: "#603F26",
                      color: "#FFFFFF",
                    }}
                    // onClick={() => setSelectedPlan(plan.name)}
                  >
                    Select {plan.name}
                  </Button>
                </StripeCheckout>

                <div className="mt-4">
                  <h2 className="font-semibold text-[18px]">Features</h2>

                  <div className="mt-1">
                    <ul className="text-[14px]">
                      {plan.features.map((feature, index) => (
                        <div key={index}>
                          <li>
                            <i className="fas fa-check text-green-500 text-[14px]"></i>
                            {feature}
                          </li>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}

          
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
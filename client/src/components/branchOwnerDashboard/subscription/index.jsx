import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";

const SubscritionPlans = () => {
  const [plans, setPlans] = useState([])
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
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans_response = await axios.get("");

        setPlans(plans_response.data);
      } catch(error) {
        throw error;
      }
    };

    fetchPlans();
  }, []);



  const makePayment = (token) => {
    const body = {
      token,
      planId:selectedPlan,
    };

    console.log(selectedPlan)
    return axios
      .post("", body)
      .then((response) => {
        console.log(response.data)
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
          
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-md border border-gray-400 border-opacity-70 
                  p-5 pb-8"
            >
              <h2 className="font-semibold text-xl mb-4 text-[#603F26]">
                {plan.name}
              </h2>

              <h1 className="font-semibold text-3xl mb-4 text-[#603F26]">
                {plan.price}
                <span className="font-medium text-[15px] ml-1">PKR/month</span>
              </h1>

              <StripeCheckout
                stripeKey="process.env.STRIPE_KEY"
                token={makePayment}
                name="Buy plan"
                amount={plan.price}
                currency="PKR"
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
                  onClick={() => setSelectedPlan(plan.id)}
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
                    ))

                    }
                    
                  </ul>
                </div>
              </div>
            </div>
          ))
          }

          {/* <div
            className="rounded-md border border-gray-400 border-opacity-70 
            p-5 pb-8"
          >
            <h2 className="font-semibold text-xl mb-4 text-[#603F26]">
              Silver
            </h2>

            <h1 className="font-semibold text-3xl mb-4 text-[#603F26]">
              20K
              <span className="font-medium text-[15px] ml-1">PKR/month</span>
            </h1>

            <StripeCheckout 
              stripeKey="process.env.STRIPE_KEY" 
              token={makePayment} 
              name="Buy plan"
              amount=''
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
              >
                Select Silver
              </Button>
            </StripeCheckout>

            <div className="mt-4">
              <h2 className="font-semibold text-[18px]">Features</h2>

              <div className="mt-1">
                <ul className="text-[14px]">
                  <li>
                    <i className="fas fa-check text-green-500 text-[14px]"></i>{" "}
                    Lorem ipsum dolor sit amet
                  </li>
                  <li>
                    <i className="fas fa-check text-green-500 text-[14px]"></i>{" "}
                    Lorem ipsum dolor sit amet
                  </li>
                  <li>
                    <i className="fas fa-check text-green-500 text-[14px]"></i>{" "}
                    Lorem ipsum dolor sit amet
                  </li>
                  <li>
                    <i className="fas fa-check text-green-500 text-[14px]"></i>{" "}
                    Lorem ipsum dolor sit amet
                  </li>

                  <li>
                    <i className="fas fa-check text-green-500 text-[14px]"></i>{" "}
                    Lorem ipsum dolor sit amet
                  </li>
                  <li>
                    <i className="fas fa-check text-green-500 text-[14px]"></i>{" "}
                    Lorem ipsum dolor sit amet
                  </li>
                  <li>
                    <i className="fas fa-check text-green-500 text-[14px]"></i>{" "}
                    Lorem ipsum dolor sit amet
                  </li>
                  <li>
                    <i className="fas fa-check text-green-500 text-[14px]"></i>{" "}
                    Lorem ipsum dolor sit amet
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SubscritionPlans;
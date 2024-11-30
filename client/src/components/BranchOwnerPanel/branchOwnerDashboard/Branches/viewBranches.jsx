import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

const ViewBranches = () => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("Retrieved Token:", token);
        if (!token) {
          console.error("No token found!");
          return;
        }

        const response = await axios.get("http://localhost:3000/viewBranches", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log('Branches: ', response.data)

        setBranches(response.data);
      } catch (error) {
        console.log("Error occur: ", error);
      }
    };

    fetchBranches();
  }, []);

  return(
    <>
        {branches.map((branch, index)=>(
            <div key={index}>
                <div>
                    {branch.branchCode}
                </div>
                <div>
                    {branch.name}
                </div>
            </div>
        ))

        }
    </>
  )
};

export default ViewBranches;

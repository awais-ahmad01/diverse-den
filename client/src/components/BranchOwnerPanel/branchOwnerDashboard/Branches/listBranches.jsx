import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getBranches } from "../../../../store/actions/branches";

import { Button } from "@mui/material";

const ListBranches = () => {
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth)

  console.log("id:", user.business)

  useEffect(() => {
    console.log("getting.....");
    dispatch(getBranches(user.business));
  }, []);

  return (
    <div className="bg-gray-50 flex flex-col pt-5">
      <div className="mb-4 pl-4 md:pl-8 lg:pl-12">
        <h1 className="text-[#603F26] font-bold text-2xl">Branches</h1>
      </div>

      <div className="w-full flex justify-between items-center px-4 md:px-8 lg:px-12">
        <div className="border border-[#603F26] bg-[#603F26] p-2 w-32 rounded-lg text-white">
          <span className="font-semibold text-2xl">10</span>
          <h3 className="text-[14px] font-medium">Total Branches</h3>
        </div>

        <div className="">
          <Button
            variant="contained"
            color="primary"
            size="small"
            component={Link}
            to="../addBranch"
            sx={{
              textTransform: "none",
              width: "120px",
              fontSize: "16px",
              fontWeight: "semi-bold",
              backgroundColor: "#603F26",
            }}
          >
            Add Branch
          </Button>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="border-2 border-black flex justify-center items-center mt-8">
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old. Richard McClintock, a Latin professor at
          Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going
          through the cites of the word in classical literature, discovered the
          undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
          1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and
          Evil) by Cicero, written in 45 BC. This book is a treatise on the
          theory of ethics, very popular during the Renaissance. The first line
          of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
          section 1.10.32.
        </div>
      </div>
    </div>
  );
};

export default ListBranches;

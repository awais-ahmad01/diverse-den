import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

export const showToast = (type, msg) => {
  console.log("Do na");
  switch (type) {
    case "SUCCESS":
      toast.success(msg, {
        position: "bottom-right",
      });
      break;
    case "ERROR":
      toast.error(msg, {
        position: "bottom-right",
      });
      break;
    default:
      return false;
  }
};

export const Loader = () => (
  // <div className='text-center mt-48'>
  //     <CircularProgress/>
  // </div>

  <div className="flex justify-center items-center h-80 ">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#603F26]"></div>
  </div>
);

import { toast } from 'react-toastify';





export const showToast = (type,msg) => {
    console.log('Do na')
    switch(type){
        case 'SUCCESS':
            toast.success(msg,{
                position: "bottom-right"
            })
        break;
        case 'ERROR':
            toast.error(msg,{
                position: "bottom-right"
            })
        break;
        default:
            return false

    }
}
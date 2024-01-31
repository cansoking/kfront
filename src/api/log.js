import { get, post } from "@/utils/request";
export const getLog = (data) => {
    console.log(data,'data');
    return get({
        url: '/log/all',
        data,
    })
}


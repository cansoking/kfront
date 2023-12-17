import { get, post } from "@/utils/request";
export const getLog = () => {
    return get({
        url: '/log/all',
        data: {}
    })
}


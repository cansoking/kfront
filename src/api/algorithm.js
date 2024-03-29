import {get, post} from "@/utils/request";

export const fetchAllAlgorithms = () => {
    return get({
        url: '/algorithmFile/fetchAllAlgorithms',
        data: {}
    })
}
export const runAlgorithm = (data) => {
    return post({
        url: '/algorithm/run',
        data
    })
}
export const removeAlgorithm = () => {
    return post({
        url: '/algorithm/remove',
        data:{}
    })
}
export const reloadAlgorithm = (data) => {
    return post({
        url: '/algorithm/reload',
        params: data
    })
}

export const currentAlgorithm = () => {
    return get({
        url: '/algorithm/current',
        data: {}
    })
}

export const deleteAlgorithm = (data) => {
    return post({
        url: '/algorithmFile/deleteAlgorithm',
        params: data
    })
}

export const confirmAlgorithm = (data) => {
    return post({
        url: '/algorithm/confirm',
        data: {}
    })
}

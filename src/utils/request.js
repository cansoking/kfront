import axios from 'axios'

const request = axios.create({
    baseURL: '//39.101.136.242:8750/',
})
const request2 = axios.create({
    baseURL: '//39.101.136.242:8080/',
})


function http(
    {url, data, method, config, params, useRequest2 = false}
) {
    const successHandler = (res) => {
        if (res.data.code === 200)
            return res.data
        return Promise.reject(res.data)
    }

    const failHandler = (error) => {
        throw new Error(error?.message || 'Error')
    }

    method = method || 'GET'
    const finalRequest = useRequest2 ? request2 : request

    if (method === 'GET') {
        const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})
        return finalRequest.get(url, {params, ...config}).then(successHandler, failHandler)
    }

    if (method === 'POST') {
        if (data) {
            return finalRequest.post(url, data, config).then(successHandler, failHandler)
        }
        if (params) {
            return finalRequest.post(url, null, {params, ...config}).then(successHandler, failHandler)
        }
    }
}

export function get(
    {url, data, method = 'GET', useRequest2 = false}
) {
    return http({
        url,
        method,
        data,
        useRequest2,
    })
}

export function post(
    {url, data, params, method = 'POST', useRequest2 = false}
) {
    return http({
        url,
        method,
        params,
        data,
        useRequest2,
    })
}

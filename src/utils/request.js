import axios from 'axios'

const request = axios.create({
    baseURL: '//81.70.164.10:8750/',
})


function http(
    {url, data, method, config, params}
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

    if (method === 'GET') {
        const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})
        return request.get(url, {params, ...config}).then(successHandler, failHandler)
    }

    if (method === 'POST') {
        if (data) {
            return request.post(url, data, config).then(successHandler, failHandler)
        }
        if (params) {
            return request.post(url, null, {params, ...config}).then(successHandler, failHandler)
        }
    }
}

export function get(
    {url, data, method = 'GET'}
) {
    return http({
        url,
        method,
        data,
    })
}

export function post(
    {url, data, params, method = 'POST'}
) {
    return http({
        url,
        method,
        params,
        data,
    })
}

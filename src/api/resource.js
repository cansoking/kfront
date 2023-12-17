import { get, post } from "@/utils/request";

export const fetchAllResourceType = () => {
    return get({
        url: '/resource/fetchAllResourceType',
        data: {}
    })
}

export const createResourceType = (data) => {
    return post({
        url: '/resource/createResourceType',
        data
    })
}

export const deleteResourceType = (resource_type_id)=>{
    return post({
        url: '/resource/deleteResourceType',
        params: {
            resource_type_id
        }
    })
}


export const fetchResource = (resource_type_id)=>{
    return get({
        url: '/resource/fetchResource',
        data: {
            resource_type_id
        }
    })
}

export const fetchAllResources = ()=>{
    return get({
        url: '/resource/fetchAllResources',
        data: {}
    })
}

export const createResource = (data) =>{
    return post({
        url: '/resource/createResource',
        data
    })
}
export const createMultiResource = (data) =>{
    return post({
        url: '/resource/createMultiResource',
        data
    })
}
export const deleteResource = (resource_id)=>{
    return post({
        url: '/resource/deleteResource',
        params: {
            resource_id
        }
    })
}

export const fetchAllDataType = ()=>{
    return get({
        url: '/dataType/fetchAllDataType',
        data: {}
    })
}

export const createDataType = (data)=>{
    return post({
        url: '/dataType/createDataType',
        data
    })
}

export const deleteDataType = (data_type_id)=>{
    return post({
        url: '/dataType/deleteDataType',
        params: {
            data_type_id
        }
    })
}
export const fetchTasksByResource = (resource_id)=>{
    return get({
        url: '/relation/fetchTasksByResource',
        data: {
            resource_id
        }
    })
}
export const deleteTaskFromResource = (data)=>{
    return post({
        url: '/relation/deleteTaskFromResource',
        data
    })
}

import { get, post } from "@/utils/request";

export const fetchAllTaskType = () => {
    return get({
        url: '/task/fetchAllTaskType',
        data: {}
    })
}

export const createTaskType = (data) => {
    return post({
        url: '/task/createTaskType',
        data
    })
}

export const deleteTaskType = (task_type_id)=>{
    return post({
        url: '/task/deleteTaskType',
        params: {
            task_type_id
        }
    })
}


export const fetchTask = (task_type_id)=>{
    return get({
        url: '/task/fetchTask',
        data: {
            task_type_id
        }
    })
}

export const fetchAllTasks = ()=>{
    return get({
        url: '/task/fetchAllTasks',
        data: {}
    })
}

export const createTask = (data) =>{
    return post({
        url: '/task/createTask',
        data
    })
}
export const createMultiTask = (data) =>{
    return post({
        url: '/task/createMultiTask',
        data
    })
}
export const deleteTask = (task_id)=>{
    return post({
        url: '/task/deleteTask',
        params: {
            task_id
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

export const addTaskToResource = (data)=>{
    return post({
        url: '/relation/addTaskToResource',
        data
    })
}

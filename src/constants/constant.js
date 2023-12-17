export const taskTypeColumns = [
    {
        title: '任务类型ID',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: { customRender: 'id' },
    },
    {
        title: '任务类型名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '任务类型描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '关联的任务属性',
        dataIndex: 'attributes',
        key: 'attributes',
        scopedSlots: { customRender: 'attributes' },
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    }
]

export const taskColumns = [
    {
        title: '任务ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '任务描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '任务属性',
        dataIndex: 'attributes_values',
        key: 'attributes_values',
        // ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]



export const taskDataTypeColumns = [
    {
        title: '数据类型中文名',
        dataIndex: 'info',
        key: 'info',
    },
    {
        title: '数据类型英文名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]

export const resourceTypeColumns = [
    {
        title: '资源类型ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '资源类型名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '资源类型描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '关联的资源属性',
        dataIndex: 'attributes',
        key: 'attributes',
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]

export const resourceColumns = [
    {
        title: '资源ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '资源名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '资源描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '资源属性',
        dataIndex: 'attributes_values',
        key: 'attributes_values',
        // ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]



export const resourceDataTypeColumns = [
    {
        title: '数据类型中文名',
        dataIndex: 'info',
        key: 'info',
    },
    {
        title: '数据类型英文名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]

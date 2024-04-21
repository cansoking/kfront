<template>
    <div class="vmarea">
        <el-col :span="10" :offset="0">
            <p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
                容器模版列表
            </p>
        </el-col>
        <el-col :span="2" :offset="12">
            <el-button @click="openCreateVMtem" icon="el-icon-circle-plus-outline" size="medium" round plain>新增模版
            </el-button>
        </el-col>

        <el-table :data="vmtemdata
            .slice((curpage - 1) * pagesize, curpage * pagesize)
            .filter(
                (data) =>
                    !psearch ||
                    data.name.toLowerCase().includes(psearch.toLowerCase())
            )" style="width: 100%" empty-text="暂无容器模版" :header-cell-style="{ background: '#00b8a9', color: '#fff' }">
            <el-table-column width="100" type="index" label="序号"> </el-table-column>
            <!--      <el-table-column  sortable label="ID" prop="id">-->
            <!--      </el-table-column>-->
            <el-table-column width="150" sortable label="模板名称" prop="name"> </el-table-column>
            <el-table-column width="200" sortable label="命名空间" prop="podNamespace">
            </el-table-column>
            <el-table-column width="200" sortable label="持久卷" prop="pvcName">
            </el-table-column>
            <el-table-column sortable label="下属容器" prop="containerInfoList">
                <template slot-scope="scope">
                    <span v-if="JSON.parse(scope.row.containerInfoList).length === 0">无</span>
                    <el-popover v-else style="margin-right: 10px" placement="top-start" :title="container.containerName"
                        width="200" trigger="hover" :key="container.containerName"
                        v-for="container, idx in JSON.parse(scope.row.containerInfoList)">
                        <el-descriptions :column="1" size="mini">
                            <el-descriptions-item label="镜像">{{ container.containerImage }}</el-descriptions-item>
                            <el-descriptions-item label="端口号">{{ container.port }}</el-descriptions-item>
                        </el-descriptions>
                        <el-tag slot="reference" :disable-transitions="false" type="info" effect="plain">
                            容器模板{{ idx + 1 }}
                        </el-tag>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column width="250" fixed="right">
                <template slot="header">
                    <el-input v-model="psearch" size="mini" placeholder="输入名称搜索" />
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <el-button size="mini" type="warning" @click="edit(scope.row)">修改</el-button>
                    <el-tooltip content="以该模版创建容器" placement="top">
                        <el-button size="mini" type="success" @click="build(scope.row)">创建</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <div v-if="vmtemdata.length != 0" style="margin-top: 30px">
            <el-pagination :current-page.sync="curpage" :page-sizes="[10, 20, 30, 40, 50]" :page-size.sync="pagesize"
                layout="sizes, total, prev, pager, next, jumper" :total="totalvmtem" background></el-pagination>
        </div>
        <el-dialog title="添加模版" :visible.sync="createvmtemvisible">
            <el-form label-position="top" label-width="80px" :model="cp_form" :status-icon="true" :rules="cp_rules"
                ref="cp_form">
                <el-form-item label="模板名称" prop="tempName">
                    <el-input v-model="cp_form.tempName" placeholder="请输入模板名称"></el-input>
                </el-form-item>
                <el-form-item label="命名空间" prop="namespace">
                    <!-- <el-input v-model="cp_form.namespace"></el-input> -->
                    <el-select style="width: 100%" v-model="cp_form.namespace" clearable @visible-change="nsremote"
                        placeholder="请选择命名空间">
                        <el-option v-for="item in namespace_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择持久卷声明" prop="pvcName">
                    <!-- <el-input v-model="cp_form.containerImage"></el-input> -->
                    <el-select style="width: 100%" v-model="cp_form.pvcName" clearable @visible-change="pvcremote"
                        placeholder="请选择pvc">
                        <el-option v-for="item in pvcName_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属容器" prop="containerInfoList">
                    <el-popover style="margin-right: 10px" placement="top-start" :title="container.containerName"
                        width="200" trigger="hover" :key="container.containerName"
                        v-for="container, idx in cp_form.containerInfoList">
                        <el-descriptions :column="1" size="mini">
                            <el-descriptions-item label="镜像">{{ container.containerImage }}</el-descriptions-item>
                            <el-descriptions-item label="端口号">{{ container.port }}</el-descriptions-item>
                        </el-descriptions>
                        <el-tag slot="reference" closable :disable-transitions="false" @close="handleClose(container)"
                            type="info" effect="plain">
                            容器模板{{ idx + 1 }}
                        </el-tag>
                    </el-popover>
                    <el-card class="con-card" v-if="addvisible" shadow="hover">
                        <div slot="header" class="clearfix">
                            <el-row :gutter="20">
                                <el-col :span="12" :offset="0">
                                    <span>添加第
                                        {{ cp_form.containerInfoList.length + 1 }}
                                        个新容器</span>
                                </el-col>
                                <el-col :span="3" :offset="3">
                                    <el-button @click="addcontainer('tmp_con_info')" icon="el-icon-check" size="mini"
                                        circle plain type="success"></el-button>
                                </el-col>
                                <el-col :span="3" :offset="0">
                                    <el-button @click="resetForm('tmp_con_info')" icon="el-icon-refresh-right"
                                        size="mini" circle></el-button>
                                </el-col>
                                <el-col :span="3" :offset="0">
                                    <el-button @click="closeadd" icon="el-icon-close" size="mini" circle plain
                                        type="danger"></el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <el-form label-position="top" :model="tmp_con_info" :status-icon="true" :rules="tmp_con_rules"
                            ref="tmp_con_info">
                            <el-form-item label="容器镜像" prop="containerImage">
                                <el-select style="width: 100%" v-model="tmp_con_info.containerImage" clearable
                                    @visible-change="imageremote" placeholder="请选择容器镜像">
                                    <el-option v-for="item in containerImage_options" :key="item.value"
                                        :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="端口号" prop="port">
                                <el-input v-model="tmp_con_info.port" placeholder="请输入端口号"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-card>
                    <el-button class="button-new-tag" v-else size="small" @click="showInputCon">添加容器</el-button>
                </el-form-item>
                <el-form-item size="large">
                    <div class="cp-sbm-area">
                        <el-button round @click="resetForm('cp_form')">清空输入</el-button>
                        <el-button round type="primary" @click="cp_sumbit('cp_form')">立即创建</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="修改模版" :visible.sync="editvmtemvisible">
            <el-form label-position="top" label-width="80px" :model="edit_cp_form" :status-icon="true" :rules="cp_rules"
                ref="edit_cp_form">
                <el-form-item label="模板名称" prop="tempName">
                    <el-input v-model="edit_cp_form.tempName" placeholder="请输入模板名称"></el-input>
                </el-form-item>
                <el-form-item label="命名空间" prop="namespace">
                    <!-- <el-input v-model="edit_cp_form.namespace"></el-input> -->
                    <el-select style="width: 100%" v-model="edit_cp_form.namespace" clearable @visible-change="nsremote"
                        placeholder="请选择命名空间">
                        <el-option v-for="item in namespace_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择持久卷声明" prop="pvcName">
                    <!-- <el-input v-model="edit_cp_form.containerImage"></el-input> -->
                    <el-select style="width: 100%" v-model="edit_cp_form.pvcName" clearable @visible-change="pvcremote"
                        placeholder="请选择pvc">
                        <el-option v-for="item in pvcName_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属容器" prop="containerInfoList">
                    <el-popover style="margin-right: 10px" placement="top-start" :title="container.containerName"
                        width="200" trigger="hover" :key="container.containerName"
                        v-for="container, idx in edit_cp_form.containerInfoList">
                        <el-descriptions :column="1" size="mini">
                            <el-descriptions-item label="镜像">{{ container.containerImage }}</el-descriptions-item>
                            <el-descriptions-item label="端口号">{{ container.port }}</el-descriptions-item>
                        </el-descriptions>
                        <el-tag slot="reference" closable :disable-transitions="false"
                            @close="edit_handleClose(container)" type="info" effect="plain">
                            容器模板{{ idx + 1 }}
                        </el-tag>
                    </el-popover>
                    <el-card class="con-card" v-if="addvisible" shadow="hover">
                        <div slot="header" class="clearfix">
                            <el-row :gutter="20">
                                <el-col :span="12" :offset="0">
                                    <span>添加第
                                        {{ edit_cp_form.containerInfoList.length + 1 }}
                                        个新容器</span>
                                </el-col>
                                <el-col :span="3" :offset="3">
                                    <el-button @click="edit_addcontainer('edit_tmp_con_info')" icon="el-icon-check"
                                        size="mini" circle plain type="success"></el-button>
                                </el-col>
                                <el-col :span="3" :offset="0">
                                    <el-button @click="resetForm('edit_tmp_con_info')" icon="el-icon-refresh-right"
                                        size="mini" circle></el-button>
                                </el-col>
                                <el-col :span="3" :offset="0">
                                    <el-button @click="closeadd" icon="el-icon-close" size="mini" circle plain
                                        type="danger"></el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <el-form label-position="top" :model="edit_tmp_con_info" :status-icon="true"
                            :rules="tmp_con_rules" ref="edit_tmp_con_info">
                            <el-form-item label="容器镜像" prop="containerImage">
                                <el-select style="width: 100%" v-model="edit_tmp_con_info.containerImage" clearable
                                    @visible-change="imageremote" placeholder="请选择容器镜像">
                                    <el-option v-for="item in containerImage_options" :key="item.value"
                                        :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="端口号" prop="port">
                                <el-input v-model="edit_tmp_con_info.port" placeholder="请输入端口号"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-card>
                    <el-button class="button-new-tag" v-else size="small" @click="showInputCon">添加容器</el-button>
                </el-form-item>
                <el-form-item size="large">
                    <div class="cp-sbm-area">
                        <el-button round @click="resetForm('edit_cp_form')">清空输入</el-button>
                        <el-button round type="primary" @click="edit_pod_temp_sumbit('edit_cp_form')">立即修改</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="创建容器" :visible.sync="buildvmtemvisible">
            <el-form label-position="top" label-width="80px" :model="build_cp_form" :status-icon="true"
                :rules="cp_rules" ref="build_cp_form">
                <el-form-item label="Pod名称" prop="podName">
                    <el-input v-model="build_cp_form.podName" placeholder="请输入Pod名称"></el-input>
                </el-form-item>
                <el-form-item label="命名空间" prop="namespace">
                    <!-- <el-input v-model="build_cp_form.namespace"></el-input> -->
                    <el-select disabled style="width: 100%" v-model="build_cp_form.namespace" clearable
                        @visible-change="nsremote" placeholder="请选择命名空间">
                        <el-option v-for="item in namespace_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择节点" prop="nodename">
                    <!-- <el-input v-model="build_cp_form.containerImage"></el-input> -->
                    <el-select style="width: 100%" v-model="build_cp_form.nodename" clearable
                        @visible-change="noderemote" placeholder="请选择节点">
                        <el-option v-for="item in nodename_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择持久卷声明" prop="pvcName">
                    <!-- <el-input v-model="build_cp_form.containerImage"></el-input> -->
                    <el-select disabled style="width: 100%" v-model="build_cp_form.pvcName" clearable
                        @visible-change="pvcremote" placeholder="请选择pvc">
                        <el-option v-for="item in pvcName_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属容器" prop="containerInfoList">
                    <div style="display: flex; width: 100%; flex-wrap: wrap;">
                        <div :key="idx" v-for="container, idx in build_cp_form.containerInfoList"
                            style="width: 50%; margin-bottom: 20px;">
                            <el-card class="con-card2" shadow="hover">
                                <div slot="header" class="clearfix">
                                    <el-row :gutter="20">
                                        <el-col :span="12" :offset="0">
                                            <span>第
                                                {{ idx + 1 }}
                                                个新容器</span>
                                        </el-col>
                                        <el-col :span="3" :offset="6">
                                            <el-button @click="confirmcontainer('build_tmp_con_info', idx)"
                                                icon="el-icon-check" size="mini" circle plain
                                                :disabled="flag_build_cp_container[idx]" type="success"></el-button>
                                        </el-col>
                                        <el-col :span="3" :offset="0">
                                            <el-button @click="resetBuildForm(idx)"
                                                :disabled="flag_build_cp_container[idx]" icon="el-icon-refresh-right"
                                                size="mini" circle></el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                                <el-form label-position="top" :model="container" :status-icon="true">
                                    <el-form-item label="容器名称" prop="containerName">
                                        <el-input :disabled="flag_build_cp_container[idx]" v-model="temp_pod_names[idx]"
                                            placeholder="请输入容器名称" clearable></el-input>
                                    </el-form-item>
                                    <el-form-item label="容器镜像" prop="containerImage">
                                        <el-select disabled style="width: 100%" v-model="container.containerImage"
                                            clearable @visible-change="imageremote" placeholder="请选择容器镜像">
                                            <el-option v-for="item in containerImage_options" :key="item.value"
                                                :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="端口号" prop="port">
                                        <el-input disabled v-model="container.port" placeholder="请输入端口号"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-card>
                            <!-- <el-popover v-show="flag_build_cp_container[idx]" style="margin-right: 10px" placement="top-start"
                                :title="build_cp_form.containerInfoList[idx].containerName" width="200" trigger="hover">
                                <el-descriptions :column="1" size="mini">
                                    <el-descriptions-item label="镜像">{{
            build_cp_form.containerInfoList[idx].containerImage
        }}</el-descriptions-item>
                                    <el-descriptions-item label="端口号">{{
                build_cp_form.containerInfoList[idx].port
            }}</el-descriptions-item>
                                </el-descriptions>
                                <el-tag slot="reference" closable :disable-transitions="false"
                                    @close="handleClose(container)" type="info" effect="plain">
                                    {{ build_cp_form.containerInfoList[idx].containerName }}
                                </el-tag>
                            </el-popover> -->
                        </div>
                    </div>
                </el-form-item>
                <el-form-item size="large">
                    <div class="cp-sbm-area">
                        <el-button round @click="resetForm('build_cp_form')">清空输入</el-button>
                        <el-button round type="primary" @click="build_sumbit('build_cp_form')">立即创建</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import moment from "moment";
export default {
    name: "PodTemp",
    data() {
        // 自定义验证规则
        var checkcmpimage = (rule, value, callback) => {
            console.log(value);
            if (value.length < 1) {
                // 不足，提示不足
                return callback(new Error("请添加至少一个容器"));
            }
            callback();
        };
        return {
            psearch: '',
            temp_pod_names: [],
            tempPodname: '',
            nodename_options: [],
            flag_build_cp_container: [],
            build_cp_form: {
                podName: "",
                namespace: "",
                pvcName: "",
                nodename: "",
                containerInfoList: [],
                id: ""
            },
            edit_cp_form: {
                tempName: "",
                namespace: "",
                pvcName: "",
                containerInfoList: [],
                id: ""
            },
            cp_form: {
                tempName: "",
                namespace: "",
                pvcName: "",
                containerInfoList: [],
            },
            baseurl: "http://39.101.136.242:8080",
            curpage: 1,
            totalvmtem: 0,
            pagesize: 10,
            createvmtemvisible: false,
            editvmtemvisible: false,
            images: [],
            buildvmtemvisible: false,
            vmtemdata: [],
            addvisible: false,
            // 命名空间选项
            namespace_options: [],
            // 容器镜像选项
            containerImage_options: [
                {
                    value: "",
                    label: "",
                },
            ],
            build_tmp_con_info: {
                containerName: "",
                containerImage: "",
                port: "80",
            },
            tmp_con_info: {
                containerImage: "",
                port: "80",
            },
            edit_tmp_con_info: {
                containerImage: "",
                port: "80",
            },
            tmp_con_rules: {
                containerImage: [
                    { required: true, message: "请选择容器镜像", trigger: "change" },
                ],
                port: [{ required: true, message: "请输入端口号", trigger: "blur" }],
            },
            // pvc名称选项
            pvcName_options: [],
            // 添加容器校验规则
            cp_rules: {
                tempName: [
                    { required: true, message: "请输入模板名称", trigger: "blur" },
                ],
                namespace: [
                    { required: true, message: "请选择命名空间", trigger: "change" },
                ],
                pvcName: [
                    { required: true, message: "请输入Pvc名称", trigger: "change" },
                ],
                containerInfoList: [{ validator: checkcmpimage, trigger: "change" }],
            },
        };
    },
    mounted() {
        this.getVMTem();
    },
    methods: {
        edit_pod_temp_sumbit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提交表单，创建容器
                    this.$axios({
                        method: "post",
                        url: this.baseurl + "/Template/updatePodtemp", //换成实际地址
                        // url: "http://localhost:8080/Template/updatePodtemp", //换成实际地址
                        data: {
                            id: this.edit_cp_form.id,
                            name: this.edit_cp_form.tempName,
                            pvcName: this.edit_cp_form.pvcName,
                            podNamespace: this.edit_cp_form.namespace,
                            containerInfoList: JSON.stringify(this.edit_cp_form.containerInfoList)
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(
                        (res) => {
                            if (res.data.success === false) {
                                //增加失败
                                this.$notify.error({
                                    title: "修改失败",
                                    message: res.data.msg,
                                    position: "bottom-right",
                                });
                            } else {
                                this.$notify.success({
                                    title: "修改通知",
                                    message: "模版" + this.edit_cp_form.tempName + " 修改成功",
                                    position: "bottom-right",
                                });
                                this.getVMTem();
                            }
                        },
                        (err) => {
                            console.log(err);
                            this.$notify.error({
                                title: "修改失败",
                                message: "请检查网络连接设置",
                                position: "bottom-right",
                            });
                        }
                    );
                    this.editvmtemvisible = false;
                } else {
                    console.log("表单验证不通过");
                    return false;
                }
            });
        },
        cp_sumbit(formName) {
            // 校验表单
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios({
                        method: "post",
                        url: this.baseurl + "/Template/addPodTemplate",
                        // url: "http://localhost:8080/Template/addPodTemplate",
                        data: {
                            name: this.cp_form.tempName,
                            podNamespace: this.cp_form.namespace,
                            pvcName: this.cp_form.pvcName,
                            containerInfoList: JSON.stringify(this.cp_form.containerInfoList)
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(
                        (res) => {
                            if (res.data.success) {
                                this.$notify.success({
                                    title: "创建成功",
                                    message: "容器模板 " + this.cp_form.tempName + " 创建成功！",
                                    position: "bottom-right",
                                    duration: 6000,
                                });
                            }
                            this.getVMTem()
                        }
                    );
                    this.createvmtemvisible = false;
                } else {
                    console.log("表单验证不通过");
                    return false;
                }
            });
        },
        handleClose(tag) {
            this.cp_form.containerInfoList.splice(
                this.cp_form.containerInfoList.indexOf(tag),
                1
            );
        },
        edit_handleClose(tag) {
            this.edit_cp_form.containerInfoList.splice(
                this.edit_cp_form.containerInfoList.indexOf(tag),
                1
            );
        },
        // 解析数据
        data_resolver(sdata) {
            let res = [];
            let rows = sdata.split("\n");
            let i = 1;
            for (; i < rows.length - 1; i++) {
                let cols = rows[i].split(" ");
                let j = 0;
                cols = cols.filter(function (item) {
                    return item !== "";
                });
                res.push({
                    imageName: cols[0],
                    imageTag: cols[1],
                    imageId: cols[2],
                    imageSize: cols[3],
                });
            }
            return res;
        },
        // 远程搜索命名空间
        nsremote() {
            this.$axios
                .get(this.baseurl + "/workload/namespace/list")
                .then((res) => {
                    // console.log(res);
                    console.log(JSON.parse(res.data.result));
                    let rdata = JSON.parse(res.data.result).items;
                    let resop = [];
                    for (let i = 0; i < rdata.length; i++) {
                        let tmp = {};
                        tmp["label"] = rdata[i].metadata.name;
                        tmp["value"] = rdata[i].metadata.name;
                        resop.push(tmp);
                    }
                    this.namespace_options = resop;
                })
                .catch((err) => {
                    console.log("errors", err);
                });
        },
        // 远程搜索节点名
        noderemote() {
            this.$axios
                .get(this.baseurl + "/workload/node/list")
                .then((res) => {
                    // console.log(res);
                    console.log(JSON.parse(res.data.result));
                    let rdata = JSON.parse(res.data.result).items;
                    let resop = [];
                    for (let i = 0; i < rdata.length; i++) {
                        let tmp = {};
                        tmp["label"] = rdata[i].metadata.name;
                        tmp["value"] = rdata[i].metadata.name;
                        resop.push(tmp);
                    }
                    this.nodename_options = resop;
                })
                .catch((err) => {
                    console.log("errors", err);
                });
        },
        // 远程搜索pvc名
        pvcremote() {
            this.$axios
                .get(this.baseurl + "/virtuleStorage/vs/pvclist")
                .then((res) => {
                    console.log(res);
                    console.log(JSON.parse(res.data.result));
                    let rdata = JSON.parse(res.data.result).items;
                    let resop = [];
                    for (let i = 0; i < rdata.length; i++) {
                        let tmp = {};
                        tmp["label"] = rdata[i].metadata.name;
                        tmp["value"] = rdata[i].metadata.name;
                        resop.push(tmp);
                    }
                    this.pvcName_options = resop;
                })
                .catch((err) => {
                    console.log("errors", err);
                });
        },
        // 远程搜索image名
        imageremote() {
            this.$axios
                .post(
                    this.baseurl +
                    "/containerd/images/list?nodeName=" +
                    this.$store.state.nodename,
                    {
                        virtualMachineIp: "39.101.136.242",
                        userName: "root",
                        userPassword: "Upc123456@",
                    }
                )
                .then((res) => {
                    let rdata = this.data_resolver(res.data.result);
                    // this.cidata = rdata;
                    // this.totalci = rdata.length;
                    console.log(rdata);
                    // let rdata = JSON.parse(res.data.result).items;
                    let resop = [];
                    for (let i = 0; i < rdata.length; i++) {
                        let tmp = {};
                        tmp["label"] = rdata[i].imageName + ":" + rdata[i].imageTag;
                        tmp["value"] = rdata[i].imageName + ":" + rdata[i].imageTag;
                        resop.push(tmp);
                    }
                    this.containerImage_options = resop;
                })
                .catch((err) => {
                    console.log("errors", err);
                });
        },
        // 动态添加容器相关
        showInputCon() {
            this.addvisible = true;
        },
        closeadd() {
            this.addvisible = false;
        },
        addcontainer(formName) {
            // 校验表单
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提交表单，创建容器
                    this.cp_form.containerInfoList.push(
                        JSON.parse(JSON.stringify(this.tmp_con_info))
                    );
                    this.addvisible = false;
                } else {
                    console.log("表单验证不通过");
                    return false;
                }
            });
        },
        resetBuildForm(idx) {
            this.build_cp_form.containerInfoList[idx].containerName = ""
            this.build_cp_form.containerInfoList = JSON.parse(JSON.stringify(this.build_cp_form.containerInfoList))
            this.temp_pod_names[idx] = ""
            this.temp_pod_names = JSON.parse(JSON.stringify(this.temp_pod_names))
        },
        confirmcontainer(formName, idx) {
            this.build_cp_form.containerInfoList[idx].containerName = this.temp_pod_names[idx]
            // 校验表单
            console.log(this.temp_pod_names[idx]);
            this.flag_build_cp_container[idx] = true;
            this.flag_build_cp_container = JSON.parse(JSON.stringify(this.flag_build_cp_container))
            this.$message({
                message: "容器" + (idx + 1) + "已添加",
                type: "success",
            });
        },
        edit_addcontainer(formName) {
            // 校验表单
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提交表单，创建容器
                    this.edit_cp_form.containerInfoList.push(
                        JSON.parse(JSON.stringify(this.edit_tmp_con_info))
                    );
                    this.addvisible = false;
                } else {
                    console.log("表单验证不通过");
                    return false;
                }
            });
        },
        getVMTem() {
            this.$axios
                .get(this.baseurl + "/Template/getAllPodsTemplates")
                // .get("http://localhost:8080/Template/getAllPodsTemplates")
                .then((res) => {
                    if (res.data.success) {
                        this.vmtemdata = res.data.content;
                        this.totalvmtem = res.data.content.length;
                    } else {
                        alert(res.data.msg);
                    }
                })
                .catch((err) => {
                    alert(err);
                    console.log("err::::" + err);
                });
        },
        build_sumbit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 将data数据分成两个对象
                    const podInfo = {
                        podName: this.build_cp_form.podName,
                        podNamespace: this.build_cp_form.namespace,
                        podNodeName: this.build_cp_form.nodename,
                        containerInfoList: this.build_cp_form.containerInfoList,
                    };

                    const pvcInfo = {
                        pvcName: this.build_cp_form.pvcName,
                    };
                    // 提交表单，创建容器
                    this.$axios({
                        method: "post",
                        url: this.baseurl + "/workload/createPod",
                        data: {
                            // podName: this.cp_form.podName,
                            // podNamespace: this.cp_form.namespace,
                            // podNodeName: this.cp_form.nodename,
                            // containerInfoList: this.cp_form.containerInfoList,
                            // pvcName: this.cp_form.pvcName,
                            podInfo: podInfo,
                            pvcInfo: pvcInfo,
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(
                        (res) => {
                            console.log(res);
                            if (res.data[0] === "E") {
                                this.$notify.error({
                                    title: "创建失败",
                                    message: res.data,
                                    position: "bottom-right",
                                });
                            } else {
                                this.$notify.success({
                                    title: "完成通知",
                                    message: "容器 " + this.build_cp_form.podName + " 创建成功",
                                    position: "bottom-right",
                                });
                            }
                        },
                        (err) => {
                            console.log(err);
                            this.$notify.error({
                                title: "创建失败",
                                message: "请检查网络连接设置",
                                position: "bottom-right",
                            });
                        }
                    );
                } else {
                    console.log("表单验证不通过");
                    return false;
                }
            });
        },
        openCreateVMtem() {
            this.createvmtemvisible = true;
        },
        handleDelete(index, row) {
            console.log(row);
            this.$confirm(`您确定删除吗?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$axios
                        .delete(this.baseurl + "/Template/deletePodTemplate/" + row.id)
                        // .delete("http://localhost:8080/Template/deletePodTemplate/" + row.id)
                        .then((response) => {
                            const data = response.data;
                            if (data.success) {
                                this.$message.success("删除成功！");
                                this.getVMTem();
                            } else {
                                this.$message.success("删除失败！");
                            }
                        });
                })
                .catch(() => {
                    // 取消操作
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        edit(row) {
            this.edit_cp_form.id = row.id;
            this.edit_cp_form.tempName = row.name;
            this.edit_cp_form.pvcName = row.pvcName;
            this.edit_cp_form.containerInfoList = JSON.parse(row.containerInfoList);
            this.edit_cp_form.namespace = row.podNamespace;
            this.editvmtemvisible = true;
        },
        build(row) {
            this.build_cp_form.namespace = row.podNamespace;
            this.build_cp_form.pvcName = row.pvcName;
            this.build_cp_form.containerInfoList = JSON.parse(row.containerInfoList);
            this.buildvmtemvisible = true;
            this.flag_build_cp_container = []
            this.temp_pod_names = []
            for (let i = 0; i < JSON.parse(row.containerInfoList).length; i++) {
                this.flag_build_cp_container.push(false)
                this.temp_pod_names.push('')
            }
        },
        resetForm(formName) {
            console.log(formName);
            this.$refs[formName].resetFields();
        },
        sucupload(response, file, fileList) {
            if (response === "ok") {
                this.$notify.success({
                    title: "创建成功",
                    message: "虚拟机 " + this.buildvmtem_form.name + " 创建成功！",
                    position: "bottom-right",
                    duration: 6000,
                });
                this.$router.push("/vmlist");
            } else {
                this.$notify.error({
                    title: "创建失败",
                    message: response,
                    position: "bottom-right",
                    duration: 6000,
                });
            }
        },
        errupload(err, file, fileList) {
            this.$notify.error({
                title: "创建失败",
                message: JSON.parse(err.message).message,
                position: "bottom-right",
                duration: 6000,
            });
        },
    },
};
</script>

<style>
/* 动态容器名称 */
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 110px;
    margin-left: 10px;
    vertical-align: bottom;
}

.vmarea {
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    margin-top: 15px;
}

.v_html {
    font-size: 20px;
}

.con-card {
    width: 40%;
}

.con-card2 {
    width: 90%;
}

/*带背景的分页按钮背景色begin*/
.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #08c0b9;
    color: #fff;
}

.el-pagination.is-background .el-pager li.active {
    color: #fff;
    cursor: default;
}

.el-pagination.is-background .el-pager li:hover {
    color: #08c0b9;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #08c0b9;
}

.el-pagination.is-background .el-pager li:not(.disabled).active:hover {
    background-color: #08c0b9;
    color: #fff;
}

/*带背景的分页按钮背景色end*/

/*不带背景的分页按钮背景色begin*/
.el-pager li.active {
    color: #08c0b9;
    cursor: default;
}

.el-pagination .el-pager li:hover {
    color: #08c0b9;
}

.el-pagination .el-pager li:not(.disabled):hover {
    color: #08c0b9;
}

.cp-sbm-area {
    padding-top: 70px;
    text-align: right;
}

/*不带背景的分页按钮背景色end*/
</style>
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

        <el-table :data="vmtemdata.slice((curpage - 1) * pagesize, curpage * pagesize)" style="width: 100%"
            empty-text="暂无容器模版" :header-cell-style="{ background: '#00b8a9', color: '#fff' }">
            <el-table-column width="100" type="index" label="序号"> </el-table-column>
            <!--      <el-table-column  sortable label="ID" prop="id">-->
            <!--      </el-table-column>-->
            <el-table-column sortable label="Pod名称" prop="name"> </el-table-column>
            <el-table-column sortable label="命名空间" prop="cpuNum">
            </el-table-column>
            <el-table-column sortable label="持久卷" prop="OStype">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
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

        <!-- <el-dialog title="修改模版" :visible.sync="editvmtemvisible">
            <el-form label-position="top" label-width="80px" :model="editvmtem_form" :status-icon="true"
                :rules="vmtem_rules" ref="editvmtem_form">
                <el-row :gutter="30">
                    <el-col :span="12" :offset="0">
                        <el-form-item label="模版名称" prop="name">
                            <el-input v-model="editvmtem_form.name" placeholder="请输入模版名称"
                                @blur="validName('editvmtem_form')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-form-item label="内存大小" prop="memory">
                            <el-input v-model="editvmtem_form.memory" placeholder="请输入内存大小(单位G)" clearables
                                @blur="validMemory('editvmtem_form')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12" :offset="0">
                        <el-form-item label="处理器个数" prop="cpuNum">
                            <el-select style="width: 100%" v-model="editvmtem_form.cpuNum" clearable
                                placeholder="请选择处理器个数">
                                <el-option v-for="item in cpuNum_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-form-item label="操作系统类型" prop="OStype">
                            <el-select style="width: 100%" v-model="editvmtem_form.OStype" clearable
                                placeholder="请选择操作系统类型">
                                <el-option v-for="item in OStype_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12" :offset="0">
                        <el-form-item label="虚拟机镜像,#仅支持qcow2格式" prop="ImgName">
                            <el-select style="width: 60%" v-model="editvmtem_form.ImgName" clearable
                                @visible-change="nsremote" placeholder="请选择虚拟机镜像">
                                <el-option v-for="item in images" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-form-item label="网络类型" prop="nettype">
                            <el-select style="width: 60%" v-model="editvmtem_form.nettype" clearable
                                placeholder="请选择创建虚拟机的网络类型">
                                <el-option v-for="item in nettype_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="cp-sbm-area" style="margin-left: 450px; margin-top: 20px">
                    <el-button round @click="resetForm('editvmtem_form')">重置</el-button>
                    <el-button round type="primary" @click="editvmtem_sumbit('editvmtem_form')">确认
                    </el-button>
                </div>
            </el-form>
        </el-dialog> -->

        <!-- <el-dialog title="创建虚拟机" :visible.sync="buildvmtemvisible">
            <el-form label-position="top" label-width="50px" :model="buildvmtem_form" :status-icon="true"
                ref="buildvmtem_form">
                <el-row :gutter="30">
                    <el-col :span="12" :offset="0">
                        <el-form-item label="请输入虚拟机别名" prop="otherName">
                            <el-input v-model="buildvmtem_form.otherName" placeholder="请输入虚拟机中文名称" style="width: 60%"
                                @blur="validName('buildvmtem_form')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-form-item label="请输入虚拟机名称" prop="vmname">
                            <el-input v-model="buildvmtem_form.vmname" placeholder="请输入虚拟机名称" style="width: 60%"
                                @blur="validName('buildvmtem_form')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="24" :offset="0">
                        <el-form-item label="节点" prop="node">
                            <el-select style="width: 60%" v-model="buildvmtem_form.node" clearable
                                placeholder="请选择创建虚拟机所在宿主机节点">
                                <el-option v-for="item in node_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="30">
                    <el-col :span="12" :offset="0">
                        <el-form-item label="模版名称" prop="name">
                            <el-input v-model="buildvmtem_form.name" placeholder="请输入模版名称" style="width: 60%"
                                disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-form-item label="内存大小" prop="memory">
                            <el-input v-model="buildvmtem_form.memory" placeholder="请输入内存大小(单位G)" style="width: 60%"
                                clearables @blur="validMemory('editvmtem_form')" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="30">
                    <el-col :span="12" :offset="0">
                        <el-form-item label="处理器个数" prop="cpuNum">
                            <el-select style="width: 60%" v-model="buildvmtem_form.cpuNum" clearable
                                placeholder="请选择处理器个数" disabled>
                                <el-option v-for="item in cpuNum_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-form-item label="操作系统类型" prop="OStype">
                            <el-select style="width: 60%" v-model="buildvmtem_form.OStype" clearable
                                placeholder="请选择操作系统类型" disabled>
                                <el-option v-for="item in OStype_options" :key="item.value" :label="item.label"
                                    :value="item.value" disabled>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="30">
                    <el-col :span="12" :offset="0">
                        <el-form-item label="虚拟机镜像,#仅支持qcow2格式" prop="ImgName">
                            <el-select style="width: 60%" v-model="buildvmtem_form.ImgName" clearable
                                @visible-change="nsremote" placeholder="请选择虚拟机镜像" disabled>
                                <el-option v-for="item in images" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-form-item label="网络类型" prop="nettype">
                            <el-select style="width: 60%" v-model="buildvmtem_form.nettype" clearable
                                placeholder="请选择创建虚拟机的网络类型" disabled>
                                <el-option v-for="item in nettype_options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="cp-sbm-area" style="margin-left: 450px; margin-top: 20px">
                    <el-button round type="primary" @click="buildvmtem_sumbit('buildvmtem_form')">立即创建
                    </el-button>
                </div>
            </el-form>
        </el-dialog> -->
    </div>
</template>

<script>
import moment from "moment";
export default {
    name: "VMLogList",
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
            tmp_con_info: {
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
        handleClose(tag) {
            this.cp_form.containerInfoList.splice(
                this.cp_form.containerInfoList.indexOf(tag),
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
        getVMTem() {
            this.$axios
                .get(this.baseurl + "/Template/selectAll")
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
        openCreateVMtem() {
            this.createvmtemvisible = true;
        },
        handleDelete(index, row) {
            this.$confirm(`您确定删除吗?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$axios
                        .delete(this.baseurl + "/Template/delete/" + row.id)
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
            this.editvmtem_form.id = row.id;
            this.editvmtem_form.name = row.name;
            this.editvmtem_form.memory = row.memory;
            this.editvmtem_form.cpuNum = row.cpuNum;
            this.editvmtem_form.OStype = row.OStype;
            this.editvmtem_form.ImgName = row.ImgName;
            this.editvmtem_form.nettype = row.nettype;
            this.editvmtemvisible = true;
        },
        build(row) {
            this.buildvmtem_form.name = row.name;
            this.buildvmtem_form.memory = row.memory;
            this.buildvmtem_form.cpuNum = row.cpuNum;
            this.buildvmtem_form.OStype = row.OStype;
            this.buildvmtem_form.ImgName = row.ImgName;
            this.buildvmtem_form.nettype = row.nettype;
            this.buildvmtemvisible = true;
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
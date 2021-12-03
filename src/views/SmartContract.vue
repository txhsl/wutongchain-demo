<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-apps"></i> 智能合约
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="合约ID" prop="id">
                        <el-input v-model="form.id" placeholder="部署时自动生成"></el-input>
                    </el-form-item>
                    <el-form-item label="交易ID" prop="txid">
                        <el-input v-model="form.txid" placeholder="部署时自动记录"></el-input>
                    </el-form-item>
                    <el-form-item label="合约源码" prop="src">
                        <el-input type="textarea" rows="5"  v-model="form.src"></el-input>
                        <el-button type="primary" class="mt20" @click="onInstall">部署</el-button>
                    </el-form-item>
                    <el-form-item label="调用函数" prop="method">
                        <el-input v-model="form.method" placeholder="输入函数名称"></el-input>
                    </el-form-item>
                    <el-form-item label="输入参数" prop="args">
                        <el-input v-model="form.args" placeholder="使用英文字符“,”分隔参数"></el-input>
                    </el-form-item>
                    <el-form-item label="请求类型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option key="query" label="查询" value="query"></el-option>
                            <el-option key="invoke" label="调用" value="invoke"></el-option>
                        </el-select>
                        <el-button type="primary" class="ml20" @click="onRequest">发送请求</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table-box">
                <el-table :data="results" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                    <el-table-column prop="state" label="状态码"></el-table-column>
                    <el-table-column prop="message" label="请求结果"></el-table-column>
                    <el-table-column prop="data.result" label="返回结果"></el-table-column>
                    <el-table-column prop="data.txId" label="交易ID"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { installContract, queryContract, invokeContract } from "../api/index";

export default {
    name: "smartcontract",
    setup() {
        const formRef = ref(null);
        const form = reactive({
            id: "",
            txid: "",
            src: "",
            method: "",
            type: "",
            args: "",
        });

        const rules = {

        };

        const results = ref([]);

        const query = reactive({
            category: "wvm",
            file: "",
            name: "",
            method: "",
            args: []
        });
        
        const onInstall = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    query.file = window.btoa(form.src);
                    installContract(query).then((res) => {
                        if(res.state == 200) {
                            form.txid = res.data.txId;
                            form.id = res.data.name;
                            ElMessage.success("合约安装成功！");
                        }
                        else {
                            ElMessage.error("合约安装失败！");
                        }
                    });
                } else {
                    return false;
                }
            });
        };

        const onRequest = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    query.name = form.id;
                    query.method = form.method;
                    query.args = [];
                    if(form.args != "") {
                        let args = form.args.split(',');
                        args.forEach(function(arg) {
                            let n = Number(arg);
                            if(!isNaN(arg)) {
                                query.args.push(n);
                            }
                            else {
                                query.args.push(arg);
                            }
                        });
                    }
                    if(form.type == "query") {
                        queryContract(query).then((res) => {
                            if(res.state == 200) {
                                results.value.push(res);
                                ElMessage.success("查询成功！");
                            }
                            else {
                                ElMessage.error("查询失败！");
                            }
                        });
                    }
                    else if(form.type == "invoke") {
                        invokeContract(query).then((res) => {
                            if(res.state == 200) {
                                results.value.push(res);
                                ElMessage.success("调用成功！");
                            }
                            else {
                                ElMessage.error("调用失败！");
                            }
                        });
                    }
                    else {
                        ElMessage.error("请选择请求类型！");
                    }
                } else {
                    return false;
                }
                console.log(results);
            });
        };

        const onReset = () => {
            formRef.value.resetFields();
        };

        return {
            formRef,
            form,
            rules,
            results,
            onRequest,
            onInstall,
            onReset,
        };
    },
};

</script>

<style scoped>
.mt20 {
    margin-top: 20px;
}
.ml20 {
    margin-left: 20px;
}
.container {
    display: flex;
}
.form-box {
    width: 45%;
}
.table-box {
    width: 50%;
    margin-left: 5%;
}
.table {
    width: 100%;
    font-size: 14px;
}
</style>
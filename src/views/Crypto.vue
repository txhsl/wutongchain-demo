<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-lock"></i> 密码工具
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="formARef" :rules="rules" :model="formA" label-width="80px">
                    <el-form-item label="SM2私钥" prop="prvkey">
                        <el-input v-model="formA.prvkey" placeholder="点击按钮随机生成" disabled></el-input>
                        <el-button type="primary" class="mt20" @click="onGenerateA">生成</el-button>
                    </el-form-item>
                    <el-form-item label="SM2公钥" prop="pubkey">
                        <el-input v-model="formA.pubkey" placeholder="依照私钥自动计算" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="消息内容" prop="msg">
                        <el-input v-model="formA.msg" placeholder="填入需要签名的内容"></el-input>
                        <el-button type="primary" class="mt20" @click="onSignA">签名</el-button>
                    </el-form-item>
                    <el-form-item label="签名输出" prop="sig">
                        <el-input v-model="formA.sig" placeholder="依照消息内容自动计算" disabled></el-input>
                        <el-button type="primary" class="mt20" @click="onValidateA">验证</el-button>
                        <el-button type="primary" class="mt20" @click="onResetA">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="form-box ml">
                <el-form ref="formBRef" :rules="rules" :model="formB" label-width="80px">
                    <el-form-item label="选择密钥" prop="keystore">
                        <el-select v-model="formB.keystore" placeholder="请选择">
                            <el-option key="1" label="1" value="1"></el-option>
                            <el-option key="2" label="2" value="2"></el-option>
                            <el-option key="3" label="3" value="3"></el-option>
                        </el-select>
                        <el-button type="primary" class="ml20" @click="onSwitch">载入</el-button>
                    </el-form-item>
                    <el-form-item label="RSA私钥" prop="prvkey">
                        <el-input v-model="formB.prvkey" placeholder="依照文件自动加载" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="RSA公钥" prop="pubkey">
                        <el-input v-model="formB.pubkey" placeholder="依照文件自动加载" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="消息内容" prop="msg">
                        <el-input v-model="formB.msg" placeholder="填入需要签名的内容"></el-input>
                        <el-button type="primary" class="mt20" @click="onSignB">签名</el-button>
                    </el-form-item>
                    <el-form-item label="签名输出" prop="sig">
                        <el-input v-model="formB.sig" placeholder="依照消息内容自动计算" disabled></el-input>
                        <el-button type="primary" class="mt20" @click="onValidateB">验证</el-button>
                        <el-button type="primary" class="mt20" @click="onResetB">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, setDevtoolsHook } from "vue";
import { ElMessage } from "element-plus";
import { fetchPrivateKey, fetchPublicKey } from "../api/index";
import { JSEncrypt } from "jsencrypt";
import { SHA256 } from "crypto-js";

export default {
    name: "crypto",
    setup() {
        // 废弃方案
        const formARef = ref(null);
        const formA = reactive({
            prvkey: "",
            pubkey: "",
            msg: "",
            sig: "",
        });
        

        const rules = {

        };

        const onGenerateA = () => {
            let keypair = sm2.generateKeyPairHex();
            formA.prvkey = window.btoa(keypair.privateKey);
            formA.pubkey = window.btoa(keypair.publicKey);
        };

        const onSignA = () => {
            formARef.value.validate((valid) => {
                if (valid) {
                    formA.sig = sm2.doSignature(formA.msg, window.atob(formA.prvkey));
                    return true;
                }
                else {
                    return false;
                }
            });
        };

        const onValidateA = () => {
            formARef.value.validate((valid) => {
                if (valid) {
                    if (sm2.doVerifySignature(formA.msg, formA.sig, window.atob(formA.pubkey))) {
                        ElMessage.success("签名验证通过");
                    }
                    else {
                        ElMessage.error("签名验证失败");
                    }
                    return true;
                }
                else {
                    return false;
                }
            });
        };

        const onResetA = () => {
            formARef.value.resetFields();
        };

        // 替代方案
        const formBRef = ref(null);
        const formB = reactive({
            keystore: [],
            prvkey: "",
            pubkey: "",
            msg: "",
            sig: "",
        });

        const query = reactive({
            id: 0
        });

        const selection = reactive([1, 2, 3]);
        const encryptor = new JSEncrypt();
        const keystore = reactive([]);

        const loadKeystore = () => {
            selection.forEach(function(index) {
                query.id = index;
                let keypair = { prvkey: '', pubkey: '' };
                fetchPrivateKey(query).then((res) => {
                    keypair.prvkey = res;
                });
                fetchPublicKey(query).then((res) => {
                    keypair.pubkey = res;
                });
                keystore.push(keypair);
            });
            console.log(keystore);
        };
        loadKeystore();

        const onSwitch = () => {
            formB.prvkey = keystore[parseInt(formB.keystore)].prvkey;
            formB.pubkey = keystore[parseInt(formB.keystore)].pubkey;
        };

        const onSignB = () => {
            encryptor.setPrivateKey(formB.prvkey);
            formB.sig = encryptor.sign(formB.msg, SHA256, "sha256");
            console.log(window.atob(formB.sig));
        };

        const onValidateB = () => {
            encryptor.setPublicKey(formB.pubkey);
            if (encryptor.verify(formB.msg, formB.sig, SHA256)) {
                ElMessage.success("签名验证通过");
            }
            else {
                ElMessage.error("签名验证失败");
            }
        };

        const onResetB = () => {
            formBRef.value.resetFields();
        };


        return {
            formARef,
            formA,
            rules,
            onGenerateA,
            onSignA,
            onValidateA,
            onResetA,

            formBRef,
            formB,
            onSwitch,
            onSignB,
            onValidateB,
            onResetB,
        }
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
    width: 50%;
}
</style>
<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-apps"></i> 碳排放平台
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-menu
          :default-active="activeNavMenu"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="onSelectNavMenu"
      >
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">指标认定</el-menu-item>
        <el-menu-item index="3">碳足迹结算</el-menu-item>
        <el-menu-item index="4">碳积分交易</el-menu-item>
        <el-menu-item index="5">我的</el-menu-item>
      </el-menu>
      <div v-if="isNavSelected('1')">
          <div class="intro-page mt20">
            <el-row></el-row>
            <el-row class="mt50"></el-row>
            <el-row class="intro-title">使用说明</el-row>
            <el-row :gutter="20" class="intro-box mt50">
              <el-col :span="1"/>
              <el-col :span="10" class="message-box">
                <div class="intro-desc">1. 系统介绍</div>
                <div class="intro-desc mt20">2. 指标认定</div>
                <div class="intro-desc mt20">3. EEXI标准与减排</div>
                <div class="intro-desc mt20">4. 碳足迹结算</div>
                <div class="intro-desc mt20">5. 碳积分与交易</div>
              </el-col>
              <el-col :span="2"/>
              <el-col :span="10" class="fig-box">
              <el-col :span="1"/>
              </el-col>
            </el-row>
            <el-row class="mt75"></el-row>
          </div>
      </div>
      <div v-if="isNavSelected('2')">
        <div class="form-box">
          <el-form ref="formRef" :rules="rules" :model="form">
            <el-card class="mt20">
              <template #header>
                <span>基本信息</span>
              </template>
              <el-row :gutter="20">
                <el-col :span="4">
                  <el-form-item label="船舶类型" prop="type" class="ifl">
                    <el-select v-model="form.type" @change="onShipTypeChange" id="ship-type">
                      <el-option
                          v-for="item in ship_type"
                          :label="item.label"
                          :value="item.value"
                          :key="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="船舶载重吨位" prop="carry" class="ifl">
                    <el-select v-model="form.carry" id="ship-tonnage">
                      <el-option
                          v-for="item in tonnage"
                          :label="item.label"
                          :value="item.value"
                          :key="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="船舶载重" prop="carry_tonnage" class="ifl">
                    <el-input v-model.number="form.carry_tonnage"><template #suffix>吨</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label="航速" prop="speed" class="ifl">
                    <el-input v-model.number="form.speed" type="number"><template #suffix>节</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="船舶总吨位" prop="total_tonnage" class="ifl">
                    <el-input v-model.number="form.total_tonnage"><template #suffix>吨</template></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="mt20">
                  <template #header>
                    <span>主引擎</span>
                  </template>
                  <el-form-item label="主引擎数量" prop="main_engine_amount">
                    <el-input-number :min="1" :step="1" v-model="form.main_engine_amount"></el-input-number>
                  </el-form-item>
                  <el-form-item label="最大持续额定出力" prop="mcr">
                    <el-input v-model.number="form.mcr" type="number"><template #suffix>千瓦</template></el-input>
                  </el-form-item>
                  <el-form-item label="受限最大持续额定出力" prop="mcr_lim">
                    <el-input v-model.number="form.mcr_lim" type="number"><template #suffix>千瓦</template></el-input>
                  </el-form-item>
                  <el-form-item label="燃油类型" prop="main_oil_type">
                    <el-select v-model="form.main_oil_type">
                      <el-option v-for="item in oil_type"
                                 :key="item.label"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="燃油消耗率" prop="main_oil_rate">
                    <el-input v-model.number="form.main_oil_rate" type="number"><template #suffix>克/千瓦时</template></el-input>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="mt20">
                  <template #header>
                    <span>副引擎</span>
                  </template>
                  <el-form-item label="最大持续额定出力" prop="amcr">
                    <el-input v-model.number="form.amcr" type="number"><template #suffix>千瓦</template></el-input>
                  </el-form-item>
                  <el-form-item label="燃油类型" prop="aux_oil_type">
                    <el-select v-model="form.aux_oil_type">
                      <el-option v-for="item in oil_type"
                                 :key="item.label"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="燃油消耗率" prop="aux_oil_rate">
                    <el-input v-model.number="form.aux_oil_rate" type="number"><template #suffix>克/千瓦时</template></el-input>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-button type="primary" @click="calEEXI" class="div_center">计算EEXI</el-button>
            </el-row>
          </el-form>
        </div>
      </div>
      <div v-if="isNavSelected('3')">
        <el-card class="mt20">
          <template #header>
            <strong>添加航程</strong>
          </template>
          <el-form :model="new_sailing" :inline="true" :rules="new_sailing_rules" ref="sailing_ref">
            <el-form-item label="出发时间" prop="time_start">
              <el-date-picker
                  v-model="new_sailing.time_start"
                  type="date"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="起点" prop="from">
              <el-input v-model="new_sailing.from"></el-input>
            </el-form-item>
            <el-form-item label="到达时间" prop="time_end">
              <el-date-picker
                  v-model="new_sailing.time_end"
                  type="date"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="终点" prop="to">
              <el-input v-model="new_sailing.to"></el-input>
            </el-form-item>
            <el-form-item label="航程" prop="dist">
              <el-input v-model.number="new_sailing.dist" type="number">
                <template #suffix>千米</template>
              </el-input>
            </el-form-item>
          </el-form>
          <el-row>
            <el-button type="primary" class="div_center" @click="submit_sailing">提交航程</el-button>
          </el-row>

        </el-card>
        <el-card class="mt20">
          <template #header>
            <strong>航程记录</strong>
          </template>
          <el-table :data="sailing_record" border class="table" header-cell-class-name="table-header">
            <el-table-column prop="time_start" label="出发时间"></el-table-column>
            <el-table-column prop="from" label="起点"></el-table-column>
            <el-table-column prop="time_end" label="到达时间"></el-table-column>
            <el-table-column prop="to" label="终点"></el-table-column>
            <el-table-column prop="dist" label="航程"></el-table-column>
            <el-table-column prop="amount" label="所获碳积分"></el-table-column>
            <el-table-column prop="tx_id" label="交易ID"></el-table-column>
          </el-table>
        </el-card>
      </div>
      <div v-if="isNavSelected('4')">
        <el-card class="mt20">
          <template #header>
            <strong>发起交易</strong>
          </template>
          <el-form :model="new_tx" :inline="true" :rules="new_tx_rules" ref="tx_ref">
            <el-form-item label="接收方" prop="to">
              <el-input v-model="new_tx.to"></el-input>
            </el-form-item>
            <el-form-item label="碳积分数量" prop="amount">
              <el-input v-model.number="new_tx.amount"></el-input>
            </el-form-item>
            <el-row>
              <el-button type="primary" class="div_center" @click="submit_tx">发起交易</el-button>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="mt20">
          <template #header>
            <strong>交易记录</strong>
          </template>
          <el-table :data="transaction_record" border class="table" header-cell-class-name="table-header">
            <el-table-column prop="time" label="时间"></el-table-column>
            <el-table-column prop="from" label="发起方"></el-table-column>
            <el-table-column prop="to" label="接收方"></el-table-column>
            <el-table-column prop="amount" label="碳积分数量"></el-table-column>
            <el-table-column prop="tx_id" label="交易ID"></el-table-column>
          </el-table>
        </el-card>
      </div>
      <div v-if="isNavSelected('5')">
        <el-card class="mt20">
          <template #header>
            <strong>船基本信息</strong>
          </template>
          <el-descriptions
              direction="vertical"
              border
              :column="5"
          >
            <el-descriptions-item label="船主">Saturn</el-descriptions-item>
            <el-descriptions-item label="船厂">福州船政局</el-descriptions-item>
            <el-descriptions-item label="船体编号">12345</el-descriptions-item>
            <el-descriptions-item label="国际海事组织编号">94112XX</el-descriptions-item>
            <el-descriptions-item label="船体类型">散装货轮</el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card class="mt20">
          <template #header>
            <strong>船体参数</strong>
          </template>
          <el-descriptions
              direction="vertical"
              border
              :column="3"
          >
            <el-descriptions-item label="全长">250.0米</el-descriptions-item>
            <el-descriptions-item label="型长">240.0米</el-descriptions-item>
            <el-descriptions-item label="型宽">40.0米</el-descriptions-item>
            <el-descriptions-item label="型深">20.0米</el-descriptions-item>
            <el-descriptions-item label="夏季吃水线">14.0米</el-descriptions-item>
            <el-descriptions-item label="处于夏季吃水线时的载重量">150,000吨</el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card class="mt20">
          <template #header>
            <strong>我的碳积分</strong>
          </template>
          <el-descriptions
            direction="vertical"
            border
            :column="4">
            <el-descriptions-item label="当前积分">{{balance}}</el-descriptions-item>
            <el-descriptions-item label="标准EEXI">{{required_eexi}}</el-descriptions-item>
            <el-descriptions-item label="当前EEXI">{{current_eexi}}</el-descriptions-item>
            <el-descriptions-item label="是否允许出航">{{current_eexi <= required_eexi ? '是' : '否'}}</el-descriptions-item>
          </el-descriptions>
          <el-row>
            <el-button type="primary" class="div_center" @click="update">更新信息</el-button>
          </el-row>
        </el-card>

      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted, onBeforeMount } from "vue";
import {
  fetchData,
  fetchPrivateKey,
  fetchPublicKey,
  invokeContract,
  queryContract
} from "../api";
import { ElMessage } from "element-plus";
import { KEYUTIL } from "jsrsasign";

export default {
  name: "Platform",
  setup() {
    const activeNavMenu = ref("1");
    const formRef = ref(null);
    const sailing_ref = ref(null);
    const tx_ref = ref(null);
    const pk = ref();
    const sk = ref();
    const query = reactive({
      category: "wvm",
      file: "",
      name: "95669c2b4e63edc0978e1d3c85d623552b6f600d05e55cd910c528217bcb2a7f",
      method: '',
      args: []
    });
    const new_tx = reactive({
      time: '',
      from:'',
      to: '',
      amount: '',
      tx_id: ''
    });
    const new_sailing = reactive({
      from: '',
      time_start: '',
      to: '',
      time_end: '',
      dist: '',
      amount: '',
      tx_id: ''
    })
    const balance = ref(0);
    const required_eexi = ref(0);
    const current_eexi = ref(0);
    const form = reactive({
      type: 0,
      carry: 0,
      carry_tonnage: '',
      total_tonnage: '',
      speed: '',
      main_engine_amount: 1,
      mcr: '',
      mcr_lim: '',
      amcr: '',
      main_oil_rate: '',
      aux_oil_rate: '',
      main_oil_type: 0,
      aux_oil_type: 0
    });
    const sailing_record = ref([]);
    const transaction_record = ref([]);
    const rules = ref({});
    const new_sailing_rules = ref({});
    const new_tx_rules = ref({});
    const oil_type = ref([]);
    const ship_type = ref([]);
    const all_tonnage = ref([]);
    const tonnage = ref([]);
    const CF = ref([]);
    const AC = ref([]);
    const X = ref([]);
    const cap_fac = ref([]);

    const getData = () => {
      fetchData(null).then((res) => {
        rules.value = res.rules;
        new_sailing_rules.value = res.new_sailing_rules;
        new_tx_rules.value = res.new_tx_rules;
        oil_type.value = res.oil_type;
        ship_type.value = res.ship_type;
        all_tonnage.value = res.all_tonnage;
        tonnage.value = all_tonnage.value[form.type];
        CF.value = res.CF;
        AC.value = res.AC;
        X.value = res.X;
        cap_fac.value = res.cap_fac;
      });
    };

    const getAccount = () => {
      let query = {
        id: 1
      };
      let keypair = { sk: '', pk: '' };
      fetchPrivateKey(query).then((res) => {
        keypair.sk = res;
        fetchPublicKey(query).then((res) => {
          keypair.pk = res;
          sk.value = KEYUTIL.getKey(keypair.sk);
          pk.value = KEYUTIL.getKey(keypair.pk.replaceAll(" EC ", " "));
        });
      });
    };

    onBeforeMount(() => {
      getData();
      getAccount();
    });

    const onShipTypeChange = (val) => {
      tonnage.value = all_tonnage.value[val];
      form.carry = 0;
    };
    const isNavSelected = (index) => activeNavMenu.value === index;
    const onSelectNavMenu = (key) => {
      activeNavMenu.value = key;
    };
    const calEEXI = () => {
      formRef.value.validate((valid) => {
        if(valid) {
          let account = pk.value.pubKeyHex;
          let ac = AC.value[form.type];
          let x = X.value[form.type][form.carry];
          let require_eexi = (1 - x / 100) * ac[0] * Math.pow(form.carry_tonnage, -ac[1]);
          query.method = 'register';
          query.args = [account, x, ac[0], form.carry_tonnage, ac[1], require_eexi];

          let msg = JSON.stringify(query);
          let sig = sign(msg);
          if(validate(msg, sig)) {
            ElMessage.success("签名验证成功！");
          }
          else {
            ElMessage.error("签名验证失败！");
            return;
          }

          invokeContract(query).then((res) => {
            if(res.state === 200) {
              ElMessage.success("EEXI期望值设置成功！");
            }
            else {
              ElMessage.error("EEXI期望值设置失败！");
            }
          });
          let eps = 1e-8;
          let MEA = form.main_engine_amount;
          let MEP = Math.min(form.mcr * 0.75, form.mcr_lim * 0.83) + eps;
          let MEC = CF.value[form.main_oil_type] + eps;
          let MESFC = form.main_oil_rate + eps;
          let AEP = form.amcr + eps;
          let AEC = CF.value[form.aux_oil_type] + eps;
          let AESFC = form.aux_oil_rate + eps;
          let capacity = Math.round(cap_fac.value[form.type][0] * form.carry_tonnage + cap_fac.value[form.type][1] * form.total_tonnage);
          let velocity = form.speed + eps;

          query.method = "updateArchive";
          query.args = [account, MEA, MEP, MEC, MESFC, AEP, AEC, AESFC, capacity, velocity];
          invokeContract(query).then((res) => {
            if(res.state === 200) {
              ElMessage.success("EEXI实际值更新成功！");
            }
            else {
              ElMessage.error("EEXI实际值更新失败！");
            }
          });
        }
        else {
          return false;
        }
      });
    };

    const sign = (msg) => {
      let sig = new KJUR.crypto.Signature({"alg": "SM3withECDSA", "prov": "cryptojs/jsrsa"});
      sig.initSign({"ecprvhex": sk.value.prvKeyHex, "eccurvename": "secp256r1"});
      sig.updateString(msg);
      return sig.sign();
    };

    const validate = (msg, attained_sig) => {
      let sig = new KJUR.crypto.Signature({"alg": "SM3withECDSA", "prov": "cryptojs/jsrsa"});
      sig.initVerifyByPublicKey({"ecpubhex": pk.value.pubKeyHex, "eccurvename": "secp256r1"});
      sig.updateString(msg);
      return sig.verify(attained_sig);
    };

    const getBalance = () => {
      query.method = 'getDecimals';
      query.args = [];
      queryContract(query).then((res) => {
        if(res.state === 200){
          let decimals = res.data.result;
          query.method = 'balanceOf';
          query.args = [pk.value.pubKeyHex];
          queryContract(query).then((res) => {
            if(res.state === 200){
              ElMessage.success("碳积分余额获取成功！");
              balance.value = res.data.result / 10 ** decimals;
            }
            else {
              ElMessage.error("碳积分余额获取失败！");
            }
          });
        }
        else {
          ElMessage.error("碳积分余额获取失败！");
        }
      });


    };

    const getRequiredEEXI = () => {
      query.method = 'getRequiredEEXI';
      query.args = [pk.value.pubKeyHex];
      queryContract(query).then((res) => {
        if(res.state === 200){
          ElMessage.success("EEXI期望值获取成功！");
          required_eexi.value = res.data.result;
        }
        else {
          ElMessage.error("EEXI期望值获取失败！");
        }
      });
    };

    const getCurrentEEXI = () => {
      query.method = 'getCurrentEEXI';
      query.args = [pk.value.pubKeyHex];
      queryContract(query).then((res) => {
        if(res.state === 200){
          ElMessage.success("EEXI实际值获取成功！");
          current_eexi.value = res.data.result;
        }
        else {
          ElMessage.error("EEXI期望值获取失败！");
        }
      });
    };

    const submit_sailing = () => {
      sailing_ref.value.validate(valid => {
        if(valid) {
          query.method = 'settleAccount';
          query.args = [pk.value.pubKeyHex, new_sailing.dist];
          invokeContract(query).then((res) => {
            if(res.state === 200) {
              query.method = 'getDecimals';
              query.args = [];
              new_sailing.tx_id = res.data.txId;
              queryContract(query).then((res) => {
                if(res.state === 200) {
                  let decimals = res.data.result;
                  query.method = 'getLastAttained';
                  query.args = [pk.value.pubKeyHex];
                  queryContract(query).then(res => {
                    if(res.state === 200){
                      ElMessage.success("碳足迹结算成功！");
                      new_sailing.amount = res.data.result / 10 ** decimals;
                      sailing_record.value.push(new_sailing);
                    }
                  })
                }})
            }
            else {
              ElMessage.error("碳足迹结算失败！");
            }
          });
        }
        else {
          return false;
        }
      });
    }

    const submit_tx = () => {
      tx_ref.value.validate(valid => {
        if(valid) {
          query.method = 'getDecimals';
          query.args = [];
          queryContract(query).then((res) => {
            if(res.state === 200){
              let decimals = res.data.result;
              query.method = 'transfer';
              query.args = [pk.value.pubKeyHex, new_tx.to, new_tx.amount * 10 ** decimals];
              invokeContract(query).then((res) => {
                if(res.state === 200) {
                  ElMessage.success("积分交易成功！");
                  new_tx.time = new Date();
                  new_tx.from = pk.value.pubKeyHex;
                  new_tx.tx_id = res.data.txId;
                  transaction_record.value.push(new_tx);
                }
                else {
                  ElMessage.error("积分交易失败！");
                }
              });
            }
            else {
              ElMessage.error("积分交易失败！");
            }
          });
        }
        else {
          return false;
        }
      });
    };

    const update = () => {
      getBalance();
      getCurrentEEXI();
      getRequiredEEXI();
    }

    return {
      activeNavMenu,
      formRef,
      isNavSelected,
      onSelectNavMenu,
      ship_type,
      tonnage,
      onShipTypeChange,
      form,
      rules,
      calEEXI,
      oil_type,
      transaction_record,
      sailing_record,
      new_tx,
      new_sailing,
      submit_sailing,
      submit_tx,
      new_sailing_rules,
      new_tx_rules,
      tx_ref,
      sailing_ref,
      required_eexi,
      current_eexi,
      balance,
      update
    };
  },
};
</script>

<style scoped>
.form-box {
  margin-top: 20px;
  width: 100%;
}

.message-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.fig-box {
  height: 490px;
  background-image: url(../assets/img/login-bg.jpg);
}

.mt20 {
  margin-top: 20px;
}

.mt50 {
  margin-top: 50px;
}

.mt75 {
  margin-top: 75px;
}

.intro-page {
  width: 100%;
  background: #f3f3f3;
  box-sizing: border-box;
}

.intro-title {
  justify-content: center;
  line-height: 1;
  font-size: 50px;
  font-weight: bolder;
  color: #2d8cf0;
}

.intro-desc {
  font-size: 18px;
  color: #777;
}

:deep(#ship-type) {
  width: 120px;
}

:deep(#ship-tonnage) {
  width: 260px;
}
:deep(.ifl) {
  margin: 0 10px;
}

.div_center {
  position: relative;
  margin: 20px auto 0 auto;
}
:deep(input[type="number"]::-webkit-inner-spin-button){
  display: none!important;
}
</style>

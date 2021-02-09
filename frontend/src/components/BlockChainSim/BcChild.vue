<template>
    <div class="shadow">
        <b-card 
            :header-bg-variant="blockData.blockcolor"
            header-text-variant="white"
            align="center">
            <template #header>
                <h6 class="mb-0 p-1 font-weight-bold">Block {{blockData.blockid}}</h6>
            </template>
            <b-card-text>
                <b-input-group>
                    <template #prepend>
                        <b-input-group-text class="font-weight-bold" >Parent Hash</b-input-group-text>
                    </template>
                    <b-form-input readonly
                        v-model="blockData.parent"
                    ></b-form-input>
                </b-input-group>
            </b-card-text>
            <b-card-text>
                <b-input-group>
                    <template #prepend>
                        <b-input-group-text class="font-weight-bold" >Block Data</b-input-group-text>
                    </template>
                    <!-- the data for the Genesis block cannot be altered -->
                    <b-form-textarea
                        v-model="blockData.dataval" :disabled="blockData.blockid === 0" 
                    ></b-form-textarea>
                  </b-input-group>
            </b-card-text>
            <b-card-text>
                <b-input-group>
                    <template #prepend>
                        <b-input-group-text class="font-weight-bold" >Block Hash</b-input-group-text>
                    </template>
                    <b-form-input readonly 
                        v-model="blockData.hash"
                    ></b-form-input>
                </b-input-group>
            </b-card-text>
            <b-card-text>
                <b-input-group>
                    <template #prepend>
                        <b-input-group-text class="font-weight-bold" >Nonce</b-input-group-text>
                    </template>
                    <b-form-input readonly
                        v-model="blockData.nonce"
                    ></b-form-input>
                </b-input-group>
            </b-card-text>
            <b-card-text>
                <b-input-group>
                    <template #prepend>
                        <b-input-group-text class="font-weight-bold" >Timestamp</b-input-group-text>
                    </template>
                    <b-form-input readonly
                        v-model="blockData.timestamp"
                    ></b-form-input>
                 </b-input-group>
            </b-card-text>
            <b-button block v-on:click="mine()" id="mine" :disabled=blockData.mined>Mine</b-button>
        </b-card>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Emit, Vue, Watch } from "vue-property-decorator";
    import { BlockType, BlockChangeMessage } from './BlockType';
    import axios from 'axios';
    
    @Component
    export default class BcChild extends Vue {
        @Prop()  private blockData!:          BlockType;
        @Prop()  private blockIndex!:         number;
        @Emit('my-block-changed')
        notifyParentDetail(): BlockChangeMessage{
          return {idx: this.blockIndex, data: this.blockData};
        }
        
        @Watch('blockData', {deep:true})
        onBlockDataChanged(){
            if (this.blockData.mined === true) {     
                axios.post("http://localhost:5000", {
                                                     "blockid": this.blockData.blockid,
                                                     "data": this.blockData.dataval,
                                                     "nonce": this.blockData.nonce,
                                                     "parent": this.blockData.parent,
                                                     "timestamp": this.blockData.timestamp,
                                                     "cmd": "check_block"
                })
                .then((response) => {
                    
                    if (response.data.matches !== "true" && this.blockData.parent !== "NULL") {
                        
                        for (let i = this.blockData.blockid-this.$parent.$data.blockList[0].blockid; 
                                 i <= this.$parent.$data.blockList[this.$parent.$data.blockList.length-1].blockid-this.$parent.$data.blockList[0].blockid; 
                                 i++) {
                            if(this.$parent.$data.blockList[i].hash !== "") {
                              this.$parent.$data.blockList[i].blockcolor = "danger";
                            }
                        }
                        if(this.$parent.$data.blockList[this.$parent.$data.blockList.length-1].mined !== true) {
                            this.$parent.$data.blockList[this.$parent.$data.blockList.length-1].mined = true;
                        }                      
                        this.notifyParentDetail()
                        
                    } else {
                        
                        for (let i = this.blockData.blockid-this.$parent.$data.blockList[0].blockid; 
                                 i <= this.$parent.$data.blockList[this.$parent.$data.blockList.length-1].blockid-this.$parent.$data.blockList[0].blockid; 
                                 i++) {
                            if(this.$parent.$data.blockList[i].hash !== "" && (i===0 || this.$parent.$data.blockList[i-1].blockcolor !== "danger")) {
                                this.$parent.$data.blockList[i].blockcolor = "success";
                            }
                        }
                        
                        if(this.$parent.$data.blockList[this.$parent.$data.blockList.length-1].mined === true 
                          && this.$parent.$data.blockList[this.$parent.$data.blockList.length-1].hash === ""
                          && this.$parent.$data.blockList[this.$parent.$data.blockList.length-2].blockcolor !== "danger"){
                            this.$parent.$data.blockList[this.$parent.$data.blockList.length-1].mined = false;
                        }
                        
                    }
                    
                });
                
            }
            
        }
        
        getBlock() {
            axios.get('http://localhost:5000').then((response) => {
                this.blockData.blockid = response.data.blockid;
                this.blockData.parent = response.data.parent;
                this.blockData.hash = response.data.hash;
                this.blockData.dataval = response.data.dataval;
                this.blockData.nonce = response.data.nonce;
                this.blockData.timestamp = response.data.timestamp;
            });
        }
        
        // mine a new block on the chain
        mine() {
            // let people know this block is being mined
            this.blockData.nonce = 0
            this.blockData.blockcolor = "info";
            //
            axios.post("http://localhost:5000", {
                                                 "difficulty": this.blockData.difficulty,
                                                 "data": this.blockData.dataval,
                                                 "maxiterations": this.blockData.maxIter,
                                                 "parent": this.blockData.parent,
                                                 "cmd": "mine"
            })
            .then((response) => {
                if (response.data.error) {
                    this.blockData.mined = false;
                    this.blockData.blockcolor = "warning";
                    this.blockData.nonce = this.blockData.maxIter;
                
                } else {
                    
                    this.blockData.blockid = response.data.blockid;
                    this.blockData.parent = response.data.parent;
                    this.blockData.hash = response.data.hash;
                    this.blockData.nonce = response.data.nonce;
                    this.blockData.timestamp = response.data.timestamp;
                    this.blockData.mined = true;
                    this.blockData.blockcolor = "success";
                    
                }
            
            });            
        }
    
    }
    
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
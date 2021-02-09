<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    div.sticky {
      position: -webkit-sticky; /* Safari */
      position: sticky;
      top: 0;
      z-index: 9999; /* set this to something high*/
    }
</style>

<template>
    <div>
        <br>
        <div class="row shadow; sticky" style="background: #fff4d9">
            <b-container class="p-4" >
                <b-card-text class="h1 font-weight-bold"> 
                    Simple Blockchain Simulator
                </b-card-text>
            </b-container>
            <div class="input-group mb-4 justify-content-xl-center; row">
                <div class="column; mx-auto">
                    <b-button-group>
                        <b-button pill variant="outline-dark p-3 btn-block" @click="createNewBlock()">Create New Block</b-button>
                    </b-button-group>
                </div>
                <div class="column; mx-auto">
                    <b-input-group>
                        <template #prepend>
                            <b-input-group-text class="font-weight-bold" style="padding-right: 5px; padding-left: 5px;" >Mining Difficulty</b-input-group-text>
                        </template>
                        <b-form-input 
                            v-model.number="mineDiff"
                        ></b-form-input>
                    </b-input-group>
                    <b-input-group>
                        <template #prepend>
                            <b-input-group-text class="font-weight-bold" style="padding-right: 5px; padding-left: 5px;" >Maximum Mining Iterations</b-input-group-text>
                        </template>
                        <b-form-input 
                            v-model.number="maxMineIter"
                        ></b-form-input>
                    </b-input-group>
                </div>
                
            </div>
            
        </div> 
        <hr>      
        <div class="row">
            <div class="col-sm-9 mb-2; mx-auto" v-for="(block, index) in blockList" :key="index">
                <bc-child
                    :block-data="block"
                    :block-index="index"
                    @my-block-changed="onChildBlockChange"
                ></bc-child>
                <br>
            </div>
            
        </div>
        
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from "vue-property-decorator";
    import BcChild from "./BcChild.vue";
    import { BlockType, BlockChangeMessage } from './BlockType';
    import axios from 'axios';
    
    @Component({ components: { "bc-child": BcChild } })
    export default class BcParent extends Vue {
        
        created() {
            // default block if not connected to server
            this.blockList.push({ blockid: -1,
                                  parent: "junk",
                                  hash: "junk",
                                  dataval: "junk",
                                  nonce: -1,
                                  timestamp: -1,
                                  mined: true,
                                  difficulty: 0,
                                  maxIter: 0,
                                  blockcolor: "warning"
            })
            axios.get('http://localhost:5000').then((response) => { // response block from server
                this.blockList[0].blockid = response.data.blockid;
                this.blockList[0].parent = response.data.parent;
                if (this.blockList[0].parent === "\u0000") {
                    this.blockList[0].parent = "NULL";
                }
                this.blockList[0].hash = response.data.hash;
                this.blockList[0].dataval = response.data.dataval;
                this.blockList[0].nonce = response.data.nonce;
                this.blockList[0].timestamp = response.data.timestamp;
                this.mineDiff = response.data.miningdifficulty;
                this.maxMineIter = response.data.miningmaxiter;
            })
        }
        
        blockList: BlockType[] = [ ];
        
        private mineDiff = 0
        @Watch('mineDiff')
        diffChanged(newVal: number) {
            if (newVal.toString() !== '') {
                if (newVal >= 0) {
                    axios.post("http://localhost:5000", {
                                                          "difficulty": newVal,
                                                          "cmd": "check_difficulty"
                    })
                    .then((response) => {
                        // minimum difficulty is the last mined difficulty
                        if (response.data.acceptable !== "true") {
                            window.alert("Difficulty Must Be Greater Than Or Equal Too Previous Mining Difficulty");
                            axios.post("http://localhost:5000", {
                                                          "cmd": "get_difficulty"
                            })
                            .then((response) => {     
                                this.mineDiff = response.data.miningdifficulty
                            });
                            
                        } else {
                            this.mineDiff = newVal
                            this.blockList[this.blockList.length - 1].difficulty = this.mineDiff                   
                        }
                            
                    });
                } else {
                    window.alert("Difficulty Must Be A Number Greater Than 0");
                    axios.post("http://localhost:5000", {
                                                  "cmd": "get_difficulty"
                    })
                    .then((response) => {             
                        this.mineDiff = response.data.miningdifficulty     
                    });
                }
            }            
        }
        
        private maxMineIter = 10000
        @Watch('maxMineIter')
        iterChanged(newVal: number) {
            if (newVal.toString() !== '') {
                if (newVal > 0) {
                    this.maxMineIter = newVal
                    this.blockList[this.blockList.length - 1].maxIter = this.maxMineIter
                } else {
                    window.alert("Maximum Mining Iterations Must Be A Number Greater Than 0");
                    axios.post("http://localhost:5000", {
                                                  "cmd": "get_max_iter"
                    })
                    .then((response) => {             
                        this.maxMineIter = response.data.miningmaxiter     
                    });
                }
            } else {
                axios.post("http://localhost:5000", {
                                              "cmd": "get_max_iter"
                })
                .then((response) => {             
                    this.maxMineIter = response.data.miningmaxiter     
                });
            }
        }
        
        // check for changes on the child
        onChildBlockChange(bMsg: BlockChangeMessage){
            // make things a little easier, not necessary but unpack arguements into local variables
            const msgIdx = bMsg.idx;
            const msgBlock = bMsg.data;
            
            // get length of BC
            const bcLen = this.blockList.length
            
            // make sure this is not the last element, if so, adjust the parent in the next array slot
            if((bcLen > 0) && (bMsg.idx < bcLen - 1)){
                // adjust parent block relative to changed block
                this.blockList[msgIdx + 1].parent = msgBlock.hash
            }
        }
        
        // create a new block - this block has not yet been mined and is therefore not yet part of the chain
        createNewBlock(){
            if (this.blockList[this.blockList.length - 1].mined === false
                || this.blockList[this.blockList.length - 1].blockcolor === 'danger') return;
            this.blockList.push({ blockid: this.blockList[this.blockList.length - 1].blockid+1,
                                  parent:  this.blockList[this.blockList.length - 1].hash,
                                  hash: "",
                                  dataval: "",
                                  nonce: 0,
                                  timestamp: 0,
                                  mined: false,
                                  difficulty: this.mineDiff,
                                  maxIter: this.maxMineIter,
                                  blockcolor: "primary"                        
            })
        }
        
    }

</script>
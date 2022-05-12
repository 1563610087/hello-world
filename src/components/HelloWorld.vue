<template>
  <div class="hello">
    <div class="hh" id="hh">你的用户名为：{{ name }}</div>
  </div>
</template>

<script>
import {wxLogin,getUsersInfo} from './login'

export default {
  name: "HelloWorld",
  data() {
    return {
      name: ""
    }
    
  },
  created() {
    this.name=sessionStorage.userName
    // this.getInfo()
  },
  methods: {
    getInfo() {
      console.log(2);
      const appid='ww0cc0d3dfd98ddb64'
      // getUsersInfo()
      wxLogin(appid)
    },
  },
  updated() {
    if(sessionStorage.userName){
      this.name=sessionStorage.userName
    }
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  display: flex;
  justify-content: center;
}
.hh {
  border: 1px solid red;
  width: 400px;
  height: 400px;
}
</style>

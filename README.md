# BeetleXjs
`BeetleXjs`是专门针对vuejs特性包装一个webapi访问库，可以让你基于beetlex和vuejs快速地进行应用开发。
## 引用
``` html
    <script src="vue.js"></script>
    <script src="axios.js"></script>
    <script src="beetlex4axios.js"></script>
```
## 示例
``` html
<form class="form-horizontal">
    <div class="form-group  form-group-sm">
        <label for="inputEmail3" class="col-sm-2 control-label">Name</label>
        <div class="col-sm-10">
            <input type="email" class="form-control" v-model="login.data.name" placeholder="name">
        </div>
    </div>
    <div class="form-group  form-group-sm">
        <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
        <div class="col-sm-10">
            <input type="password" class="form-control" v-model="login.data.pwd" placeholder="Password">
        </div>
    </div>

    <div class="form-group  form-group-sm">
        <div class="col-sm-offset-2 col-sm-10">
            <button type="button" @click="login.post()" class="btn btn-default">Sign in</button>
            <label v-if="login.result==true" style="color:forestgreen;">Success</label>
            <label v-if="login.result==false" style="color:red;">Wrong password</label>
        </div>
    </div>
</form>
```
## 相应vuejs代码
``` javascript
var logincmd = new beetlexAction("/Login", { name: '', pwd: '' });
 var page = new Vue({
            el: '#page',
            data: {
                login: logincmd,
            }
     });
```
## 启用websocket访问
``` javascript
beetlex.useWebsocket(); 
```
详细查看`samples`

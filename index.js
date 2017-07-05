// import './css/index.css'
import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'bKh6BzhqmNS5UIRdrg9BCKvo-gzGzoHsz';
var APP_KEY = 'xJiGNTlbP7rieCiDgLcX4wBI';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

var app = new Vue({
    el: '#app',
    data: {
        actionType: 'signup',
        formData: {
            username: '',
            password: ''
        },
        currentUser: null,
        newtodo: '',
        todoList: [],
        classObject: {
            toLeft: false,
            toRight: false
        }
    },
    created: function() {

        this.currentUser = this.getCurrentUser()

        this.fetchTodos()

    },
    methods: {
        addTodo: function() {
            let d = new Date()
            let month = d.getMonth() + 1
            let date = d.getDate()
            let hours = d.getHours()
            let minutes = d.getMinutes()
            month = month > 9 ? month : '0' + month
            date = date > 9 ? date : '0' + date
            hours = hours > 9 ? hours : '0' + hours
            minutes = minutes > 9 ? minutes : '0' + minutes
            this.todoList.push({
                text: this.newtodo,
                createTime: `
                创建时间 ${month}月${date}日 ${hours}:${minutes}
                `,
                isDone: false
            })
            this.newtodo = ''
            this.saveOrUpdateTodos()
        },
        del: function(todo) {
            let index = this.todoList.indexOf(todo)
            this.todoList.splice(index, 1)
            this.saveOrUpdateTodos()
        },
        saveOrUpdateTodos: function() {
            if (this.todoList.id) {
                this.updateTodos()
            } else {
                this.saveTodos()
            }
        },
        saveTodos: function() {
            let dataString = JSON.stringify(this.todoList) //转化为JSON字符串
            var AVTodos = AV.Object.extend('AllTodos');
            var avTodos = new AVTodos(); //创建AVTodos的实例
            var acl = new AV.ACL()
            acl.setReadAccess(AV.User.current(), true) // 只有这个 user 能读
            acl.setWriteAccess(AV.User.current(), true)
            avTodos.set('content', dataString); //将数据存入自定义属性content
            avTodos.setACL(acl) // 设置访问控制
            avTodos.save().then((todo) => {
                    console.log(todo.id + 'aaa')
                    this.todoList.id = todo.id
                    console.log('保存成功');
                },
                function(error) {
                    console.log('保存失败');
                });
        },
        updateTodos: function() {
            console.log(this.todoList.id)
            let dataString = JSON.stringify(this.todoList)
            let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
            avTodos.set('content', dataString)
            avTodos.save().then(() => {
                console.log('更新成功')
            })

        },
        fetchTodos: function() {
            if (this.currentUser) {
                var query = new AV.Query('AllTodos');
                query.find()
                    .then((todos) => {
                        let avAllTodos = todos[0]
                        let id = avAllTodos.id
                        this.todoList = JSON.parse(avAllTodos.attributes.content)
                        this.todoList.id = id
                    }, function(error) {
                        console.error(error)
                    })
            }
        },

        signUp: function() {
            if (this.formData.username === '' && this.formData.password === '') {
                alert('请输入用户名和密码');
                return;
            } else if (this.formData.username === '') {
                alert('请输入用户名');
                return;
            } else if (this.formData.password === '') {
                alert('请输入密码');
                return;
            }
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
                alert('注册成功')
            }, error => {
                alert('该用户名已存在')
            })
        },
        logIn: function() {
            AV.User.logIn(this.formData.username, this.formData.password)
                .then((loginedUser) => {
                    this.currentUser = this.getCurrentUser()
                    this.fetchTodos()
                }, error => {
                    alert('账户或者密码不正确')
                });
            this.fetchTodos()
        },
        logout: function() {
            AV.User.logOut() //登出
            this.currentUser = null
            window.location.reload()
        },
        getCurrentUser: function() {
            let { id, createdAt, attributes: { username } } = AV.User.current()
            return { id, username, createdAt }
        },
        toLeft: function() { //横线往左
            let line = document.getElementsByClassName('line')[0]
            this.classObject.toRight = false
            this.classObject.toLeft = true
                // line.classList.remove('toRight')
                // line.classList.add('toLeft')
        },
        toRight: function() { //横线往右
            let line = document.getElementsByClassName('line')[0]
            this.classObject.toLeft = false
            this.classObject.toRight = true
                // line.classList.remove('toLeft')
                // line.classList.add('toRight')
        }
    }
})
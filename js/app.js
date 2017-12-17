;
(function() {
		// 钩子函数,页面进入就聚焦

	// 注册一个全局自定义指令 `v-focus`
	Vue.directive('focus', {
	  // 当被绑定的元素插入到 DOM 中时……
	  inserted: function (el) {
	    // 聚焦元素
	    el.focus()
	  }
	})

			// 双击哪个指令,则聚焦
		Vue.directive('todo-focus', {
	  // 当被绑定的元素插入到 DOM 中时……
	 update(el,binding){
	 		console.log(binding.val)
	 		if(binding.value){
	 			  // 聚焦元素
	  		  el.focus()

	 		}
	  
	  }
	})


	// const todos = [{
	// 		id: 0,
	// 		title: '吃饭',
	// 		completed: true
	// 	},
	// 	{
	// 		id: 1,
	// 		title: '安全',
	// 		completed: false
	// 	},
	// 	{
	// 		id: 2,
	// 		title: '睡觉',
	// 		completed: false
	// 	}

	// ]
	window.app = new Vue({
		data: {
			todos:JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEditing: null,
			filterText:'all'
			
		},
		computed: {
			//显示所有未完成任务数
			//			计算属性的一大特色,1模板不用太繁杂,2方法不必重复调用
			remazingCount : {
				//用filter方法,返回没有完成的数目
				//filter()方法对数组中的每一项运行给定函数，返回该函数会返回true的项组成的数组。该方法常用于查询符合条件的所有数组项
				get() {
						return this.todos.filter(item => !item.completed).length
					},
					set() {

					}
			},

			//			全选与全不选互相切换
			toggleAllstate: {
				get() {
					return this.todos.every(item => item.completed)
				},
				set() {
					const checked = !this.toggleAllstate
					this.todos.forEach(item => {
						item.completed = checked
					})
				}
			},
			filterTodos(){
				switch(this.filterText){
					case 'active':
					return this.todos.filter(item=>!item.completed)
					break
					case 'completed':
					return this.todos.filter(item=>item.completed)
					break
					default:
					return this.todos
					break
				}
			}
		},
		
		//监视本地存储
		watch:{
			//监视todos的改变,当todos发生改变的时候,做业务制订处理
			todos:{
				//当监视到todos发生改变的时候,会自动调用handle函数
				handler (val,oldval){
					//监视到todos的变化,把todos本次存储记录的状态
					window.localStorage.setItem('todos',JSON.stringify(val))
				},
				deep:true,//深度监视,
			}
			
		},
		
		methods: {
			handleNewKeyDown(e) {
				// console.log(e)
				// 注册回车事件
				// 获取文本框的内容
				// 进行数据校验,数据不能为空
				// 添加数据到列表,添加完成后输入框为空
				const target = e.target
				// trim()函数是去掉String字符串的首尾空格;
				const value = target.value.trim()
				if(!value.length) {
					return
				}
				const todo = this.todos
				todo.push({
					// 判断数据是否为空,如果为空,则id为1,如果不为空,则最后一个数据的id+1
					id: todo.length ? todo[todo.length - 1].id + 1 : 1,
					title: value,
					completed: false
				})
				// 输入框清空
				target.value = ''
			},

			// 标记所有任务完成与未完成
			handleToggleAllChange(e) {
				// console.log('hah')
				// console.log(e)
				//绑定checkbox的change事件
				//获取checkbox的绑定事件
				//2直接循环所有的子任务项的选中状态设置为toggleAll的状态
				var checked = e.target.checked

				this.todos.forEach(item => {
					item.completed = checked
				})
			},

			// 删除列表信息,根据索引值删除
			// splice() 方法通过删除现有元素和/或添加新元素来更改一个数组的内容。
			handleRemoveTodoClick(index, e) {
				console.log(11)
				this.todos.splice(index, 1)
			},

			// 双击label进入编辑模式
			handleEdictingDblClick(todo) {
				// 首先注册双击事件
				// 然后让当前选中的label有编辑的类样式
				// console.log(11)
				this.currentEditing = todo
			},

			// 按回车键保存数据或者失去焦点
			handleSaveKeydownClick(todo, index, e) {
				// console.log(11)
				// 注册按下回车事件
				// 获取编辑文本中的数据
				// 判断数据是否为空
				// 如果空,则删除,不为空则保存
				const target = e.target
				const value = target.value
				if(!value.length) {
					this.todos.splice(index, 1)
				} else {
					todo.title = value
					this.currentEditing = null
				}
			},

			// 输入状态按下esc取消编辑
			handleCancelEditEsc() {
				// 取消编辑,即没有编辑状态的样式
				this.currentEditing = null
			},

			// 清除所有已完成任务
			handleClearAllDone() {
				// 手动控制遍历索引的方式
				// 	for(let i = 0;i<this.todos.length;i++){
				// 		if(this.todos[i].completed){
				// 			this.todos.splice(i,1)
				// 			i--
				// 		}
				// 	}
				// 	
				this.todos = this.todos.filter(t => !t.completed)
			},
			  // 获取剩余的任务数量
      // remazingCount() {
      //   console.log(111)
      //   return this.todos.filter(t => !t.completed).length
      // }

		}
	}).$mount('#app')
	
	//页面初始化的时候调用一次,保持过滤状态
	handlehashchange()
	
//	该事件在页面初始化的时候不会执行,只有change的时候才会执行
	window.onhashchange=handlehashchange
	
	function handlehashchange(){
		app.filterText=window.location.hash.substr(2)
		// console.log(app.filterText)
	}
})()
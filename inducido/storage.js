//inspired by https://gist.github.com/jed/966030 (in http://www.140byt.es)
//definitive list of browsers that support the JSON object look here: http://caniuse.com/json
//pretty much all browsers that really matter in the year 2014+
(function(root) {
var webstore = function(store) {
    return function(k, v) {
        return v === undefined ? store[k] && JSON.parse(store[k]) : store[k] = JSON.stringify(v)
    }
},ls=webstore(root.localStorage || {}), ss=webstore(root.sessionStorage || {})
		
root.storage={ls:ls,ss:ss,l:ls,s:ss,local:ls,session:ss,
remove : function(key) { store.removeItem(key) }
}

}(this));


/*
/ Store 'mickey' at 'username': ls or local or l
storage.ls('username', 'mickey')
storage.local('username', 'mickey')
storage.l('username', 'mickey')

// Get 'username'
value=storage.ls('username')
value=storage.local('username')

Same for SessionStorage:

storage.ss('username', 'mickey')
storage.session('username', 'mickey')
storage.s('username', 'mickey')


// Remove 'username'
storage.remove('username')

// Store an object literal - storage.js uses JSON.stringify under the hood
storage.local('user', { name: 'marcus', age: 11 })

// Get the stored object - storage.js uses JSON.parse under the hood
var user = storage.get('user')
console.log(user)

*/
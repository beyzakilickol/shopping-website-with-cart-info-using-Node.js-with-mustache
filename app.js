const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
var session = require('express-session')
const PORT = 3050
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')
app.use(express.static('css'))
app.use(express.static('js'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'cat',
  resave: false,
  saveUninitialized: false
}))
//------------------------------------------------------------
let authenticateLogin = function(req,res,next) {

  // check if the user is authenticated
  if(req.session.username) {
    next()
  } else {
    res.redirect("/login")
  }

}
app.all("/add_to_cart",authenticateLogin,function(req,res,next){
    next()
})
//--------------------------------------------------------------
let userList = []
app.get("/login",function(req,res){
  res.render("login")
})
app.get("/register",function(req,res){
  res.render("register")
})
app.post('/register',function(req,res){
  let username= req.body.username
  let password = req.body.password
  let user = {username:username, password:password}
  userList.push(user)
  res.redirect('/login')
  console.log(userList)
})
app.get('/products',function(req,res){
  if(req.session && req.session.username){
    let itemCount = userProducts.filter(function(item){
      return item.username == req.session.username
    })
    res.render('products',{productList:products,username:req.session.username, itemCount:itemCount.length})
  }else{
  res.render("products",{productList:products})
}
})
app.post('/login',function(req,res){
  let username= req.body.username
  let password = req.body.password
  let findUser = userList.find(function(user){
    return user.username==username && user.password == password
  })
  if(findUser != null && req.session){
    req.session.username = username
    res.redirect("/products")
  }else{
    res.redirect('/register')
  }

})
app.get('/logout',function(req,res){
  if(req.session && req.session.username){
    req.session.destroy()
    res.redirect("/products")
  } else{
    res.redirect('/products')
  }
})
app.get("/",function(req,res){
  res.redirect("/products")
})
app.get("/products/:brand",function(req,res){
  let brand = req.params.brand
  let filteredProducts = products.filter(function(product){
    return product.brand == brand
  })
  console.log(filteredProducts)
  res.render('products',{productList:filteredProducts})
})
app.get("/add_to_cart",function(req,res){
  let userItems = userProducts.filter(function(item){
    return item.username == req.session.username
  })
  let itemCount = userProducts.filter(function(item){
    return item.username == req.session.username
  })
  let itemPrices =itemCount.map(function(each){
    return each.price
  })
    let a = 0
  for(let i =0;i<itemPrices.length;i++){

    a=a+ itemPrices[i]
  }
  console.log(a)
  res.render('mycart',{itemList:userItems,username:req.session.username, itemCount:itemCount.length,itemTotal:a})
  // res.render("mycart",{itemList:userItems})

})

let userProducts = []
app.post("/add_to_cart", function(req,res){
  let productId = req.body.productId
    let productToAdd = products.find(function(item){
      return item.productId==productId
    })

    productToAdd["username"] = req.session.username
    userProducts.push(productToAdd)
    console.log(userProducts)
    res.redirect('/products')
})

let products = [{ productId : 1, brand: "Apple", name:
"Apple iPhone 8 Plus a1897 64GB Smartphone GSM Unlocked", price: 599.00, shipping:"free", rating: "%98",imageUrl:"https://r3.whistleout.com/public/images/articles/2018/01/i-8.jpg"},{productId :2, brand:"Apple",name:"APPLE MACBOOK PRO 13 / 3.1GHz i5 / 16GB RAM / 1TB SSD HYB / OS-2017 / WARRANTY", price:749.00, shipping:"standard",rating:"%63",imageUrl:"https://www.picclickimg.com/d/w1600/pict/263423305663_/Apple-MacBook-Pro-13-INTEL-Core-i5-PRE-RETINA.jpg"},
{productId:3,brand:"Samsung", name:"Samsung Galaxy S7 Edge 32GB SM-G935 Unlocked GSM 4G LTE Android Smartphone", price:279.99, shipping:"free", rating: "%100", imageUrl:"https://s7d2.scene7.com/is/image/SamsungUS/600_006_Galaxy_S7_bk_Left_Angle?$product-details-jpg$"}

,{productId:4,brand:"Time2", name:"Time2: 10 inch HD Tablet PC, Android 7.0 Nougat, 3G ,Google, 3G, DUAL SIM", price:162.16, shipping:"2-day shipping", rating:"%88", imageUrl:"https://images-na.ssl-images-amazon.com/images/I/61za%2BiR-iPL._SY355_.jpg"}
,
{productId:5, brand:"Samsung",name:"BOSE ON-EAR HEADPHONES CLUB EDITION 715594-0010 BLACK SAMSUNG GALAXY IPHONE IPAD", price:99.95, shipping:"free", rating:"%98", imageUrl:"https://i.ebayimg.com/images/g/ZTkAAOSwKJlbRjV8/s-l225.jpg"}]











app.listen(PORT, function(){
  console.log('Surver is running...')
})

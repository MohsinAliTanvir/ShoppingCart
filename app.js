// GLOBAL VARIABLES
let uniqueID

// Fetching the product list from the API
fetch('https://api.jsonbin.io/b/60d10c3c5ed58625fd162e87')
  .then(response => response.json())
  .then(products => showProducts(products))

// The function used to dispplay products on the screen
showProducts = products => {
  const productsDiv = document.querySelector('#Products')
  products.forEach(product => {
    const productName = document.createElement('h5')
    const productDescription = document.createElement('p')
    const productPrice = document.createElement('p')

    productName.innerText = `Product name : ${product.title}`
    productDescription.innerText = product.description
    productPrice.innerText = `Product price :${product.price}$`

    productsDiv.append(productName)
    productsDiv.append(productDescription)

    const images = product.images
    images.forEach((element) => {
      const productImage = document.createElement('img')
      productImage.src = element
      productsDiv.append(productImage)
    })
    productsDiv.append(productPrice)
    createButton(product)
  })
}

// Creating the add to cart button
function createButton (data) {
  const productsDiv = document.querySelector('#Products')
  const button = document.createElement('button')
  button.innerHTML = 'Add to Cart'
  button.className = 'addCart btn btn-primary'
  productsDiv.append(button)

  button.onclick = function () {
    const count = parseInt(localStorage.getItem('noOfProducts'))
    let id

    // Checking if the product being added is the first one or not
    if (count) {
      uniqueID++
      localStorage.setItem('noOfProducts', count + 1)
      document.querySelector('.cart span').textContent = count + 1
      localStorage.setItem(`Product ${uniqueID}`, JSON.stringify(data))
      id = 'Product ' + uniqueID
      localStorage.setItem('uniqueID', uniqueID)
    } else {
      uniqueID = 0
      localStorage.setItem('noOfProducts', 1)
      document.querySelector('.cart span').textContent = 1
      localStorage.setItem(`Product ${uniqueID}`, JSON.stringify(data))
      id = 'Product ' + uniqueID
      localStorage.setItem('uniqueID', uniqueID)
    }

    // For price
    let price = localStorage.getItem('Price')
    price = parseInt(price)
    if (price) {
      localStorage.setItem('Price', price + parseInt(data.price))
      document.querySelector('.price span').textContent = price + parseInt(data.price)
    } else {
      localStorage.setItem('Price', parseInt(data.price))
      document.querySelector('.price span').textContent = parseInt(data.price)
    }

    // MODAL CONTENT IS HERE
    createContent(id, data)
  }
}

// To ensure cart keeps it state while you reload
function onLoadCartState () {
  const count = localStorage.getItem('noOfProducts')
  const price = localStorage.getItem('Price')
  if (count) {
    document.querySelector('.cart span').textContent = count
    document.querySelector('.price span').textContent = price
  } else {
    uniqueID = 0
  }
  uniqueID = localStorage.getItem('uniqueID')

  for (let i = 0; i <= uniqueID; i++) {
    const data = JSON.parse(localStorage.getItem(`Product ${i}`))

    if (data !== null) {
      const id = 'Product ' + i
      createContent(id, data)
    }
  }
}

function createDeleteButton (name) {
  const productDiv = document.getElementById(name)
  const button = document.createElement('button')
  button.innerHTML = 'X'
  button.className = 'btn btn-danger delete-button'

  productDiv.append(button)

  button.onclick = function () {
    document.getElementById(name).remove()

    const data = JSON.parse(localStorage.getItem(name))
    const price = parseInt(localStorage.getItem('Price'))
    const count = parseInt(localStorage.getItem('noOfProducts'))

    const labelVal = localStorage.getItem(name + 'labelValue')
    if (labelVal !== null) {
      localStorage.setItem('Price', price - parseInt(labelVal))
      document.querySelector('.price span').textContent = price - parseInt(labelVal)
    } else {
      localStorage.setItem('Price', price - parseInt(data.price))
      document.querySelector('.price span').textContent = price - parseInt(data.price)
    }

    document.querySelector('.cart span').textContent = count - 1
    localStorage.setItem('noOfProducts', count - 1)
    localStorage.removeItem(name)
    localStorage.removeItem(name + 'labelValue')
    localStorage.removeItem(name + 'number')
  }
}

// CLEAR CART
document.querySelector('.clear-cart').onclick = function () {
  document.getElementById('modal-values').remove()
  localStorage.clear()
  document.querySelector('.cart span').textContent = 0
  document.querySelector('.price span').textContent = 0

  // Creating the div again for next addition
  const modalDiv = document.createElement('div')
  modalDiv.className = 'modal-values'
  modalDiv.id = 'modal-values'
  const mainModal = document.querySelector('.modal-body')
  mainModal.append(modalDiv)
}

// Creating the quanitity increase and decrease option
function createQuantityform (name, data) {
  const productDiv = document.getElementById(name)
  const form = document.createElement('form')
  form.className = 'quantity'
  const label = document.createElement('label')
  const result = document.createElement('label')

  label.innerHTML = 'Current Product price: $'
  label.className = 'changingLabel'

  const price = parseInt(data.price)
  result.id = name + 'label'
  result.className = 'result'

  const num = document.createElement('input')
  num.type = 'number'
  num.id = name + 'number'
  num.className = 'value'
  num.disabled = true

  const count = localStorage.getItem('noOfProducts')
  const val = parseInt(localStorage.getItem(name + 'labelValue'))
  if (count && !isNaN(val)) {
    num.value = parseInt(localStorage.getItem(name + 'number'))
    result.innerHTML = val
  } else {
    num.value = 1
    result.innerHTML = price
  }

  const btn1 = document.createElement('button')
  btn1.innerHTML = '-'
  btn1.type = 'button'
  btn1.className = 'btn btn-outline-secondary btn-sm'
  btn1.onclick = function () {
    let value = parseInt(document.getElementById(name + 'number').value)
    value--
    if (value > 0) {
      let TotalPrice = parseInt(localStorage.getItem('Price'))
      document.getElementById(name + 'number').value = value
      result.innerHTML = price * value
      localStorage.setItem(name + 'labelValue', (price * value))
      localStorage.setItem(name + 'number', value)
      TotalPrice = TotalPrice - price
      localStorage.setItem('Price', TotalPrice)
      document.querySelector('.price span').textContent = TotalPrice
    }
  }

  const btn2 = document.createElement('button')
  btn2.innerHTML = '+'
  btn2.type = 'button'
  btn2.className = 'btn btn-outline-secondary btn-sm'
  btn2.onclick = function () {
    let value = parseInt(document.getElementById(name + 'number').value)
    value++
    if (value > 0) {
      let TotalPrice = parseInt(localStorage.getItem('Price'))
      document.getElementById(name + 'number').value = value
      result.innerHTML = price * value
      localStorage.setItem(name + 'labelValue', (price * value))
      localStorage.setItem(name + 'number', value)
      TotalPrice = TotalPrice + price
      localStorage.setItem('Price', TotalPrice)
      document.querySelector('.price span').textContent = TotalPrice
    }
  }
  productDiv.append(label, result)
  form.append(btn1, num, btn2)
  productDiv.append(form)
}

// For creating the modal content
function createContent (name, data) {
  const productDiv = document.createElement('div')
  productDiv.id = name
  const modalDiv = document.querySelector('.modal-values')
  const productName = document.createElement('h6')
  const productPrice = document.createElement('p')

  productPrice.className = 'product-price'
  productName.innerText = `Product name : ${data.title}`
  productPrice.innerText = `Product price : $ ${data.price}`

  productDiv.append(productName)
  productDiv.append(productPrice)
  modalDiv.append(productDiv)

  createDeleteButton(productDiv.id)
  createQuantityform(productDiv.id, data)
}

// Calling all the initial functions
onLoadCartState()

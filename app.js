// GLOBAL VARIABLES
let start = 0
let end = 8
let currentPage = 1
let productArray = []
let productCount = 0

// --------------------------- INITIALISING -------------------------------------------
// Fetching the product list from the API
getProducts('https://api.jsonbin.io/b/60d10c3c5ed58625fd162e87')
let products = JSON.parse(localStorage.getItem('data'))

showProducts(products, start, end)
onLoadCartState()
// -----------------------------------------------------------------------------------------

// --------------------------- PRODUCT FETCH AND DISPLAY FUNCTIONS --------------------------
// Fetching the products
async function getProducts (url) {
  let response = await fetch(url)
  response = await response.json()
  localStorage.setItem('data', JSON.stringify(response))
}

// The function used to display products on the screen
function showProducts (products, start, end) {
  const productsDiv = document.querySelector('#Products')
  let prodID = 1

  for (let i = start; i <= end; i++) {
    const div1 = document.createElement('div')
    div1.className = 'col-md-6 col-lg-4'
    div1.id = 'div-1' + prodID

    const div2 = document.createElement('div')
    div2.className = 'panel panel-default'
    div2.id = 'div-2' + prodID

    const div3 = document.createElement('div')
    div3.className = 'panel-body'
    div3.id = 'div-3' + prodID

    prodID++

    const images = products[i].images
    const productImage = document.createElement('img')
    productImage.src = images[0]
    div3.append(productImage)

    const productName = document.createElement('h6')
    const productPrice = document.createElement('p')
    const button = document.createElement('button')
    button.innerHTML = 'Add to Cart'
    button.className = 'addCart btn btn-primary'
    button.onclick = addToCart

    productName.innerText = `Product name : ${products[i].title}`
    productPrice.innerText = `Product price : $${products[i].price}`

    div3.append(productName)
    div3.append(productPrice)
    div3.append(button)
    div2.append(div3)
    div1.append(div2)
    productsDiv.append(div1)

    // Storing the index of the product in main data array
    localStorage.setItem(div3.id, i)
  }
}
// Function for add to cart buttom
function addToCart (e) {
  const id = e.target.parentElement.id
  const index = parseInt(localStorage.getItem(id))
  productArray[productCount] = products[index]
  localStorage.setItem('productArray', JSON.stringify(productArray)) // Saving productArray in localstorage for the onload cart state
  increaseTotalPrice(parseInt(products[index].price))
  increaseCartCount()
  productCount++
}

// -------------------------------------------------------------------------------

// -------------------------- ONLOAD CART STATE FUNCTION--------------------------
function onLoadCartState () {
  const count = parseInt(localStorage.getItem('noOfProducts'))
  const price = parseInt(localStorage.getItem('Price'))
  const dataProducts = JSON.parse(localStorage.getItem('productArray'))
  if (count) {
    document.querySelector('.cart span').textContent = count
    document.querySelector('.price span').textContent = price
    for (let i = 0; i < dataProducts.length; i++) {
      productArray[i] = dataProducts[i]
    }
    createModalContent()
  }
}
// -----------------------------------------------------------------------------
// -------------------------- CLEAR CART FUNCTION ------------------------------
// CLEAR CART
document.querySelector('.clear-cart').onclick = function () {
  document.getElementById('modal-values').remove()

  // Saving data before clearing for next times
  products = JSON.parse(localStorage.getItem('data'))
  const end = parseInt(localStorage.getItem('div-39'))
  localStorage.clear()
  localStorage.setItem('data', JSON.stringify(products))
  document.querySelector('.cart span').textContent = 0
  document.querySelector('.price span').textContent = 0

  createIndex(end)
  productCount = 0
  productArray = []

  // Creating the div again for next addition
  const modalDiv = document.createElement('div')
  modalDiv.className = 'modal-values'
  modalDiv.id = 'modal-values'
  const mainModal = document.querySelector('.modal-body')
  mainModal.append(modalDiv)
}
// --------------------------------------------------------------------------------

// -------------------------- CART MODAL CONTENT------------------------------
// For creating the modal content
function createModalContent () {
  const modalDiv = document.querySelector('.modal-values')
  modalDiv.innerHTML = ''
  for (let i = 0; i < productArray.length; i++) {
    if (productArray[i] !== '') {
      const productDiv = document.createElement('div')
      productDiv.id = 'product' + i
      const productName = document.createElement('h6')
      const productPrice = document.createElement('p')

      productPrice.className = 'product-price'
      productName.innerText = `Product name : ${productArray[i].title}`
      productPrice.innerText = `Product price : $ ${productArray[i].price}`

      productDiv.append(productName)
      productDiv.append(productPrice)
      modalDiv.append(productDiv)

      // Storing the data array with its div ID in local storage
      localStorage.setItem(productDiv.id, JSON.stringify(productArray[i]))
      localStorage.setItem(productDiv.id + 'prodIndex', i)

      createDeleteButton(productDiv.id)
      createQuantityForm(productDiv.id)
    }
  }
}

// Creating the delete button
function createDeleteButton (name) {
  const productDiv = document.getElementById(name)
  const button = document.createElement('button')
  button.innerHTML = 'X'
  button.className = 'btn btn-danger delete-button'
  button.onclick = deleteFunction
  productDiv.append(button)
}

// Implementing the delete button fucntionality
function deleteFunction (e) {
  const id = e.target.parentElement.id

  // Removing product from productArray as well
  const prodIndex = parseInt(localStorage.getItem(id + 'prodIndex'))
  productArray[prodIndex] = ''
  localStorage.setItem('productArray', JSON.stringify(productArray))

  const data = JSON.parse(localStorage.getItem(id))

  const count = parseInt(document.getElementById(id + 'number').value)
  for (let i = 1; i <= count; i++) {
    decreaseTotalPrice(parseInt(data.price))
    decreaseCartCount()
  }
  // Removing total div
  document.getElementById(id).remove()
}
// -------------------------------------------------------------------------------------

// -------------------------- CART COUNT AND TOTAL PRICE INCREASE & DECREASE --------------
// Implementing decrease total price functionlaity
function decreaseTotalPrice (currentPrice) {
  const price = parseInt(localStorage.getItem('Price'))
  localStorage.setItem('Price', price - currentPrice)
  document.querySelector('.price span').textContent = price - currentPrice
}

// Implementing increase total price functionlaity
function increaseTotalPrice (currentPrice) {
  const price = parseInt(localStorage.getItem('Price'))
  if (price) {
    localStorage.setItem('Price', price + currentPrice)
    document.querySelector('.price span').textContent = price + currentPrice
  } else {
    localStorage.setItem('Price', parseInt(currentPrice))
    document.querySelector('.price span').textContent = currentPrice
  }
}
// Increase total count function
function increaseCartCount () {
  const count = parseInt(localStorage.getItem('noOfProducts'))
  if (count) {
    localStorage.setItem('noOfProducts', count + 1)
    document.querySelector('.cart span').textContent = count + 1
  } else {
    localStorage.setItem('noOfProducts', 1)
    document.querySelector('.cart span').textContent = 1
  }
}

// Decrease total count function
function decreaseCartCount () {
  const count = parseInt(localStorage.getItem('noOfProducts'))
  localStorage.setItem('noOfProducts', count - 1)
  document.querySelector('.cart span').textContent = count - 1
}
// ---------------------------------------------------------------------------------------------------

// -------------------------- QUANTITY INCREASE AND DECREASE FORM ------------------------------

// Creating the quantity form
function createQuantityForm (name) {
  const productDiv = document.getElementById(name)
  const form = document.createElement('form')
  form.className = 'quantity'
  const label = document.createElement('label')
  const result = document.createElement('label')

  label.innerHTML = 'Current Product price: $'
  label.className = 'changingLabel'

  result.id = name + 'label'
  result.className = 'result'

  const num = document.createElement('input')
  num.type = 'number'
  num.id = name + 'number'
  num.className = 'value'
  num.disabled = true

  // Checking for the onload cart state
  const count = parseInt(localStorage.getItem('noOfProducts'))
  const currentPrice = parseInt(localStorage.getItem(name + 'currentPrice'))
  if (count && !isNaN(currentPrice)) {
    num.value = parseInt(localStorage.getItem(name + 'value'))
    result.innerHTML = currentPrice
  } else {
    result.innerHTML = parseInt(JSON.parse(localStorage.getItem(name)).price)
    num.value = 1
  }

  const btn1 = document.createElement('button')
  btn1.innerHTML = '-'
  btn1.type = 'button'
  btn1.className = 'btn btn-outline-secondary btn-sm'
  btn1.onclick = minusButton

  const btn2 = document.createElement('button')
  btn2.innerHTML = '+'
  btn2.type = 'button'
  btn2.className = 'btn btn-outline-secondary btn-sm'
  btn2.onclick = plusButton

  productDiv.append(label, result)
  form.append(btn1, num, btn2)
  productDiv.append(form)
}

// Function for the minus button
function minusButton (e) {
  const id = e.target.parentElement.parentElement.id
  let value = parseInt(document.getElementById(id + 'number').value)
  value--
  if (value > 0) {
    const price = parseInt(JSON.parse(localStorage.getItem(id)).price)
    document.getElementById(id + 'number').value = value
    document.getElementById(id + 'label').innerHTML = value * price

    // Saving value of the quantity and the current product price for onload
    localStorage.setItem(id + 'value', value)
    localStorage.setItem(id + 'currentPrice', value * price)

    decreaseTotalPrice(parseInt(price)) // For total price
    decreaseCartCount() // For total count
  }
}
// Function for plus button
function plusButton (e) {
  const id = e.target.parentElement.parentElement.id
  let value = parseInt(document.getElementById(id + 'number').value)
  value++
  if (value > 0) {
    const price = parseInt(JSON.parse(localStorage.getItem(id)).price)
    document.getElementById(id + 'number').value = value
    document.getElementById(id + 'label').innerHTML = value * price

    // Saving value of the quantity and the current product price for onload
    localStorage.setItem(id + 'value', value)
    localStorage.setItem(id + 'currentPrice', value * price)

    increaseTotalPrice(price) // For total price
    increaseCartCount() // For total count
  }
}
// --------------------------------------------------------------------------------------

// ----------------------------------- PAGINATION ----------------------------------------
// Forward function for Pagintation
function pageForward () {
  if (currentPage < 19) {
    start = start + 8
    end = end + 8
    currentPage++
    const productsDiv = document.querySelector('#Products')
    productsDiv.innerHTML = ''
    document.getElementById('pageBack').className = 'page-item'
    showProducts(products, start, end)
  } else {
    document.getElementById('pageForward').className = 'page-item disabled'
  }
}

// Backward function for Pagintation
function pageBack () {
  if (currentPage > 1) {
    start = start - 8
    end = end - 8
    currentPage--
    const productsDiv = document.querySelector('#Products')
    productsDiv.innerHTML = ''
    document.getElementById('pageForward').className = 'page-item'
    showProducts(products, start, end)
  } else {
    document.getElementById('pageBack').className = 'page-item disabled'
  }
}
// ------------------------- MISC ------------------------
// For creating indexes after clear cart function
function createIndex (end) {
  let j = 1
  for (let i = end - 8; i <= end; i++) {
    localStorage.setItem('div-3' + j, i)
    j++
  }
}
// ----------------------------------------------------------

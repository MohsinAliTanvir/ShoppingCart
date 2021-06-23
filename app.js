fetch('https://api.jsonbin.io/b/60d10c3c5ed58625fd162e87')
.then(response => response.json())
.then(products => showProducts(products));


showProducts=products =>{

    const productsDiv=document.querySelector('#Products');
    products.forEach(product =>{
        const productName=document.createElement('p');
        const productDescription=document.createElement('p');
        const productPrice=document.createElement('p');
        
        
        productName.innerText=`Product name : ${product.title}`;
        productDescription.innerText=product.description;
        productPrice.innerText=`Product price :${product.price}$`


        
        //console.log(product.title)
        productsDiv.append(productName);
        productsDiv.append(productDescription);
        

        let images=product.images;
        images.forEach((element,index) => {
            let productImage=document.createElement('img');
            productImage.src=element;
           // console.log(element)
            //console.log(index)
            productsDiv.append(productImage);


        });
        productsDiv.append(productPrice); 
        createButton(product);
    });
}
//console.log(product.title)

function createButton(data){
    const productsDiv=document.querySelector('#Products');
    let button=document.createElement('button')
        button.innerHTML='Add to Cart'
        button.className="addCart btn btn-primary"
        productsDiv.append(button);
        
        button.onclick = function(){
            let count= localStorage.getItem('noOfProducts');
            count=parseInt(count);
            if(count){
                localStorage.setItem('noOfProducts',count+1);
                document.querySelector('.cart span').textContent=count+1;
            }
            else{
                localStorage.setItem('noOfProducts',1);
                document.querySelector('.cart span').textContent=1;
            }
            

            // For price
            let price= localStorage.getItem('Price');
            price=parseInt(price);
            if(price){
                localStorage.setItem('Price',price+ parseInt(data.price));
                document.querySelector('.price span').textContent=price+ parseInt(data.price);
                console.log(typeof price)
                console.log(typeof data.price)
                
            }
            else{
                localStorage.setItem('Price',parseInt(data.price));
                console.log(typeof price)
                console.log(typeof data.price)
                document.querySelector('.price span').textContent=parseInt(data.price);
            }
            

        
}

// To ensure cart keeps it state while you reload
function onLoadCartState(){
    let count= localStorage.getItem('noOfProducts');
    let price= localStorage.getItem('Price');
    if(count)
    {document.querySelector('.cart span').textContent=count;
    document.querySelector('.price span').textContent=price;
}

    
}

// Calling all rhe initial functions
onLoadCartState();

//let carts=document.querySelectorAll('.addCart');
//console.log(carts.length);
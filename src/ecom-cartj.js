let label = document.getElementById("label")
let shoppingCart = document.getElementById("shopping-cart");

let basket = JSON.parse(localStorage.getItem("data")) || [];/**to store the selected itms */

let calculation = () => { /**it runs when ever update func run */
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x,y)=> x + y, 0);/**2 values x and y, one of them is previous quantity value and one is the next one, taki previous me *,- kr ske */
    /**ab ye cart vale icon me upar live +,- hote dikega */
}

calculation(); /**yha pe call kerke hume ab cart me hmri selected quantity refresh hone ke baad bhi dekhegi */

let generateCartItems = () => {
    if(basket.length !== 0) {
       return (shoppingCart.innerHTML = basket.map((x) =>{/**yha pe x har ek item ko target krega 1 by 1 jo basket me h, aur jitne honge basket me vo saare aa jynge*/
       let {id, item} = x;
       let search = shopItemsData.find((y) => y.id === id) || [];
       return `
        <div class="cart-item">
          <img width="100" src=${search.img} alt="" />
          <div class="details">

            <div class="title-price-x">
              <h4 class="title-price">
                <p>${search.name}</p>
                <p class="cart-item-price">₹ ${search.price}</p>
              </h4>
              <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
            </div>

            <div class="buttons">
                <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                <div id=${id} class="quantity">${item}</div> 
                   <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
             </div>

            <h3>₹ ${item * search.price}</h3>
          </div>   
        </div>

        `;
       }).join(""));
    } else {
      shoppingCart.innerHTML = ``
      label.innerHTML = `
      <h2>Cart is Empty</h2>
      <a href="ecommindex.html">
      <button class="HomeBtn">Back to Home</button>
      </a>
      `; 
    }
}

generateCartItems();

let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
/**yha pe hum find use krnge ki agr same id ka item h to usme hi inc ya dec ho i.e bss item ki quantity badhe. */
    if (search === undefined) {
        basket.push({
            id: selectedItem.id,
            item: 1,
        });/*yha jo bhi hum *,- krnge vo basket me id aur itrm ke sath jake save hoga */
    } else {
        search.item += 1; /**agr same item h to bss add hojana h */
    }
    
    // console.log(basket);
    generateCartItems();/**imp h ye bht, iski vjh se cart me bhi +,- krne me price dikhta h as per item quantity */

    update(selectedItem.id);/**kyuki incr ho ya decre tabhi hume update kr dena h */
    
    localStorage.setItem("data", JSON.stringify(basket));/**name data ek key ki trh kaam krra h, key ka naam kch bhi de skte h..yha pe isliye kiya  taki page refresh ho to hamari cart pe koi asar na pade... localstorage ye inbuild browers storage h */
};

let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
/**yha pe hum find use krnge ki agr same id ka item h to usme hi inc ya dec ho i.e bss item ki quantity badhe. */
   
    if(search === undefined) return /**cart jb empty h aur hum - icon me click kiya to error aara tha, isliye ye line add kiya */
    else if (search.item === 0) return;
      else {
        search.item -= 1; /**agr same item h to bss add hojana h */
    }
    
    update(selectedItem.id);/**ye isliye basket ke upar taaki js ko pta chle ki koi item 0 h to vo local me sote na ho aur ye cheez update bhi ho jaye */

    basket = basket.filter((x) => x.item !== 0);/**ye isliye taaki jo item 0 ho usko local storage me rkhne ka koi fayda nhi */
    // console.log(basket);
     
    generateCartItems();/**yha pe cart me -jb krre the to jb quantity 0 hogi to vo apne aap hat jayega */

    localStorage.setItem("data", JSON.stringify(basket));/**YHA pe isko use krke incr, decre me jo hga vo local me save ho jayega, ab hume ye local se retreive krna h taaki jab page fresh kare to cart khali na ho jaye */
};

let update = (id) => { /**to give live update of quantity of items, also it is running every time we click * or - */
    let search = basket.find((x) => x.id === id);
    document.getElementById(id).innerHTML = search.item;
   
    calculation();
    totalAmount();/**bill amount update karta rahega */
};


let removeItem = (id) => {
    let selectedItem = id;
   
    basket = basket.filter((x) => x.id !== selectedItem.id);
    generateCartItems();/**yhe pe re render kiya ab x button cart me dabane se item bhi chla jayega */
    totalAmount();/**agr hum remove kardenge cross dabake tab pura amnt vo bill se kat jyga */
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));/*upar vali line remove krke local storage me bhi udate kr dgi pr abhi bhi cart se item remove nhi hoga isliye aur code add krnge*/
};

let clearCart = () => {
    basket = []
    generateCartItems();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));
}

let totalAmount = () => {
    if (basket.length !== 0) {
    let amount = basket.map((x) => {
      let {item, id} = x;
      let search = shopItemsData.find((y) => y.id === id) || [];
      return  item * search.price;
    }).reduce((x,y) => x + y, 0); /**ye total sum karke dega bill ka */
  
    label.innerHTML = `
    <h2>Total Bill :₹ ${amount}</h2>
    <button class="checkout">Checkout</button>
    <button onclick="clearCart()" class="removeAll">Clear Cart</button>
    `;
   } else return ;
};

totalAmount();
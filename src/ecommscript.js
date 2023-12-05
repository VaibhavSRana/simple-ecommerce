let shopEl = document.getElementById("shop");
/*we do not want to repeat ourself so from html we do the work in js */



let basket = JSON.parse(localStorage.getItem("data")) || [];/**to store the selected itms */
/**upar hmne yhape agr humnwe kucg selec kiya item to vo page refresh me na hate OR agr nhi kiya h select to cart empty rahe */

let generateShop = () => {
    if (!shopEl) {
        console.log("Element with id 'shop' not found.");
        return;
    }

    return (shop.innerHTML = shopItemsData.map((x) => {
        let {id, name, price, description, img} = x; /*yha pe x. babr bar use krna paddd rha to ab hum yha pr destructuribg kar rhe h */
        let search = basket.find((x) => x.id === id) || [];/** ye reflect krega quantity pe in page itself...if we find something with id return it OR empty array */
        return `
        <div id=product-id-${id} class="item">
             <img width="220" src=${img} alt="">
            <div class="details">
                <h3>${name}</h3>
                <p>${description}</p>
                <div class="price-quantity">
                    <h2>₹ ${price}</h2>
                    <div class="buttons">
                        <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                        <div id=${id} class="quantity">
                        ${search.item === undefined? 0: search.item}
                        </div> 
                        <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        `; /*quantity me id isliye dala taaki jb iten quantity + ya - kre to vhi item target ho koi aur nahi */
    }).join("")); /*join removes the , from between the carts */
};/*onclick 'i' vale  me isliye kiya taki specificaly hum bta sake kis id me * - hona h, id as argument dena jaruri h */

generateShop();

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

    localStorage.setItem("data", JSON.stringify(basket));/**YHA pe isko use krke incr, decre me jo hga vo local me save ho jayega, ab hume ye local se retreive krna h taaki jab page fresh kare to cart khali na ho jaye */
};
let update = (id) => { /**to give live update of quantity of items, also it is running every time we click * or - */
    let search = basket.find((x) => x.id === id);
    document.getElementById(id).innerHTML = search.item;
   
    calculation();
};

let calculation = () => { /**it runs when ever update func run */
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x,y)=> x + y, 0);/**2 values x and y, one of them is previous quantity value and one is the next one, taki previous me *,- kr ske */
    /**ab ye cart vale icon me upar live +,- hote dikega */
}

calculation(); /**yha pe call kerke hume ab cart me hmri selected quantity refresh hone ke baad bhi dekhegi */


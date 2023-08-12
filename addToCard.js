import {
    finder,
    constants,
    tryFindElement,
    logger,
    createDomNode,
    sessionStore,
    maltinaBasket
} from "./shared.js";

function createAddToCardButton(buyButtonContainer){
    const template = `<button class="${'maltinaTextElement maltinaButton ' + (window.isTrendyolMobile?'isMobile':'') }"><label>افزودن به سبد خرید</label><label><span class="productPrice">${sessionStore.store.price.value}</span><em>تومان</em></label></button>`;
    const element = createDomNode(template);
    element.addEventListener("click",function (){
        const modal = finder().getElement("#addToBasketModal","add to basket modal");
        if (modal){
            modal.style.display = "block";
            setTimeout(()=>{
                const input = document.querySelector(constants.PRODUCT_WEIGHT_INPUT);
                input.focus();
                input.select();
            },1000);
        }
    });

    buyButtonContainer.insertBefore(element, buyButtonContainer.children[1]);
}
function createWeightMessage(buyButtonContainer){
    const template = `<div class="${'maltinaTextElement weightMessage '+ (window.isTrendyolMobile?'isMobile':'')}"> وزن کالا بصورت <strong>پیش‌فرض ۵۰۰ گرم</strong> محاسبه شده است که در صورت نیاز میتوانید در مرحله بعد تغییر دهید. </div>`
    const element = createDomNode(template);
    const parent = buyButtonContainer.parentElement;
    const index = Array.prototype.indexOf.call(buyButtonContainer.parentNode.childNodes, buyButtonContainer);
    parent.insertBefore(element, parent.children[index+1]);
}
window.calculateNewPrice =  async function (weight){
    if (!weight){
        const productWeightInput = weight || finder().getElement(constants.PRODUCT_WEIGHT_INPUT,"product weight input");
        weight = productWeightInput? Number(productWeightInput.value):0;
    }
    if (weight<50 || weight>999999){
        alert("وزن وارد شده خارج از رنج می باشد...");
        return;
    }
    sessionStore.store.weight.value= weight;
    const resp = await fetch(constants.CALCULATE_COST_API,{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            'Accept':"application/json"
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify({
            country:sessionStore.store.country.value,
            price:sessionStore.store.mainPrice.value,
            weight:sessionStore.store.weight.value
        })
    });
    console.log("resp...",resp);
    const {amount} = await resp.json();
    if (amount){
        sessionStore.change("price",amount.toLocaleString());
    }
}
window.addToBasket= function (){
    //add new product to list....
    const productName = window.location.pathname;
    maltinaBasket().addToBasket(productName);
    sessionStore.change("basketCount",maltinaBasket().getCount());
}
function createAddToBasketModal(){
    const template =
        `<section id="addToBasketModal" class="${'maltinaModal '+(window.isTrendyolMobile?'isMobile':'')}">         
            <div class="${'modalContent '+(window.isTrendyolMobile?'isMobile':'')}">
             <span class="modalClose" onclick="document.querySelector('#addToBasketModal').style.display='none'">&times;</span>
             <header>
                <h3>افزودن به سبد خرید</h3>
                <img src="https://nasermaltina.github.io/trendyol/assets/turkey.svg" alt="country"/>
            </header>
            <main>
                <article>این محصول با وزن پیش فرض ۵۰۰ گرم محاسبه شده و پس از رسیدن به دفتر ایران وزن‌کشی میشود و ممکن است قیمت آن کمتر یا بیشتر شود.
                اگر وزن محصول را میدانید آنرا وارد و دکمه محاسبه قیمت را بزنید.</article>
                <section class="calculatePriceSection">
                    <div><input type="number" name="productWeight" id=${constants.PRODUCT_WEIGHT_INPUT.replace("#","")} 
                        value="${sessionStore.store.weight.value}"/><span>گرم</span></div>
                    <button onclick="calculateNewPrice()">محاسبه قیمت</button>
                </section>
                <section class="totalPrice">
                    <strong class="productPrice">${sessionStore.store.price.value}</strong>
                    <span>تومان</span>
                </section>
                <section class="addToBasketButtonContainer">
                    <button onclick="addToBasket()">
                    افزودن به سبد خرید
                    </button>
                </section>
                <section class="buyGuideSection">
                    <a href="https://malltina.com/purchase-guide/turkey" target="_blank"><span>راهنمای خرید از ترکیه</span> </a>
                </section>
            </main>
            </div>
    </section>`;
    const element = createDomNode(template);
    document.body.appendChild(element);
}
function addToCard () {
    console.log("step2: loader Works....");
    const detailApp = tryFindElement(document,constants.PRODUCT_DETAIL_APP);
    if (detailApp){
        const pricesBox = finder(detailApp).find(constants.PRICE_BOX, "prices box");

        const originalPrice = pricesBox.getElement(constants.ORIGINAL_PRICE, "original price");
        const descPrice = pricesBox.getElement(constants.DISCOUNT_PRICE, "discount price");
        if (!originalPrice && !descPrice){
            logger("add to card stopped, because no price found...","warning");
            return;
        }
        const buyButtonContainer = finder(detailApp).getElement(constants.BUY_BUTTON_CONTAINER, "buy button container");
        if (!buyButtonContainer){
            logger("add to card stopped, because add to basket button not found...","warning");
            return;
        }
        //hideElement(constants.ADD_TO_BASKET_BUTTON,buyButtonContainer);
        const price = descPrice?.textContent || originalPrice?.textContent || "0";
        sessionStore.store.mainPrice.value = price.replace(/[^0-9.]/g,"");
        createAddToCardButton(buyButtonContainer);
        createWeightMessage(buyButtonContainer);
        createAddToBasketModal();
        calculateNewPrice(500).then();
    }
}

export default addToCard;


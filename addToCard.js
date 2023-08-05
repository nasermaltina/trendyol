import {finder,constants,hideElement,logger,createDomNode,storeManager} from "./shared.js";

const sessionStore= storeManager({
    country: {
        elements: '',
        value: 'turkey',
    },
    weight: {
        elements: '#productWeightInput',
        value: "500",
    },
    price: {
        elements: '.productPrice',
        value: "0",
    }
});
function createAddToCardButton(buyButtonContainer){
    const template = `<button class="maltinaTextElement maltinaButton"><span>افزودن به سبد خرید</span><span class="productPrice">${sessionStore.store.price.value}</span</button>`;
    const element = createDomNode(template);
    element.addEventListener("click",function (){
        const modal = finder().getElement("#addToBasketModal","add to basket modal");
        if (modal){
            modal.style.display = "block";
        }
    });
    buyButtonContainer.insertBefore(element, buyButtonContainer.children[1]);
}
function createWeightMessage(buyButtonContainer){
    const template = `<div class="maltinaTextElement weightMessage"> وزن کالا بصورت <strong>پیش‌فرض ۵۰۰ گرم</strong> محاسبه شده است که در صورت نیاز میتوانید در مرحله بعد تغییر دهید. </div>`
    const element = createDomNode(template);
    const parent = buyButtonContainer.parentElement;
    const index = Array.prototype.indexOf.call(buyButtonContainer.parentNode.childNodes, buyButtonContainer);
    parent.insertBefore(element, parent.children[index+1]);
}
window.calculateNewPrice =  async function (){
    const productWeightInput = finder().getElement(constants.PRODUCT_WEIGHT_INPUT,"product weight input");
    if (productWeightInput){
        const value = Number(productWeightInput.value);
        if (value<500 || value>999999){
            alert("out of range...");
            return;
        }
        const resp = await fetch(constants.CALCULATE_COST_API,{
            method:"POST",
            body:{
                country:sessionStore.store.country.value,
                price:sessionStore.store.price.value,
                weight:sessionStore.store.weight.value
            }
        });
        console.log("resp...",resp);
    }
}
function createAddToBasketModal(){
    const template =
        `<section id="addToBasketModal" class="maltinaModal">         
            <div class="modalContent">
             <span class="modalClose" onclick="document.querySelector('#addToBasketModal').style.display='none'">&times;</span>
             <header>
                <h3>افزودن به سبد خرید</h3>
                <img src="https://cdn.jsdelivr.net/gh/nasermaltina/trendyol/turkey2.svg" alt="country"/>
            </header>
            <main>
                <article>این محصول با وزن پیش فرض ۵۰۰ گرم محاسبه شده و پس از رسیدن به دفتر ایران وزن‌کشی میشود و ممکن است قیمت آن کمتر یا بیشتر شود.
                اگر وزن محصول را میدانید آنرا وارد و دکمه محاسبه قیمت را بزنید.</article>
                <section class="calculatePriceSection">
                    <strong><input type="number" name="productWeight" id=${constants.PRODUCT_WEIGHT_INPUT} 
                        value="${sessionStore.store.weight.value}"/><span>گرم</span></strong>
                    <button onclick="calculateNewPrice()">محاسبه قیمت</button>
                </section>
                <section class="totalPrice">
                    <strong class="productPrice">${sessionStore.store.price.value}</strong>
                    <span>تومان</span>
                </section>
                <section class="addToBasketButtonContainer">
                    <button>
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
    const detailApp = document.querySelector(constants.PRODUCT_DETAIL_APP);
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
        hideElement(constants.ADD_TO_BASKET_BUTTON,buyButtonContainer);
        const price = descPrice?.textContent || originalPrice?.textContent || "0";
        sessionStore.price = price.replace(/[^0-9.]/g,"");
        createAddToCardButton(buyButtonContainer);
        createWeightMessage(buyButtonContainer);
        createAddToBasketModal();
    }
}

export default addToCard;


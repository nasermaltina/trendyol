import {finder,constants,hideElement,logger,createDomNode} from "./shared.js";

function addToCardAction(price){
    alert("add to maltina button clicked " + price);
}
function createAddToCardButton(buyButtonContainer, price){
    const template = `<button class="maltinaTextElement maltinaButton"><span>افزودن به سبد خرید</span><span>${price}</span</button>`;
    const element = createDomNode(template);
    element.addEventListener("click",function (){
        addToCardAction(price);
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
        createAddToCardButton(buyButtonContainer,price);
        createWeightMessage(buyButtonContainer);
    }
}

export default addToCard;


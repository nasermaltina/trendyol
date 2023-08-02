import {finder,constants,hideElement,logger} from "./shared.js";

function addToCardAction(price){
    alert("add to maltina button clicked " + price);
}
function createAddToCardButton(buttonContainer, price){
    const template = `<button class="maltinaButton" onclick="addToCardAction(${price})"><span>افزودن به سبد خرید</span><span></span>${price}</button>`;
    const element = new DOMParser().parseFromString(template,'text/html').firstChild;
    buttonContainer.insertBefore(element, buttonContainer.children[1]);
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
        const buttonContainer = finder(detailApp).getElement(constants.BUY_BUTTON_CONTAINER, "buy button container");
        if (!buttonContainer){
            logger("add to card stopped, because add to basket button not found...","warning");
            return;
        }
        hideElement(constants.ADD_TO_BASKET_BUTTON,buttonContainer);
        const price = descPrice?.textContent || originalPrice?.textContent || "0";
        createAddToCardButton(buttonContainer,price);
    }
}

export default addToCard;


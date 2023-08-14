import {constants, createDomNode, finder, maltinaBasket, sessionStore} from "./shared.js";

export function addMaltinaHeader(){
    const topHeaderContainer = finder("body").getElement(constants.TOP_HEADER,"TOP HEADER");
    if (topHeaderContainer){
        topHeaderContainer.style.height = "100px";
        const template =
            `<div class="${'maltinaTopHeader '+(window.isTrendyolMobile?'isMobile':'')}">
            <nav>
                <a href="#">
                    <img src="https://nasermaltina.github.io/trendyol/assets/user.png" alt="user"/>                                    
                    <span>ورود یا عضویت</span>
                </a>
                <a class="basketIcon" onclick="showMaltinaCart()">
                     <img src="https://nasermaltina.github.io/trendyol/assets/basket.png" alt="user"/>                       
                     <small>${sessionStore.store.basketCount.value}</small>
                     <span>سبد خرید</span>
                </a>
                <a class="maltinaLogo" href="https://malltina.com" >
                    <img src="https://nasermaltina.github.io/trendyol/assets/maltina.svg" alt="malltina"/>
                </a>                                   
            </nav>
         </div>`;

        const topHeaderElement = createDomNode(template);
        topHeaderContainer.insertBefore(topHeaderElement, topHeaderContainer.children[0]);

        const stickyHeader = createDomNode(template);
        const stickyHeaderContainer = finder().getElement(constants.STICKY_HEADER,"STICKY HEADER");
        if (stickyHeaderContainer){
            stickyHeaderContainer.insertBefore(stickyHeader, stickyHeaderContainer.children[0]);
        }
    }
}

window.showMaltinaCart= function (){
    const cartItems = maltinaBasket().currentState();
    if (cartItems && cartItems.length){
        //TODO: set localstorage for maltina.com before redirect to malltina.com/cart

    }else{
        alert("سبد خرید شما خالی می باشد");
    }

}

export default addMaltinaHeader;
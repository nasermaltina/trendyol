export const constants={
    PRODUCT_DETAIL_APP:"#product-detail-app|#product-detail",
    PRICE_BOX:".featured-prices|.product-price-container|.price__container",
    ORIGINAL_PRICE:".prc-org|.price__container__sales_price>span|.old-price>span",
    DISCOUNT_PRICE:".prc-dsc|.price__container__discount__price old-price-exist>span",
    BUY_BUTTON_CONTAINER:".product-button-container|.price__add_to_basket",
    //ADD_TO_BASKET_BUTTON:"button.add-to-basket",
    PRODUCT_WEIGHT_INPUT:"#productWeightInput",
    PRODUCT_WIDGET_LIST:".product-widget-list",
    SIDE_BAR_FILTER_PANEL:"#sticky-aggregations",
    TOP_HEADER:"#header",
    STICKY_HEADER:".sticky-header",
    MALTINA_BASKET:"maltinaBasket",
    MALTINA_TURKEY_MANUAL:"https://malltina.com/purchase-guide/turkey",
    MALTINA_BASKET_COUNT:"#maltinaBasketCount",
    CALCULATE_COST_API: "https://api.malltina.com/api/v1/asia-shop/compute-cost" //"http://localhost:8008/compute-cost"
}

export function logger(message,type){
    let css;
    switch (type){
        case "error":
        case "err":
            css= 'background-color: red;color:#000;padding:10px;font-weight: 900;';
            break;
        case "warning":
        case "warn":
            css= 'background-color: yellow;color:#f00;padding:10px';
            break;
        default:
            css = 'background-color: blue;color:#fff;padding:10px';//info pallet
    }
    console.log(`%c${message}`, css);
}

export function maltinaBasket(){
    return{
        currentState(){
            let currentLocalStorage= window.localStorage.getItem(constants.MALTINA_BASKET);
            if (!currentLocalStorage){
                currentLocalStorage=[];
            }else{
                currentLocalStorage = JSON.parse(currentLocalStorage);
            }
            return currentLocalStorage;
        },
        addToBasket(productName){
            const current = this.currentState();
            let exist = current.find(p=>p.name===productName);
            if (!exist){
                exist= {
                    name:productName,
                    count:0
                }
                current.push(exist);
            }
            exist.count++;
            window.localStorage.setItem(constants.MALTINA_BASKET,JSON.stringify(current));
        },
        getCount(){
            const current = this.currentState();
            return current.reduce((a, b) => ({count:a.count + b.count}),{count:0}).count;
        }
    }
}
export function storeManager(initialState){
    const result = {
        store:initialState,
        change: function (key,value){
            const node = this.store[key];
            if (node){
                node.value= value;
                if (node.elements){
                    const elementToBeUpdate = finder().getAllElements(node.elements);
                    elementToBeUpdate.forEach(element=>{
                        if (element.tagName==="INPUT"){
                            element.value=value;
                        }else{
                            element.innerHTML= value;
                        }
                    })
                }

            }
        },
        initialize:function (){
            const allKeys = Object.keys(this.store);
            allKeys.forEach(key=> this.change(key,this.store[key].value));
        }
    }
    result.initialize();
    return result;
}

export function tryFindElement(root,query){
    const arr = query.split("|");
    let result;
    arr.find((q)=>{
        result = root.querySelector(q);
        return result!=null;
    });
    return result;

}
export function createDomNode(html){
    const placeholder = document.createElement("div");
    placeholder.innerHTML = html;
    return placeholder.firstElementChild;
}
export function finder(root=null,order=1){
    if (!root){
        root= document;
    }else if (typeof root=== "string"){
        root = document.querySelector(root);
    }
    return{
        root:root,
        order:order,
        find: function (query,title){
            const result = tryFindElement(this.root,query);
            console.info(`${this.order++} > `);
            if (result){
                logger(`${title} found`);
                this.root= result;
            }else {
                logger(`${title} not found`,"error");
            }
            return this;
        },
        getElement: function (query, title){
            const element = tryFindElement(this.root,query);
            if (element){
                logger(`${title} content: ` + element);
                return element;
            }
            logger(`${title} not found`,"error");
        },
        getAllElements: function (query){
            if (!query){
                return [];
            }
            const arr = query.split("|");
            const elements= arr.map(q=>Array.from(document.querySelectorAll(q)));
            return [].concat.apply([], elements);
        }
    }
}
export function hideElement(query,parent){
    if (!query || typeof query != "string"){
        return;
    }
    if (!parent){
        parent= document;
    }
    const elements =  finder(parent).getAllElements(query); //parent.querySelector(query);
    if (elements && elements.length){
        setTimeout(()=>{
            elements.forEach(element=> {console.log("hideElement...",element); element.style.display="none"});
        },3000);
    }
}
export const sessionStore= storeManager({
    country: {
        elements: '',
        value: 'turkey',
    },
    mainPrice:{
        elements:'',
        value:0
    },
    weight: {
        elements: '#productWeightInput',
        value: "500",
    },
    price: {
        elements: '.productPrice',
        value: "0",
    },
    products:{
        elements:'localstorage',
        value:['test1']
    },
    basketCount:{
        elements:".basketIcon>small",
        value:0
    }
});

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
                <a class="basketIcon" href="#">
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
// window.scrollUp = function (){
//     scroll({
//         top: 100,
//         behavior: "smooth",
//     });
// }
// window.scrollDown = function (){
//     scroll({
//         top: -100,
//         behavior: "smooth",
//     });
// }
// export function changeScrollbars(){
//     // document.body.style.overflow = "hidden";
//     // const scrollUp = `<button class="scrollButton scrollUp" onclick="scrollUp()"><i class="scrollArrow scrollArrowUp"></i></button>`;
//     // const SUelement = createDomNode(scrollUp);
//     // document.body.appendChild(SUelement);
//     //
//     // const scrollDown = `<button class="scrollButton scrollDown" onclick="scrollDown()"><i class="scrollArrow scrollArrowDown"></i></button>`;
//     // const SDelement = createDomNode(scrollDown);
//     // document.body.appendChild(SDelement);
//
//     const filterPanel= finder().getElement(constants.SIDE_BAR_FILTER_PANEL,"side bar filter");
//     if (filterPanel){
//         filterPanel.classList.add("beautyScrollbar");
//     }
//     document.body.classList.add("bodyScrollBar");
// }
// window.handleProductClick= function (event) {
//     console.log("event clicked", event);
//     return false;
// }
export function runCommonTasks(){
    window.isTrendyolMobile = document.querySelector('meta[name="mobile-web-app-capable"]')?.content === "yes";
    logger("isTrendyolMobile: "+isTrendyolMobile);
    setTimeout(()=> {
        addMaltinaHeader();
        sessionStore.change("basketCount",maltinaBasket().getCount());
    },1000);
    //changeScrollbars();
    // document.querySelectorAll("a").forEach(a => {
    //     //a.setAttribute("rel", "noopener");
    //     a.setAttribute("target", "_self");
    //     if (typeof window.addEventListener != "undefined") {
    //         a.addEventListener("click",handleProductClick,false);
    //     } else {
    //         a.attachEvent("onclick",handleProductClick);
    //     }
    // });
}
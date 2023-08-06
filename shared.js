export const constants={
    PRODUCT_DETAIL_APP:"#product-detail-app",
    PRICE_BOX:".featured-prices|.product-price-container",
    ORIGINAL_PRICE:".prc-org",
    DISCOUNT_PRICE:".prc-dsc",
    BUY_BUTTON_CONTAINER:".product-button-container",
    ADD_TO_BASKET_BUTTON:"button.add-to-basket",
    NO_NEED_BANNER:"#onetrust-consent-sdk",
    PRODUCT_WEIGHT_INPUT:"#productWeightInput",
    CALCULATE_COST_API: "http://localhost:8000/compute-cost" //"https://api.malltina.com/api/v1/asia-shop/compute-cost"
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
            const elements=
            arr.map(query=>Array.from(document.querySelectorAll(query)));
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
    const element = parent.querySelector(query);
    if (element){
        element.style.display="none";
    }
}
export function runCommonTasks(){
    hideElement(constants.NO_NEED_BANNER);
}
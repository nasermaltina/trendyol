function finder(root=null,order=1){
    if (!root){
        root= document;
    }else if (typeof root=== "string"){
        root = document.querySelector(root);
    }
    return{
        root:root,
        order:order,
        find: function (query,title){
            const result = this.root.querySelector(query);
            console.info(`${this.order++} > `);
            if (result){
                console.info(`${title} found`);
                this.root= result;
            }else {
                console.info(`${title} not found`);
            }
            return this;
        },
        getContent: function (query,title){
            const element = this.root.querySelector(query);
            console.info(`${title} content:`,element);
            return element;
        }
    }
}

(function (){
    const pricesBox = finder().find("#product-detail-app","detail app").find(".featured-price-box","price box")
        .find(".featured-prices","prices box");

    const originalPrice = pricesBox.getContent(".prc-org","original price");
    const descPrice = pricesBox.getContent(".prc-dsc","discount price");

    const buttonContainer = finder("#product-detail-app").find(".product-button-container","button container");
    const button = buttonContainer
        .getContent("button.add-to-basket","add to card button");
    button.style.display="none";

    const newButton = document.createElement("button");
    newButton.className="maltinaButton";
    newButton.innerHTML= "<span>Add to Card</span> <span>+</span>";
    newButton.onclick= function (){
        //const data = originalPrice.querySelector("font").querySelector("font").innerHTML
        const data = originalPrice.textContent;
        alert("add to maltina button clicked " + data);
    }

    buttonContainer.root.insertBefore(newButton, buttonContainer.root.children[1]);
})();


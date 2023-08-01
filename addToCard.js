import {finder} from "./shared.js";

const addToCard = function () {
    console.log("step2: loader Works....");
    const pricesBox = finder().find("#product-detail-app", "detail app").find(".featured-price-box", "price box")
        .find(".featured-prices", "prices box");

    const originalPrice = pricesBox.getContent(".prc-org", "original price");
    const descPrice = pricesBox.getContent(".prc-dsc", "discount price");

    const buttonContainer = finder("#product-detail-app").find(".product-button-container", "button container");
    const button = buttonContainer
        .getContent("button.add-to-basket", "add to card button");
    button.style.display = "none";

    const newButton = document.createElement("button");
    newButton.className = "maltinaButton";
    newButton.innerHTML = "<span>Add to Card</span> <span>+++</span>";
    newButton.onclick = function () {
        //const data = originalPrice.querySelector("font").querySelector("font").innerHTML
        const price = descPrice?.textContent || originalPrice?.textContent || "NO PRICE";
        alert("add to maltina button clicked " + price);
    }

    buttonContainer.root.insertBefore(newButton, buttonContainer.root.children[1]);

//     const template = `<div class="modal">
//             <header>
//             <h1>Maltina modal</h1>
//             <span>X</span>
// </header>
// <main>
// <p> the content of maltina modal</p>
// </main>
//         </div>`;


}

export default addToCard;


import {createDomNode,finder,constants} from "./shared.js"
function addSideBarWidget(){
    if (window.isTrendyolMobile) return;

    const widgetsListContainer = finder().getElement(constants.PRODUCT_WIDGET_LIST,"Product Widget List (sidebar)");
    if (widgetsListContainer){
        const template =
            `<section class="expressInfoSideBar">
            <header>
                <img src="https://nasermaltina.github.io/trendyol/assets/expressCar.svg" alt="express"/>
                <label>
                    <h3>ارسال رایگان</h3>
                    <p>هزینه ارسال داخل ایران رایگان میباشد.</p>
                </label>
            </header>
            <ul>
                <li>
                    <img src="https://nasermaltina.github.io/trendyol/assets/airplane.svg" alt="maltina express"/>
                    <label>حمل هوایی و اکسپرس</label>
                </li>
                 <li>
                    <img src="https://nasermaltina.github.io/trendyol/assets/guarantee.svg" alt="maltina guarantee"/>
                    <label>گارانتی زمان تحویل کالا</label>
                </li> 
                <li>
                    <img src="https://nasermaltina.github.io/trendyol/assets/cost.svg" alt="maltina cost"/>
                    <label>کمترین هزینه حمل و گمرک</label>
                </li>      
            </ul>
        </section>`;

        const element = createDomNode(template);

        widgetsListContainer.insertBefore(element,widgetsListContainer.children[0]);

    }
}

export default addSideBarWidget;
import {createDomNode,finder,constants} from "./shared.js"
function addSideBarWidget(){
    const widgetsListContainer = finder().getElement(constants.PRODUCT_WIDGET_LIST,"Product Widget List (sidebar)");
    if (widgetsListContainer){
        const template =
            `<section class="expressInfoSideBar">
            <header>
                <img src="./expressCar.png" alt="express"/>
                <label>
                    <h3>ارسال رایگان</h3>
                    <p>هزینه ارسال داخل ایران رایگان میباشد.</p>
                </label>
            </header>
            <ul>
                <li>
                    <img src="#airplan" alt="airplan"/>
                    <label>حمل هوایی و اکسپرس</label>
                </li>
                 <li>
                    <img src="#garanti" alt="garanti"/>
                    <label>گارانتی زمان تحویل کالا</label>
                </li> 
                <li>
                    <img src="#cost" alt="cost"/>
                    <label>کمترین هزینه حمل و گمرک</label>
                </li>      
            </ul>
        </section>`;

        const element = createDomNode(template);

        widgetsListContainer.insertBefore(element,widgetsListContainer.children[0]);

    }
}

export default addSideBarWidget;
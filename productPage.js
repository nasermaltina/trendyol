//scripts of this page would run on the trendyol add to basket page (product page).
import {
	elementSelector,
	constants,
	tryFindElement,
	logger,
	createDomNode,
	sessionStore,
} from './shared.js';

function productPage() {
	const detailApp = tryFindElement(document, constants.PRODUCT_DETAIL_APP);
	if (detailApp) {
		const pricesBox = elementSelector(detailApp).find(
			constants.PRICE_BOX,
			'prices box'
		);

		const originalPrice = pricesBox.getElement(
			constants.ORIGINAL_PRICE,
			'original price'
		);
		const descPrice = pricesBox.getElement(
			constants.DISCOUNT_PRICE,
			'discount price'
		);
		if (!originalPrice && !descPrice) {
			logger('add to card stopped, because no price found...', 'warning');
			return;
		}
		const buyButtonContainer = elementSelector(detailApp).getElement(
			constants.BUY_BUTTON_CONTAINER,
			'buy button container'
		);
		if (!buyButtonContainer) {
			logger(
				'add to card stopped, because add to basket button not found...',
				'warning'
			);
			return;
		}

		const price =
			descPrice?.textContent || originalPrice?.textContent || '0';
		sessionStore.store.mainPrice.value = price.replace(/[^0-9.]/g, '');
		createAddToCardButton(buyButtonContainer);
		createWeightMessage(buyButtonContainer);
		createAddToBasketModal();
		addSideBarInfo();
		calculateNewPrice(constants.DEFAULT_WEIGHT).then();
	}
}
function createAddToCardButton(buyButtonContainer) {
	const template = `<button class="${
		'malltinaTextElement malltinaButton ' +
		(window.isTrendyolMobile ? 'isMobile' : '')
	}"><label>افزودن به سبد خرید</label><label><span class="productPrice">${
		sessionStore.store.price.value
	}</span><em>تومان</em></label></button>`;
	const element = createDomNode(template);
	element.addEventListener('click', function () {
		const modal = elementSelector().getElement(
			'#addToBasketModal',
			'add to basket modal'
		);
		if (modal) {
			modal.style.display = 'block';
			setTimeout(() => {
				const input = document.querySelector(
					constants.PRODUCT_WEIGHT_INPUT
				);
				input.focus();
				input.select();
			}, 500);
		}
	});

	buyButtonContainer.insertBefore(element, buyButtonContainer.children[1]);
}

function createWeightMessage(buyButtonContainer) {
	const template = `<div class="${
		'malltinaTextElement weightMessage ' +
		(window.isTrendyolMobile ? 'isMobile' : '')
	}"> وزن کالا بصورت <strong>پیش‌فرض ۵۰۰ گرم</strong> محاسبه شده است که در صورت نیاز میتوانید در مرحله بعد تغییر دهید. </div>`;
	const element = createDomNode(template);
	const parent = buyButtonContainer.parentElement;
	const index = Array.prototype.indexOf.call(
		buyButtonContainer.parentNode.childNodes,
		buyButtonContainer
	);
	parent.insertBefore(element, parent.children[index + 1]);
}

function createAddToBasketModal() {
	const template = `<section id="addToBasketModal" class="${
		'malltinaModal ' + (window.isTrendyolMobile ? 'isMobile' : '')
	}">         
            <div class="${
				'modalContent ' + (window.isTrendyolMobile ? 'isMobile' : '')
			}">
             <span class="modalClose" onclick="document.querySelector('#addToBasketModal').style.display='none'">&times;</span>
             <header>
                <h3>افزودن به سبد خرید</h3>
                <img src="${constants.ASSETS_URL}/turkey.svg" alt="country"/>
            </header>
            <main>
                <article>این محصول با <b>وزن پیش فرض ۵۰۰ گرم</b> محاسبه شده و پس از رسیدن به دفتر ایران وزن‌کشی میشود و ممکن است قیمت آن کمتر یا بیشتر شود.
                <br/>اگر وزن محصول را میدانید آنرا وارد و دکمه محاسبه قیمت را بزنید.</article>
                <section class="calculatePriceSection">
                    <div><input type="number" name="productWeight" id=${constants.PRODUCT_WEIGHT_INPUT.replace(
						'#',
						''
					)} 
                        value="${
							sessionStore.store.weight.value
						}"/><span>گرم</span></div>
                    <button onclick="calculateNewPrice()">محاسبه قیمت</button>
                </section>
                <section class="totalPrice">
                    <strong class="productPrice">${
						sessionStore.store.price.value
					}</strong>
                    <span>تومان</span>
                </section>
                <section class="addToBasketButtonContainer">
                    <button onclick="addToBasket()">
                    افزودن به سبد خرید
                    </button>
                </section>
                <section class="buyGuideSection">
                    <a href="${
						constants.malltina_TURKEY_MANUAL
					}" target="_blank"><span>راهنمای خرید از ترکیه</span> </a>
                </section>
            </main>
            </div>
    </section>`;
	const element = createDomNode(template);
	document.body.appendChild(element);
}

function addSideBarInfo() {
	if (window.isTrendyolMobile) return;

	const widgetsListContainer = elementSelector().getElement(
		constants.PRODUCT_WIDGET_LIST,
		'Product Widget List (sidebar)'
	);
	if (widgetsListContainer) {
		const template = `<section class="expressInfoSideBar">
            <header>
                <img src="${constants.ASSETS_URL}/expressCar.svg" alt="express"/>
                <div>
                    <h3>ارسال رایگان</h3>
                    <p>هزینه ارسال داخل ایران رایگان میباشد.</p>
                </div>
            </header>
            <ul>
                <li>
                    <img src="${constants.ASSETS_URL}/airplane.svg" alt="malltina express"/>
                    <label>حمل هوایی و اکسپرس</label>
                </li>
                 <li>
                    <img src="${constants.ASSETS_URL}/guarantee.svg" alt="malltina guarantee"/>
                    <label>گارانتی زمان تحویل کالا</label>
                </li> 
                <li>
                    <img src="${constants.ASSETS_URL}/cost.svg" alt="malltina cost"/>
                    <label>کمترین هزینه حمل و گمرک</label>
                </li>      
            </ul>
        </section>`;

		const element = createDomNode(template);

		widgetsListContainer.insertBefore(
			element,
			widgetsListContainer.children[0]
		);
	}
}

window.calculateNewPrice = async function (weight) {
	if (!weight) {
		const productWeightInput =
			weight ||
			elementSelector().getElement(
				constants.PRODUCT_WEIGHT_INPUT,
				'product weight input'
			);
		weight = productWeightInput ? Number(productWeightInput.value) : 0;
	}
	if (weight < 50 || weight > 999999) {
		alert('وزن وارد شده خارج از رنج می باشد...');
		return;
	}
	sessionStore.store.weight.value = weight;
	const resp = await fetch(constants.CALCULATE_COST_API, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			country: sessionStore.store.country.value,
			price: sessionStore.store.mainPrice.value,
			weight: sessionStore.store.weight.value,
		}),
	});
	console.log('resp...', resp);
	const { amount } = await resp.json();
	if (amount) {
		sessionStore.change('price', amount.toLocaleString());
	}
};
window.addToBasket = function () {

	//TODO:
	//According to Sorosh code review we decided to change the add to basked senior
	//So here we should redirect user to malltina cart page.
	//and before redirect, here we should set the malltina basket local storage.

	const item={
		amount: sessionStore.store.mainPrice.value,
		date: Date.now().toString(),
		description: '',
		icon: '',
		image: null,
		logo: '',
		price: sessionStore.store.price.value.toString(),
		quantity: 1,
		url: window.location.href,
		weight: sessionStore.store.weight.value,
	}
	const modal = elementSelector().getElement(
		'#addToBasketModal',
		'add to basket modal'
	);
	modal.style.display = 'none';
};

export default productPage;

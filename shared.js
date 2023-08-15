//In this file we have some shared util functions and common task functions
// that can be used in every other page and module.

export const constants = {
	PRODUCT_DETAIL_APP: '#product-detail-app|#product-detail',
	PRICE_BOX: '.featured-prices|.product-price-container|.price__container',
	ORIGINAL_PRICE:
		'.prc-org|.price__container__sales_price>span|.old-price>span',
	DISCOUNT_PRICE:
		'.prc-dsc|.price__container__discount__price|.old-price-exist>span',
	BUY_BUTTON_CONTAINER: '.product-button-container|.price__add_to_basket|',
	PRODUCT_WEIGHT_INPUT: '#productWeightInput',
	PRODUCT_WIDGET_LIST: '.product-widget-list',
	SIDE_BAR_FILTER_PANEL: '#sticky-aggregations',
	TOP_HEADER: '#header',
	STICKY_HEADER: '.sticky-header',
	MALLTINA_BASKET: 'malltinaBasket',
	MALLTINA_TURKEY_MANUAL: 'https://malltina.com/purchase-guide/turkey',
	MALLTINA_BASKET_COUNT: '#malltinaBasketCount',
	DEFAULT_WEIGHT:500,
	ASSETS_URL:'https://nasermalltina.github.io/trendyol/assets',
	CALCULATE_COST_API:
		'https://api.malltina.com/api/v1/asia-shop/compute-cost',
};

export function logger(message, type) {
	let css;
	switch (type) {
		case 'error':
		case 'err':
			css =
				'background-color: red;color:#000;padding:10px;font-weight: 900;';
			break;
		case 'warning':
		case 'warn':
			css = 'background-color: yellow;color:#f00;padding:10px';
			break;
		default:
			css = 'background-color: blue;color:#fff;padding:10px'; //info pallet
	}
	console.log(`%c${message}`, css);
}

export function generateStoreManager(initialState) {
	const result = {
		store: initialState,
		change: function (key, value) {
			const node = this.store[key];
			if (node) {
				node.value = value;
				if (node.elements) {
					const elementToBeUpdate = elementSelector().getAllElements(
						node.elements
					);
					elementToBeUpdate.forEach((element) => {
						if (element.tagName === 'INPUT') {
							element.value = value;
						} else {
							element.innerHTML = value;
						}
					});
				}
			}
		},
		initialize: function () {
			const allKeys = Object.keys(this.store);
			allKeys.forEach((key) => this.change(key, this.store[key].value));
		},
	};
	result.initialize();
	return result;
}

export function tryFindElement(root, query) {
	const arr = query.split("|");
	let result;
	arr.find((q)=>{
		result = root.querySelector(q);
		return result!=null;
	});
	return result;
}

export function createDomNode(html) {
	const placeholder = document.createElement('div');
	placeholder.innerHTML = html;
	return placeholder.firstElementChild;
}

export function elementSelector(root = null, order = 1) {
	if (!root) {
		root = document;
	} else if (typeof root === 'string') {
		root = document.querySelector(root);
	}
	return {
		root: root,
		order: order,
		find: function (query, title) {
			const result = tryFindElement(this.root, query);
			console.info(`${this.order++} > `);
			if (result) {
				logger(`${title} found`);
				this.root = result;
			} else {
				logger(`${title} not found`, 'error');
			}
			return this;
		},
		getElement: function (query, title) {
			const element = tryFindElement(this.root, query);
			if (element) {
				logger(`${title} content: ` + element);
				return element;
			}
			logger(`${title} not found`, 'error');
		},
		getAllElements: function (query) {
			if (!query) {
				return [];
			}
			const arr = query.split('|');
			const elements = arr.map((q) =>
				Array.from(document.querySelectorAll(q))
			);
			return [].concat.apply([], elements);
		},
	};
}

export const sessionStore = generateStoreManager({
	country: {
		elements: '',
		value: 'turkey',
	},
	mainPrice: {
		elements: '',
		value: 0,
	},
	weight: {
		elements: '#productWeightInput',
		value: '500',
	},
	price: {
		elements: '.productPrice',
		value: '0',
	},
	basketCount: {
		elements: '.basketIcon>small',
		value: 0,
	},
});

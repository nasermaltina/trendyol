import {
	constants,
	createDomNode,
	elementSelector,
	sessionStore,
} from './shared.js';

export function addMalltinaHeader() {
	const topHeaderContainer = elementSelector('body').getElement(
		constants.TOP_HEADER,
		'TOP HEADER'
	);
	if (topHeaderContainer) {
		topHeaderContainer.style.height = '100px';
		const template = `<div class="${
			'malltinaTopHeader ' + (window.isTrendyolMobile ? 'isMobile' : '')
		}">
            <nav>
                <a href="#">
                    <img src="${constants.ASSETS_URL}/user.png" alt="user"/>                                    
                    <span>ورود یا عضویت</span>
                </a>
                <a class="basketIcon" href="https://malltina.com/cart">
                     <img src="${constants.ASSETS_URL}/basket.png" alt="user"/>                       
                     <small>${sessionStore.store.basketCount.value}</small>
                     <span>سبد خرید</span>
                </a>
                <a class="malltinaLogo" href="https://malltina.com" >
                    <img src="${constants.ASSETS_URL}/maltina.svg" alt="malltina"/>
                </a>                                   
            </nav>
         </div>`;

		const topHeaderElement = createDomNode(template);
		topHeaderContainer.insertBefore(
			topHeaderElement,
			topHeaderContainer.children[0]
		);

		const stickyHeader = createDomNode(template);
		const stickyHeaderContainer = elementSelector().getElement(
			constants.STICKY_HEADER,
			'STICKY HEADER'
		);
		if (stickyHeaderContainer) {
			stickyHeaderContainer.insertBefore(
				stickyHeader,
				stickyHeaderContainer.children[0]
			);
		}
	}
}


export default addMalltinaHeader;

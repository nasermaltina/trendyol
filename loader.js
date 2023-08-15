import productPage from './productPage.js';
import { logger, sessionStore } from './shared.js';
import addMalltinaHeader from './header.js';

//this function is the main entrypoint of the trendyol auto-surf challenge.
// this function is called in head of trendyol subdomain website,
// through some reverse proxy configs which is handled by backend developer.
const loader = () => {
	setTimeout(() => {
		runCommonTasks();
		productPage();
	}, 1500);
};

export function runCommonTasks() {
	window.isTrendyolMobile =
		document.querySelector('meta[name="mobile-web-app-capable"]')
			?.content === 'yes';
	logger('isTrendyolMobile: ' + isTrendyolMobile);
	addMalltinaHeader();
	//TODO:
	//According to Sorosh Code review and changing the add to basket scenario,
	// here we need to get the count of the basket from malltina.com local storage.
	const basketCount= 0;
	sessionStore.change('basketCount', basketCount);
}

export default loader;

import trendyolBasketPage from "./trendyolBasketPage.js";
import {logger, maltinaBasket,  sessionStore} from "./shared.js";
import addMaltinaHeader from "./trendyolHeader.js";

//this function is the main entrypoint of the trendyol auto-surf challenge.
// this function is called in head of trendyol subdomain website,
// through some reverse proxy configs which is handled by backend developer.
const loader = ()=>{
    setTimeout(()=> {
        runCommonTasks();
        trendyolBasketPage();
    },1500);
}

export function runCommonTasks(){
    window.isTrendyolMobile = document.querySelector('meta[name="mobile-web-app-capable"]')?.content === "yes";
    logger("isTrendyolMobile: "+isTrendyolMobile);
    addMaltinaHeader();
    sessionStore.change("basketCount",maltinaBasket().getCount());
}
export default loader;

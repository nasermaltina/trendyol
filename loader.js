import addToCard from "./addToCard.js";
import addSideBarWidget from "./widgets.js";
import {runCommonTasks} from "./shared.js";
const loader = ()=>{
    setTimeout(()=> {
        runCommonTasks();
        addToCard();
        addSideBarWidget();
    },1500);

}
export default loader;

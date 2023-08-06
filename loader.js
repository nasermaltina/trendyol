import addToCard from "./addToCard.js";
import addSideBarWidget from "./widgets";
import {runCommonTasks} from "./shared.js";
const loader = ()=>{
    runCommonTasks();
    addToCard();
    addSideBarWidget();
}
export default loader;

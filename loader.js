import addToCard from "./addToCard.js";
import {runCommonTasks} from "./shared.js";
const loader = ()=>{
    runCommonTasks();
    addToCard();
}
export default loader;

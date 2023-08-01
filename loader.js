import addToCard from "./addToCard.js";
import {runCommonTasks} from "./shared.js";
const loader = ()=>{
    const isAdded = sessionStorage.getItem("isMaltinaKeyAdded");
    if (isAdded && isAdded==="YES"){
        return;
    }
    sessionStorage.setItem("isMaltinaKeyAdded","YES");
    runCommonTasks();
    addToCard();
}
export default loader;

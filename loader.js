import addToCard from "./addToCard.js";
const loader = ()=>{
    const isAdded = sessionStorage.getItem("isMaltinaKeyAdded");
    if (isAdded && isAdded==="YES"){
        return;
    }
    addToCard();
    sessionStorage.setItem("isMaltinaKeyAdded","YES");
}
export default loader;

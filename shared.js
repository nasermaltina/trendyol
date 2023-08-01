export function finder(root=null,order=1){
    if (!root){
        root= document;
    }else if (typeof root=== "string"){
        root = document.querySelector(root);
    }
    return{
        root:root,
        order:order,
        find: function (query,title){
            const result = this.root.querySelector(query);
            console.info(`${this.order++} > `);
            if (result){
                console.info(`${title} found`);
                this.root= result;
            }else {
                console.info(`${title} not found`);
            }
            return this;
        },
        getContent: function (query,title){
            const element = this.root.querySelector(query);
            console.info(`${title} content:`,element);
            return element;
        }
    }
}

export function runCommonTasks(){
    const banner = document.querySelector("#onetrust-consent-sdk");
    banner.style.display="none";
}
export function save(key,value){
    localStorage.setItem(key,JSON.stringify(value));
  }
  
  export function load(key){
    try{
      return JSON.parse(localStorage.getItem(key))
    }catch(error){
      console.log(`${key} does not exists in local storage`)
      return "";
    }
  }

  export function createIconContainer(className, value, src, alt, title, dir){
    const iconContainer = document.createElement("div"); 
    const icon = document.createElement("img"); 
    const iconText = document.createElement("p"); 

    iconContainer.setAttribute("class",className);

    icon.setAttribute("src",src);
    icon.setAttribute("alt",alt);
    icon.setAttribute("title",title);

    iconText.innerText=value; 

    if(!dir||dir.toLowerCase()==="left"){ 
      iconContainer.appendChild(icon);
      iconContainer.appendChild(iconText);
    }else{
      iconContainer.appendChild(iconText);
      iconContainer.appendChild(icon);
    }

    return iconContainer
  }
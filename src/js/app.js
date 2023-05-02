import { Tooltip, Toast, Popover, Dropdown, Modal } from 'bootstrap';


let cookies = new Map()

let cookieArray = document.cookie.split(";")
cookieArray.forEach(c =>{ 
    let [key, value] = c.split("=");  
    cookies.set(key.trim(), value) }
)

window.cookies = cookies
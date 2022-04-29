/*
 * General utils for managing cookies in Typescript.
 */
export function setCookie(name: string, val: string) {
    document.cookie = name+"="+val+"; path=/";
}

export function getCookie(name: string) {
    const value = "; " + document.cookie;
    const arr = value.split("; " + name + "=");
    
    if (arr.length == 2) {
        return arr.pop().split(";").shift();
    }
}
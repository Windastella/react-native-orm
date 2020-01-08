export default ()=>{
    if (typeof document != 'undefined') {
        // I'm on the web!
        return 'web'
    }
    else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
        // I'm in react-native
        return 'rn'
    }
    else {
        // I'm in node js
        return 'node'
    }
};
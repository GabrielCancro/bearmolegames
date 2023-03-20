export var FONTS = {
    VeryYou: {family:"Very You", cdn: 'https://fonts.cdnfonts.com/css/very-you'}
}

export function loadAllFonts(){
    for (let f in FONTS){
        $('<link>').appendTo('head').attr({rel: 'stylesheet',href: FONTS[f].cdn});
        console.log(f)
    }
}
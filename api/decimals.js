const dec=require('decimal.js');

function format(value, scale) {
    var fmt=(value).toFixed(scale);
    return fmt.replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

exports.format = format;

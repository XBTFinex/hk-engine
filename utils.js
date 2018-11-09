exports.parseArguments = function() {
    const result = Object.create(null);
    process.argv.forEach((argument) => {
        if (argument.indexOf('=') != -1) {
            const index = argument.indexOf('=');
            const name = argument.substr(0, index);
            const value = argument.substr(index + 1);
            result[name] = value;
        }
    });    
    return result;
}

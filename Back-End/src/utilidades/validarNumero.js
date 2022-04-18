function eNumero(element) {
    return element.toUpperCase() === element.toLowerCase();
}

function validarFormato(element) {
    const array = element.split('');

    for (let i = 0; i < array.length; i++) {
        if (i < 4 && eNumero(array[i])) {
            return false;
        } else if (i >= 4 && !eNumero(array[i])) {
            return false;
        } else if (i === array.length - 1) {
            return true;
        }
    }
}

module.exports = {
    validarFormato
}
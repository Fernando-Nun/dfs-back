function validarProducto(nombre, precio) {
 if (!nombre || typeof nombre !== 'string') {
    return {ok: false, error: 'Nombre inválido'}
 }   

 const p = Number(precio);
 if (!Number.isFinite(p) || p <= 0) {
    return {ok: false, error: 'Precio inválido'}
 }
 return { ok: true, data: { nombre, precio: p } };
}

module.exports = { validarProducto }
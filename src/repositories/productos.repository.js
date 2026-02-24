
const { pool } = require('../db');

class ProductosRepository {

  async getAll() {
    const result = await pool.query(
      'select id, nombre, precio from productos;'
    );
    return result.rows;
  }

  async getAllActive() {
    const result = await pool.query(
      'select id, nombre, precio from productos where activo = true;'
    );
    return result.rows;
    // return this.productos.filter(producto => producto.active);
  }

  async getById(id) {
    const result = await pool.query(
      'select id, nombre, precio, stock, descripcion from productos where activo = true and id = $1;', [id]
    );
    return result.rows[0];
    // return this.productos.find(producto => producto.id === id);
  }

  async buscar({ nombre, minPrecio, maxPrecio, page, limit }) {
    let query = 'SELECT id, nombre, precio FROM productos WHERE activo = true';
    let countQuery = 'SELECT COUNT(*) FROM productos WHERE activo = true';
    const params = [];
    let index = 1;

    if (nombre) {
      query += ` AND nombre ILIKE $${index}`;
      countQuery += ` AND nombre ILIKE $${index}`;
      params.push(`%${nombre}%`);
      index++;
    }

    if (minPrecio) {
      query += ` AND precio >= $${index}`;
      countQuery += ` AND precio >= $${index}`;
      params.push(minPrecio);
      index++;
    }

    if (maxPrecio) {
      query += ` AND precio <= $${index}`;
      countQuery += ` AND precio <= $${index}`;
      params.push(maxPrecio);
      index++;
    }

    query += ` ORDER BY id DESC`;

    const offset = (page - 1) * limit;
    query += ` LIMIT $${index} OFFSET $${index + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const totalResult = await pool.query(countQuery, params.slice(0, index - 1));
    const total = parseInt(totalResult.rows[0].count, 10);

    return {
      data: result.rows,
      page,
      limit,
      total
    };
  }

  async create(nombre, precio) {
    const result = await pool.query(
      'insert into productos (nombre, precio) values ($1,$2) returning id, nombre, precio;',[nombre, precio] 
    );
    return result.rows[0];
    // const newProducto = { id: this.nextId++, nombre, precio };
    // this.productos.push(newProducto);
    // return newProducto;
  }
  async update(id, data) {
    // const producto = await this.getById(id);
    // if (producto) {
    //   producto.nombre = data.nombre;
    //   producto.precio = data.precio;
    //   return producto;
    // }
    // return null;
    const result = await pool.query(
      'update productos set nombre = coalesce($1, nombre), precio = coalesce($2, precio) where id = $3 returning id, nombre, precio', [data.nombre ?? null, data.precio ?? null, id]
    );
    return result.rows[0] || null;
  }

 async delete(id) {
    // const index = this.productos.findIndex(producto => producto.id === id);
    // if (index !== -1) {
    //   return this.productos.splice(index, 1)[0];
    // }
    // return null;
    const result = await pool.query(
      'delete from productos where id = $1 returning id', [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = { ProductosRepository }

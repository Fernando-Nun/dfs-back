const { pool } = require('./src/db');

(async() => {
//   const r1 = await pool.query('select 1 as ok');
//   console.log('Prueba select 1:', r1.rows);

//   const r2 = await pool.query('select id, nombre, precio from productos order by id asc limit 3 offset 3;');
//   console.log(r2.rows);
    let buscar = 1;

    const r3 = await pool.query(
        `select id, nombre, precio from productos where id = $1;`, [buscar]
    );
    console.log('resultados:', r3.rows);
})();
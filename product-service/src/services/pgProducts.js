import { Pool } from "pg"

console.log(`process.env`, process.env)

const Table = {
  PRODUCTS: "products",
  STOCKS: "stocks",
}

class QueryConfig {
  constructor(text) {
    this.text = text
  }
}

class PgProductsClient {
  #pool = null
  productsTableName = Table.PRODUCTS
  stocksTableName = Table.STOCKS

  constructor(config) {
    this.#pool = new Pool(config)
  }

  #transactionRequest =
    (...queryArgs) =>
    (queryCb) =>
    async (pool) => {
      const client = await pool.connect()

      try {
        const qTransactionBegin = new QueryConfig("BEGIN")
        await client.query(qTransactionBegin)

        const response = await queryCb(client, ...queryArgs)

        const qTransactionCommit = new QueryConfig("COMMIT")
        await client.query(qTransactionCommit)

        return response
      } catch (error) {
        const qTransactionRollback = new QueryConfig("ROLLBACK")
        await client.query(qTransactionRollback)
        throw error
      } finally {
        client.release()
      }
    }

  getAll = async () => {
    const q = new QueryConfig(
      `SELECT p.id, p.title, p.description, p.price, s.count
        FROM ${this.productsTableName} p
        LEFT JOIN ${this.stocksTableName} s
        ON s.id = p.id
        ORDER BY p.title ASC;
        `
    )

    const response = await this.#pool.query(q)
    return response.rows
  }

  getById = async (id) => {
    const q = new QueryConfig(
      `SELECT p.id, p.title, p.description, p.price, s.count
        FROM ${this.productsTableName} p
        LEFT JOIN ${this.stocksTableName} s
        ON s.id = p.id
        WHERE p.id = '${id}';`
    )

    const response = await this.#pool.query(q)
    return response.rows[0]
  }

  #put = async (client, product) => {
    const qInsertProduct = new QueryConfig(
      `INSERT INTO products(title, description, price)
        VALUES
        ('${product.title}', '${product.description}', ${product.price})
        RETURNING id;`
    )

    const {
      rows: [{ id }],
    } = await client.query(qInsertProduct)

    const qInsertCount = new QueryConfig(
      `INSERT INTO stocks(id, count)
        VALUES
        ('${id}', ${product.count});`
    )

    await client.query(qInsertCount)

    const qSelectProduct = new QueryConfig(
      `SELECT p.id, p.title, p.description, p.price, s.count
        FROM ${this.productsTableName} p
        LEFT JOIN ${this.stocksTableName} s
        ON s.id = p.id
        WHERE p.id = '${id}';`
    )

    const response = await client.query(qSelectProduct)

    return response.rows[0]
  }

  put = (product) => this.#transactionRequest(product)(this.#put)(this.#pool)

  #updateById = async (client, product, productId) => {
    const qUpdateProduct = new QueryConfig(
      `UPDATE products p
        SET title = '${product.title}', description = '${product.description}', price=${product.price}
        WHERE p.id = '${productId}'
        RETURNING p.id;`
    )

    const {
      rows: [{ id }],
    } = await client.query(qUpdateProduct)

    const qUpdateCount = new QueryConfig(
      `UPDATE stocks s
        SET count = ${product.count}
        WHERE s.id = '${id}';`
    )

    await client.query(qUpdateCount)

    const qSelectProduct = new QueryConfig(
      `SELECT p.id, p.title, p.description, p.price, s.count
        FROM ${this.productsTableName} p
        LEFT JOIN ${this.stocksTableName} s
        ON s.id = p.id
        WHERE p.id = '${id}';`
    )

    const response = await client.query(qSelectProduct)

    return response.rows[0]
  }

  updateById = (product, productId) =>
    this.#transactionRequest(product, productId)(this.#updateById)(this.#pool)

  #insertAll = async (client, products) => {
    const values = products
      .map((p) => `('${p.title}', '${p.description}', ${p.price})`)
      .join(", ")

    const qInsertProduct = new QueryConfig(
      `INSERT INTO products(title, description, price)
        VALUES ${values}
        RETURNING *;`
    )

    const { rows } = await client.query(qInsertProduct)

    const qInsertCount = new QueryConfig(
      `INSERT INTO stocks(id, count)
        VALUES
        ${rows
          .map(({ id }, i) => `('${id}', ${products[i]["count"]})`)
          .join(", ")};`
    )

    await client.query(qInsertCount)

    const qSelectProduct = new QueryConfig(
      `SELECT p.id, p.title, p.description, p.price, s.count
        FROM ${this.productsTableName} p
        LEFT JOIN ${this.stocksTableName} s
        ON s.id = p.id
        WHERE p.id IN (${rows.map(({ id }) => `'${id}'`).join(", ")});
        `
    )

    const response = await client.query(qSelectProduct)

    return response.rows
  }

  insertAll = (products) =>
    this.#transactionRequest(products)(this.#insertAll)(this.#pool)

  deleteById = async (productId) => {
    const qDeleteProduct = new QueryConfig(
      `DELETE FROM ${this.productsTableName} p
        WHERE p.id = '${productId}'
        RETURNING *;`
    )

    const response = await this.#pool.query(qDeleteProduct)

    return response.rows[0]
  }
}

const pgProducts = new PgProductsClient({
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
})

export { pgProducts }

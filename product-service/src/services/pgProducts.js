import { Client } from "pg"

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
  #client = null
  productsTableName = Table.PRODUCTS
  stocksTableName = Table.STOCKS

  init = async () => {
    this.#client =
      this.#client ??
      new Client({
        user: process.env.PG_USER,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        ssl: {
          rejectUnauthorized: false,
        },
      })

    await this.#client.connect()
  }

  getAll = async () => {
    const q = new QueryConfig(
      `SELECT p.id, p.title, p.description, p.price, s.count
        FROM ${this.productsTableName} p
        LEFT JOIN ${this.stocksTableName} s
        ON s.id = p.id;
        `
    )

    const response = await this.#client.query(q)
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

    const response = await this.#client.query(q)
    return response.rows[0]
  }

  put = async (product) => {
    try {
      const qTransactionBegin = new QueryConfig("BEGIN")
      await this.#client.query(qTransactionBegin)

      const qInsertProduct = new QueryConfig(
        `INSERT INTO products(title, description, price)
        VALUES
        ('${product.title}', '${product.description}', ${product.price})
        RETURNING id;`
      )

      const {
        rows: [{ id }],
      } = await this.#client.query(qInsertProduct)

      const qInsertCount = new QueryConfig(
        `INSERT INTO stocks(id, count)
        VALUES
        ('${id}', ${product.count});`
      )

      await this.#client.query(qInsertCount)

      const qSelectProduct = new QueryConfig(
        `SELECT p.id, p.title, p.description, p.price, s.count
        FROM ${this.productsTableName} p
        LEFT JOIN ${this.stocksTableName} s
        ON s.id = p.id
        WHERE p.id = '${id}';`
      )

      const response = await this.#client.query(qSelectProduct)

      const qTransactionCommit = new QueryConfig("COMMIT")
      await this.#client.query(qTransactionCommit)

      return response.rows[0]
    } catch (error) {
      const qTransactionRollback = new QueryConfig("ROLLBACK")
      await this.#client.query(qTransactionRollback)
      throw error
    }
  }

  updateById = async (product, productId) => {
    try {
      const qTransactionBegin = new QueryConfig("BEGIN")
      await this.#client.query(qTransactionBegin)

      const qUpdateProduct = new QueryConfig(
        `UPDATE products p
      SET title = '${product.title}', description = '${product.description}', price=${product.price}
      WHERE p.id = '${productId}'
      RETURNING p.id;`
      )

      const {
        rows: [{ id }],
      } = await this.#client.query(qUpdateProduct)

      const qUpdateCount = new QueryConfig(
        `UPDATE stocks s
      SET count = ${product.count}
      WHERE s.id = '${id}';`
      )

      await this.#client.query(qUpdateCount)

      const qSelectProduct = new QueryConfig(
        `SELECT p.id, p.title, p.description, p.price, s.count
      FROM ${this.productsTableName} p
      LEFT JOIN ${this.stocksTableName} s
      ON s.id = p.id
      WHERE p.id = '${id}';`
      )

      const response = await this.#client.query(qSelectProduct)

      const qTransactionCommit = new QueryConfig("COMMIT")
      await this.#client.query(qTransactionCommit)

      return response.rows[0]
    } catch (error) {
      const qTransactionRollback = new QueryConfig("ROLLBACK")
      await this.#client.query(qTransactionRollback)
      throw error
    }
  }
}

const pgProducts = new PgProductsClient()

pgProducts.init()

export { pgProducts }

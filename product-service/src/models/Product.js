import * as Yup from "yup"

class Product {
  constructor({ id, title, description, price, count }) {
    id && (this.id = id)
    this.title = title
    this.price = price
    this.description = description
    this.count = count
  }

  static schema = Yup.object().shape({
    id: Yup.string().uuid(),
    title: Yup.string().required(),
    description: Yup.string(),
    price: Yup.number().required(),
    count: Yup.number().required(),
  })
}

export { Product }

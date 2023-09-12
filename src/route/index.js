// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
class Product {
  static #list = []
  
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 10000)
    this.createDate = () => {
      this.date = new Date().toISOString()
    }
  }

  static getList() {
    return this.#list;
  }

  checkId = (id) => this.id === id

  static add(product) {
    this.#list.push(product);
  }

  static getById(id) {
    return this.#list.find(product => product.id === id);
  }

  static updateById(id, data) {
    const product = this.getById(id);
      if (product) {
      if (data.name) product.name = data.name;
      if (data.price) product.price = data.price;
      if (data.description) product.description = data.description;
    }
  }

  static deleteById(id) {
    const index = this.#list.findIndex(product => product.id === id);
    if (index !== -1) {
      this.#list.splice(index, 1);
    }
  }
  
  static update = (
    name,
    price,
    description,
    { product },
  ) => {
    if (name) {
      product.name = name
    }

    if (price) {
      product.price = price
    }

    if (description) {
      product.description = description
    }
  }
}

// ================================================================

router.get('/product-create', function (req, res) {
 
  const list = Product.getList()
 
  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

router.post('/product-create', function (req, res) {

  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('product-alert', {
    style: 'product-alert',
    info: 'Товар успішно додано',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
 const productList = Product.getList();

    res.render('product-list', {
        style: 'product-list',
        data: {
            products: {
                list: productList,
                isEmpty: productList.length === 0,
            },
        },
    });
});
// ================================================================

router.get('/product-edit', function (req, res) {
 
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (product) {
    return res.render('product-edit', {
      style: 'product-edit',

      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('product-alert', {
      style: 'product-alert',
      info: 'Продукту за таким ID не знайдено',
    })
  }
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  console.log(id)
  console.log(product)

  if (product) {
    res.render('product-alert', {
      style: 'product-alert',
      info: 'Інформація про товар оновлена',
    })
  } else {
    res.render('product-alert', {
      style: 'product-alert',
      info: 'Сталася помилка',
    })
  }
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))

  res.render('product-alert', {
    style: 'product-alert',
    info: 'Товар видалений',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router

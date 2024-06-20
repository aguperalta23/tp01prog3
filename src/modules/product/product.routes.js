const express = require('express');
const productService = require('./product.service');
const userService = require('../user/user.service');

const router = express.Router();

// Crear un nuevo producto
router.post('/productos', async (req, res) => {
  try {
    const user = await userService.findOne(req.body.email);
    if (!user) {
      return res.status(404).send({ error: 'Usuario no encontrado' });
    }

    const producto = await productService.createIfNotExists(req.body, user._id);
    res.status(201).send(producto);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos los productos
router.get('/productos', async (req, res) => {
  try {
    const productos = await productService.paginated(req.query);
    res.send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un producto por ID
router.get('/productos/:id', async (req, res) => {
  try {
    const producto = await productService.findOneById(req.params.id);
    if (!producto) {
      return res.status(404).send();
    }
    res.send(producto);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un producto por ID
router.patch('/productos/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['nombre', 'precio', 'descripcion', 'categoria', 'stock'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Actualización inválida!' });
  }

  try {
    const producto = await productService.update(req.params.id, req.body);
    if (!producto) {
      return res.status(404).send();
    }
    res.send(producto);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un producto por ID
router.delete('/productos/:id', async (req, res) => {
  try {
    const producto = await productService.remove(req.params.id);
    if (!producto) {
      return res.status(404).send();
    }
    res.send(producto);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
import { Request, Response } from 'express';
import ProductAdmFacadeFactory from '../../modules/product-adm/factory/facade.factory';

// POST - /products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, salesPrice, stock } = req.body;

    const input = {
      name: name,
      description: description,
      purchasePrice: price,
      salesPrice: salesPrice,      
      stock: stock,
    };

    const productAdmFacade = ProductAdmFacadeFactory.create();
    const productCreated = await productAdmFacade.addProduct(input);

    res.status(201).json(productCreated);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: `Error to create product: ${error}` });
  }
};

// GET - /products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const productAdmFacade = ProductAdmFacadeFactory.create();
    const products = await productAdmFacade.findAllProducts();

    if (!products) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: `Error to fetch product: ${error}` });
  }
};


// GET - /products/:id/stock
export const getStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Product ID is required.' });
      return;
    }

    const productAdmFacade = ProductAdmFacadeFactory.create();
    const product = await productAdmFacade.checkStock({productId : id});

    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

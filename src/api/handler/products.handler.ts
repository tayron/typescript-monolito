import { Request, Response } from 'express';
import ProductAdmFacade from '../../modules/product-adm/facade/product-adm.facade';
import ProductAdmFacadeFactory from '../../modules/product-adm/factory/facade.factory';

// POST - /products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock } = req.body;

    const input = {
      name: name,
      description: description,
      purchasePrice: price,
      stock: stock,
    };

    const productAdmFacade = ProductAdmFacadeFactory.create();
    await productAdmFacade.addProduct(input);

    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: 'Failed to create product' });
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
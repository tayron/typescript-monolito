import { Request, Response } from 'express';
import PlaceOrderFactory from '../../modules/checkout/factory/place.order.factory';

// POST - /checkout
export const createPlaceOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId, products } = req.body;
    const input = {
      clientId: clientId,
      products: products,
    };    

    const placeOrder = PlaceOrderFactory.create();
    const output = await placeOrder.execute(input)

    res.status(201).json(output);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: `Error to create order: ${error}` });
  }
};

import { Request, Response } from 'express';
import PlaceOrderFactory from '../../modules/checkout/factory/place.order.factory';
import GenerateInvoiceFactory from '../../modules/invoice/factory/GenerateInvoiceFactory';

// POST - /invoice
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, document, street, number, complement, city, state, zipCode, items } = req.body;
    const input = {
      name: name,
      document: document,
      street: street,
      number: number,
      complement: complement,
      city: city,
      state: state,
      zipCode: zipCode,
        items: [{
          id: "",
          name: "",
          price: 0,
        }],
    };    

    input.items = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
    }));

    const invoice = GenerateInvoiceFactory.create();
    const output = await invoice.process(input)

    res.status(201).json(output);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: `Error to create invoice: ${error}` });
  }
};

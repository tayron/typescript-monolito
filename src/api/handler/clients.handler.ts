import { Request, Response } from 'express';
import Address from '../../modules/@shared/domain/value-object/address';
import ClientAdmFacadeFactory from '../../modules/client-adm/factory/client-adm.facade.factory';

// POST - /clients
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, document, street, number, complement, city, state, zipCode } = req.body;

    const input = {
      name: name,
      email: email,
      document: document,
      address: new Address(
        street,
        number,
        complement,
        city,
        state,
        zipCode,
      )
    };

    const clientAdmFacade = ClientAdmFacadeFactory.create();
    await clientAdmFacade.add(input);

    res.status(201).json({ message: 'Client created successfully' });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

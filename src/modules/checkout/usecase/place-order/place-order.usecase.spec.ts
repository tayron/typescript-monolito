import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto.";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);  
describe("PlaceOrderUseCase unit test", () => {

  describe("validateProducts method", () => {
    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase()
    it("should throw an error when products are not valid", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("No products selected")
      );

    });

    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) => 
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1
          })
        ),
      };

      //@ts-expect-error - force set productFacade
      placeOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };      

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "1" }],
      };      

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5)
      
    });
  });

  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate)
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockReturnValue(null),
      };
      
      //@ts-expect-error - no params in constructor
      const placeOrdrUseCase = new PlaceOrderUseCase();

      //@ts-expect-error - force set clientFacade
      placeOrdrUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };
      
      await expect(placeOrdrUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockReturnValue(true),
      };

      //@ts-expect-error - no params in constructor
      const placeOrdrUseCase = new PlaceOrderUseCase();

      const mockValidateProducts = jest        
        .spyOn(placeOrdrUseCase, "validateProducts")        
        .mockRejectedValue(new Error("No products selected"));

      //@ts-expect-error - force set clientFacade
      placeOrdrUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };
      
      await expect(placeOrdrUseCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );      

      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });

    describe("place an order", () => {

      const clientProps = {
        id: "1",
        name: "Client 1",
        document: "123456789",
        email: "XXXXXXXXXXXXXXXXX",  
        address: {
          street: "Street 1",
          number: "123",
          complement: "Complement 1",
          city: "City 1",
          state: "State 1",
          zipCode: "12345678",
        },
      };

      const mockClientFacade = {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(clientProps),        
      };      

      const mockPaymentFacade = {
        process: jest.fn(),
      };
      
      const mockCheckoutRepository = {
        addOrder: jest.fn(),
        findOrder: jest.fn(),
      };

      const mockInvoiceFacade = {
        process: jest.fn().mockResolvedValue({id: "1"})
      }

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        null,
        mockCheckoutRepository,        
        mockInvoiceFacade,
        mockPaymentFacade,
      );

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "Product 1 description",
          salesPrice: 100,
        }),
        "2": new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "Product 2 description",
          salesPrice: 200,
        }),
      };

      const mockValidateProducts = jest
        .spyOn(placeOrderUseCase, "validateProducts")
        .mockResolvedValue(null);

      const mockGetProduct = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "getProduct")
        //@ts-expect-error - not return never
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId];
        });

        it("should not be approved an order", async () => {
          mockPaymentFacade.process.mockResolvedValue({
            transactionId: "1",
            orderId: "1",
            amount: 1000,
            status: "error",
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const input: PlaceOrderInputDto = {
            clientId: "1",
            products: [{ productId: "1" }, { productId: "2" }],
          };

          let output = await placeOrderUseCase.execute(input);
          

          expect(output.invoiceId).toBeNull();
          expect(output.total).toBe(300);

          expect(output.products).toStrictEqual([
            { productId: "1", name: "Product 1", salesPrice: 100 },
            { productId: "2", name: "Product 2", salesPrice: 200 },
          ]);

          expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
          expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1"});
          expect(mockValidateProducts).toHaveBeenCalledTimes(1);
          expect(mockValidateProducts).toHaveBeenCalledWith(input);
          expect(mockGetProduct).toHaveBeenCalledTimes(2);          
          expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1); 
          expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);

          expect(mockPaymentFacade.process).toHaveBeenCalledWith({
            orderId: output.id,
            amount: output.total
          });

          expect(mockInvoiceFacade.process).toHaveBeenCalledTimes(0);
        });

        it("should be approved", async () => {
            mockPaymentFacade.process.mockResolvedValue({
              transactionId: "1",
              orderId: "1",
              amount: 300,
              status: "approved",
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            
            const input: PlaceOrderInputDto = {
              clientId: "1",
              products: [{ productId: "1" }, { productId: "2" }],
            };

            let output = await placeOrderUseCase.execute(input);

            expect(output.invoiceId).toBe("1");
            expect(output.total).toBe(300);
            expect(output.products).toStrictEqual([
              { productId: "1", name: "Product 1", salesPrice: 100 },
              { productId: "2", name: "Product 2", salesPrice: 200 },
            ]);

            expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
            expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1"});
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);            
            expect(mockGetProduct).toHaveBeenCalledTimes(2);
            expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
            expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);            
            expect(mockPaymentFacade.process).toHaveBeenCalledWith({
              orderId: output.id,
              amount: output.total
            });
            expect(mockInvoiceFacade.process).toHaveBeenCalledTimes(1);

            expect(mockInvoiceFacade.process).toHaveBeenCalledWith({
              name: clientProps.name,
              document: clientProps.document,
              street: clientProps.address.street,
              number: clientProps.address.number,
              complement: clientProps.address.complement,
              city: clientProps.address.city,
              state: clientProps.address.state,
              zipCode: clientProps.address.zipCode,
              items: [
                {id: products["1"].id.id, 
                  name: products["1"].name, 
                  price: products["1"].salesPrice
                },{
                  id: products["2"].id.id, 
                  name: products["2"].name, 
                  price: products["2"].salesPrice
                },
              ]
            });

        })
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate)
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error wheen product not found", async () => {

      const mockCatalogFacade = {
        find: jest.fn().mockReturnValue(null),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockReturnValue({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        }),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
        new Product({
        id: new Id("0"),
        name: "Product 0",
        description: "Product 0 description",
        salesPrice: 0,
      }));

      expect(mockCatalogFacade.find).toBeCalledTimes(1)

    });

  })
})
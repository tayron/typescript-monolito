import { Sequelize } from "sequelize-typescript";
import PaymentFacadeFactory from "../factory/payment.facade.factory";
import TransactionModel from "../repository/transaction.model";
import { Umzug } from "umzug";
import { migrator } from "../../../migrations/migrator";

describe("PaymentFacade test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    await sequelize.addModels([TransactionModel]);
    migration = migrator(sequelize, false)
    await migration.up()
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }    
    migration = migrator(sequelize, false)
    await migration.down()
    await sequelize.close()
  });

  it("should create a transaction", async () => {
    // const repository = new TransactionRepostiory();
    // const usecase = new ProcessPaymentUseCase(repository);
    // const facade = new PaymentFacade(usecase);

    const facade = PaymentFacadeFactory.create();

    const input = {
      orderId: "order-1",
      amount: 100,
    };

    const output = await facade.process(input);

    expect(output.transactionId).toBeDefined();
    expect(output.orderId).toBe(input.orderId);
    expect(output.amount).toBe(input.amount);
    expect(output.status).toBe("approved");
  });
});

import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "./migrator";

describe("Migrator test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;
  const showLog = false

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false, // Deixe `true` se precisar de logs
    });

    await migrator(sequelize, showLog).up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize, false);
    await migration.down();
    await sequelize.close();
  });

  it("should create the all tables", async () => {
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();

    expect(tables).toContain("products");
    expect(tables).toContain("clients");
    expect(tables).toContain("orders");
    expect(tables).toContain("invoices");
    expect(tables).toContain("invoices_items");
    expect(tables).toContain("transactions");
  });
});

import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug"
import { migrator } from "./migrator";


describe("Migrator test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: true,      
    });

    await migrator(sequelize).up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  });

  it("should create a product", async () => {

  });
});

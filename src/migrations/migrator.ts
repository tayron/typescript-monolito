import { SequelizeStorage, Umzug } from "umzug"
import { join } from "path"
import { Sequelize } from "sequelize"

export const migrator = (
  sequelize: Sequelize
) => {

    let migrationsPath = [
      "*/src/migrations/products",
      "*/src/migrations/clients",
      "*/src/migrations/orders",
      "*/src/migrations/invoices",
      "*/src/migrations/invoices-items",      
      "*/src/migrations/transactions"
    ].join("/*.ts,") + "/*.ts";

  return new Umzug({
    migrations: {
      glob: [
        `{${migrationsPath}}`,
        {
          cwd: join(__dirname, "../../../"),
          ignore: ["**/*.d.ts", "**/index.ts", "**/index.js"],
        },
      ],
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: console
  })
}
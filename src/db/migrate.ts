import db from "./index";
import fs from "fs";
import path from "path";

const executeMigration = async (filePath: string) => {
  const migrationSql = fs.readFileSync(filePath, "utf8");
  try {
    await db.none(migrationSql);
    console.log(
      `Migration ${path.basename(filePath)} executed successfully !!`
    );
  } catch (error: any) {
    console.error(
      `Error executing migration ${path.basename(filePath)}: ${error.message}`
    );
  }
};

const runMigrations = async () => {
  const migrationsDir = path.join(__dirname, "migrations");
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"));

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    await executeMigration(filePath);
  }

  db.$pool.end();
};

runMigrations();

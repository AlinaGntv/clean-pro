import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@cleanpro.ru" },
  });
  if (!existingUser) {
    const hash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: "admin@cleanpro.ru",
        password: hash,
        name: "Администратор",
      },
    });
    console.log("Admin user created: admin@cleanpro.ru / admin123");
  }

  const settings = [
    { key: "company_name", value: "CleanPro", group: "company" },
    { key: "company_phone", value: "+7 (495) 123-45-67", group: "company" },
    { key: "company_email", value: "info@cleanpro.ru", group: "company" },
    { key: "company_address", value: "г. Москва, ул. Чистая, 42", group: "company" },
    { key: "price_maintain_per_m2", value: "80", group: "pricing" },
    { key: "price_general_per_m2", value: "150", group: "pricing" },
    { key: "price_post_repair_per_m2", value: "220", group: "pricing" },
    { key: "price_post_move_per_m2", value: "180", group: "pricing" },
    { key: "price_windows", value: "500", group: "pricing" },
    { key: "price_oven", value: "1500", group: "pricing" },
    { key: "price_fridge", value: "1200", group: "pricing" },
    { key: "price_balcony", value: "800", group: "pricing" },
    { key: "price_ironing", value: "600", group: "pricing" },
    { key: "price_furniture_cleaning", value: "2000", group: "pricing" },
    { key: "surcharge_urgent", value: "30", group: "pricing" },
    { key: "surcharge_weekend", value: "20", group: "pricing" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("Default settings seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

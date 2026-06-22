import { PrismaClient } from "@prisma/client";
import suppliers from "../data/suppliers.json";

const prisma = new PrismaClient();

function toText(value: any): string {
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "";
}

function toArray(value: any): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (!value) return [];
  return [String(value)];
}

async function main() {
  console.log(`Importing ${suppliers.length} suppliers...`);
  let n = 0;

  for (const s of suppliers as any[]) {
    await prisma.supplier.upsert({
      where: { code: s.code },
      update: {
        name: s.name ?? "",
        category: s.category ?? "",
        products: toText(s.products),
        tags: toArray(s.tags),
        district: s.district ?? "",
        verified: Boolean(s.verified),
        agent: Boolean(s.agent),
        wechat: toArray(s.wechat),
        email: s.email ?? "",
        tel: s.tel ?? "",
        location: s.location ?? "",
      },
      create: {
        code: s.code,
        name: s.name ?? "",
        category: s.category ?? "",
        products: toText(s.products),
        tags: toArray(s.tags),
        district: s.district ?? "",
        verified: Boolean(s.verified),
        agent: Boolean(s.agent),
        wechat: toArray(s.wechat),
        email: s.email ?? "",
        tel: s.tel ?? "",
        location: s.location ?? "",
      },
    });

    if (++n % 200 === 0) console.log(`  ${n}...`);
  }

  console.log(`Done: ${n} suppliers in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
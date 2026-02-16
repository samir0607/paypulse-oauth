import db from "./drizzle";
import { companyTable } from "./schema/Company";

async function seed() {
  try {
    console.log("Seeding database...");
    
    // Create a test company
    const result = await db
      .insert(companyTable)
      .values({
        name: "Test Company",
        industry: "Technology",
        numberOfEmployees: 100,
        website: "https://example.com",
        currency: "USD",
        headLocation: "USA",
      })
      .execute();
    
    console.log("✅ Test company created:", result);
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') {
      console.log("✅ Test company already exists");
    } else {
      console.error("❌ Seed failed:", error?.message || error);
      process.exit(1);
    }
  }
}

seed().then(() => {
  console.log("Seed completed successfully!");
  process.exit(0);
});

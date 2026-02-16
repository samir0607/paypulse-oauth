import { eq, and } from "drizzle-orm";
import db from "../drizzle";
import { IntegrationInsert, IntegrationTable, systems } from "../schema/Integrations";

export class IntegrationRepository {
	public static async createIntegration(integration: IntegrationInsert) {
		try {
			return await db
				.insert(IntegrationTable)
				.values(integration)
				.$returningId()
				.execute();
		} catch (error) {
			throw error;
		}
	}

	public static async getIntegrationByCompanyIdAndType(company_id: number, type: (typeof systems)[number]) {
		try {
			const res = await db
				.select()
				.from(IntegrationTable)
				.where(and(eq(IntegrationTable.company_id, company_id), eq(IntegrationTable.type, type)))
				.execute();
			return res[0];
		} catch (error) {
			throw error;
		}
	}
};
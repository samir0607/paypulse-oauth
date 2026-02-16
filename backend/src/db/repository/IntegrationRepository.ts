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
		} catch (error: any) {
			if (error?.code === 'ER_NO_REFERENCED_ROW_2' || error?.message?.includes('foreign key')) {
				throw new Error(`Company with ID ${integration.company_id} does not exist. Please create the company first.`);
			}
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
import db from "../drizzle";
import { IntegrationInsert, IntegrationTable } from "../schema/Integrations";

export class IntegrationRepository {
	public static async createIntegration(integration: IntegrationInsert) {
		try {
			return await db
				.insert(IntegrationTable)
				.values(integration)
				.$returningId();
		} catch (error) {
			throw error;
		}
	}
};
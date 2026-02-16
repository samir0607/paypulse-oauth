type OAuthStateData = {
  system: "sap" | "oracle";
  companyId: number;
};

class OAuthStateStoreClass {
  private store = new Map<string, OAuthStateData>();

  addState(state: string, data: OAuthStateData) {
    this.store.set(state, data);
  }

  isValidState(state: string) {
    return this.store.has(state);
  }

  getData(state: string) {
    return this.store.get(state)!;
  }

  removeState(state: string) {
    this.store.delete(state);
  }
}

export const OAuthStateStore = new OAuthStateStoreClass();

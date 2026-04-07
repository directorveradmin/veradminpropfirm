import { AccountWorkflowResult } from '../accountWorkflowTypes';
import { refreshReadModel } from '../read-models/builders';

export const step6ViewModelIntegrator = {
  async refresh(results: AccountWorkflowResult[]) {
    for (const r of results) {
      for (const key of r.invalidationKeys) {
        await refreshReadModel(key);
      }
    }
  }
};

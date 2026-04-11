import { describe, expect, it } from 'vitest';
import { getReportsScreenVM } from '@/lib/services/reporting';

describe('Step 12 reporting scaffold', () => {
  it('returns a scaffold-safe reports view model', () => {
    const vm = getReportsScreenVM();
    expect(vm.title).toBe('Reports');
    expect(vm.status).toBe('scaffold');
    expect(vm.snapshotCards.length).toBeGreaterThan(0);
    expect(vm.exportOptions.length).toBeGreaterThan(0);
  });
});
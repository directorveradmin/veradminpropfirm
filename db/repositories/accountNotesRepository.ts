import { AddAccountNoteCommand } from '../../src/lib/services/accountWorkflowTypes';

export class AccountNotesRepository {
    insertAccountNote(command: AddAccountNoteCommand): string {
        // TODO: insert note row
        return '';
    }

    getNotes(accountId: string, limit = 20) {
        // TODO: fetch recent notes
        return [];
    }
}

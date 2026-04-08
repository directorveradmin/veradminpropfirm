import React from 'react';
import { AccountDetailVM } from '../../lib/view-models/accountDetail';

interface Props {
    account: AccountDetailVM;
}

const AccountDetailScreen: React.FC<Props> = ({ account }) => {
    return (
        <div className='account-detail-screen'>
            <header>
                <h1>{account.header.label}</h1>
                <span>{account.header.firm} | {account.header.lifecycleStage}</span>
                <span>{account.header.mode}</span>
                <span>{account.header.stateBadge}</span>
            </header>

            <section className='current-state'>
                {/* Render all current state summary fields */}
                <p>Current Balance: {account.currentState.currentBalance}</p>
                <p>Lives: {account.currentState.lives}</p>
                <p>Next Action: {account.currentState.nextAction}</p>
            </section>

            <section className='permissions'>
                {/* Render permissions */}
                <p>Tradable: {account.permissions.tradable}</p>
                <p>Full Size: {account.permissions.fullSizeAllowed}</p>
            </section>

            <section className='why-state'>
                {account.whyState.map((reason, idx) => <p key={idx}>{reason}</p>)}
            </section>

            <section className='tactical-actions'>
                {/* Action buttons grouped */}
            </section>

            <section className='journal-timeline'>
                {/* Timeline render */}
            </section>

            <section className='payout-context'>
                {/* Payout/admin info */}
            </section>

            <section className='simulation-entry'>
                <button>Open Simulation</button>
            </section>

            <section className='secondary-metadata'>
                {/* Metadata render */}
            </section>
        </div>
    );
};

export default AccountDetailScreen;

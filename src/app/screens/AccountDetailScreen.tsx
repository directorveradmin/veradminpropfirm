"use client";

import dummyData from './dummy-data/AccountDetailScreen.json';
import React, { useEffect, useState } from 'react';
import { useRefreshSignal } from '../../hooks/useRefreshSignal';
import { refreshCoordinator } from '../../lib/services/refreshCoordinator';
import * as readModels from '../../lib/services/read-models';
import { AccountDetailScreenVM } from '../../lib/view-models/AccountDetailScreen';
import FilterPanel from '../components/FilterPanel';
import DetailDrawer from '../components/DetailDrawer';

const AccountDetailScreen: React.FC = () => {
    const [data, setData] = useState<AccountDetailScreenVM | null>(null);
    const [filters, setFilters] = useState({});
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const refreshSignal = useRefreshSignal();

    useEffect(() => {
        async function load() {
            const vm = await readModels.loadAccountDetailScreen();
            setData(vm);
        }
        load();
        const unsub = refreshCoordinator.subscribe('AccountDetailScreen', load);
        return () => unsub();
    }, [refreshSignal]);

    if (!data) return <div>Loading AccountDetailScreen...</div>;

    return (
        <div className='AccountDetailScreen'>
            <FilterPanel filters={filters} onChange={setFilters} />
            <DetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default AccountDetailScreen;


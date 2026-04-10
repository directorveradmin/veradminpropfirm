"use client";

import dummyData from './dummy-data/JournalScreen.json';
import React, { useEffect, useState } from 'react';
import { useRefreshSignal } from '../../hooks/useRefreshSignal';
import { refreshCoordinator } from '../../lib/services/refreshCoordinator';
import * as readModels from '../../lib/services/read-models';
import { JournalScreenVM } from '../../lib/view-models/JournalScreen';
import FilterPanel from '../components/FilterPanel';
import DetailDrawer from '../components/DetailDrawer';

const JournalScreen: React.FC = () => {
    const [data, setData] = useState<JournalScreenVM | null>(null);
    const [filters, setFilters] = useState({});
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const refreshSignal = useRefreshSignal();

    useEffect(() => {
        async function load() {
            const vm = await readModels.loadJournalScreen();
            setData(vm);
        }
        load();
        const unsub = refreshCoordinator.subscribe('JournalScreen', load);
        return () => unsub();
    }, [refreshSignal]);

    if (!data) return <div>Loading JournalScreen...</div>;

    return (
        <div className='JournalScreen'>
            <FilterPanel filters={filters} onChange={setFilters} />
            <DetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default JournalScreen;


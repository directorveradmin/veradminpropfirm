"use client";

import dummyData from './dummy-data/AlertsScreen.json';
import React, { useEffect, useState } from 'react';
import { useRefreshSignal } from '../../hooks/useRefreshSignal';
import { refreshCoordinator } from '../../lib/services/refreshCoordinator';
import * as readModels from '../../lib/services/read-models';
import { AlertsScreenVM } from '../../lib/view-models/AlertsScreen';
import FilterPanel from '../components/FilterPanel';
import DetailDrawer from '../components/DetailDrawer';

const AlertsScreen: React.FC = () => {
    const [data, setData] = useState<AlertsScreenVM | null>(null);
    const [filters, setFilters] = useState({});
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const refreshSignal = useRefreshSignal();

    useEffect(() => {
        async function load() {
            const vm = await readModels.loadAlertsScreen();
            setData(vm);
        }
        load();
        const unsub = refreshCoordinator.subscribe('AlertsScreen', load);
        return () => unsub();
    }, [refreshSignal]);

    if (!data) return <div>Loading AlertsScreen...</div>;

    return (
        <div className='AlertsScreen'>
            <FilterPanel filters={filters} onChange={setFilters} />
            <DetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default AlertsScreen;


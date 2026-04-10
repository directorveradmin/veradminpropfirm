"use client";

import dummyData from './dummy-data/CalendarRotationScreen.json';
import React, { useEffect, useState } from 'react';
import { useRefreshSignal } from '../../hooks/useRefreshSignal';
import { refreshCoordinator } from '../../lib/services/refreshCoordinator';
import * as readModels from '../../lib/services/read-models';
import { CalendarRotationScreenVM } from '../../lib/view-models/CalendarRotationScreen';
import FilterPanel from '../components/FilterPanel';
import DetailDrawer from '../components/DetailDrawer';

const CalendarRotationScreen: React.FC = () => {
    const [data, setData] = useState<CalendarRotationScreenVM | null>(null);
    const [filters, setFilters] = useState({});
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const refreshSignal = useRefreshSignal();

    useEffect(() => {
        async function load() {
            const vm = await readModels.loadCalendarRotationScreen();
            setData(vm);
        }
        load();
        const unsub = refreshCoordinator.subscribe('CalendarRotationScreen', load);
        return () => unsub();
    }, [refreshSignal]);

    if (!data) return <div>Loading CalendarRotationScreen...</div>;

    return (
        <div className='CalendarRotationScreen'>
            <FilterPanel filters={filters} onChange={setFilters} />
            <DetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default CalendarRotationScreen;


import ScreenComponent from '../AlertsScreen';
import * as readModels from '../../../lib/services/read-models';

export default async function Page() {
    const data = await readModels.loadAlertsScreen();
    return <ScreenComponent data={data} />;
}

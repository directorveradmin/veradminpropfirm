import ScreenComponent from '../PayoutsScreen';
import * as readModels from '../../../lib/services/read-models';

export default async function Page() {
    const data = await readModels.loadPayoutsScreen();
    return <ScreenComponent data={data} />;
}

import ScreenComponent from '../AccountDetailScreen';
import * as readModels from '../../../lib/services/read-models';

export default async function Page() {
    const data = await readModels.loadAccountDetailScreen();
    return <ScreenComponent data={data} />;
}

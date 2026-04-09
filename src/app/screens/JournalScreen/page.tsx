import ScreenComponent from '../JournalScreen';
import * as readModels from '../../../lib/services/read-models';

export default async function Page() {
    const data = await readModels.loadJournalScreen();
    return <ScreenComponent data={data} />;
}

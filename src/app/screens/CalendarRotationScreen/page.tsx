import ScreenComponent from '../CalendarRotationScreen';
import * as readModels from '../../../lib/services/read-models';

export default async function Page() {
    const data = await readModels.loadCalendarRotationScreen();
    return <ScreenComponent data={data} />;
}

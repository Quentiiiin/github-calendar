import { ActivityCalendar } from 'react-activity-calendar';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug;
    const currentYear = new Date().getFullYear();
    const url = `https://github-contributions-api.jogruber.de/v4/${slug}`;
    const res = await fetch(url);
    const json = await res.json();
    const rawData = json.contributions;
    const data: any[] = [];
    rawData.forEach((entry: any) => {
        const date: string = entry.date;
        if (date.startsWith(`${currentYear}`)) {
            data.push(entry);
        }
    });

    return (
        <div className='flex w-screen h-screen justify-center items-center overflow-hidden page-container'>
            <div className='overflow-hidden scale-150'>
                <ActivityCalendar data={data} />
            </div>
        </div>
    );
}

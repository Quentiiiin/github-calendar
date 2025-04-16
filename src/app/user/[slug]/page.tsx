'use client'
import { ActivityCalendar } from 'react-activity-calendar';
import { useState, useEffect } from 'react';
import React from 'react';

export default function Page({params}: any) {
    const { slug } = params;
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        const fetchDataAndUpdate = async (currentSlug: string) => {
            const newData = await fetchData(currentSlug);
            setData(newData);
        };

        if (slug) {
            fetchDataAndUpdate(slug);
            intervalId = setInterval(() => {
                if (slug) {
                    fetchDataAndUpdate(slug);
                }
            }, 1000 * 60);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [slug]);

    return (
        <div className='flex w-screen h-screen justify-center items-center overflow-hidden page-container'>
            <div className='overflow-hidden scale-150'>
                {data && data.length > 0 ? (
                    <ActivityCalendar data={data} colorScheme={'dark'} />
                ) : (
                    <p>No contribution data found for the current year.</p>
                )}
            </div>
        </div>
    );
}

async function fetchData(slug: string): Promise<any[]> {
    const url = `https://github-contributions-api.jogruber.de/v4/${slug}`;
    const res = await fetch(url);
    const json = await res.json();
    const currentYear = new Date().getFullYear();
    const rawData = json.contributions;
    const data: any[] = [];
    rawData.forEach((entry: any) => {
        const date: string = entry.date;
        if (date.startsWith(`${currentYear}`)) {
            data.push(entry);
        }
    });
    return data;
}
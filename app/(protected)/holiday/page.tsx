"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function HolidayPage() {
  const hours = -5.15;
  const getBgColor = (hours: number) => {
    if (hours > 20 || hours < -20) return "bg-red-400";
    if (hours >= -10 && hours <= 10) return "bg-green-400";
    if (hours > 10 || hours < -10) return "bg-orange-400";
  };
  const stringHours = (hours: number) => {
    return hours.toFixed(2);
  };

  return (
    <div className="mt-10">
      <Card className="overflow-hidden p-3">
        <CardHeader>
          <CardTitle>Infos</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 justify-between  ">
          <Card className="flex-1 aspect-square w-full min-w-0 bg-indigo-400 border-0 text-black font-bold">
            <CardContent className="flex flex-col items-center justify-center h-full ">
              <p>Solde</p>
              <p>17,00</p>
            </CardContent>
          </Card>
          <Card className="flex-1 aspect-square w-full min-w-0 bg-pink-400 border-0 text-black font-bold">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <p>Pris</p>
              <p>13,00</p>
            </CardContent>
          </Card>
          <Card
            className={`flex-1 aspect-square w-full min-w-0 border-0 text-black font-bold ${getBgColor(hours)}`}
          >
            <CardContent className="flex flex-col items-center justify-center h-full">
              <p>Heures</p>
              <p>{stringHours(hours)}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

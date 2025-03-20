"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarProps {
  onDateRangeSelect: (startDate: Date, endDate: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateRangeSelect }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [selectionMode, setSelectionMode] = useState<"start" | "end">("start");
  const [availableDays, setAvailableDays] = useState<number>(23);

  // Assurez-vous que ces fonctions créent de nouvelles instances de Date
  const prevMonth = () => {
    setCurrentMonth((prevDate) => {
      const newDate = new Date(prevDate);
      return subMonths(newDate, 1);
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prevDate) => {
      const newDate = new Date(prevDate);
      return addMonths(newDate, 1);
    });
  };

  const onDateClick = (day: Date) => {
    // Créer une nouvelle instance de Date pour éviter les problèmes de référence
    const clickedDate = new Date(day);

    if (selectionMode === "start") {
      setSelectedRange({ start: clickedDate, end: null });
      setSelectionMode("end");
    } else {
      if (selectedRange.start && clickedDate >= selectedRange.start) {
        setSelectedRange({ ...selectedRange, end: clickedDate });
        setSelectionMode("start");

        if (selectedRange.start) {
          onDateRangeSelect(selectedRange.start, clickedDate);
        }
      } else {
        setSelectedRange({ start: clickedDate, end: null });
        setSelectionMode("end");
      }
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between p-4">
        <div>
          <button
            onClick={prevMonth}
            className="mr-4 px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            aria-label="Mois précédent"
          >
            &lt;
          </button>
        </div>
        <div className="text-lg font-bold">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </div>
        <div>
          <button
            onClick={nextMonth}
            className="ml-4 px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            aria-label="Mois suivant"
          >
            &gt;
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const weekDays = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm text-gray-500 py-2">
          {weekDays[i]}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    // Créer de nouvelles instances de Date pour éviter les problèmes de référence
    const monthStart = startOfMonth(new Date(currentMonth));
    const monthEnd = endOfMonth(new Date(monthStart));
    const startDate = startOfWeek(new Date(monthStart), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(monthEnd), { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = new Date(startDate);

    const isInRange = (date: Date) => {
      if (!selectedRange.start || !selectedRange.end) return false;
      return isWithinInterval(date, {
        start: selectedRange.start,
        end: selectedRange.end,
      });
    };

    const isSelected = (date: Date) => {
      return (
        (selectedRange.start && isSameDay(date, selectedRange.start)) ||
        (selectedRange.end && isSameDay(date, selectedRange.end))
      );
    };

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        // Important: clone la date pour éviter les références partagées
        const cloneDay = new Date(day);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={`relative h-10 flex items-center justify-center cursor-pointer ${
              !isCurrentMonth
                ? "text-gray-300"
                : isSelected(day)
                ? "relative z-10"
                : isInRange(day)
                ? "bg-purple-200"
                : ""
            }`}
            onClick={() => isCurrentMonth && onDateClick(cloneDay)}
          >
            {isSelected(day) &&
              (selectedRange.start && isSameDay(day, selectedRange.start) ? (
                <div className="absolute w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center z-0">
                  <span className="relative z-10 text-black">
                    {formattedDate}
                  </span>
                </div>
              ) : (
                <div className="absolute w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center z-0">
                  <span className="relative z-10 text-white">
                    {formattedDate}
                  </span>
                </div>
              ))}
            {!isSelected(day) && formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  const renderFooter = () => {
    if (!selectedRange.start || !selectedRange.end) {
      return (
        <div className="p-4 text-sm text-gray-600">
          {availableDays} jours disponible à fin juin 2024
        </div>
      );
    }

    const start = selectedRange.start;
    const end = selectedRange.end;
    const dayCount =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return (
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">
          {dayCount} jours sélectionnés
        </div>
        <button className="w-full bg-purple-600 text-white py-2 rounded-md">
          Sélectionner cette période
        </button>
      </div>
    );
  };

  // Ajouter un console.log pour déboguer la valeur du mois actuel
  console.log(
    "Current month:",
    format(currentMonth, "MMMM yyyy", { locale: fr })
  );

  return (
    <div className="border rounded-lg shadow-md bg-white max-w-md mx-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Faire une demande</h2>
        <button className="text-gray-400">&times;</button>
      </div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderFooter()}
    </div>
  );
};

export default Calendar;

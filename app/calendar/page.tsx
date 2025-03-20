// pages/index.tsx
import type { NextPage } from "next";
import Calendar from "../../components/layout/calendar";

const Home: NextPage = () => {
  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    console.log("Date range selected:", startDate, endDate);
    // Ici vous pouvez traiter la sélection de date comme vous le souhaitez
  };

  return (
    <div className="container mx-auto p-4">
      <Calendar onDateRangeSelect={handleDateRangeSelect} />
    </div>
  );
};

export default Home;

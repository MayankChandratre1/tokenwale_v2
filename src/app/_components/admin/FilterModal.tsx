import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, Filter } from "lucide-react"; // Icon library
import "@/styles/filter.css";
import { TimePicker } from "./TimePicker";

const FilterModal: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [wallet, setWallet] = useState<"everyone"|"pasttransactions">("everyone")
  const [open, setOpen] = useState(false)


  const reset = ()=>{
    setStartDate(null)
    setEndDate(null)
    setSelectedDates([])
    setHours(0)
    setMinutes(0)
    setWallet("everyone")
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formatDate = (date: Date) => {
    return formatter.format(date).split("/").reverse().join("-");
  };

  const handleDateClick = (date: Date) => {
    if (!startDate) {
      // No start date selected; set the start date
      setStartDate(date);
      setSelectedDates([date]);
    } else if (!endDate) {
      // No end date selected; set the end date and range
      if (date < startDate) {
        const range = getDatesInRange(date, startDate);
        setEndDate(startDate);
        setStartDate(date);
        setSelectedDates(range);
      } else {
        const range = getDatesInRange(startDate, date);
        setEndDate(date);
        setSelectedDates(range);
      }
    } else {
      // Both start and end dates are already set; reset to a new range
      setStartDate(date);
      setEndDate(null);
      setSelectedDates([date]);
    }
  };

 

  const getDatesInRange = (start: Date, end: Date): Date[] => {
    const dates = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (start > end) {
      dates.reverse();
    }

    return dates;
  };


  const ApplyFilters = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(e)=>setOpen(e)}>
      <DialogTrigger asChild>
        <Button onClick={()=>{
            setOpen(true)
        }} className="bg-transparent hover:bg-transparent">
          <Filter />
        </Button>
      </DialogTrigger>
      <DialogContent
        showOverlay={false}
        className="bg-gradient-to-b bg-opacity-10 from-transparent to-[#5AD44622] shadow-white/10 border border-[#2d2d2d] backdrop-blur-lg backdrop:opacity-100 border-none text-white max-h-fit p-10"
      >
        <div className="space-y-4 ">
          <h2 className="text-xl font-bold">Filters</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <div className="bg-[#38f68f] flex justify-between w-[90%] my-2 px-3 py-1 rounded-md items-center">
                <div className="text-xs flex gap-2 text-black  flex-1">
                  <p>{startDate ? formatDate(startDate) : "YYYY_MM_DD"}</p>
                  <p>to</p>
                  <p>{endDate ? formatDate(endDate) : "YYYY_MM_DD"}</p>
                </div>
                <div>
                  <CalendarIcon color="black" size={18} />
                </div>
              </div>
              <Calendar
                selected={selectedDates}
                onSelect={(days) => {}}
                onDayClick={(date: Date) => handleDateClick(date)}
                mode="multiple"
                classNames={{
                  day_today: `border-[#38f68f]`, // Add a border to today's date
                  day_selected: `bg-[#38f68f] rounded-none hover:bg-[#38f68fdd] text-black `, // Highlight the selected day
                  root: `bg-black text-white shadow-lg p-5 rounded-xl w-full`,
                  day: `w-full h-full rounded-md`,
                }}
              />
            </div>
            <div>
              <div className="bg-[#38f68f] flex justify-between w-[90%] my-2 px-3 py-1 rounded-md items-center">
                <div className="text-xs flex gap-2 text-black  flex-1">
                  <p>{`${hours < 10 ? "0" + hours : hours}:${
                    minutes < 10 ? "0" + minutes : minutes
                  }`}</p>
                </div>
                <div>
                  <ClockIcon color="black" size={18} />
                </div>
              </div>
              <TimePicker
                time={{
                  hours,
                  minutes,
                }}
                setHours={setHours}
                setMinutes={setMinutes}
              />
            </div>
          </div>
                
          <div>
            <p className="text-xl font-bold mb-2">Wallets</p>
            <div className="flex gap-2">
                <Button onClick={()=>{
                    setWallet("everyone")
                }} className={`rounded-none ${wallet == 'everyone' ? "bg-[#38f68f] hover:bg-[#38f68f] text-black":"bg-transparent hover:bg-transparent text-white"}`}>EVERYONE</Button>
                <Button onClick={()=>{
                    setWallet("pasttransactions")
                }} className={`rounded-none ${wallet == 'pasttransactions' ? "bg-[#38f68f] hover:bg-[#38f68f] text-black":"bg-transparent hover:bg-transparent text-white"}`}>PAST TRANSACTIONS</Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={reset} className="bg-transparent hover:bg-transparent border border-[#38f68f]">Reset</Button>
            <Button onClick={ApplyFilters} className="bg-[#38f68f] hover:bg-[#38f68fdd] text-black">Apply</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;

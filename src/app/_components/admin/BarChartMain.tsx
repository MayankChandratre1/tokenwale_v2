import {
  Bar,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/trpc/react";
import { formatFirestoreTimestamp } from "@/utils/random";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { limit } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const BarChartMain = () => {
  const chartConfig = {
    token: {
      label: "Token",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  const [filter, setFilter] = useState<"daily" | "monthly" | "yearly">("daily")

  const [rows, setRows] = useState(7)
  const [ticksX, setTicksX] = useState<string[]>([new Date().toDateString(), "12:00 AM", "3:00 AM", "6:00 AM", "9:00 AM", "12:00 PM"])

  const { data: txns, isPending } = api.txn.getLatestTxn.useQuery({ 
    limit: rows
   });

  //  const txns = [
  //       {
  //           id: "39901568",
  //           "timestamp": {
  //               "date": "19/12/24",
  //               "time": "3:36 PM"
  //           },
  //           "from": "76396130",
  //           "to": "35049053",
  //           "amount": 98
  //       },
  //       {
  //           id: "69543393",
  //           "timestamp": {
  //               "date": "19/12/24",
  //               "time": "3:31 PM"
  //           },
  //           "from": "76396130",
  //           "to": "35049053",
  //           "amount": 98
  //       },
  //       {
  //           id: "54250855",
  //           "timestamp": {
  //               "date": "19/12/24",
  //               "time": "3:05 PM"
  //           },
  //           "from": "76396130",
  //           "to": "35049053",
  //           "amount": 98
  //       },
  //       {
  //           id: "06764940",
  //           "timestamp": {
  //               "date": "19/12/24",
  //               "time": "3:01 PM"
  //           },
  //           "from": "76396130",
  //           "to": "35049053",
  //           "amount": 98
  //       },
  //       {
  //           id: "35317595",
  //           "timestamp": {
  //               "date": "19/12/24",
  //               "time": "3:01 PM"
  //           },
  //           "from": "76396130",
  //           "to": "35049053",
  //           "amount": 98
  //       },
  //       {
  //           id: "68507087",
  //           "timestamp": {
  //               "date": "19/12/24",
  //               "time": "3:01 PM"
  //           },
  //           "from": "76396130",
  //           "to": "35049053",
  //           "amount": 98
  //       },
  //       {
  //           id: "13940821",
  //           "timestamp": {
  //               "date": "16/12/24",
  //               "time": "6:58 PM"
  //           },
  //           "from": "76396130",
  //           "to": "35049053",
  //           "amount": 98
  //       },
  //       {
  //           id: "13940821",
  //           "timestamp": {
  //               "date": "16/12/24",
  //               "time": "6:58 PM"
  //           },
  //           "from": "76396130",
  //           "to": "35049053",
  //           "amount": 98
  //       },
  //   ]


   useEffect(()=>{
    if(filter == "daily"){
      setRows(7)
      const date = new Date().toDateString().split(" ")
      const tick0 = `${date[2]} ${date[1]}`
      setTicksX([tick0, "12:00 AM", "3:00 AM", "6:00 AM", "9:00 AM", "12:00 PM"])
    }
    if(filter == "monthly"){
      setRows(20)
      const months = ["Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      setTicksX([months[new Date().getMonth()] ?? "Jan", "WEEK 1", "WEEK 2", "WEEK 3", "WEEK 4"])
    }
    if(filter == "yearly"){
      setRows(30)
      setTicksX([new Date().getFullYear().toString(), "Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])
    }
   },[filter])

  const newChartData = txns
    ?.map((txn) => ({
      time: formatFirestoreTimestamp(txn.timestamp)?.time,
      // time: txn.timestamp.time,
      token: txn.amount,
    }))
    .reverse();

  return (
    <div>
      <Card
        style={{
          width: "100%",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <CardContent>
          <div className="my-4 flex justify-between">
            <h1 className="text-3xl text-white">Token Transferred</h1>
            <div>
              <Button onClick={(e)=>{
                setFilter("daily")
              }} className={cn(`${
                filter == "daily" ? "bg-[#38f68f] text-black hover:bg-[#38f68f]":"bg-transparent text-white hover:bg-transparent"
              } rounded-none`)}>Daily</Button>
              <Button onClick={(e)=>{
                setFilter("monthly")
              }} className={cn(`${
                filter == "monthly" ? "bg-[#38f68f] text-black hover:bg-[#38f68f]":"bg-transparent text-white hover:bg-transparent"
              } rounded-none`)}>Monthly</Button>
              <Button onClick={(e)=>{
                setFilter("yearly")
              }} className={cn(`${
                filter == "yearly" ? "bg-[#38f68f] text-black hover:bg-[#38f68f]":"bg-transparent text-white hover:bg-transparent"
              } rounded-none`)}>Yearly</Button>
            </div>
          </div>
          {
            isPending && <div className="grid place-items-center w-full h-full">
              <Loader2 className="w-5 h-5 animate-spin text-[#38f68f]" />
            </div>
          }
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                accessibilityLayer
                data={newChartData}
                margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
              >
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  tickMargin={10}
                  interval={2}
                  axisLine={false}
                  tickFormatter={(value, index) => ticksX[index] as string|| ""}
                  tick={{ fontSize: 16 }}
                />
                <YAxis
                  dataKey="token"
                  tickLine={false}
                  tickMargin={2}
                  axisLine={false}
                  tickFormatter={(value, index) =>{
                    if(index == 0) return "No. of Tokens"
                    return value as string
                  }}
                  tick={{ fontSize: 12 }}
                  yAxisId={"right"}
                  orientation="right"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <CartesianGrid horizontal={false} vertical={false} />
                <Bar dataKey="token" fill="#38F68F" yAxisId={"right"}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarChartMain;

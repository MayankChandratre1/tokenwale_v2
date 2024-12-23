import { Bar, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { BarChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";

import React, { useEffect } from 'react'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { api } from "@/trpc/react";

const BarChartUser = ({id}:{
    id:string
}) => {
    const chartConfig = {
        token: {
          label: "Token",
          color: "hsl(var(--chart-1))",
        },
      } satisfies ChartConfig;

      const {data:txns} = api.txn.getLatestTxnForUserId.useQuery({
            limit:15,
            id:id
      })

    // const txns = [
    //     {
    //         id: "39901568",
    //         "timestamp": {
    //             "date": "19/12/24",
    //             "time": "3:36 PM"
    //         },
    //         "from": "76396130",
    //         "to": "35049053",
    //         "amount": 98
    //     },
    //     {
    //         id: "69543393",
    //         "timestamp": {
    //             "date": "19/12/24",
    //             "time": "3:31 PM"
    //         },
    //         "from": "76396130",
    //         "to": "35049053",
    //         "amount": 98
    //     },
    //     {
    //         id: "54250855",
    //         "timestamp": {
    //             "date": "19/12/24",
    //             "time": "3:05 PM"
    //         },
    //         "from": "76396130",
    //         "to": "35049053",
    //         "amount": 98
    //     },
    //     {
    //         id: "06764940",
    //         "timestamp": {
    //             "date": "19/12/24",
    //             "time": "3:01 PM"
    //         },
    //         "from": "76396130",
    //         "to": "35049053",
    //         "amount": 98
    //     },
    //     {
    //         id: "35317595",
    //         "timestamp": {
    //             "date": "19/12/24",
    //             "time": "3:01 PM"
    //         },
    //         "from": "76396130",
    //         "to": "35049053",
    //         "amount": 98
    //     },
    //     {
    //         id: "68507087",
    //         "timestamp": {
    //             "date": "19/12/24",
    //             "time": "3:01 PM"
    //         },
    //         "from": "76396130",
    //         "to": "35049053",
    //         "amount": 98
    //     },
    //     {
    //         id: "13940821",
    //         "timestamp": {
    //             "date": "16/12/24",
    //             "time": "6:58 PM"
    //         },
    //         "from": "76396130",
    //         "to": "35049053",
    //         "amount": 98
    //     },
    //     {
    //         id: "13940821",
    //         "timestamp": {
    //             "date": "16/12/24",
    //             "time": "6:58 PM"
    //         },
    //         "from": "76396130",
    //         "to": "35049053",
    //         "amount": 98
    //     },
    // ]
      
      const newChartData = txns?.map(txn => ({
          time:  txn.timestamp?.time,
          token: txn.amount
        })).reverse()
  return (
    <div className="h-[450px]">
        <Card
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                <CardContent>
                  <div className="mb-5">
                    <h1 className="text-3xl text-white">Token Transferred</h1>
                  </div>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer maxHeight={400} aspect={2}>
                      <BarChart
                        accessibilityLayer
                        data={newChartData}
                        margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
                      >
                        <XAxis
                          dataKey="time"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value, index) => {
                            if(index == 0){
                              return new Date().toDateString() 
                            }
                            return value as string
                          }}
                          tick={{ fontSize: 16 }}
                        />
                        <YAxis
                          dataKey="token"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => {
                            if(value == '0'){
                              return "No. of Tokens"
                            }
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
                        <Bar yAxisId={"right"} dataKey="token" fill="#38F68F">
                          <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={16}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
    </div>
  )
}

export default BarChartUser
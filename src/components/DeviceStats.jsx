import { Percent } from 'lucide-react';
import React from 'react'
import { ResponsiveContainer } from 'recharts';
// import "./styles.css";
// import React, { useCallback, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
function DeviceStats({clicksData}) {
    const deviceCount = clicksData.reduce((acc, item) => {
        if(acc[item.device]) {
          acc[item.device] += 1;
        }
        else {
          acc[item.device] =1
        }
        return acc
    } , {})
      // console.log(cityCount);
      const devices = Object.entries(deviceCount).map(([device,count]) => ({
        device,
        count,
      }))
  return (
    <div style={{width: "100%", height: 300}}>
      <ResponsiveContainer>
        <PieChart width={700} height={400}>
          <Pie
            data={devices}
            labelLine={false}
            label={({device, percent}) =>
              `${device}: ${(percent * 100).toFixed(0)}%`
            }
            dataKey="count"
          >
            {devices.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DeviceStats
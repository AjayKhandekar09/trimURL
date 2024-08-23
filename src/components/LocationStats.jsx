// import React from 'react'
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



function LocationStats({clicksData}) {
  console.log(typeof clicksData);
  
  const cityCount = clicksData.reduce((acc, item) => {
        if(acc[item.city]) {
          acc[item.city] += 1;
        }
        else {
          acc[item.city] =1
        }
        return acc
  } , {})


  const cities = Object.entries(cityCount).map(([city,count]) => ({
    city,
    count
  }))
  
  return (
    <div style={{width :"100%" , height: 300}}>
        <ResponsiveContainer>
          <LineChart width={700} height={300} data={cities.slice(0,5)}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip className="text-green-500" labelStyle={{color: 'green'}}  />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
              />
              
          </LineChart>
        </ResponsiveContainer>
    </div>

  )
}

export default LocationStats

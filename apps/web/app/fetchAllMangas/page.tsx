"use client";
import React, { useEffect, useState } from "react";



const Page = () => {
  const [queryData, setqueryData] = useState<any>(null);
  
  useEffect(() => {
    const queryingData = async () => {
      const query = await fetch("http://localhost:7000/manga");
      const response = await query.json();
      setqueryData(response);
    };
    queryingData();
  }, []);

  useEffect(() => {
    console.log(queryData);
  }, [queryData]);
  
  
  return <div className="bg-black min-h-screen text-white flex items-center justify-center text-2xl"></div>;
};
export default Page;

import { getSession } from "@/lib/session";
import React from "react";
import { redirect } from "next/navigation";
import { Role } from "@/lib/type";
import { checking } from "@/lib/actions";
const Dashboard = async () => {
  const checking1 = await checking();

  return <div>Dashboard</div>;
};

export default Dashboard;

import { connection } from "next/server";
import SequenceSimulationWorkbench from "@/features/simulation/SequenceSimulationWorkbench";

export default async function SimulationPage() {
  await connection();

  return <SequenceSimulationWorkbench />;
}
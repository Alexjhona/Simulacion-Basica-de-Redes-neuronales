import type { Metadata } from "next";
import { CrispLab } from "./crisp-lab";

export const metadata: Metadata = {
  title: "NexoLab | Laboratorio CRISP-DM",
  description:
    "Laboratorio interactivo de minería de datos e inteligencia de negocios con redes neuronales, Random Forest y CNN.",
};

export default function Home() {
  return <CrispLab />;
}

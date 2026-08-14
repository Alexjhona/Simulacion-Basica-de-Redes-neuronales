import type { Metadata } from "next";
import { CrispLab } from "./crisp-lab";

export const metadata: Metadata = {
  title: "Laboratorio Interactivo de Modelos",
  description:
    "Simulación interactiva de red neuronal, Random Forest y red convolucional.",
};

export default function Home() {
  return <CrispLab />;
}

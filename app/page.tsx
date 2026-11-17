import { Hero } from "@/components/home/Hero";
import { Departments, Marquee } from "@/components/home/Departments";
import { ReadingRoom } from "@/components/home/ReadingRoom";
import { ClassSets, Featured, HowItWorks, StationeryCupboard, Visit } from "@/components/home/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Departments />
      <ReadingRoom />
      <ClassSets />
      <Featured />
      <StationeryCupboard />
      <HowItWorks />
      <Visit />
    </>
  );
}

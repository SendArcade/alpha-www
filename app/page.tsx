import Hero from "@/components/Pages/Landing/main/Hero";
import Projects from "@/components/Pages/Landing/main/Projects";
import Navbar from "@/components/Layout/Navbar";
export default function Home() {
  return (
    <main className="h-full w-full">
      <Navbar />
      <div className="flex flex-col">
        <Hero />
        {/* <Projects /> */}
      </div>
    </main>
  );
}

import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Decorative Backgrounds */}
      <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-purple-300 rounded-bl-[200px] z-0" />
      <div className="absolute bottom-[-200px] left-[-120px] w-[450px] h-[450px] bg-purple-400 rotate-[45deg] rounded-[100px] z-0" />
      <div className="absolute left-0 bottom-0 w-[200px] h-[300px] bg-purple-600 rounded-tr-[150px] z-0" />

      {/* Foreground Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
      </div>
    </div>
  );
}
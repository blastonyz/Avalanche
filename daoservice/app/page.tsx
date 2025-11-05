import { GovernorForm } from "./components/forms/GovernorForm";
import DeployDao from "./components/interactions/DeployDao";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <DeployDao factoryAddress="0xfFd14cEf06fe527Df57829Ca7EB93158727afb48"/>
      <GovernorForm/>
      </main>
    </div>
  );
}

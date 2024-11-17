import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";

export function AppBar() {
  return (
    <div className="grid grid-cols-3 p-8 items-center">
      <div className="justify-self-start w-96">
        <Search />
      </div>
      <h1 className="justify-self-center text-3xl font-semibold	text-white">savepoint</h1>
      <div className="justify-self-end">
        <UserNav />
      </div>
    </div>
  );
}

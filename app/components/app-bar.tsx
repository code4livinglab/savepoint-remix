import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import { ProjectSaveDialog } from "@/routes/projects+/_index+/components/project-save-button";

export function AppBar() {
  return (
    <div className="grid grid-cols-3 p-8 items-center backdrop-blur-sm">
      <div className="justify-self-start w-96">
        <Search />
      </div>
      <img src="/savepoint-light.svg" className="justify-self-center h-8" />
      <div className="justify-self-end flex gap-4">
        <ProjectSaveDialog />
        <UserNav />
      </div>
    </div>
  );
}

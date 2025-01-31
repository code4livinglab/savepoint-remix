import { Search as SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Search() {
  return (
    <form className="relative">
      <SearchIcon className="absolute top-3 left-3 h-6 w-6 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder="キーワードで探す"
        className="text-white h-12 pl-12 bg-black"
      />
    </form>
  )
}

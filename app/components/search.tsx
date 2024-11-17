import { Search as SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Search() {
  return (
    <form className="relative bg-black">
      <SearchIcon className="absolute top-3 left-3 h-6 w-6 text-muted-foreground" />
      <Input
        type="search"
        placeholder="キーワードで探す"
        className="text-white h-12 pl-12"
      />
    </form>
  )
}

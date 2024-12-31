import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"

export const HamburgerMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute top-4 left-4">
        <Menu className="h-6 w-6 text-white hover:text-gray-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => console.log("Settings clicked")}>
          <Settings2 className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
import { type LucideProps } from "lucide-react";
import { Link } from "react-router-dom";

export interface DropdownItem {
    name: string;
    link: string;
}

interface NavbarDropdown {
    name: string;
    icon: React.ComponentType<LucideProps>;
    items: DropdownItem[];
}

const DropdownItem: React.FC<DropdownItem> = ({ name, link }) => {
    return (
        <li className="text-color"><Link to={link}>{name}</Link></li>
    )
}

export const NavbarDropdown: React.FC<NavbarDropdown> = ({ icon: Icon, name, items }) => {
    return (
        <div className="dropdown dropdown-start">
            <div tabIndex={0} role="button" className="flex items-center text-sm text-gray-300 font-light gap-2 cursor-pointer hover:text-white">
                {name} <Icon size={14} />
            </div>
            <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 mt-2 text-color shadow-sm">
                {items.map((item, idx) => {
                    return  <DropdownItem key={idx} name={item.name} link={item.link} />
                })}
            </ul>
        </div>
    )
}
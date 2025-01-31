import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input"


export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink pr-6">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        </Link>
        <h3 className="text-xl">Docs</h3>
        <SearchInput />
      </div>
    </nav>
  );
};
"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import { SearchIcon } from "lucide-react";
import { useState, useRef } from "react";

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };
  return (

    <div className="flex-1 flex items-center justify-center">
      <form className="relative max-w-[720px] w-full">
        <Input
          value={}
          placeholder="Search"
          className="md:text-base placeholder:text-neutral-800 px-14 w-full border-none
          focus-visible:shadow-[0_1px_1px_0_rgba(0,0,0,0.1), 0_1px_3px_1px_rgba(0,0,0,0.1)] rounded-full h-[48px] focus-visible:ring-0 focus:bg-white"
        />
        <Button type='submit' variant="ghost" size="icon" className="absolute left-3 top1/2 -translate-y1/2 [&svg]:size5 rounded-full">
            <SearchIcon />
        </Button>
      </form>
    </div>
  );
};

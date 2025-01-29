"use client";

import { LucideIcon, Undo2, Undo2Icon } from "lucide-react";
import {cn} from "@/lib/utils"
import { useEditorStore } from '@/store/use-editor-store';


interface ToolbarButtonProps {
    icon: LucideIcon;
    isActive?: boolean;
    onClick?: () => void;
}


const ToolbarButton = ({ onClick, isActive, icon: Icon} : ToolbarButtonProps) => {
    return (
        <button
            className={cn("text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",isActive && "bg-neutral-200/80")}
            onClick={onClick}
        >
            <Icon className="size-4" />
        </button>
    );
}

export const Toolbar = () => {
    const { editor } = useEditorStore();
    console.log(editor);
    const sections: {label :string, icon: LucideIcon, onClick:()=> void , isActive?: boolean}[][] =[
        [
            {
                label: "Undo",
                icon: Undo2Icon,
                onClick: () => editor?.chain().focus().undo().run(),
            }
        ]
    ];
    return ( 
        <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-[40px] flex items-center gap-x-0.5 overflow-x-auto">
            {sections[0].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}
        </div>
     );
}
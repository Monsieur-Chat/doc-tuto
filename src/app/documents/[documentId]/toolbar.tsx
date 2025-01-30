"use client";

import { LucideIcon, Redo2Icon, Undo2, Undo2Icon, PrinterIcon, SpellCheck2Icon, BoldIcon, ItalicIcon, UnderlineIcon, MessageSquarePlusIcon, ListTodoIcon, RemoveFormattingIcon, ChevronDown, HighlighterIcon, Link2Icon, ImageIcon, UploadIcon, SearchIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, ListIcon, MinusIcon, PlusIcon } from "lucide-react";
import {cn} from "@/lib/utils"
import { useEditorStore } from '@/store/use-editor-store';
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader,DialogTitle} from "@/components/ui/dialog";
import { ChevronDownIcon } from "lucide-react";
import { CirclePicker, type ColorResult } from "react-color";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { set } from "date-fns";

const FontSizeButton = () => {
    const { editor } = useEditorStore();
    const currentFontSize = editor?.getAttributes("textStyle")?.fontSize? editor?.getAttributes("textStyle")?.fontSize.replace("px","") : "16";
    const [fontSize, setFontSize] = useState(currentFontSize);
    const [inputValue, setInputValue] = useState(fontSize);
    const [isEditing, setIsEditing] = useState(false);
    
    const updateFontSize = (newSize: string) => {
        const size = parseInt(newSize);
        if (!isNaN(size)&&size > 0) {
            editor?.chain().focus().setFontSize(`${size}px`).run();
            setFontSize(newSize);
            setInputValue(newSize);
            setIsEditing(false);
        }
    } 

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(inputValue);
    }
    
    const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFontSize(inputValue);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            updateFontSize(inputValue);
            editor?.commands.focus(); 
        }
    }

    const increment = () => {
        const newSize = parseInt(fontSize) + 1;
        updateFontSize(newSize.toString());
    }

    const decrement = () => {
        const newSize = parseInt(fontSize) - 1;
        updateFontSize(newSize.toString());
    }

    return (
        <div className="flex items-center gap-x-0.5">
            <button onClick={decrement} className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                <MinusIcon className="size-4"/>
            </button>
            {isEditing ? (
                <input type="text" value={inputValue} onChange={handleInputChange} onBlur={handleInputBlur} onKeyDown={handleKeyDown} className="h-7 w-10 text-center border border-neutral-400 bg-transparent focus:outline-none focus:ring-0 rounded-sm text-sm"/>
            ) : (
            <button onClick={() => {setIsEditing(true);setFontSize(currentFontSize)}} className="h-7 w-10 text-center border border-neutral-400 hover:bg-neutral-200/80 rounded-sm text-sm">
                {currentFontSize}
            </button>
            )}
            <button onClick={increment} className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                <PlusIcon className="size-4"/>
            </button>
        </div>
    )}

const ListButton = () => {
    const { editor } = useEditorStore();
    const list =[
        {label : "Bulet List", icon: ListIcon,isActive: () => editor?.isActive("bulletList"), onClick: () => editor?.chain().focus().toggleBulletList().run()},
        {label : "Order List", icon: ListIcon,isActive: () => editor?.isActive("orderedList"), onClick: () => editor?.chain().focus().toggleOrderedList().run()}
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <ListIcon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {list.map(({label, onClick , isActive, icon : Icon}) => (
                    <button key={label} className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80", isActive() && "bg-neutral-200/80")}  onClick={onClick}>
                        <span>{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )}


const AlignButton = () => {
    const { editor } = useEditorStore();
    const alignments = [
        {label: "Left", value: "left", icons: AlignLeftIcon},
        {label : "Center", value: "center", icons: AlignCenterIcon},
        {label : "Right", value: "right", icons: AlignRightIcon},
        {label : "Justify", value: "justify", icons: AlignJustifyIcon}
    ]; 

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <AlignLeftIcon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {alignments.map(({label, value, icons : Icon}) => (
                    <button key={value} className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80", editor?.isActive("align", {value}) && "bg-neutral-200/80")} onClick={() => editor?.chain().focus().setTextAlign(value).run()}>
                        <Icon className="size-4"/>
                        <span>{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )}


const ImageButton = () => {
    const { editor } = useEditorStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const onChange = (src : string) => {
        editor?.chain().focus().setImage({src}).run();
    }

    const onUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                onChange(imageUrl);
            }
        }
        input.click();
    }

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            onChange(imageUrl);
            setImageUrl("");
            setIsDialogOpen(false);
        }
    }

    return(
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <ImageIcon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
                <DropdownMenuItem>
                    <UploadIcon className="size-4 mr-2"/>
                    Upload
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SearchIcon className="size-4 mr-2"/>
                    Search
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
           

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                <Input 
                placeholder="Paste an image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleImageUrlSubmit()}
                />
                <DialogFooter>
                    <Button onClick={handleImageUrlSubmit}>Submit</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
            </>
        )}



const LinkButton = () => {
    const { editor } = useEditorStore();
    const [value, setValue] = useState(editor?.getAttributes("link")?.href || "");

    const onChange = (href : string) => {
        editor?.chain().focus().extendMarkRange("link").setLink({href}).run();
        setValue("")
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <Link2Icon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://example.com" className="w-full p-1.5 border border-neutral-200 rounded-sm"/>
                <Button onClick={() => onChange(value)}>Apply</Button>
            </DropdownMenuContent>
            </DropdownMenu>
            
        )}

const HighlightColorButton = () => {
    const { editor } = useEditorStore();
    const value = editor?.getAttributes("highlight")?.color || "#FFFFFF";
    const onChange = (color : ColorResult) => {
        editor?.chain().focus().setHighlight({color: color.hex}).run();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <HighlighterIcon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5">
                <CirclePicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )}

const TextColorButton = () => {
    const { editor } = useEditorStore();
    const value = editor?.getAttributes("textStyle")?.color || "#000000";
    const onChange = (color : ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <span className="truncate">
                        <span className="text-xs">A</span>
                    </span>
                    <div className="h-0.5 w-full" style={{backgroundColor: value}}/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5">
                <CirclePicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )}

const HeadinglevelButton= () => {
    const {editor} = useEditorStore();
    const headings = [
        {label: "Normal text", value: 0, fontSize: "16px"},
        {label: "Heading 1", value: 1, fontSize: "32px"},
        {label: "Heading 2", value: 2, fontSize: "24px"},
        {label: "Heading 3", value: 3, fontSize: "20px"},
        {label: "Heading 4", value: 4, fontSize: "18px"},
        {label: "Heading 5", value: 5, fontSize: "16px"},
    ]

    const getCurrentHeading = () => {
        for (let level = 1; level <= 5; level++) {
            if (editor?.isActive("heading" , {level})) {
                return `Heading ${level}`;
            }
        }
        return "Normal text";
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm:bg-neutral-200/80 px-1.5 overflow-hidden text-sm ">
                    <span className="truncate">
                        {getCurrentHeading()}
                    </span>
                <ChevronDownIcon className="ml-2 size-4 shrink-0"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {headings.map(({label, value, fontSize}) => (
                    <button key={value} className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80", (value === 0 && !editor?.isActive("heading") || editor?.isActive("heading" , {level : value})) && "bg-neutral-200/80")} style={{fontSize}} onClick={() => editor?.chain().focus().toggleHeading({level: value}).run()}>
                        {label}
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>

)}

const FontFamilyButton = () => {
    const { editor } = useEditorStore();
    const fonts = [{label:"Arual", value:"Arial"}, {label:"Times New Roman", value:"Times New Roman"}, {label:"Courier New", value:"Courier New"}];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm:bg-neutral-200/80 px-1.5 overflow-hidden text-sm ">
                    <span className="truncate">
                        {editor?.getAttributes("textStyle")?.fontFamily || "Arial"}
                    </span>
                <ChevronDownIcon className="ml-2 size-4 shrink-0"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {fonts.map(({label,value }) => (
                    <button key={value} className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80", editor?.getAttributes("textStyle").fontFamily=== value && "bg-neutral-200/80")} style={{fontFamily: value}} onClick={() => editor?.chain().focus().setFontFamily(value).run()}>
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

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
            },
            {
                label: "Redo",
                icon: Redo2Icon,
                onClick: () => editor?.chain().focus().redo().run(),
            },
            {
                label:"Print",
                icon: PrinterIcon,
                onClick: () => window.print(),
            },
            {
                label:"Spell Check",
                icon: SpellCheck2Icon,
                onClick: () => {
                    const current = editor?.view.dom.getAttribute("spellcheck");
                    editor?.view.dom.setAttribute("spellcheck", current === "false" ? "true" : "false");
                },
            }
        ],
        [
            {
                label: "Bold",
                icon: BoldIcon,
                isActive: editor?.isActive("bold"),
                onClick: () => editor?.chain().focus().toggleBold().run(),
            },
            {
                label: "Italic",
                icon: ItalicIcon,
                isActive: editor?.isActive("italic"),
                onClick: () => editor?.chain().focus().toggleItalic().run(),
            },
            {
                label: "Underline",
                icon: UnderlineIcon,
                isActive: editor?.isActive("underline"),
                onClick: () => editor?.chain().focus().toggleUnderline().run(),
            }
        ],
        [
            {
                label: "Comment",
                icon: MessageSquarePlusIcon,
                onClick: () => {console.log("Comment")},
                isActive: false
            },
            {
                label: "List Todo",
                icon: ListTodoIcon,
                onClick: () => editor?.chain().focus().toggleTaskList().run(),
                isActive: editor?.isActive("taskList")
            },
            {
                label: "Remove formating",
                icon: RemoveFormattingIcon,
                onClick: () => editor?.chain().focus().unsetAllMarks().run(),
            }
        ]
    ];
    return ( 
        <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-[40px] flex items-center gap-x-0.5 overflow-x-auto">
            {sections[0].map((item) => (
                <ToolbarButton key={item.label} {...item} /> 
            ))}
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            <FontFamilyButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            <HeadinglevelButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            <FontSizeButton/>
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            {sections[1].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}
            <TextColorButton />
            <HighlightColorButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            <LinkButton />
            <ImageButton/>
            <AlignButton />
            {/*Todo add more sections*/}
            <ListButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            {sections[2].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}
        </div>
     );
}
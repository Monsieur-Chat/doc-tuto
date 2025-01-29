import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { Editor } from "./editor";

interface DocumentIdPageProps{
    params: Promise<{ documentId: string}>;
}
const DocumentIdPage = async({ params }: DropdownMenuContentProps) => {
    const { documentId } = await params;
    return ( 
        <div className="min-h-screen bg-[#FAFBFD]">
            <Editor />
        </div>
     );
}
 
export default DocumentIdPage;
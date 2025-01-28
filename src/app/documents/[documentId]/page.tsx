import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

interface DocumentIdPageProps{
    params: Promise<{ documentId: string}>;
}
const DocumentIdPage = async({ params }: DropdownMenuContentProps) => {
    const { documentId } = await params;
    return ( 
        <div>
            Document ID: {documentId}
        </div>
     );
}
 
export default DocumentIdPage;
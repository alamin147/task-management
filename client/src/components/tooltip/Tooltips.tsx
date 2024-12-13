import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Tooltips = ({ text, element }: { text: string; element: any }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{element}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default Tooltips;

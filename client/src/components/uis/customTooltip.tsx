import './tooltip.css';

const customTooltip = ({title}:{title:string}) => {
  return (
    <span className="u-triangle absolute top-[50%] translate-y-[-50%] left-8 text-xs pointer-events-none text-white bg-[#3aafae] px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {title}
    </span>
  );
};
export default customTooltip;

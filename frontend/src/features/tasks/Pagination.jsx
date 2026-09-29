import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 border-t border-border pt-4">
       <span className="text-sm text-muted-foreground font-medium">
         Page <span className="font-bold text-foreground">{currentPage}</span> of {totalPages}
       </span>
       <div className="flex gap-2">
         <button 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 transition-colors shadow-sm"
         >
           <FiChevronLeft />
         </button>
         <button 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 transition-colors shadow-sm"
         >
           <FiChevronRight />
         </button>
       </div>
    </div>
  )
}
export default Pagination;

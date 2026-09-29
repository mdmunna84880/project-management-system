import { useSearchParams } from 'react-router';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useGetMembersQuery } from '../members/membersApi';
import { useState, useEffect } from 'react';

// Custom hook to debounce search input to prevent rapid API calls
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const TaskFilters = ({ projectId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: membersResponse } = useGetMembersQuery(projectId);
  const members = membersResponse?.data?.members || [];

  // Local state for search text to debounce it
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchText, 400);

  // Sync debounced search with URL
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      if (newParams.get('search') !== debouncedSearch) {
        newParams.set('search', debouncedSearch);
        newParams.set('page', '1');
        setSearchParams(newParams);
      }
    } else {
      if (newParams.has('search')) {
        newParams.delete('search');
        newParams.set('page', '1');
        setSearchParams(newParams);
      }
    }
  }, [debouncedSearch, setSearchParams]); // Omit searchParams from deps to avoid loop on other filter changes

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // reset page to 1 on filter change
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    setSearchText('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('status');
    newParams.delete('priority');
    newParams.delete('assignedTo');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const hasSearch = !!searchText;
  const hasFilters = searchParams.has('status') || searchParams.has('priority') || searchParams.has('assignedTo');

  return (
    <div className="flex flex-col gap-3 mt-3 bg-muted/30 p-3 rounded-lg border border-border">
      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search tasks by title..." 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-card border border-border rounded-md pl-9 pr-10 py-1.5 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors shadow-sm"
        />
        {hasSearch && (
          <button 
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive p-1 transition-colors"
            title="Clear Search"
          >
            <FiX />
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <FiFilter className="text-muted-foreground mr-1 text-sm" />
        
        <select 
          value={searchParams.get('status') || ''} 
          onChange={(e) => updateParam('status', e.target.value)}
          className="bg-card border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none shadow-sm cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select 
          value={searchParams.get('priority') || ''} 
          onChange={(e) => updateParam('priority', e.target.value)}
          className="bg-card border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none shadow-sm cursor-pointer"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <select 
          value={searchParams.get('assignedTo') || ''} 
          onChange={(e) => updateParam('assignedTo', e.target.value)}
          className="bg-card border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none shadow-sm cursor-pointer max-w-[150px] truncate"
        >
          <option value="">All Assignees</option>
          {members.map(m => (
            <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
          ))}
        </select>
        
        <div className="h-4 w-px bg-border mx-1"></div>

        <select 
          value={searchParams.get('sortBy') || 'createdAt'} 
          onChange={(e) => updateParam('sortBy', e.target.value)}
          className="bg-card border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none shadow-sm cursor-pointer"
        >
          <option value="createdAt">Sort: Created Date</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
        </select>

        <select 
          value={searchParams.get('sortOrder') || 'desc'} 
          onChange={(e) => updateParam('sortOrder', e.target.value)}
          className="bg-card border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none shadow-sm cursor-pointer"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>

        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="ml-auto text-xs flex items-center gap-1 text-muted-foreground hover:text-destructive bg-card border border-border px-2 py-1.5 rounded-md shadow-sm transition-colors font-medium"
            title="Clear Filters"
          >
            <FiX /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;

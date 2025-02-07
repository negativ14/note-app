import React, { useMemo } from 'react';
import { IconButton } from './ui/IconButton';
import { IoSearchOutline } from 'react-icons/io5';
import { Button } from './ui/Button';
import { VscSettings } from 'react-icons/vsc';

interface SearchBarProps {
    searchTerm: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = React.memo(({ searchTerm, onSearch }) => {
    // Memoize the input props object since it's passed to a child component
    const inputProps = useMemo(() => ({
        onChange: onSearch,
        value: searchTerm,
        type: "text",
        placeholder: "Search",
        className: "w-full h-full outline-none ml-4 text-gray-500"
    }), [searchTerm, onSearch]);

    return (
        <div className="h-16 w-full ml-64 mb-5 fixed top-0 left-0 bg-white flex justify-center items-center mt-4">
            <div className="h-full w-full flex items-center p-4 gap-1 ">
                <div className="w-3/4 h-10 bg-white border-2 rounded-4xl flex justify-between items-center p-2 border-gray-200">
                    <input {...inputProps} />
                    <IconButton variant="simple" icon={IoSearchOutline} />
                </div>
                <Button size='md' variant="simple" icon={VscSettings} title="Sort" />
            </div>
        </div>
    );
});

export default SearchBar;



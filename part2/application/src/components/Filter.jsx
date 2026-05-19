const Filter = ({ searchQuery, setSearchQuery }) => {
    return (
        <input 
            placeholder="search by name..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
        />
    )

    
}

export default Filter
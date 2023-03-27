import React from "react";  
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';

const Navbar = () => {
  // nav links
  const [anchorNavEl, setAnchorNavEl] = React.useState(null);
  const openNav = Boolean(anchorNavEl);

  const handleNavClick = (e) => {
    setAnchorNavEl(e.currentTarget);
  };

  const handleNavClose = () => {
    setAnchorNavEl(null);
  };

  // search bar
  const [anchorSearchEl, setAnchorSearchEl] = React.useState(null);
  const openSearch = Boolean(anchorSearchEl);

  const handleSearchClick = (e) => {
    setAnchorSearchEl(e.currentTarget);
  };

  const handleSearchClose = () => {
    setAnchorSearchEl(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.value.length > 0) {
      const ticker = e.target.value.substring(0, e.target.value.indexOf(":"));
      localStorage.setItem('active', ticker.toUpperCase());
      e.target.value = "";
    }
  }

  const ticker_list = [
    { symbol: 'AAPL', company: 'Apple' },
    { symbol: 'MSFT', company: 'Microsoft' },
    { symbol: 'KO', company: 'Coca Cola' },
    { symbol: 'NVDA', company: 'Nvidia Corporation' },
  ];

  const symbols = {
    options: ticker_list.map((option) => option.symbol + ' : ' + option.company),
  };

  return (
    <div className="font-custom bg-dark-purple-700 text-light-purple-500 flex flex-row items-center justify-between">
      <img className="w-16 ml-2" src="images/lovethestocks-min.png" alt="logo" />

      <Button
        id="nav-button"
        aria-controls={openNav ? 'nav-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openNav ? 'true' : undefined}
        onClick={handleNavClick}
        sx={{
          p: 0
        }}
      >
        <MenuIcon className="cursor-pointer text-light-purple-500" />
      </Button>
      <Menu
        id="nav-menu"
        anchorEl={anchorNavEl}
        open={openNav}
        onClose={handleNavClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{
          '& .MuiMenu-paper': {
            border: '2px solid black',
            backgroundColor: '#493e8e',
            color: 'white',
            textTransform: 'uppercase'
          },
          '& .MuiMenuItem-root': {
            border: '1px solid black',
            fontSize: 14,
            py: 0,
            px: 5 
          },
          '& .MuiMenuItem-root:hover': {
            backgroundColor: 'white',
            color: 'black'
          },
          '& .MuiList-root': {
            padding: 0
          },
        }}
      >
        <MenuItem onClick={handleNavClose}>Latest News</MenuItem>
        <MenuItem onClick={handleNavClose}>Index List</MenuItem>
        <MenuItem onClick={handleNavClose}>Charts</MenuItem>
        <MenuItem onClick={handleNavClose}>Details</MenuItem>
        <MenuItem onClick={handleNavClose}>Financials</MenuItem>
        <MenuItem onClick={handleNavClose}>Analysis</MenuItem>
        <MenuItem onClick={handleNavClose}>Company</MenuItem>
      </Menu>

      <Button
        id="search-button"
        aria-controls={openSearch ? 'search-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openSearch ? 'true' : undefined}
        onClick={handleSearchClick}
        sx={{
          p: 0
        }}
      >
        <SearchIcon className="cursor-pointer text-light-purple-500" />
      </Button>
      <Menu
        id="search-menu"
        anchorEl={anchorSearchEl}
        open={openSearch}
        onClose={handleSearchClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{
          '& .MuiMenu-paper': {
            border: '2px solid black',
            backgroundColor: '#493e8e',
            color: 'white',
            width: '100%'
          },
          '& .MuiMenuItem-root': {
            border: 0,
            py: 0,
            px: 0,
          },
          '& .MuiMenuItem-root:hover': {
            backgroundColor: '#493e8e',
            color: 'white',
            padding: 0
          },
          '& .MuiPaper-root': {
            backgroundColor: '#493e8e'
          },
          '& .MuiList-root': {
            padding: 0
          },
        }}
      >
        <MenuItem onKeyDown={e => handleKeyPress(e)}>
          <Autocomplete 
            {...symbols}
            id="ticker-search"
            autoHighlight
            sx={{
              width: '100%',
              "& .MuiInputBase-input": {
                textTransform: 'uppercase',
              },
              "& .MuiAutocomplete-inputRoot": {
                color: "white",
              },
              "& .MuiButtonBase-root": {
                color: 'white'
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "black"
              },
              "& :hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white"
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label=""
                placeholder="search a company"
              />
            )}
          />
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Navbar;
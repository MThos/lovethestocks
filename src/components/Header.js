import React from "react";  
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";

const Header = () => {
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
    <div className="bg-dark-purple-700 text-light-purple-500 flex flex-row items-center justify-between">
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
      
      <ThemeProvider theme={navMenuTheme}>
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
            'aria-labelledby': 'nav-menu',
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
      </ThemeProvider>

      <Button
        id="search-button"
        aria-controls={openSearch ? 'search-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openSearch ? 'true' : undefined}
        onClick={handleSearchClick}
        sx={{ p: 0 }}
      >
        <SearchIcon className="cursor-pointer text-light-purple-500" />
      </Button>

      <ThemeProvider theme={searchMenuTheme}>
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
        >
          <MenuItem onKeyDown={e => handleKeyPress(e)}>
            <ThemeProvider theme={autocompleteMenuTheme}>
              <Autocomplete 
                {...symbols}
                id="ticker-search"
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=""
                    placeholder="search a company"
                  />
                )}
              />
            </ThemeProvider>
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </div>
  )
}

export default Header;

const navMenuTheme = createTheme({
  typography: {
    "fontFamily": `"Nanum Gothic Coding", Helvetica, sans-serif`,
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: '2px solid black',
          backgroundColor: '#493e8e',
          color: 'white',
          textTransform: 'uppercase'
        }
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          border: '1px solid black',
          fontSize: '0.9rem',
          '&:hover': {
            backgroundColor: 'white',
            color: 'black'
          }
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    }
  }
});

const searchMenuTheme = createTheme({
  typography: {
    "fontFamily": `"Nanum Gothic Coding", Helvetica, sans-serif`,
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: '2px solid black',
          backgroundColor: '#241f47',
          color: 'white',
          width: '100%'
        }
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          border: 0,
          padding: 0,
          '&:hover': {
            backgroundColor: '#493e8e',
            color: 'white',
            padding: 0
          }
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
  }
});

const autocompleteMenuTheme = createTheme({
  typography: {
    "fontFamily": `"Nanum Gothic Coding", Helvetica, sans-serif`,
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: 'white',
          textTransform: 'uppercase'
        },
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          width: '100%'
        },
        option: {
          backgroundColor: '#493e8e',
          color: 'white',
          '&:hover': {
            backgroundColor: 'white',
            color: 'black'
          },
          '&.Mui-focused': {
            color: 'black'
          }
        },
        listbox: {
          fontSize: '1rem',
          padding: 0
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'white'
        }
      }
    }
  }
});
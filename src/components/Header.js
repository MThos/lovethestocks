import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import { Link } from "react-router-dom";
import GlobalTheme from './GlobalTheme'

const Header = (props) => {
  // eslint-disable-next-line
  const [active, setActive] = useState('');
  const stockList = props.stockList;

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

  const symbols = {
    options: stockList.map((option) => option.symbol + ' : ' + option.companyName),
  };

  return (
    <div className="bg-purple-700 border-b-8 border-purple-600 text-purple-200 flex flex-row items-center justify-between">
      <img className="w-16 ml-2" src={`${process.env.PUBLIC_URL}/images/lovethestocks-min.png`} alt="logo" />

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
        <MenuIcon className="cursor-pointer text-purple-200" />
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
          <Link to="/news"><MenuItem onClick={handleNavClose}>Latest News</MenuItem></Link>
          <Link to="/indexes"><MenuItem onClick={handleNavClose}>Index List</MenuItem></Link>
          <MenuItem onClick={handleNavClose}>Charts</MenuItem>
          <Link to="/details"><MenuItem onClick={handleNavClose}>Details</MenuItem></Link>
          <Link to="/financials"><MenuItem onClick={handleNavClose}>Financials</MenuItem></Link>
          <Link to="/analysis"><MenuItem onClick={handleNavClose}>Analysis</MenuItem></Link>
          <Link to="/company"><MenuItem onClick={handleNavClose}>Company</MenuItem></Link>
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
        <SearchIcon className="cursor-pointer text-purple-200" />
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
          <MenuItem>
            <ThemeProvider theme={autocompleteMenuTheme}>
              <Autocomplete
                onChange={(event, newValue) => {
                  if (newValue) {
                    setActive(newValue);
                    const ticker = newValue.substring(0, newValue.indexOf(":")).trim().toUpperCase();
                    localStorage.setItem('active', ticker);
                    setActive(ticker.toUpperCase());
                    window.location.reload(false);
                    if (window.location.href.includes("localhost")) {
                      window.location.replace("http://localhost:3000/company");
                    } else {
                      window.location.replace("http://www.lovethestocks.com/company");
                    }
                  }
                }}
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
          backgroundColor: '#6527F3',
          color: 'white',
          textTransform: 'uppercase'
        }
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          border: '1px solid black',
          fontSize: '1.2rem',
          [GlobalTheme.breakpoints.up('md')]: {
            fontSize: '1.5rem',
            paddingLeft: 20,
            paddingRight: 20
          },
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
          border: '2px solid #F8D9FD',
          padding: 1
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
          backgroundColor: '#6527F3',
          color: 'white',
          width: '100%',
          [GlobalTheme.breakpoints.up('md')]: {
            width: '25%'
          }
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
          backgroundColor: '#6527F3',
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
          [GlobalTheme.breakpoints.up('md')]: {
            fontSize: '1.2rem',
          },
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
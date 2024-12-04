import React from 'react'
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import BadgeIcon from '@mui/icons-material/Badge';
import SellIcon from '@mui/icons-material/Sell';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SettingsIcon from '@mui/icons-material/Settings';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ViewListIcon from '@mui/icons-material/ViewList';
import AirplayIcon from '@mui/icons-material/Airplay';
import SummarizeIcon from '@mui/icons-material/Summarize';

const BottomBar = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Navigate based on the selected tab
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/notifications');
        break;
      case 2:
        navigate('/addVendorProduct');
        break;
      case 3:
        navigate('/allproducts');
        break;
      case 4:
        navigate('/allusers');
        break;
      case 5:
        navigate('/employee');
        break;
      case 6:
        navigate('/tags');
        break;
      case 7:
        navigate('/manage-order');
        break;
      case 8:
        navigate('/settings');
        break;
      case 9:
        navigate('/vendors');
        break;
      case 10:
        navigate('/stocks');
        break;
      case 11:
        navigate('/transaction');
        break;
      case 12:
        navigate('/tax');
        break;
      case 13:
        navigate('/expired');
        break;
      case 14:
        navigate('/requests');
        break;
      case 15:
        navigate('/platforms');
        break;
      case 16:
        navigate('/reports');
        break;
      default:
        break;
    }
  };



  return (
   <Box
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        backgroundColor: '#fff',
        zIndex: 1000,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{
          display: 'inline-flex',
          minWidth: '100%',
        }}
      >
        <BottomNavigationAction label="Dashboard" icon={<HomeOutlinedIcon />} />
        <BottomNavigationAction label="Notification" icon={<NotificationsIcon />} />
        <BottomNavigationAction label="Add Product" icon={<AddCircleIcon />} />
        <BottomNavigationAction label="Products" icon={<CategoryIcon />} />
        <BottomNavigationAction label="Users" icon={<GroupIcon />} />
        <BottomNavigationAction label="Employee" icon={<BadgeIcon />} />
        <BottomNavigationAction label="Tags" icon={<SellIcon />} />
        <BottomNavigationAction label="Manage Orders" icon={<StorefrontIcon />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        <BottomNavigationAction label="Vendors" icon={<AddBusinessIcon />} />
        <BottomNavigationAction label="Stocks" icon={<Inventory2Icon />} />
        <BottomNavigationAction label="Transaction" icon={<PaidIcon />} />
        <BottomNavigationAction label="Manage Tax" icon={<AccountBalanceIcon />} />
        <BottomNavigationAction label="Exp Prod" icon={<ReportGmailerrorredIcon />} />
        <BottomNavigationAction label="Req Prod" icon={<ViewListIcon />} />
        <BottomNavigationAction label="Platforms" icon={<AirplayIcon />} />
        <BottomNavigationAction label="Reports" icon={<SummarizeIcon />} />
      </BottomNavigation>
    </Box>
  )
}

export default BottomBar


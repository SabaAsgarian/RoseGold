"use client"
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Button, FormControl, Input, InputLabel, InputAdornment, TextField, Grid } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponsiveDrawer from '../adminUI/Drawer'
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import B from '../../bradcrumbs'
import SearchIcon from '@mui/icons-material/Search';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import EditNoteIcon from '@mui/icons-material/EditNote';
import myContext from '@/app/myContext';


import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PeopleIcon from '@mui/icons-material/People';
import Link from 'next/link';
// Adjust the import path as necessary

const Item = styled(Paper)(({ theme }) => ({
  backgroundstatus: '#1a2035',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  status: theme.palette.text.primary,
  ...theme.applyStyles('dark', {
    backgroundstatus: '#1a2035',
  }),
}));
const WhiteTextField = styled(TextField)({
  backgroundColor: 'white',
  borderRadius: '4px',
  '& .MuiInputBase-input': {
    color: 'black', // Text color
  },
  '& .MuiInputLabel-root': {
    color: 'black', // Label color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black', // Border color
    },
    '&:hover fieldset': {
      borderColor: 'black', // Hover border color
    },
    '&.Mui-focused fieldset': {
      borderColor: 'black', // Focused border color
    },
  },
});
const StyledButton = styled(Button)({
  backgroundColor: '#a9dfd8',
  color: 'black',
  '&:hover': {
    backgroundColor: '#8fcfc8',
  },
});

function createData(name, calories, fat, carbs, protein, street) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    street,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}


export default function page() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    loadPage(setData);
  }, []);

  const [formData, setFormData] = useState({
    img: '',
    fname: '',
    lname: '',
    street: '',
    role: '',
    user: '',
    age: '',
    pass: '',
    city: '',
    email: '',
    mobile: '',


  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const { img, fname, lname, street, role, user, age, pass, city, email, mobile } = formData;

    // Check if all fields are filled
    if (!img || !fname || !lname || !street || !role || !user || !age || !pass || !city || !email || !mobile) {
      alert('Please fill all the fields');
      return;
    }

    const url = 'https://rosegoldgallery-back.onrender.com/api/user';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to add user');
        }
        alert('New user added!');
        setFormData({ 
          img: '', 
          fname: '', 
          lname: '', 
          street: '', 
          role: '', 
          user: '', 
          age: '', 
          pass: '', 
          city: '', 
          email: '', 
          mobile: '' 
        }); // Reset form
        setOpen(false); // Close accordion after submission
        loadPage(setData); // Pass setData to loadPage function
      })
      .catch(error => {
        alert('New user not added: ' + error.message);
      });
  };

  // Filter data based on search term
  const filteredData = data.filter((user) =>
    user.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate paginated data
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <ResponsiveDrawer>
      <Box sx={{ 
        maxWidth: '92vw',
        overflowX: 'hidden'
      }}>
        <Grid container>
          <Grid item xs={12}>
            <Box sx={{
              width: { xs: '100%', sm: '100%' },
              mx: 'auto',
              px: { xs: 1, sm: 2, md: 3 },
            }}>
              <Box>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 4,
                  flexDirection: {sm: 'row' },
                  gap: { xs: 2, sm: 0 }
                }}>
                  <h1 style={{ textAlign: 'start', marginTop: '2rem' ,fontSize:'32px',fontWeight:'bold'}}>
                    <PeopleIcon /> Users
                  </h1>

                  <WhiteTextField
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      width: { xs: '100%', sm: '300px' },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ 
                  width: '100%',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    height: '8px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '4px'
                  }
                }}>
                  <TableContainer component={Paper} sx={{ 
                    minWidth: 650,
                    '@media (max-width: 600px)': {
                      minWidth: 1000 // Forces horizontal scroll on small screens
                    }
                  }}>
                    <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Address</TableCell>
                          <TableCell>phone</TableCell>
                          <TableCell>Edit</TableCell>
                          <TableCell>Delete</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedData.map((val) => (
                          <myContext.Provider value={val} key={'post' + val._id}>
                            <Row 
                              val={val} 
                              loadPage={() => loadPage(setData)}
                            />
                          </myContext.Provider>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {filteredData.length > rowsPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={Math.ceil(filteredData.length / rowsPerPage)}
                      page={page}
                      onChange={handlePageChange}
                      renderItem={(item) => (
                        <PaginationItem
                          slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                          {...item}
                        />
                      )}
                    />
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mt: 5, fontWeight: 'bolder' }}>
                  ADD New Users
                  <ControlPointIcon
                    sx={{ cursor: 'pointer', fontSize: '50px', color: 'black' }}
                    onClick={() => setOpen(!open)} // Toggle accordion
                  />
                </Box>
                <Accordion expanded={open}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}>
                    <h2>Add Users Details</h2>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                      <FormControl variant="standard">

                        <WhiteTextField
                          id="img"
                          name="img"
                          label="Image"
                          value={formData.img}
                          onChange={handleInputChange}
                          startAdornment={
                            <InputAdornment position="start">
                              <AccountCircle />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                      <WhiteTextField
                        id="fname"
                        name="fname"
                        label="First Name"
                        value={formData.fname}
                        onChange={handleInputChange}
                      />
                      <WhiteTextField
                        id="lname"
                        name="lname"
                        label="Last Name"
                        value={formData.lname}
                        onChange={handleInputChange}
                      />
                      <WhiteTextField
                        id="street"
                        name="street"
                        label="Street"
                        value={formData.street}
                        onChange={handleInputChange}
                      />
                      <WhiteTextField
                        id="role"
                        name="role" // Update this to match the 'role' property in formData
                        label="Status"
                        value={formData.role}
                        onChange={handleInputChange}
                      />
                      <WhiteTextField
                        id="user"
                        name="user"
                        label="User"
                        value={formData.user}
                        onChange={handleInputChange}
                      />
                      <WhiteTextField
                        id="age"
                        name="age"
                        label="Age"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                      <WhiteTextField
                        id="pass"
                        name="pass"
                        label="Password"
                        value={formData.pass}
                        onChange={handleInputChange}
                      />
                      <WhiteTextField
                        id="city"
                        name="city"
                        label="City"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                      <WhiteTextField
                        id="email"
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      <WhiteTextField
                        id="mobile"
                        name="mobile"
                        label="Mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                      />
                      <StyledButton variant="contained" onClick={handleSubmit}>Submit</StyledButton>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ResponsiveDrawer>
  );
}

function Row({ val, loadPage }) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState({ ...val }); // Initialize with current data

  const handleDelete = () => {
    if (!val._id) {
      alert('Invalid User ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      fetch(`https://rosegoldgallery-back.onrender.com/api/user/${val._id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            alert('Deleted successfully!');
            loadPage(); // Refresh data after deletion
          } else {
            throw new Error('Failed to delete');
          }
        })
        .catch((error) => {
          alert('Error: ' + error.message);
        });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!val._id) {
      alert('Invalid User ID');
      return;
    }

    fetch(`https://rosegoldgallery-back.onrender.com/api/user/${val._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed');
        alert('User updated successfully!');
        setIsEditing(false);
        loadPage(); // Refresh data after update
      })
      .catch((error) => alert('Error: ' + error.message));
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: 'black' }}
          >
            {open ? <KeyboardArrowUpIcon sx={{ color: 'black' }} /> : <KeyboardArrowDownIcon sx={{ color: 'black' }} />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {isEditing ? (
            <Box>
              <WhiteTextField
                label="img"
                value={newData.img}
                onChange={(e) => setNewData({ ...newData, img: e.target.value })}
              />
              <WhiteTextField
                label="fname"
                value={newData.fname}
                onChange={(e) => setNewData({ ...newData, fname: e.target.value })}
              />
              <WhiteTextField
                label="lname"
                value={newData.lname}
                onChange={(e) => setNewData({ ...newData, lname: e.target.value })}
              />
              <WhiteTextField
                label="status"
                value={newData.role}
                onChange={(e) => setNewData({ ...newData, status: e.target.value })}
              />
              <WhiteTextField
                label="email"
                value={newData.email}
                onChange={(e) => setNewData({ ...newData, email: e.target.value })}
              />
              <WhiteTextField
                label="mobile"
                value={newData.mobile}
                onChange={(e) => setNewData({ ...newData, mobile: e.target.value })}
              />
              <WhiteTextField
                label="pass"
                value={newData.pass}
                onChange={(e) => setNewData({ ...newData, pass: e.target.value })}
              />
              <WhiteTextField
                label="user"
                value={newData.user}
                onChange={(e) => setNewData({ ...newData, user: e.target.value })}
              />
              <WhiteTextField
                label="city"
                value={newData.city}
                onChange={(e) => setNewData({ ...newData, city: e.target.value })}
              />
              <WhiteTextField
                label="street"
                value={newData.street}
                onChange={(e) => setNewData({ ...newData, street: e.target.value })}
              />
              <WhiteTextField
                label="age"
                value={newData.age}
                onChange={(e) => setNewData({ ...newData, age: e.target.value })}
              />

              <IconButton onClick={handleSave}>
                <EditNoteIcon sx={{ color: 'black' }} />
              </IconButton>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              {newData.img && (
                <img
                  src={newData.img}
                  alt="User"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              )}
              <span>{newData.fname} {newData.lname}</span>
            </Box>
          )}
        </TableCell>

        <TableCell align="left"> {/* Empty Status Column */}
          {/* You can add status text here if needed */}
          {val.role}
        </TableCell>
        <TableCell align="left">{val.email}</TableCell>
        <TableCell align="left">{val.city},{val.street}</TableCell>
        <TableCell align="left">{val.mobile}</TableCell>
        <TableCell align="center">
          {val.id === 0 ? null : ( // Do not render edit icon for ID 1
            <IconButton onClick={handleEditClick}>
              <EditNoteIcon sx={{ color: 'black' }} />
            </IconButton>
          )}
        </TableCell>
        <TableCell align="center">
          {val._id === 1 ? null : ( // Ensure you're using the correct property (_id) for the user
            <IconButton onClick={handleDelete}> {/* Invokes handleDelete */}
              <DeleteOutlineIcon sx={{ color: 'black' }} />
            </IconButton>
          )}
        </TableCell>



      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                More Detail:
              </Typography>
              <Typography variant="body2">User: {val.user}</Typography>
              <Typography variant="body2">Password: {val.pass}</Typography>
              <Typography variant="body2">Age: {val.age}</Typography>

            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const loadPage = (setData) => {
  fetch('https://rosegoldgallery-back.onrender.com/api/user')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to load data');
      }
      return res.json();
    })
    .then(data => {
      console.log('Fetched data:', data);
      setData(data); // Call setData passed as an argument
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Error fetching data: ' + error.message);
    });
};





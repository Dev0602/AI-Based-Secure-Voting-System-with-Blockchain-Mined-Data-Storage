import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {  Drawer } from '@material-ui/core';
import Notifications from '@material-ui/icons/Edit';
import Contact from '@material-ui/icons/LocalHospital';
import Total from '@material-ui/icons/Email';
import {  SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)',
    }
  },
  root: {
    backgroundColor:'#7aa4f0',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
  // background:'#3e6fc9',

  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));


const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'AddCandidate ',
      href: '/AddCandidate',
      icon: <Contact />
    } 
 
   
  
  ];


  const pages2 = [
    {
      title: 'Add User',
      href: '/Addusers',
      icon: <Contact />
    } 
 
   
  
  ];

  const pages3 = [
    {
      title: 'Edit Candidate',
      href: '/Admin',
      icon: <Contact />
    } ,

    {
      title: 'Update Election Details',
      href: '/AdminUpdateElectionDay',
      icon: <Notifications />
    } ,
    {
      title: 'Total Vote Count',
      href: '/AdminVotecount',
      icon: <Total />
    } ,


 
   
  
  ];

  const pages4 = [
    {
      title: 'Candidate List',
      href: '/Candidate_details_for_users',
      icon: <Contact />
    } 
 
   
  
  ];

  const pages5 = [
    {
      title: 'Add Promises',
      href: '/AddPromises',
      icon: <Contact />
    } 
 
   
  
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >

      
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >{

        localStorage.getItem("usertype") == "candidate" ?(
          <SidebarNav
          className={classes.nav}
          pages={pages}
        />

        ):localStorage.getItem("usertype") == "user" ?(

          <SidebarNav
          className={classes.nav}
          pages={pages2}
        />
        ):localStorage.getItem("usertype") == "UserCandidate" ?(

          <SidebarNav
          className={classes.nav}
          pages={pages4}
        />

        ):localStorage.getItem("usertype") == "AddPromises_for_candidate" ?(

          <SidebarNav
          className={classes.nav}
          pages={pages5}
        />
        ):(

          <SidebarNav
          className={classes.nav}
          pages={pages3}
        />
        )
      }
      
       
       
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;

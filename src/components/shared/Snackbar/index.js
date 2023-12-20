import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../../store/actions/notification';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function SnackbarBox({notification}) {
  const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
  useEffect(()=>{
    setOpen(true);
    if (!notification?.autoHide) {
        return;
    }
    setTimeout(()=>{
        setOpen(false);
        dispatch(showNotification({
            message: '',
            severity: 'warning',
            autoHide: true
        }))
    }, 2000);
  },[notification?.message])

  if(!notification?.message){
    return null;
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={2000}
      >
        <Alert classes={{maxWidth: "auto"}} severity={notification.severity}>
            {notification?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

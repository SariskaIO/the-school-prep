import {
    Box,
    Hidden,
    makeStyles
  } from "@material-ui/core";
  import React, { useState } from "react";
  import { color } from "../../../assets/styles/_color";
  import { useHistory } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import CallEndIcon from "@material-ui/icons/CallEnd";
  import MicIcon from "@material-ui/icons/Mic";
  import MicOffIcon from "@material-ui/icons/MicOff";
  import VideocamIcon from "@material-ui/icons/Videocam";
  import VideocamOffIcon from "@material-ui/icons/VideocamOff";
  import {
    localTrackMutedChanged
  } from "../../../store/actions/track";
  import { clearAllReducers } from "../../../store/actions/conference";
  import {
    formatAMPM
  } from "../../../utils";
  import StyledTooltip from "../../shared/StyledTooltip";

  
  const useStyles = makeStyles((theme) => ({
    root: {
      height: "44px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      bottom: "16px",
      width: "650px",
      position: "fixed",
      color: color.white,
      [theme.breakpoints.down("md")]: {
        bottom: "0px",
        background: color.secondaryDark,
        height: '72px'
      },
      "& svg": {
        padding: "8px",
        borderRadius: "8px",
        marginRight: "2px",
        [theme.breakpoints.down("md")]: {
          background: color.secondary,
          borderRadius: '50%',
          marginRight: "6px !important",
        },
        "&:hover": {
          opacity: "0.8",
          cursor: "pointer",
          color: color.primaryLight,
        },
      },
    },
    active: {
      opacity: "0.8",
      cursor: "pointer",
      color: color.red,
    },
    panTool: {
      fontSize: "18px",
      padding: "12px !important",
      marginRight: "12px",
      [theme.breakpoints.down("md")]: {
        marginRight: "6px !important",
      },
    },
    infoContainer: {
      marginLeft: "20px",
      display: "flex",
      width: "fit-content",
    },
    separator: {
      marginLeft: "10px",
      marginRight: "10px",
    },
    screenShare: {
      padding: "8px",
      marginRight: "2px",
      borderRadius: "8px",
      [theme.breakpoints.down("md")]: {
        background: color.secondary,
        borderRadius: '50%',
        marginRight: "6px",
      },
    },
    permissions: {
      display: "flex",
      alignItems: "center",
      padding: "0px 5px",
      backgroundColor: color.secondary,
      borderRadius: "7.5px",
      marginRight: "24px",
      [theme.breakpoints.down("sm")]: {
        backgroundColor: "transparent",
      //  margin: 'auto',
        position: 'relative',
        bottom: '0px'
      },
    },
    end: {
      background: `${color.red} !important`,
      borderColor: `${color.red} !important`,
      padding: "2px 12px !important",
      textAlign: "center",
      borderRadius: "30px !important",
      width: "42px",
      fontSize: "36px",
      marginRight: 0,
      "&:hover": {
        opacity: "0.8",
        background: `${color.red} !important`,
        cursor: "pointer",
        color: `${color.white} !important`,
      },
      [theme.breakpoints.down("sm")]: {
        padding: "8px !important",
        width: "40px",
        fontSize: "24px",
      },
    },
    liveBox: {
      display: 'flex',
      alignItems: 'center',
      border: `1px solid ${color.red}`,
      borderRadius: '30px',
      paddingLeft: '8px',
      paddingRight: '8px',
      marginLeft: '8px',
      '&:hover': {
        cursor: 'pointer'
      }
    },
    dot: {
      padding: '2px !important',
      fontSize: '1rem'
    },
    live: {
      color: color.red,
      padding: '6px 6px 6px 0',
      minWidth: '36px',
    },
    subIcon: {
      border: "none !important",
      marginRight: "0px !important",
      marginLeft: "4px !important",
    },
    more: {
      marginRight: "0px !important",
    },
    drawer: {
      "& .MuiDrawer-paper": {
        overflowX: "hidden",
        top: "16px",
        bottom: "80px",
        right: "16px",
        borderRadius: "10px",
        height: "89%",
        width: "360px",
        backgroundColor: color.secondary,
        overflowY: "auto",
      },
    },
    list: {
      padding: theme.spacing(3, 3, 0, 3),
      height: "100%",
    },
    title: {
      color: color.white,
      fontWeight: "400",
      marginLeft: "8px",
      fontSize: "28px",
      lineHeight: "1",
      [theme.breakpoints.down("sm")]: {
        marginLeft: 0,
        fontSize: '24px'
      }
    },
    participantHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      "& svg": {
        color: color.white
      }
    },
    chatList: {
      height: "100%",
      padding: theme.spacing(3, 3, 0, 3),
    },
    chat: {
      marginRight: "0px !important",
      fontSize: "20px",
      padding: "10px !important",
      [theme.breakpoints.down("md")]: {
        marginRight: '6px !important'
      }
    },
    moreActionList: {
      height: "100%",
      width: "260px",
      padding: theme.spacing(1, 0, 0, 0),
      backgroundColor: color.secondary,
    },
  }));
  
  const ActionButtons = () => {
    const history = useHistory();
    const audioTrack = useSelector((state) => state.localTrack).find((track) =>
      track.isAudioTrack()
    );
    const videoTrack = useSelector((state) => state.localTrack).find((track) =>
      track.isVideoTrack()
    );
    const classes = useStyles();
    const dispatch = useDispatch();
    const [time, setTime] = useState(formatAMPM(new Date()));
    const profile = useSelector((state) => state.profile);
  
    const muteAudio = async () => {
      await audioTrack?.mute();
      dispatch(localTrackMutedChanged());
    };
  
    const unmuteAudio = async () => {
      await audioTrack?.unmute();
      dispatch(localTrackMutedChanged());
    };
  
    const muteVideo = async () => {
      await videoTrack?.mute();
      dispatch(localTrackMutedChanged());
    };
  
    const unmuteVideo = async () => {
      await videoTrack?.unmute();
      dispatch(localTrackMutedChanged());
    };
  
    const leaveConference = () => {
      dispatch(clearAllReducers());
      history.push("/leave");
    };
    
    return (
      <Box id="footer" className={classes.root}>
          <Box className={classes.infoContainer}>
            <Box>{time}</Box>
            <Box className={classes.separator}>|</Box>
            <Box>{profile.meetingTitle}</Box>
          </Box>
          <Box sx={{display: 'flex'}}>
          <StyledTooltip title="Leave Call">
            <CallEndIcon onClick={leaveConference} className={classes.end} />
          </StyledTooltip>
          </Box>
        <Box className={classes.permissions}>
          <StyledTooltip
            title={
              audioTrack
                ? audioTrack?.isMuted()
                  ? "Unmute Audio"
                  : "Mute Audio"
                : "Check the mic or Speaker"
            }
          >
            {audioTrack ? (
              audioTrack?.isMuted() ? (
                <MicOffIcon onClick={unmuteAudio} className={classes.active} />
              ) : (
                <MicIcon onClick={muteAudio} />
              )
            ) : (
              <MicIcon onClick={muteAudio} style={{ cursor: "unset" }} />
            )}
          </StyledTooltip>
          <StyledTooltip
            title={videoTrack?.isMuted() ? "Unmute Video" : "Mute Video"}
          >
            {videoTrack?.isMuted() ? (
              <VideocamOffIcon onClick={unmuteVideo} className={classes.active} />
            ) : (
              <VideocamIcon onClick={muteVideo} />
            )}
          </StyledTooltip>
        </Box>
      </Box>
    );
  };
  
  export default ActionButtons;
  
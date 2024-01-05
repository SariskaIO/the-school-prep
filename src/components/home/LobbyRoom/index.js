import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateMeetingId, generateParticipantName, getRandomColor, getToken } from '../../../utils';
import { setDisconnected } from '../../../store/actions/layout';
import { addConnection } from '../../../store/actions/connection';
import { addConference } from '../../../store/actions/conference';
import { setMeeting, setProfile, updateProfile } from '../../../store/actions/profile';
import sariskaMediaTransport from 'sariska-media-transport';
import { Box, Button, Typography, makeStyles } from '@material-ui/core';
import FancyButton from '../../shared/FancyButton';
import { color } from '../../../assets/styles/_color';
import Meeting from '../../../views/Meeting';
import JoinTrack from '../JoinTrack';
import TextInput from '../../shared/TextInput';


const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: 'flex-start',
      background: color.black1,
      height: '100vh',
    },
    videoContainer: {
        padding: '24px'
    },
    title: {
        fontWeight: '600',
        fontSize: '1.2rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
        border: `1px solid ${color.buttonGradient}`,
        color: color.white,
        background: color.buttonGradient,
        width: '100%'   
    }
}));

const LobbyRoom = ({tracks}) => {
    const classes = useStyles();
    const [name, setName] = useState("");
  const audioTrack = tracks.filter(track => track?.isAudioTrack());
  const videoTrack = tracks.filter(track => track?.isVideoTrack());
  const conferenceRedux = useSelector((state) => state.conference);
  const profile = useSelector((state) => state.profile);
console.log('first trackss', tracks)
  const dispatch = useDispatch();

  let moderator = useRef(false);
  let meetingTitle = 'sariska1' || generateMeetingId();


  const handleUserNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.length === 1 ) {
      dispatch(updateProfile({key: "color", value: getRandomColor()}));
    }
    if (!e.target.value) {
      dispatch(updateProfile({key: "color", value: null}));
    }
  };

  const handleSubmit = async() => {

    let isModerator = name ==='admin' ? true : false;
    // get token
    const token = await getToken(profile, name, getRandomColor(), isModerator);

    // create connection
    const connection  = new sariskaMediaTransport.JitsiConnection(
        token,
        meetingTitle,
        process.env.REACT_APP_ENV === "development" ? true : false
    )
    
    // Event Listeners for connections
    connection.addEventListener(
        sariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED,
        () => {
          dispatch(addConnection(connection));

          //create conference
          createConference(connection);
        }
      );
  
      connection.addEventListener(
        sariskaMediaTransport.events.connection.CONNECTION_FAILED,
        async (error) => {
          console.log(" CONNECTION_DROPPED_ERROR", error);
          if (
            error === sariskaMediaTransport.errors.connection.PASSWORD_REQUIRED
          ) {
            const token = await getToken(profile, name, moderator.current, isModerator);
            connection.setToken(token); // token expired, set a new token
          }
          if (
            error ===
            sariskaMediaTransport.errors.connection.CONNECTION_DROPPED_ERROR
          ) {
            dispatch(setDisconnected("lost"));
          }
        }
      );
  
      connection.addEventListener(
        sariskaMediaTransport.events.connection.CONNECTION_DISCONNECTED,
        (error) => {
          console.log("connection disconnect!!!", error);
        }
      );

      // connect the connection
      connection.connect();

     const createConference = async(connection) => {

        // create conference using connection
        const conference = connection.initJitsiConference();

        // add all localtracks to the conference
        tracks.forEach(async (track) => await conference.addTrack(track));

        // Event listeners for conference
        conference.addEventListener(
            sariskaMediaTransport.events.conference.CONFERENCE_JOINED,
            () => {
              dispatch(addConference(conference));
              dispatch(setProfile(conference.getLocalUser()));
              dispatch(setMeeting({ meetingTitle }));
            }
        );

        // join the conference
        conference.join();
     }
  }

  // useEffect(()=>{
  //   const submit = async() =>{
  //     handleSubmit()
  //   }
  //   submit();
  // }, [])
  
  return (
    
    <Box className={classes.root}>
      <Box className={classes.videoContainer}>
        <Box sx={{textAlign: 'center'}}>
          <Typography className={classes.title} >
            TheSchoolPrep
          </Typography>
        </Box>
        <Box className={classes.userBox}>
                  <TextInput
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    label="Username"
                    width="20vw"
                    value={name}
                    onChange={handleUserNameChange}
                  />
              </Box>
        {/* <Box className={!queryParams.meetingId ? classes.permissions : classes.joinPermissions}>
          {audioTrack?.isMuted() ? (
            <StyledTooltip title="Unmute Audio">
              <MicOffIcon onClick={unmuteAudioLocalTrack} />
            </StyledTooltip>
          ) : (
            <StyledTooltip title="Mute Audio">
              <MicIcon onClick={muteAudioLocalTrack} />
            </StyledTooltip>
          )}
          {videoTrack?.isMuted() ? (
            <StyledTooltip title="Unmute Video">
              <VideocamOffIcon onClick={unmuteVideoLocalTrack} />
            </StyledTooltip>
          ) : (
            <StyledTooltip title="Mute Video">
              <VideocamIcon onClick={muteVideoLocalTrack} />
            </StyledTooltip>
          )}
          <StyledTooltip title="Settings">
            <SettingsIcon onClick={toggleSettingsDrawer("right", true)} />
          </StyledTooltip>
        </Box> */}
        {/* <Box style={{textAlign: 'center', position: 'relative'}}>
            <Button 
                onClick={handleSubmit}
            >Create Meeting</Button>
        </Box> */}
      </Box>
      {/* <JoinTrack tracks={tracks} name={name} /> */}
        {conferenceRedux ? <Meeting /> : null}
      
    </Box>
  )
}

export default LobbyRoom
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import sariskaMediaTransport from 'sariska-media-transport';
import { setModerator, setPinParticipant } from '../../store/actions/layout';
import { addRemoteTrack, participantLeft, removeRemoteTrack } from '../../store/actions/track';
import Home from '../Home';
import { Box, makeStyles } from '@material-ui/core';
import MainLayout from '../../components/meeting/MainLayout';
import VirtualRoomLayout from '../../components/meeting/VirtualRoomLayout';

const useStyles = makeStyles((theme) => ({
  meetingContainer: {
    width: '650px',
    height: '500px',
    maxWidth: '1320px',
    maxHeight: '1000px'
  }
}));

const Meeting = () => {
  const classes = useStyles();
  const localTracks = useSelector((state) => state.localTrack);
  const conference = useSelector((state) => state.conference);
  const connection = useSelector((state) => state.connection);
  const layout = useSelector((state) => state.layout);
  const dispatch = useDispatch();
console.log('meeting here')
  const destroy = async () => {
    if (conference?.isJoined()) {
      await conference?.leave();
    }
    for (const track of localTracks) {
      await track.dispose();
    }
    await connection?.disconnect();
  };

  useEffect(()=>{
    if (!conference) {
      return;
    }
    conference.getParticipantsWithoutHidden().forEach((item) => {
      if (item._properties?.isModerator === "true") {
          dispatch(setModerator({ participantId: item._id, isModerator: true }));
        }
    });

    conference.addEventListener(
      sariskaMediaTransport.events.conference.TRACK_REMOVED,
      (track) => {
        console.log('track removed', track);
        dispatch(removeRemoteTrack(track));
      }
    );

    conference.addEventListener(
      sariskaMediaTransport.events.conference.TRACK_ADDED,
      (track) => {
        console.log('track addded', track);
        if (track.isLocal()) {
          return;
        }
        
        // if(track?.getType() === 'video'){
        //   track?.unmute();
        // }
        dispatch(addRemoteTrack(track));
      }
    );

    conference.addEventListener(
      sariskaMediaTransport.events.conference.PARTICIPANT_PROPERTY_CHANGED,
      (participant, key, oldValue, newValue) => {
        console.log('PARTICIPANT_PROPERTY_CHANGED')
        if (key === "isModerator" && newValue === "true") {
          dispatch(
            setModerator({ participantId: participant._id, isModerator: true })
          );
        }
      })

    window.addEventListener("beforeunload", destroy);
    return () => {
      destroy();
    };
    },[conference]);

    useEffect(() => {
      if (!conference) {
        return;
      }
      const userLeft = (id) => {
        if (id === layout.pinnedParticipant.participantId) {
          dispatch(setPinParticipant(null));
        }
        dispatch(participantLeft(id));
      };
      conference.addEventListener(
        sariskaMediaTransport.events.conference.USER_LEFT,
        userLeft
      );
      return () => {
        conference.removeEventListener(
          sariskaMediaTransport.events.conference.USER_LEFT,
          userLeft
        );
      };
    }, [conference, layout]);
    
  return (
    <Box sx={{display: 'flex'}}>

<Box className={classes.meetingContainer}>
      <MainLayout />
      </Box>
      <VirtualRoomLayout />
    </Box>
  )
}

export default Meeting
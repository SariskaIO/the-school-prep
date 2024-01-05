import React, { useEffect, useState } from 'react'
import Video from '../Video'
import { Avatar, Box, Typography, makeStyles } from '@material-ui/core';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import classNames from 'classnames';
import { color } from '../../../assets/styles/_color';
import { useDispatch, useSelector } from 'react-redux';
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { setPinParticipant, setVirtualParticipant } from '../../../store/actions/layout';
import PinParticipant from '../PinParticipant';
import { AVATAR_DIMENTIONS, VIDEO_DIMENTIONS } from '../../../constants';
import { getTrackByType } from '../../../utils';
import Audio from '../Audio';
import VirtualizeParticipant from '../VirtualizeParticipant';

const VideoBox = ({
    tracks, height, width, minWidth, minHeight, localUserId, participantDetails, isPresenter,
    totalTracks,
    totalParticipants,
    unpinnedParticipantIds
  }) => {
    const useStyles = makeStyles(theme => ({
      avatar: {
        zIndex: 1,
        width: '80px',
        height: '80px',
        '& svg': {
          fontSize: '48px'
        }
      },
      pan: {
        color: color.primaryLight,
        position: 'absolute',
        marginTop: '-182px',
      },
      audioBox: {
        background: totalParticipants>1 ? color.secondary : "transparent",
        position: "absolute",
        top: 0,
        zIndex: 1,
        display: "flex",
        justifyContent: "flex-end",
        padding: theme.spacing(1),
        color: color.white,
        "& svg": {
          background: color.secondary,
          borderRadius: "50%",
          padding: "5px",
          [theme.breakpoints.down("sm")]: {
            background: totalParticipants>1 ? color.secondary : "transparent",
          },
        },
        [theme.breakpoints.down("sm")]: {
          padding: theme.spacing(0.25, 1, 1, 0.25),
        },
      },
      rightControls: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        padding: theme.spacing(1),
      //  right: 0,
        zIndex: "9999",
        marginLeft: '285px',
        marginTop: '-37px'
      },
      textBox: {
        color: color.white,
        position: 'absolute',
        marginTop: '-27px',
        marginLeft: '4px'
      }
    }))
    
  const classes = useStyles();
  const conference = useSelector(state => state.conference);
  const { pinnedParticipant, virtualParticipant } = useSelector(state => state.layout);
  //adds video or desktop track
  let videoTrack = tracks?.find(track => track?.getType() === 'video');
  const audioTrack = tracks?.find((track) => track?.isAudioTrack());
 // videoTrack?.unmute();
  const videoTrack1 = useSelector((state) => state.localTrack).find((track) =>
    track.isVideoTrack()
  );
  console.log('first part', conference, totalTracks, totalParticipants, localUserId, participantDetails?.name, tracks, videoTrack, videoTrack?.isMuted(), videoTrack1, virtualParticipant)
  
  const [visibleVirtualParticipant, setVisibleVirtualParticipant] = useState(true);
  const dispatch = useDispatch();

  const toggleVirtualParticipant = (id) => {
    console.log('(id===localUserId) && ', id===localUserId, id, localUserId)
    if(conference.isModerator()){
      if(id){
        conference.setLocalParticipantProperty("isVirtual", id);
      }else{
        conference.setLocalParticipantProperty("isVirtual", null);
      }
      dispatch(setVirtualParticipant(id));
    }else{
      console.log('you are not expert')
    }
  };

  useEffect(()=>{
    let otherTracks = []; 
    if(!totalTracks ){ return; }
    if(!virtualParticipant.participantId ){ return; }
    unpinnedParticipantIds?.map(id => otherTracks.push(getTrackByType(totalTracks[id], 'audio')));
    console.log('unpinnedParticipantIds other', unpinnedParticipantIds, otherTracks, virtualParticipant, localUserId);
    if(Object.keys(virtualParticipant)?.length){
      totalParticipants?.forEach(async (participant) => {
        if(conference?.isModerator()){
          return;
        }
        else if( participant?._id === localUserId && participant?._id === virtualParticipant?.participantId){
          console.log('first participant participant', participant)
          otherTracks?.map(async (track) => await conference.removeTrack(track));
        }
        else{
          if(totalParticipants?.length<3){return;}
          let virtualParticipantAudioTrack = getTrackByType(totalTracks[virtualParticipant?.participantId], 'audio');
          console.log('virtualParticipantAudioTrack', virtualParticipantAudioTrack)
          await conference.removeTrack(virtualParticipantAudioTrack);
        }
      })
    }
  },[virtualParticipant?.participantId])

  console.log('toggle pin', virtualParticipant)
  return (
    <Box 
      style={{background: isPresenter && '#42424a', position: 'relative'}}
      onMouseEnter={() => setVisibleVirtualParticipant(true)}
      onMouseLeave={() => setVisibleVirtualParticipant(false)}
      >
      <Box className={classNames(classes.audioBox, { audioBox: true })}>
        {audioTrack?.isMuted() ? <MicOffIcon /> : <MicIcon />}
        {!audioTrack?.isLocal() && <Audio track={audioTrack} />}
      </Box>
      {
        videoTrack?.isMuted() ? //to show video muted on remote side.
        <Box sx={{width, height: AVATAR_DIMENTIONS.HEIGHT, minHeight, minWidth, background: 'lightgray', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Avatar className={classes.avatar}>
            <PersonOutlineIcon />
          </Avatar>
        </Box>
        :
        <Video 
            width={width}
            height={height}
            track={videoTrack}
            minHeight={minHeight}
            minWidth={minWidth}
            isPresenter={isPresenter}
        />
      }
      <Box
        className={classNames(classes.rightControls, { rightControls: true })}
      >
        {visibleVirtualParticipant && (
          <VirtualizeParticipant
            participantId={participantDetails?.id}
            virtualParticipantId={virtualParticipant.participantId}
            toggleVirtualParticipant={toggleVirtualParticipant}
          />
        )}
      </Box>
      <Typography className={classNames(classes.textBox, {userDetails: true})} >
        {
        localUserId === participantDetails?.id 
        ? "You"
        : participantDetails?.name
        }
      </Typography>
    </Box>
  )
}

export default VideoBox
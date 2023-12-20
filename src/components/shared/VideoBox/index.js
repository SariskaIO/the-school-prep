import React, { useEffect, useState } from 'react'
import Video from '../Video'
import { Avatar, Box, Typography, makeStyles } from '@material-ui/core';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import classNames from 'classnames';
import { color } from '../../../assets/styles/_color';
import { useDispatch, useSelector } from 'react-redux';
import { setPinParticipant } from '../../../store/actions/layout';
import PinParticipant from '../PinParticipant';
import { AVATAR_DIMENTIONS, VIDEO_DIMENTIONS } from '../../../constants';

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

const VideoBox = ({tracks, height, width, minWidth, minHeight, localUserId, participantDetails, isPresenter}) => {
  const classes = useStyles();
  const conference = useSelector(
    (state) => state.conference
  );
  const { pinnedParticipant } = useSelector(
    (state) => state.layout
  );
  //adds video or desktop track
  let videoTrack = tracks?.find(track => track?.getType() === 'video');
 // videoTrack?.unmute();
  const videoTrack1 = useSelector((state) => state.localTrack).find((track) =>
    track.isVideoTrack()
  );
  console.log('first part', localUserId, participantDetails?.name, tracks, videoTrack, videoTrack?.isMuted(), videoTrack1)
  
  const [visiblePinParticipant, setVisiblePinPartcipant] = useState(true);
  const dispatch = useDispatch();
  const togglePinParticipant = (id) => {
    if(conference.isModerator()){
    dispatch(setPinParticipant(id, isPresenter));
    }else{
      console.log('you are not expert')
    }
  };
  console.log('toggle pin', pinnedParticipant)
  return (
    <Box 
      style={{background: isPresenter && '#42424a'}}
      onMouseEnter={() => setVisiblePinPartcipant(true)}
      onMouseLeave={() => setVisiblePinPartcipant(false)}
      >
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
        {visiblePinParticipant && (
          <PinParticipant
            participantId={participantDetails?.id}
            pinnedParticipantId={pinnedParticipant.participantId}
            togglePinParticipant={togglePinParticipant}
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
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import React from 'react'
import { useSelector } from 'react-redux';
import VideoBox from '../../shared/VideoBox';
import { VIDEO_DIMENTIONS } from '../../../constants';
import { color } from '../../../assets/styles/_color';

const useStyles = makeStyles((theme)=>({
  box: {
    borderLeft: `1px solid ${color.whiteLight}`,
    paddingLeft: theme.spacing(0.5)
  },
  gridContainer: {
      justifyContent: 'space-between',
      flexDirection: 'column',
  },
  title: {
    color: color.white,
    fontWeight: '600',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: '1rem',
    borderBottom: `1px solid ${color.whiteLight}`,
}
}))
const VirtualRoomLayout = () => {
  const classes = useStyles();
  const layout = useSelector(state => state.layout);
  const conference = useSelector(state => state.conference);

  const localTracks = useSelector(state => state.localTrack);
  const remoteTracks = useSelector(state => state.remoteTrack);
  const localUser = conference.getLocalUser();

    // all participants 
    const tracks = { ...remoteTracks, [localUser.id]: localTracks };
    // all tracks
    const unorderedParticipants = [...conference.getParticipantsWithoutHidden(), { _identity: { user: localUser }, _id: localUser.id }]
    let [moderator] = unorderedParticipants.filter(participant => participant?._identity.user.name=== 'admin');

    let participants = [];
    let unpinnedParticipantIds=[];
    let virtualParticipantId = layout.virtualParticipant.participantId;

    unorderedParticipants?.forEach(p=>{
      if(p._id === virtualParticipantId){
          let virtualParticipant = unorderedParticipants.filter(p => p._id === virtualParticipantId)[0];
          participants.unshift(virtualParticipant);   
      }
      else if(p._id === moderator?._id){
        participants.push(moderator);
      }else{
        unpinnedParticipantIds.push(p._id);
      }
  });
console.log('first confe', conference, virtualParticipantId, unpinnedParticipantIds, participants)
  return (
    <>
    {virtualParticipantId && ((localUser.id === virtualParticipantId) || (conference?.isModerator())) ? 
    <Box className={classes.box}>
      <Typography className={classes.title}>Virtual Breakout Room</Typography>
      <Grid container className={classes.gridContainer}>
            {participants.map((participant, index) => {
                console.log('virtial unorderedParticipants index', localUser, index, participants[index]?._id, participants)
                return (tracks[participants[index]?._id] || participants[index]?._id) &&<Grid item md={6}>
                    <VideoBox key={index}
                       // height={VIDEO_DIMENTIONS.HEIGHT}
                        width={VIDEO_DIMENTIONS.WIDTH}
                        isBorderSeparator={participants.length > 1}
                        isFilmstrip={true}
                        participantDetails={participants[index]?._identity?.user}
                        tracks={tracks[participants[index]._id]}
                        localUserId={conference.myUserId()}
                        totalTracks = {tracks}
                        totalParticipants = {unorderedParticipants}
                        unpinnedParticipantIds={unpinnedParticipantIds}
                    />
                </Grid>
            })
            }
        </Grid>
    </Box>
        : null}
    </>
  )
}

export default VirtualRoomLayout
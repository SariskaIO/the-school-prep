import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import React from 'react'
import { useSelector } from 'react-redux';
import { VIDEO_DIMENTIONS } from '../../../constants';
import VideoBox from '../../shared/VideoBox';
import { color } from '../../../assets/styles/_color';

const useStyles = makeStyles((theme)=>({
    box: {
      paddingRight: theme.spacing(0.5)
    },
    gridContainer: {
        justifyContent: 'space-between',
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

const MainLayout = () => {
    const classes = useStyles();
    const conference = useSelector(state => state.conference);

    const constraints = {
        "colibriClass": "ReceiverVideoConstraints",
        "defaultConstraints": { "maxHeight":  180, "maxFrameRate": 15 }
    }
    conference.setReceiverConstraints(constraints);
    
    const localTracks = useSelector(state => state.localTrack);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const localUser = conference.getLocalUser();

    // all participants 
    const tracks = { ...remoteTracks, [localUser.id]: localTracks };
    // all tracks
    const unorderedParticipants = [...conference.getParticipantsWithoutHidden(), { _identity: { user: localUser }, _id: localUser.id }];
console.log('unorderedParticipants 1', unorderedParticipants , tracks, remoteTracks, conference, conference.getParticipantsWithoutHidden())
  return (
    <Box className={classes.box}>
        <Typography className={classes.title}>Meeting Room</Typography>
        <Grid container className={classes.gridContainer}>
            {unorderedParticipants.map((participant, index) => {
                console.log('first unorderedParticipants index', index, unorderedParticipants[index]?._id, conference)
                return (tracks[unorderedParticipants[index]?._id] || unorderedParticipants[index]?._id) &&<Grid item md={6}>
                    <VideoBox key={index}
                       // height={VIDEO_DIMENTIONS.HEIGHT}
                        width={VIDEO_DIMENTIONS.WIDTH}
                        isBorderSeparator={unorderedParticipants.length > 1}
                        isFilmstrip={true}
                        participantDetails={unorderedParticipants[index]?._identity?.user}
                        tracks={tracks[unorderedParticipants[index]._id]}
                        localUserId={conference.myUserId()}
                    />
                </Grid>
            })
            }
        </Grid>
    </Box>
  )
}

export default MainLayout
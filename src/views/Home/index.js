import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addLocalTrack } from '../../store/actions/track';
import { Box } from '@material-ui/core';
import LobbyRoom from '../../components/home/LobbyRoom';
import sariskaMediaTransport from 'sariska-media-transport';
import { RESOLUTION } from '../../constants';

const Home = () => {
  const [localTracks, setLocalTracks] = useState([]);
  const localTracksRedux = useSelector(state => state.localTrack);

  sariskaMediaTransport.initialize();
  sariskaMediaTransport.setLogLevel(sariskaMediaTransport.logLevels.Error);

  const dispatch = useDispatch();

  useEffect(()=>{
    if (localTracksRedux.length > 0)  {
      return;
    }
    const createLocalTracks = async() => {
      let tracks=[];
      try {
        const [audioTrack] = await sariskaMediaTransport.createLocalTracks({devices: ["audio"], resolution: RESOLUTION});
        tracks.push(audioTrack)
      } catch (error) {
        console.log('error in fetching audio track', error);
      }
      try {
        const [videoTrack] = await sariskaMediaTransport.createLocalTracks({devices: ["video"], resolution: RESOLUTION});
        tracks.push(videoTrack)
      } catch (error) {
        console.log('error in fetching video track', error);
      }
      setLocalTracks(tracks);
      tracks.forEach(track => dispatch(addLocalTrack(track)));
    }
    createLocalTracks();
  },[])

  return (
    <div>
      <Box>
        {localTracks?.length > 0 &&  <LobbyRoom tracks={localTracks} />}
      </Box>
    </div>
  )
}

export default Home
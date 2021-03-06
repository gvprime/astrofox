import { createSlice } from '@reduxjs/toolkit';
import { api, analyzer, logger, player } from 'global';
import { setStatusText } from 'actions/app';
import { raiseError } from 'actions/errors';
import { loadAudioData } from 'utils/audio';
import { trimChars } from 'utils/string';

const initialState = {
  file: '',
  duration: 0,
  tags: null,
};

const audioStore = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    updateAudio(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

const { updateAudio } = audioStore.actions;

export default audioStore.reducer;

export function loadAudioFile(file, play) {
  return async (dispatch, getState) => {
    player.stop();

    logger.time('audio-file-load');

    try {
      const data = await api.readAudioFile(file);
      const audio = await loadAudioData(data);
      const duration = audio.getDuration();

      player.load(audio);
      audio.addNode(analyzer.analyzer);

      if (play === undefined) {
        play = getState().config.autoPlayAudio;
      }

      if (play) {
        player.play();
      }

      logger.timeEnd('audio-file-load', 'Audio file loaded:', file);

      const tags = await api.loadAudioTags(file);

      if (tags) {
        const { artist, title } = tags;

        await dispatch(setStatusText(trimChars(`${artist} - ${title}`)));
      } else {
        await dispatch(setStatusText(trimChars(file)));
      }

      dispatch(updateAudio({ file, duration, tags }));
    } catch (error) {
      dispatch(raiseError('Invalid audio file.', error));
    }
  };
}

export function openAudioFile(play) {
  return async (dispatch, getState) => {
    const { filePaths, canceled } = await api.showOpenDialog({
      filters: [
        {
          name: 'audio files',
          extensions: ['aac', 'mp3', 'm4a', 'ogg', 'wav'],
        },
      ],
    });

    if (!canceled) {
      if (play === undefined) {
        play = getState().config.autoPlayAudio;
      }
      dispatch(loadAudioFile(filePaths[0], play));
    }
  };
}

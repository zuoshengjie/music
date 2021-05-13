import {
  getSongUrl as mgGetSongUrl,
  search as mgSearch,
  getSongDetail as mgGetSongDetail,
} from '@/utils/music/mg';
import {
  getSongUrl as wyyGetSongUrl,
  search as wyySearch,
  getSongDetail as wyyGetSongDetail,
} from '@/utils/music/wyy';

export const musicTypeList = [
  {
    title: '咪咕音乐',
    key: 'mg',
    service: {
      search: mgSearch,
      getSongUrl: mgGetSongUrl,
      getSongDetail: mgGetSongDetail,
    },
  },
  { title: '酷我音乐', key: 'kw' },
  {
    title: '网易云音乐',
    key: 'wyy',
    service: {
      search: wyySearch,
      getSongUrl: wyyGetSongUrl,
      getSongDetail: wyyGetSongDetail,
    },
  },
];

export const musicTypeService = musicTypeList.reduce((p, v) => {
  return { ...p, [v.key]: v.service };
}, {});

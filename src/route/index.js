// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  // Статичне приватне поле для зберігання списку об'єктів Track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) // Генерує випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  // Статичний метод для створення об'єктів Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }
  // Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  // Внутрішній метод для додавання треку до списку плейлисту
  addTrack(playlist) {
    playlist.tracks.push(this);
  }

  // Статичний метод для отримання треку за ідентифікатором
  static getTrackById(id) {
    return this.#list.find((track) => track.id === id) || null;
  }
}

Track.create(
  'Інь-Ян',
  'MONATIK & ROXOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez & Rauw Alejandro',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shameless ',
  'Camila Cabello ',
  'https://picsum.photos/100/100',
)
Track.create(
  '2step ft Antytila',
  'Ed Sheeran',
  'https://picsum.photos/100/100',
)
Track.create(
  'DÁKITI',
  'BAD BUNNY і JHAY',
  'https://picsum.photos/100/100',
)
Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist {
  // Статичне приватне поле для зберігання об'єктів Playlist
  static #list = []

   constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000);
    this.name = name;
    this.tracks = []; 
    this.image = 'https://picsum.photos/100/100';
}
  // Статичний метод для створення об'єкту Playlist і додавання його до списку #list
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  // Статичний метод для отримання всього списку плейлистів
  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {}
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix;

  const name = req.body.name;
  const playlist = Playlist.create(name);

  if (isMix) {
    Playlist.makeMix(playlist);
  }

  // Отримуємо список треків у плейлисті
  const tracks = playlist.tracks;

  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
      playlist,
      tracks, // Передаємо список треків у шаблон
    },
  });
});

// ================================================================

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name
 
  if (!name) {
    return res.render('alert', {
    style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
        ?  '/spotify-create?isMix=true '
        : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)
 
// ================================================================
  
  res.render('spotify-playlist', {
  style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)
  
  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId); 
  const allTracks = Track.getList();

  const playlist = Playlist.getById(playlistId);

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: '/',
      },
    });
  }

  res.render('spotify-track-add', {
    style: 'spotify-track-add',
    data: {
      playlistId: playlistId,
      tracks: allTracks,
    },
  });
});

router.post('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.body.playlistId)
  const trackId = Number(req.body.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  const trackToAdd = Track.getList().find(
    (track) => track.id === trackId,
  )

  if (!trackToAdd) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого треку не знайдено',
        link: `/spotify-track-add?playlistId=${playlistId}`,
      },
    })
  }

  playlist.tracks.push(trackToAdd)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

router.get('/', async function (req, res) {
  try {
    // Отримуємо список плейлистів та всі треки асинхронно
    const allPlaylists = await Playlist.getList();
    const allTracks = await Track.getList();

    // Формуємо список плейлистів з кількістю треків у кожному плейлисті
    const playlistsWithTrackCount = allPlaylists.map((playlist) => {
      const tracksInPlaylist = allTracks.filter((track) => track.playlistId === playlist.id);
      return {
        ...playlist,
        amount: tracksInPlaylist.length,
      };
    });

    // Відображення списку плейлистів на сторінці
    res.render('index', {
      style: 'index',
      data: {
        list: playlistsWithTrackCount,
      },
    });
  } catch (error) {
    // Обробка помилок
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Помилка при отриманні списку плейлистів',
        link: '/',
      },
    });
  }
});

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
  
// Підключаємо роутер до бек-енду
module.exports = router

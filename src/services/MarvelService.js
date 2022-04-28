

class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=e6513514f8e944ac3ae17925609c4037';

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`)
    }

    return await res.json();
  }

  getAllCharaters = () => {
    return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
  }

  getCharater = (id) => {
    return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
  }
}

export default MarvelService;
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Config } from '../config/config';

//const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
//const API_TOKEN = 'AIzaSyAJk1xUI72YYfBMgEc84gjHUX-k2AN6-B0';

@Injectable()
export class YoutubeService {

  constructor(private http: Http) { }

  search(query){
    return this.http.get(`${Config.BASE_URL}?q=${query}&part=snippet&key=${Config.API_TOKEN}`)
      .map((res:Response) => res.json())
      .map(json => json.items);
  }

}
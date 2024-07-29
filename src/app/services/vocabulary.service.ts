import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVocabulary } from '../models/models';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})

export class VocabularyService {
    private _host = '';
    speech = new SpeechSynthesisUtterance();

    constructor(
        private _http: HttpClient
    ) {
        this._host = 'https://vocabulary-eaf35-default-rtdb.firebaseio.com/vocabularies.json';
        // this._host = 'https://vocabulary-eaf35-default-rtdb.firebaseio.com/vocabulary-begubor.json';
        // this._host = 'https://nodejs-app-83e4f-default-rtdb.firebaseio.com/vocabulary.json';
        this.speech.lang = 'en-US';
        this.speech.volume = 1;
        this.speech.rate = 1;
        this.speech.pitch = 1;
    }

    getVocabulariesList(): Observable<IVocabulary[]> {
        return this._http.get<IVocabulary[]>(this._host);
    }

    addNewWord(payload: IVocabulary): Observable<{ success: boolean }> {
        return this._http.post<{ success: boolean }>(this._host, payload);
    }

    updateVocabulary(payload: IVocabulary): Observable<{ success: boolean }> {
        return this._http.patch<{ success: boolean }>(this._host, JSON.stringify({
            [payload.id!]: {
                ...payload,
                sentencesMobile: false
            }
        }));
    }

    textToSpeech(word: any): void {
        this.speech.text = word;
        window.speechSynthesis.speak(this.speech);
    }
}

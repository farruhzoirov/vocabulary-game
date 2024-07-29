import {Component, ElementRef, OnInit, signal, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VocabularyService} from '../services/vocabulary.service';
import {IVocabulary} from '../models/models';
import {Router} from '@angular/router';

@Component({
    selector: 'vocabulary-list',
    templateUrl: './vocabulary-list.component.html',
    styleUrls: ['./vocabulary-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class VocabularyListComponent implements OnInit {
    @ViewChild('wordTextArea') wordTextArea!: ElementRef;
    public showVocabularyForm = false;
    public showSearchInput = false;
    public search = '';
    public loading = true;
    public vocabularyForm: FormGroup = new FormGroup({
        word: new FormControl('', Validators.required),
        definition: new FormControl('', Validators.required),
        sentences: new FormControl(''),
    });
    public vocabularies: IVocabulary[] = [];
    public vocabulariesReserve: IVocabulary[] = [];
    public currentPage = 1;
    public itemsPerPage = 20;

    public isDesktop = true;
    public intervalId: any;
    public isListening: boolean = false;
    public currentReadingItem: any = null;

    constructor(
        private _vocabularyService: VocabularyService,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
        if (document.documentElement.offsetWidth < 768) {
            this.isDesktop = false;
        }
        this.getVocabulariesList();
    }

    removeSpacesAndToLower(text: string): string {
        return text.replace(/ /g, '')?.toLowerCase();
    }

    addNewWord(): void {
        if (this.vocabularyForm.invalid) {
            return;
        }

        const word = this.vocabularyForm.get('word')?.value;

        const isExists = this.vocabularies.find(vocabulary => {
            return this.removeSpacesAndToLower(vocabulary.word) === this.removeSpacesAndToLower(word);
        });

        if (isExists) {
            alert('This word is in the dictionary. You cannot add this word');
            return;
        }

        this.vocabularyForm.disable();

        const payload = {
            index: this.vocabulariesReserve?.length + 1,
            word: this.vocabularyForm.get('word')?.value,
            definition: this.vocabularyForm.get('definition')?.value,
            sentences: this.vocabularyForm.get('sentences')?.value,
            date: new Date()
        };

        this._vocabularyService.addNewWord(payload)
            .subscribe(() => {
                this.vocabularyForm.reset();
                this.vocabularyForm.enable();
                this.wordTextArea.nativeElement.focus();
                this.getVocabulariesList(true);
            }, () => {
                alert('Error occurred');
                this.vocabularyForm.enable();
            });
    }

    getVocabulariesList(afterAddingNewWord = false): void {
        this._vocabularyService.getVocabulariesList()
            .subscribe(res => {
                this.loading = false;
                if (res) {
                    this.vocabularies = [];
                    this.vocabulariesReserve = [];
                    for (const key in res) {
                        this.vocabularies.push({
                            ...res[key],
                            id: key
                        });
                        this.vocabulariesReserve.push({
                            ...res[key],
                            id: key
                        });
                    }
                    if (afterAddingNewWord) {
                        this.currentPage = Math.ceil(this.vocabularies.length / 20);
                    }
                }
            }, () => {
                this.vocabularies = [];
                this.vocabulariesReserve = [];
            });
    }

    updateVocabulary(item: IVocabulary) {
        this._vocabularyService.updateVocabulary(item)
            .subscribe();
    }

    toggleVocabularyForm(): void {
        this.showVocabularyForm = !this.showVocabularyForm;

        if (this.showVocabularyForm) {
            this.wordTextArea.nativeElement.focus();
        }
    }

    play(): void {
        const interval = prompt('Enter questions interval', '1-' + this.vocabularies?.length);

        const numbers = interval?.split('-');
        const fromIndex = +numbers![0];
        const toIndex = +numbers![1];

        const vocabularies = this.vocabulariesReserve.slice(fromIndex - 1, toIndex);

        if (interval && vocabularies?.length) {
            localStorage.setItem('interval', JSON.stringify(interval));
            localStorage.setItem('vocabularies', JSON.stringify(vocabularies));
            this._router.navigate(['/game']).then();
        }
    }

    toggleSearchInput(): void {
        this.search = '';
        this.showSearchInput = !this.showSearchInput;

        if (!this.showSearchInput) {
            this.searchWord();
        }
    }

    searchWord(): void {
        this.currentPage = 1;
        this.vocabularies = [];
        this.vocabularies = this.vocabulariesReserve.filter(voc => {
            return voc.word?.toLowerCase().includes(this.search.toLowerCase())
                || voc.definition?.toLowerCase().includes(this.search.toLowerCase());
        });
    }

    textToSpeech(word: string | undefined) {
        this._vocabularyService.textToSpeech(word);
    }

    listen(): void {
        const interval = prompt('Enter interval', '1-' + this.vocabulariesReserve.length);
        const numbers = interval?.split('-');
        const fromIndex = +numbers![0];
        const toIndex = +numbers![1];
        const words = this.vocabulariesReserve.slice(fromIndex - 1, toIndex);
        let count = 0;
        this.isListening = true;

        this.intervalId = setInterval(() => {
            if (count < words.length) {
                if ( count > 0 && count % 20 === 0) {
                    this.handlePageChange()
                }
                this.currentReadingItem = words[count].id;
                this._vocabularyService.textToSpeech(words[count].word);
                count++;
            } else {
                this._vocabularyService.textToSpeech('The End');
                this.stopListening();
            }

        }, 2000);
    }

    stopListening(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isListening = false;
            this.currentReadingItem = null;
        }
    }

    toggleListening(): void {
        if (!this.isListening) {
            this.listen();
            return;
        }
        this.stopListening();
    }

    handlePageChange() {
        const totalPages = Math.ceil(this.vocabularies.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
        } else {
           alert('No more pages to move to');
        }
    }
}

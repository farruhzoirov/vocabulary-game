import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { IVocabulary } from '../models/models';
import { VocabularyService } from '../services/vocabulary.service';

declare var webkitSpeechRecognition: any;
@Component({
    selector: 'vocabulary-game',
    templateUrl: './vocabulary-game.component.html',
    styleUrls: [ './vocabulary-game.component.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class VocabularyGameComponent implements OnInit {
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Shift') {
            this.answer();
        }
    }
    @ViewChild('answerInput', { static: true }) answerInput!: ElementRef;
    @ViewChild('success') success!: ElementRef;
    @ViewChild('fail') fail!: ElementRef;
    public vocabularies: IVocabulary[] = [];
    public mistakes: IVocabulary[] = [];
    public totalQuestionsCount = 0;
    public resolvedQuestionsCount = 0;
    public currentQuestion!: IVocabulary;
    public rightAnswer: string = '';
    public answerWord = '';
    public recording = false;
    public intervals: string | null = null;

    public speechRecognizer = new webkitSpeechRecognition();

    constructor(
        private _changeDetection: ChangeDetectorRef,
        private _vocabulariesService: VocabularyService
    ) {
    }

    ngOnInit(): void {
        this.getVocabulariesList();

        if ('webkitSpeechRecognition' in window) {
            this.speechRecognizer.continuous = true;
            this.speechRecognizer.interimResults = true;
            this.speechRecognizer.lang = 'en-US';

            this.speechRecognizer.onresult = (event: any) => {
                this.answerWord = event?.results[0][0].transcript;
                this._changeDetection.detectChanges();
            };
        }
    }

    removeSpacesAndToLower(text: string): string {
        return text.replace(/[^a-zA-Z]/gi, '')?.toLowerCase();
    }

    getVocabulariesList(): void {
        this.intervals = JSON.parse(localStorage.getItem('interval')!);

        this.vocabularies = JSON.parse(localStorage.getItem('vocabularies')!);
        this.totalQuestionsCount = this.vocabularies.length;
        this.nextQuestion();
    }

    generateRandomIndex(remindersLength: number): number {
        return Math.ceil(Math.random() * remindersLength) - 1;
    }

    answer(): void {
        if (!this.answerWord.length) {
            return;
        }

        this.speechRecognizer.abort();
        this.speechRecognizer.stop();
        this.recording = false;

        if (this.removeSpacesAndToLower(this.currentQuestion?.word) === this.removeSpacesAndToLower(this.answerWord)) {
            this.success.nativeElement.volume = 0.1;

            this._vocabulariesService.textToSpeech(this.answerWord);

            this.rightAnswer = '';
            this.nextQuestion();
        } else {
            this.fail.nativeElement.volume = 0.1;
            this.fail.nativeElement.play().then();
            this.rightAnswer = this.currentQuestion?.sentences || this.currentQuestion?.word;

            const isExist = this.mistakes.find(m => m.id === this.currentQuestion.id);

            if (!isExist) {
                this.mistakes.push(this.currentQuestion);
            }
        }
    }

    nextQuestion(): void {
        if (this.totalQuestionsCount === this.resolvedQuestionsCount && this.mistakes.length) {
            this.totalQuestionsCount = this.mistakes.length;
            this.resolvedQuestionsCount = 0;
            this.vocabularies = this.mistakes;
            this.mistakes = [];
        }
        if (this.totalQuestionsCount > this.resolvedQuestionsCount) {
            this.answerInput?.nativeElement?.focus();
            this.resolvedQuestionsCount++;
            this.answerWord = '';
            this.rightAnswer = '';
            const index = this.generateRandomIndex(this.vocabularies.length);
            this.currentQuestion = this.vocabularies[index];
            this.vocabularies.splice(index, 1);
        }
    }

    speech() {
        this.recording = !this.recording;

        if (this.recording) {
            this.speechRecognizer.start();
            return;
        }

        this.speechRecognizer.stop();
    }
}

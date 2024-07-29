import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'hideWord'
})

export class HideWordPipe implements PipeTransform {
    transform(sentences: string, word: string): string {
        let wordLength = word.length;
        const regex = new RegExp(word, 'gi')
        return sentences.replace(regex, '*'.repeat(wordLength))
    }
}

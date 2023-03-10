import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  switchTheme(theme: string) {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    let themeStyleLink = this.document.getElementById('app-theme-style') as HTMLLinkElement;
    const templatePath = "assets/template/css/"
    if (themeLink) {
      themeLink.href = theme + '.css';
    }
    if (themeStyleLink) {
      themeStyleLink.href = templatePath+"style-"+theme + '.css';
    }
  }
}

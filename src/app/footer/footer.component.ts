import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  htmlSnippet: string = '';
  @ViewChild('element') viewElement: ElementRef;
  public element: any;
  constructor(private http: HttpClient, public renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.appendHTMLSnippetToDOM();
  }
  public appendHTMLSnippetToDOM()
  {
    this.http.get("../assets/template/html/footer.html", {responseType: 'text'}).subscribe((html:any) => {
      this.htmlSnippet = html
      this.element = this.viewElement.nativeElement;
      const fragment = document.createRange().createContextualFragment(this.htmlSnippet);
      this.element.appendChild(fragment);
    });
  }
}
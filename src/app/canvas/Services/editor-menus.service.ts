import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TemplateService } from 'src/app/canvas/services/template.service';
import { BreakpointObserver } from '@angular/cdk/layout';

export interface QuickMenu {
  iconOrder: number;
  icon: string;
  iconFont?: string;
  iconClass?: string;
  iconType: string;
  iconGroup: string;
  source: any;
  command: string;
}

@Injectable({
  providedIn: 'root'
})
export class EditorMenusService {
  public editorOptions: any;
  qucikMenu: QuickMenu;
  constructor(private http: HttpClient,
              private templateService: TemplateService) { }

  /**
   * Function to get all editor menu options
   *
   * @memberof EditorMenusService
   */
  _getEditorOptions() {
    const url = './assets/data/editor-options.json';

    this.http.get(url).subscribe(data => {
      this.editorOptions = data;
    });
  }

  _executeCommand(quickMenu: QuickMenu, activeElement: any, activeIcon: any, iconGroup: any) {
    console.log(quickMenu.command )
    let groupClasses: string[];
    switch (quickMenu.icon) {
      case 'bold':
      case 'italics':
      case 'underline':
        // const regexClass = new RegExp(quickMenu.source[0].class);
        // if (this._getHtmlSelection() === activeElement.innerHTML || this._getHtmlSelection() === '') {
        //   if (regexClass.test(activeElement.classList.value)) {
        //     this._removeStyleFromParent(quickMenu.source[0].class, activeElement);
        //   } else {
        //     this._addStyleToParent(quickMenu.source[0].class, activeElement);
        //   }
        // } else if (this._getHtmlSelection() !== '') {
        //   this._addStyle(quickMenu.source[0].class);
        // } else {
        //   if (regexClass.test(activeElement.classList.value)) {
        //     this._removeStyleFromParent(quickMenu.source[0].class, activeElement);
        //   }
        // }
        // this._activateIcon(quickMenu, activeIcon);                
        this.templateService.tempFrameValue.execCommand(quickMenu.command, false, null);
        break;

      case 'text align left':
      case 'text align center':
      case 'text align right':
        groupClasses = iconGroup.map(a => a.source.map( x => x.class));
        this._addStyleToParent(quickMenu.source[0].class, activeElement, groupClasses);
        break;

      case 'content align left':
      case 'content align center':
      case 'content align right':
        groupClasses = iconGroup.map(a => a.source.map( x => x.class));
        this._addStyleToParent(quickMenu.source[0].class, activeElement, groupClasses);
        break;

      case 'heading':
        const selectedTag = activeIcon.dataset.value;        
        this.templateService.tempFrameValue.execCommand('formatblock', false, selectedTag);
        break;
    }
  }

  _getHtmlSelection() {
    let html = '';
    if (typeof window.getSelection !== 'undefined') {
      const sel = this.templateService.tempFrameValue.getSelection();
      if (sel.rangeCount) {
        const container = document.createElement('div');
        for (let i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
    }
    return html;
  }

  _addStyle(className: string) {
    const sel = this.templateService.tempFrameValue.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      let range = sel.getRangeAt(0);
      const html = '<span class="' + className + '">' + range + '</span>';
      range.deleteContents();
      const el = document.createElement('div');
      el.innerHTML = html;
      var frag = document.createDocumentFragment(), node, lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      const firstNode = frag.firstChild;
      range.insertNode(frag);
      // Preserve the selection
      const selectPastedContent = true;
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        if (selectPastedContent) {
          range.setStartBefore(firstNode);
        } else {
          range.collapse(true);
        }
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  _addStyleToParent(className: string, activeElement: any, groupClasses = []) {
    for (const cls of groupClasses) {
      if (activeElement.classList.contains(cls)) {
        activeElement.classList.remove(cls);
      }
    }
    activeElement.classList.add(className);
  }

  _removeStyleFromParent(className: string, activeElement: any) {
    activeElement.classList.remove(className);
  }

  _menuActions(data) {
    let elementClass;
    let Regexpression;
    switch (data.device) {
      case 'mobile': Regexpression =  /\b(oa-xs-cnt.\w*)\b/g; elementClass = this.editorOptions[data.category].QuickMenu.filter((option) => { return option.icon === data.option; })[0].source[0].class[0].mobile; break;
      case 'tablet': Regexpression =  /\b(oa-sm-cnt.\w*)\b/g; elementClass = this.editorOptions[data.category].QuickMenu.filter((option) => { return option.icon === data.option; })[0].source[0].class[0].tablet; break;
      case 'desktop': Regexpression =  /\b(oa-cnt.\w*)\b/g; elementClass = this.editorOptions[data.category].QuickMenu.filter((option) => { return option.icon === data.option; })[0].source[0].class[0].desktop; break;
    }

    switch(data.category) {
      case 'image': if (data.element.querySelector('img')) {
                      data.element.querySelector('img').className = data.element.querySelector('img').className.replace( Regexpression , '');
                      data.element.querySelector('img').classList.add(elementClass);
                  }; break;
      default: break;
    }
  }
}

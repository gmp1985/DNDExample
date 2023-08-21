import { Directive, Output, HostListener, EventEmitter, ElementRef, Input , OnInit} from '@angular/core';
import { EditorMenusService } from '../services/editor-menus.service';
import { CommonService } from './../services/common.service';
import { TemplateService } from './../services/template.service';
import { EditorquickMenu } from '../components/dynamic/dynamic.component';
@Directive({
  selector: '.arkImagedragdrop'
})
export class ImagedragdropDirective {
  @Input() imagewrapper;
  @Output() dropHandler: EventEmitter<any> = new EventEmitter<any>();
  public dragging: boolean;
  public loaded: boolean;
  public imageLoaded: boolean;
  public imageSrc: string;
  public invalidFlag: boolean;

  constructor(
    private _editorMenuService: EditorMenusService,
    private _templateService: TemplateService,
    private _commonService: CommonService,
    private _elemRef: ElementRef) { }

  @HostListener('dragover') onDragOver() {
      return false
  }
  @HostListener('dragenter') handleDragEnter() {
      this.dragging = true;
  }
  @HostListener('dragleave') handleDragLeave() {
      this.dragging = false;
  }
  @HostListener('drop', ['$event']) handleDrop(e) {
      e.preventDefault();
      this.dragging = false;
      this.handleInputChange(e);
  }

  @HostListener('dblclick', ['$event']) onDoubleClick(e) {
    this._elemRef.nativeElement.setAttribute('tabIndex', 1);
    this._elemRef.nativeElement.classList.add('activeEdtrElement','focused');
    this.dragging = false;
    const element = e.target.parentElement;
    const data = { activeElement: element, parentElement: this.imagewrapper, elementtype: 'image', options: this._editorMenuService.editorOptions['image'] };
    const options = { insertMode: 'appendChild', element: this._elemRef.nativeElement, class: 'ark-quick-menu' };
    if (this._templateService.quickMenuRef !== undefined) {
      this._commonService._destroyDynamicComponent(this._templateService.quickMenuRef);
    }

    if (this._templateService.advanceMenuRef !== undefined) {
      this._commonService._destroyDynamicComponent(this._templateService.advanceMenuRef);
    }
    this._templateService.quickMenuRef = this._commonService._createDynamicComponent(EditorquickMenu, data, options);
    this._elemRef.nativeElement.prepend (this._templateService.quickMenuRef.location.nativeElement);
  }

  @HostListener('blur', ['$event'])
  onFocusout(e) {
    if (!this._commonService.isBrowseClicked && (this._elemRef.nativeElement.querySelector('img') !== null && this._elemRef.nativeElement.querySelector('img').getAttribute('src') !== '')) {
      this._elemRef.nativeElement.classList.remove('activeEdtrElement', 'focused');
      this._commonService._destroyDynamicComponent(this._templateService.quickMenuRef);
    }
  }

  OnInit(){
      console.log("initialized");
  }

  handleInputChange(e) {
      let file = e.dataTransfer ? e.dataTransfer.files[0] : 'null';

      this.invalidFlag = false;
      let pattern = /image-*/;
      let reader = new FileReader();

      if (!file.type.match(pattern)) {
          this.invalidFlag = true;
          return this.dropHandler.emit({ event: e, invalidFlag: this.invalidFlag });
      }

      this.loaded = false;
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
  }
  handleReaderLoaded(e) {
      let reader = e.target;
      this.imageSrc = reader.result;
      this.loaded = true;
      this.dropHandler.emit({ event: e, invalidFlag: this.invalidFlag });
      this._elemRef.nativeElement.classList.remove('activeEdtrElement', 'focused');
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../material/material.module';
import { CanvasRoutingModule } from './canvas-routing.module';
import { CanvasComponent } from './canvas.component';
import { HeaderComponent } from './components/header/header.component';
import { RulerComponent } from './components/ruler/ruler.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TemplateSettingsComponent } from './components/template-settings/template-settings.component';
import { TemplateFrameComponent } from './components/template-frame/template-frame.component';
import { DynamicComponent, RulerLineComponent, RulerGuideInfoComponent, RulerGuideMenuComponent, ComponentDropZoneComponent, ElementDropZoneComponent, ImageElement, EditorquickMenu, EditoradvanceMenu, QuickMenuIcon } from './components/dynamic/dynamic.component';
import { QuickMenuComponent, AdvancedMenuComponent } from './components/dynamic/editor-menus/menus.component';
import { RulerDirective, RulerLineDirective } from './Directives/ruler.directive';
import { DragDirective, DropDirective } from './Directives/drag-drop.directive';
import { ImagedragdropDirective } from './Directives/imagedragdrop.directive';

import { ElementListComponent } from './components/dynamic/element-list/element-list.component';
import { BoxMenusComponent } from './components/dynamic/box-menus/box-menus.component';
import { IframeContentComponent } from './components/dynamic/iframe-content/iframe-content.component';
import { EditorPropertiesComponent } from './components/dynamic/editor-properties/editor-properties.component';
import { SliderComponent } from './components/dynamic/slider/slider.component';

// Guards
import { AuthGuard } from '../shared/guards/auth.guard';
import { CanvasSettingsComponent } from './components/dynamic/canvas-settings/canvas-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorComponent } from './components/dynamic/color/color.component';


@NgModule({
  declarations: [
    CanvasComponent,
    HeaderComponent,
    RulerComponent,
    SidenavComponent,
    ElementListComponent,
    ComponentDropZoneComponent,
    ElementDropZoneComponent,
    BoxMenusComponent,
    TemplateSettingsComponent,
    TemplateFrameComponent,
    DynamicComponent,
    RulerDirective,
    RulerLineDirective,
    RulerLineComponent,
    DragDirective,
    DropDirective,
    RulerGuideInfoComponent,
    RulerGuideMenuComponent,
    QuickMenuComponent,
    AdvancedMenuComponent,
    IframeContentComponent,
    EditorPropertiesComponent,
    SliderComponent,
    ImageElement,
    ImagedragdropDirective,
    CanvasSettingsComponent,
    EditorquickMenu,
    EditoradvanceMenu,
    ColorComponent,
    QuickMenuIcon
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CanvasRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    TemplateSettingsComponent,
    ElementListComponent,
    ComponentDropZoneComponent,
    ElementDropZoneComponent,
    BoxMenusComponent,
    RulerLineComponent,
    RulerGuideInfoComponent,
    RulerGuideMenuComponent,
    QuickMenuComponent,
    AdvancedMenuComponent,
    IframeContentComponent,
    EditorPropertiesComponent,
    ImageElement,
    CanvasSettingsComponent,
    EditorquickMenu,
    EditoradvanceMenu,
    QuickMenuIcon
  ],
  providers: [AuthGuard]
})
export class CanvasModule { }

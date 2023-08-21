import { ComponentRef } from '@angular/core';
export interface Interface {
}

export interface ElementList {
    elementId: number;
    element: string;
    displayValue: string;
    elementHtml: string;
    icon:string
}

export interface templateHtml {
    templateId: number;
    template: string;    
}

export interface FrameList {
    frameID: number;   
}

export interface Guideline {
    Left: number;
    Locked: boolean;
    Id: number;
    Ref: ComponentRef<any>;
}



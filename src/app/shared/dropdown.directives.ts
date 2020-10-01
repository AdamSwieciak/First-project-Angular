import { Directive, HostBinding, HostListener, ElementRef } from '@angular/core';

@Directive({ selector: '[appDropdown]' })
export class DropdownDrirectives {
    @HostBinding('class.open') isOpen: boolean=false;

    // @HostListener('click') toggleOpen(){
    //     this.isOpen=!this.isOpen;
    // }

    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
        // console.log(this.elRef.nativeElement.contains(event.target))
      }
      constructor (private elRef: ElementRef) {}
    }

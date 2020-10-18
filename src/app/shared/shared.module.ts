import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoggingService } from "../logging.service";

import { AlertComponent } from "./alert/alert.component";
import { DropdownDrirectives } from "./dropdown.directives";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directives";

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropdownDrirectives
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropdownDrirectives,
        CommonModule
    ],
    entryComponents: [AlertComponent],
    providers: [
        LoggingService
    ]
})

export class SharedModule {}
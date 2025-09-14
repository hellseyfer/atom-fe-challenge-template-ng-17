import { ApplicationConfig } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { routes } from "./app.routes";
import { AuthService } from "./core/services/auth.service";
import { TaskService } from "./core/services/task.service";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes), 
        provideAnimationsAsync(),
        provideHttpClient(),
        AuthService,
        TaskService,
        // Provide Material modules
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ]
};

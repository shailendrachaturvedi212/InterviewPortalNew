import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { UserInfoComponent } from './app/user-info/user-info.component';


bootstrapApplication(AppComponent, appConfig)
{
  providers: [
    importProvidersFrom(HttpClientModule, UserInfoComponent),
    provideRouter(routes)
  ]
}
 

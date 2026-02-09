import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { config } from './app/app.config.server';
import { BootstrapContext } from '@angular/platform-browser';

export default (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, config, context);

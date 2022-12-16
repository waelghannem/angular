import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Parameter } from 'src/app/feature/models/parameter';
import { UserService } from 'src/app/feature/services/user.service';
import { AppService } from 'src/app/shared/breadcrumb/app.service';
import {ThemeService} from "../../../services/themeService";
import {CustomValidators} from "../../../../shared/custom-validators";
import {MessageService} from "primeng/api";
import {availableThemes, messageLife} from "../../../../shared/constants";

interface language {
  disabled: boolean,
  label: string,
  value:string,
  noSelectionOption:boolean
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  submitted: boolean = false;
  customValidators = CustomValidators
  public settingsForm: FormGroup;
  currentTheme: string
  themes = availableThemes
  constructor(private themeService: ThemeService,
              private fb: FormBuilder,
              private appService: AppService,
              private userService: UserService,
              private messageService: MessageService) { }

  public languages?: language[] = [];
  public dateFormats?: string[] = [];

  changeTheme(theme: string) {
    this.currentTheme = theme;
    this.themeService.switchTheme(theme);
  }
  ngOnInit(): void {
    this.currentTheme =  "saga-blue"
    this.appService.updateBreadCrumb(["profile", "My settings"]);
    this.userService.getUser().subscribe(user => {
      this.dateFormats = user.dateFormats;
      this.languages = user.languages
    });
    this.settingsForm = this.fb.group({
      language: new FormControl('', Validators.required),
      dateFormat: new FormControl('', Validators.required),
      theme: new FormControl('', Validators.required)
    });
    this.userService.getParameters().subscribe(parameters => {
      this.settingsForm.setValue({
        language: parameters.local,
        dateFormat: parameters.datePattern,
        theme: parameters.selectedTheme
      });
    })
  }

  public onSubmit() {
    this.submitted = true;
    if (!this.settingsForm.valid) {
      this.settingsForm.markAllAsTouched();
      return;
    }
    let parameter = new Parameter();
    parameter.datePattern = this.settingsForm.get("dateFormat")?.value;
    parameter.local = this.settingsForm.get("language")?.value;
    parameter.selectedTheme = this.settingsForm.get("theme")?.value;
    this.userService.changeParameters({Parameter: parameter}).subscribe(response => {
      this.messageService.add({severity: 'success', summary: 'Successful', detail: `Settings updated`, life: messageLife});

    }, err => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: `Settings failed to update`, life: messageLife});
    });
  }

}
